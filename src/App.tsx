'use client';

import { useMemo, useRef, useState } from 'react';
import { analyzeSymptoms, type AITriageResult, type SupportedLanguage } from './services/aiTriage';
import { localLanguagePhrases, type LocalLanguagePhrase } from './services/localLanguagePhrases';
import { transcribeLocalLanguageAudio } from './services/twiSpeech';
import {
  cleanTwiPatientResponses,
  microphoneInstructions,
  patientResponses,
  recordedLanguages,
  samplePatients,
  speechLanguageCodes,
  spokenMicrophoneInstructions,
  spokenPatientResponses,
  voiceFallbackMessage,
  voiceLanguageCodes,
} from './data/appContent';
import { AppHeader } from './components/AppHeader';
import { LandingPage } from './components/LandingPage';
import { UssdPage } from './components/UssdPage';
import { ChwDashboard } from './components/ChwDashboard';
import { DistrictMetrics } from './components/DistrictMetrics';
import type { Language, Page, Patient, RiskResult } from './types/app';

type SpeechRecognitionConstructor = new () => SpeechRecognition;

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

function App() {
  const [page, setPage] = useState<Page>('landing');
  const [language, setLanguage] = useState<Language>('English');
  const [symptoms, setSymptoms] = useState('');
  const [riskResult, setRiskResult] = useState<RiskResult | null>(null);
  const [referralNote, setReferralNote] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [aiMode, setAiMode] = useState<'demo' | 'live'>('demo');
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);
  const [listening, setListening] = useState(false);
  const [speechStatus, setSpeechStatus] = useState<string | null>(null);
  const [userRecords, setUserRecords] = useState<Patient[]>([]);
  const silenceTimerRef = useRef<number | null>(null);
  const audioUnlockedRef = useRef(false);

  const hasServerAI = process.env.NEXT_PUBLIC_ENABLE_SERVER_AI === 'true';

  const orderedPatients = useMemo(
    () => [...userRecords, ...samplePatients].sort((a, b) => b.score - a.score),
    [userRecords],
  );

  const totalHighRisk = useMemo(() => orderedPatients.filter((p) => p.score >= 80).length, [orderedPatients]);
  const referralsSent = 18 + userRecords.filter((p) => p.score >= 70).length;
  const ancFollowUp = 86;

  const speakText = (text: string) => {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    window.speechSynthesis.resume();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = voiceLanguageCodes[language];
    utterance.rate = 0.92;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
  };

  const unlockMobileAudio = () => {
    if (audioUnlockedRef.current) return;

    audioUnlockedRef.current = true;
    if (window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(' ');
      utterance.volume = 0;
      window.speechSynthesis.speak(utterance);
      window.speechSynthesis.cancel();
    }
  };

  const speakPatientAdvice = async (
    visibleMessage: string,
    riskLevel: AITriageResult['riskLevel'],
  ) => {
    speakText(getSpokenPatientMessage(visibleMessage, riskLevel));
  };

  const speakForLanguage = (text: string, selectedLanguage: Language) => {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    window.speechSynthesis.resume();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = voiceLanguageCodes[selectedLanguage];
    utterance.rate = 0.92;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
  };

  const handleLanguageSelect = (selectedLanguage: Language) => {
    unlockMobileAudio();
    setLanguage(selectedLanguage);
    setSpeechStatus(microphoneInstructions[selectedLanguage]);
    window.setTimeout(() => {
      speakForLanguage(
        spokenMicrophoneInstructions[selectedLanguage] || microphoneInstructions[selectedLanguage],
        selectedLanguage,
      );
    }, 50);
  };

  const addUserRecord = (
    input: string,
    result: AITriageResult,
    sourceLanguage: Language,
  ) => {
    const trimmedInput = input.trim();
    const firstLine = trimmedInput.split('\n').find(Boolean) || 'Voice symptom report';

    setUserRecords((records) => [
      {
        name: `New ${sourceLanguage} report`,
        age: 0,
        weeks: 0,
        reason: firstLine.length > 90 ? `${firstLine.slice(0, 90)}...` : firstLine,
        score: result.riskScore,
        district: 'Community',
        language: sourceLanguage,
        riskLevel: result.riskLevel,
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
      ...records,
    ]);
  };

  const getSpokenPatientMessage = (
    visibleMessage: string,
    riskLevel: AITriageResult['riskLevel'],
  ) => {
    return spokenPatientResponses[language]?.[riskLevel] || visibleMessage;
  };

  const evaluateSymptoms = async (input: string, shouldSpeak = false) => {
    if (!input.trim()) return;

    if (aiMode === 'live' && !hasServerAI) {
      setApiKeyError('Live AI Mode is disabled. Wire the server-side AI integration and set NEXT_PUBLIC_ENABLE_SERVER_AI=true to expose it.');
      return;
    }

    setApiKeyError(null);
    setLoading(true);
    try {
      const result = await analyzeSymptoms(input.trim(), aiMode, language);
      const fallbackResponse =
        language === 'Twi'
          ? cleanTwiPatientResponses[result.riskLevel]
          : patientResponses[language][result.riskLevel] || result.patientMessage;
      const response = fallbackResponse;

      setRiskResult({ ...result, level: result.riskLevel, patientMessage: response });
      addUserRecord(input, result, language);
      if (shouldSpeak) {
        await speakPatientAdvice(response, result.riskLevel);
      }
    } catch (error) {
      console.error('Triage error:', error);
      setApiKeyError('Error analyzing symptoms. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEvaluate = async () => {
    unlockMobileAudio();
    await evaluateSymptoms(symptoms, true);
  };

  const useLocalDemoPhrase = async (phrase: LocalLanguagePhrase) => {
    unlockMobileAudio();
    const trainedInput = `${phrase.text}\n\nDemo phrase meaning: ${phrase.englishSymptoms}`;
    setSymptoms(phrase.text);
    setSpeechStatus(`${language} phrase selected. AI is checking the symptoms and will respond.`);
    setApiKeyError(null);
    setLoading(true);

    try {
      const result = await analyzeSymptoms(trainedInput, aiMode, language);
      setRiskResult({
        ...result,
        riskLevel: phrase.riskLevel,
        level: phrase.riskLevel,
        patientMessage: phrase.response,
      });
      addUserRecord(phrase.text, { ...result, riskLevel: phrase.riskLevel, riskScore: result.riskScore }, language);
      await speakPatientAdvice(phrase.response, phrase.riskLevel);
    } catch (error) {
      console.error('Local phrase triage error:', error);
      setApiKeyError('Error analyzing symptoms. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const startRecordedLanguageSpeechInput = async () => {
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      setSpeechStatus(`This browser cannot record ${language} audio. Please try Chrome or Edge.`);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : undefined,
      });
      const chunks: BlobPart[] = [];

      setListening(true);
      setSpeechStatus(`Listening in ${language}. Speak clearly; AI will write what you said.`);

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onerror = () => {
        setListening(false);
        stream.getTracks().forEach((track) => track.stop());
        setSpeechStatus(`${language} voice recording stopped. Please try again or type the symptoms.`);
      };

      recorder.onstop = async () => {
        setListening(false);
        stream.getTracks().forEach((track) => track.stop());
        setSpeechStatus(`Voice captured. Writing the ${language} text...`);

        const audio = new Blob(chunks, { type: recorder.mimeType || 'audio/webm' });
        const transcript = await transcribeLocalLanguageAudio(audio, language);

        if (!transcript) {
          setSpeechStatus(`${language} speech transcription is unavailable. Please type the symptoms or use a phrase button.`);
          return;
        }

        setSymptoms(transcript);
        setSpeechStatus(`${language} text written. AI is checking the symptoms and will respond.`);
        await evaluateSymptoms(transcript, true);
      };

      recorder.start();
      window.setTimeout(() => {
        if (recorder.state === 'recording') {
          recorder.stop();
        }
      }, 5500);
    } catch (error) {
      console.error(`${language} microphone error:`, error);
      setListening(false);
      setSpeechStatus('Microphone permission was blocked. Allow microphone access in the browser, then try again.');
    }
  };

  const startSpeechInput = async () => {
    unlockMobileAudio();

    if (recordedLanguages.includes(language)) {
      await startRecordedLanguageSpeechInput();
      return;
    }

    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!Recognition) {
      setSpeechStatus(voiceFallbackMessage);
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setSpeechStatus('This browser cannot access the microphone. Please try Chrome or Edge.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
    } catch (error) {
      console.error('Microphone permission error:', error);
      setSpeechStatus('Microphone permission was blocked. Allow microphone access in the browser, then try again.');
      return;
    }

    const recognition = new Recognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = speechLanguageCodes[language];
    let finalTranscript = '';
    let hasHandledSpeech = false;

    const clearSilenceTimer = () => {
      if (silenceTimerRef.current) {
        window.clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
    };

    const finishSpeechCapture = async () => {
      if (hasHandledSpeech || !finalTranscript.trim()) return;

      hasHandledSpeech = true;
      clearSilenceTimer();
      recognition.stop();
      setListening(false);
      setSpeechStatus('Voice captured. AI is checking the symptoms and will respond.');
      await evaluateSymptoms(finalTranscript, true);
    };

    setListening(true);
    setSpeechStatus(`Listening now. Speak clearly; AI will respond as soon as you pause.`);

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0]?.transcript ?? '')
        .join(' ')
        .trim();

      if (transcript) {
        finalTranscript = transcript;
        setSymptoms(transcript);
        clearSilenceTimer();
        silenceTimerRef.current = window.setTimeout(() => {
          void finishSpeechCapture();
        }, 700);
      }
    };

    recognition.onerror = (event) => {
      const message =
        event.error === 'not-allowed'
          ? 'Microphone permission was blocked. Allow microphone access in the browser, then try again.'
          : `Speech input stopped: ${event.error}. You can still type the symptoms.`;

      setSpeechStatus(message);
      setListening(false);
      clearSilenceTimer();
    };

    recognition.onend = async () => {
      clearSilenceTimer();
      if (hasHandledSpeech) return;

      setListening(false);
      if (!finalTranscript.trim()) {
        setSpeechStatus('No voice was captured. Please try again or type the symptoms.');
        return;
      }

      await finishSpeechCapture();
    };

    try {
      recognition.start();
    } catch (error) {
      console.error('Speech recognition start error:', error);
      setListening(false);
      setSpeechStatus('Speech input could not start. Refresh the page and try again.');
    }
  };

  const speakPatientMessage = () => {
    if (!riskResult) return;
    void speakPatientAdvice(riskResult.patientMessage, riskResult.level);
  };

  const pageTitle = {
    landing: 'Welcome to AfiaCare',
    ussd: 'USSD Simulator',
    chw: 'CHW Priority Dashboard',
    district: 'District Health Metrics',
  }[page];

  return (
    <div className="min-h-screen bg-gradient-to-b from-afia-navy via-slate-900 to-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <AppHeader
          page={page}
          aiMode={aiMode}
          hasServerAI={hasServerAI}
          onChangePage={setPage}
          onSelectDemoMode={() => setAiMode('demo')}
          onSelectLiveMode={() => {
            if (!hasServerAI) {
              setApiKeyError('Live AI Mode requires a server-side integration and NEXT_PUBLIC_ENABLE_SERVER_AI=true.');
              return;
            }
            setAiMode('live');
            setApiKeyError(null);
          }}
        />

        <section className="space-y-6">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl shadow-slate-950/30">
            <h2 className="text-2xl font-semibold text-white">{pageTitle}</h2>
          </div>

          {page === 'landing' && (
            <LandingPage
              onStartVoiceDemo={() => setPage('ussd')}
              onViewDashboard={() => setPage('chw')}
            />
          )}

          {page === 'ussd' && (
            <UssdPage
              language={language}
              symptoms={symptoms}
              speechStatus={speechStatus}
              apiKeyError={apiKeyError}
              listening={listening}
              loading={loading}
              riskResult={riskResult}
              phrases={localLanguagePhrases[language]}
              onSelectLanguage={handleLanguageSelect}
              onStartSpeechInput={() => void startSpeechInput()}
              onSymptomsChange={setSymptoms}
              onUsePhrase={(phrase) => void useLocalDemoPhrase(phrase)}
              onEvaluate={() => void handleEvaluate()}
              onSpeakPatientMessage={speakPatientMessage}
            />
          )}

          {page === 'chw' && (
            <ChwDashboard
              orderedPatients={orderedPatients}
              userRecordCount={userRecords.length}
              referralNote={referralNote}
              onGenerateReferral={(patient) =>
                setReferralNote(
                  `Referral for ${patient.name}: prioritise clinic appointment within 24 hours due to ${patient.reason.toLowerCase()}. Contact CHW team and arrange transport.`,
                )
              }
            />
          )}

          {page === 'district' && (
            <DistrictMetrics
              totalHighRisk={totalHighRisk}
              referralsSent={referralsSent}
              ancFollowUp={ancFollowUp}
            />
          )}
        </section>
      </div>
    </div>
  );
}

export default App;
