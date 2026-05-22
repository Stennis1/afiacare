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
import { Footer } from './components/Footer';
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
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);
  const [listening, setListening] = useState(false);
  const [speechStatus, setSpeechStatus] = useState<string | null>(null);
  const [userRecords, setUserRecords] = useState<Patient[]>([]);
  const silenceTimerRef = useRef<number | null>(null);
  const audioUnlockedRef = useRef(false);

  // Always run in demo mode — live mode requires server-side API key
  const aiMode: 'demo' | 'live' = 'demo';

  const orderedPatients = useMemo(
    () => [...userRecords, ...samplePatients].sort((a, b) => b.score - a.score),
    [userRecords],
  );

  const totalHighRisk = useMemo(
    () => orderedPatients.filter((p) => p.score >= 80).length,
    [orderedPatients],
  );
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
    speakText(spokenPatientResponses[language]?.[riskLevel] || visibleMessage);
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

  const addUserRecord = (input: string, result: AITriageResult, sourceLanguage: Language) => {
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

  const evaluateSymptoms = async (input: string, shouldSpeak = false) => {
    if (!input.trim()) return;
    setApiKeyError(null);
    setLoading(true);
    try {
      const result = await analyzeSymptoms(input.trim(), aiMode, language);
      const response =
        language === 'Twi'
          ? cleanTwiPatientResponses[result.riskLevel]
          : patientResponses[language][result.riskLevel] || result.patientMessage;
      setRiskResult({ ...result, level: result.riskLevel, patientMessage: response });
      addUserRecord(input, result, language);
      if (shouldSpeak) await speakPatientAdvice(response, result.riskLevel);
    } catch (error) {
      console.error('Triage error:', error);
      setApiKeyError('Error analysing symptoms. Please try again.');
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
    setSpeechStatus(`${language} phrase selected. Checking symptoms…`);
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
      addUserRecord(phrase.text, { ...result, riskLevel: phrase.riskLevel }, language);
      await speakPatientAdvice(phrase.response, phrase.riskLevel);
    } catch (error) {
      console.error('Local phrase triage error:', error);
      setApiKeyError('Error analysing symptoms. Please try again.');
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
      setSpeechStatus(`Listening in ${language}. Speak clearly.`);
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
      recorder.onerror = () => {
        setListening(false);
        stream.getTracks().forEach((t) => t.stop());
        setSpeechStatus(`Recording stopped. Please try again or type the symptoms.`);
      };
      recorder.onstop = async () => {
        setListening(false);
        stream.getTracks().forEach((t) => t.stop());
        setSpeechStatus(`Voice captured. Transcribing…`);
        const audio = new Blob(chunks, { type: recorder.mimeType || 'audio/webm' });
        const transcript = await transcribeLocalLanguageAudio(audio, language);
        if (!transcript) {
          setSpeechStatus(`Transcription unavailable. Please type the symptoms or use a phrase button.`);
          return;
        }
        setSymptoms(transcript);
        setSpeechStatus(`Text ready. Checking symptoms…`);
        await evaluateSymptoms(transcript, true);
      };
      recorder.start();
      window.setTimeout(() => { if (recorder.state === 'recording') recorder.stop(); }, 5500);
    } catch (error) {
      console.error(`${language} microphone error:`, error);
      setListening(false);
      setSpeechStatus('Microphone permission blocked. Allow access and try again.');
    }
  };

  const startSpeechInput = async () => {
    unlockMobileAudio();
    if (recordedLanguages.includes(language)) {
      await startRecordedLanguageSpeechInput();
      return;
    }
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) { setSpeechStatus(voiceFallbackMessage); return; }
    if (!navigator.mediaDevices?.getUserMedia) {
      setSpeechStatus('This browser cannot access the microphone. Please try Chrome or Edge.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((t) => t.stop());
    } catch {
      setSpeechStatus('Microphone permission blocked. Allow access and try again.');
      return;
    }
    const recognition = new Recognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = speechLanguageCodes[language];
    let finalTranscript = '';
    let hasHandledSpeech = false;
    const clearSilenceTimer = () => {
      if (silenceTimerRef.current) { window.clearTimeout(silenceTimerRef.current); silenceTimerRef.current = null; }
    };
    const finishSpeechCapture = async () => {
      if (hasHandledSpeech || !finalTranscript.trim()) return;
      hasHandledSpeech = true;
      clearSilenceTimer();
      recognition.stop();
      setListening(false);
      setSpeechStatus('Voice captured. Checking symptoms…');
      await evaluateSymptoms(finalTranscript, true);
    };
    setListening(true);
    setSpeechStatus('Listening. Speak clearly, then pause.');
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results).map((r) => r[0]?.transcript ?? '').join(' ').trim();
      if (transcript) {
        finalTranscript = transcript;
        setSymptoms(transcript);
        clearSilenceTimer();
        silenceTimerRef.current = window.setTimeout(() => { void finishSpeechCapture(); }, 700);
      }
    };
    recognition.onerror = (event) => {
      setSpeechStatus(event.error === 'not-allowed'
        ? 'Microphone permission blocked. Allow access and try again.'
        : `Speech input stopped: ${event.error}. You can type the symptoms instead.`);
      setListening(false);
      clearSilenceTimer();
    };
    recognition.onend = async () => {
      clearSilenceTimer();
      if (hasHandledSpeech) return;
      setListening(false);
      if (!finalTranscript.trim()) { setSpeechStatus('No voice captured. Try again or type the symptoms.'); return; }
      await finishSpeechCapture();
    };
    try { recognition.start(); } catch {
      setListening(false);
      setSpeechStatus('Speech input could not start. Refresh and try again.');
    }
  };

  const speakPatientMessage = () => {
    if (!riskResult) return;
    void speakPatientAdvice(riskResult.patientMessage, riskResult.level);
  };

  return (
    <div className="flex min-h-screen flex-col bg-white text-afia-navy">
      <AppHeader page={page} onChangePage={setPage} />

      <main className="flex-1">
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
      </main>

      <Footer onChangePage={setPage} />
    </div>
  );
}

export default App;
