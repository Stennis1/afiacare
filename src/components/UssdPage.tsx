import type { LocalLanguagePhrase } from '../services/localLanguagePhrases';
import {
  languagePrompts,
  recordedLanguages,
  riskColors,
  ussdCareImageUrl,
} from '../data/appContent';
import { MicrophoneIcon } from './MicrophoneIcon';
import type { Language, RiskResult } from '../types/app';

interface UssdPageProps {
  language: Language;
  symptoms: string;
  speechStatus: string | null;
  apiKeyError: string | null;
  listening: boolean;
  loading: boolean;
  riskResult: RiskResult | null;
  phrases: LocalLanguagePhrase[] | undefined;
  onSelectLanguage: (language: Language) => void;
  onStartSpeechInput: () => void;
  onSymptomsChange: (value: string) => void;
  onUsePhrase: (phrase: LocalLanguagePhrase) => void;
  onEvaluate: () => void;
  onSpeakPatientMessage: () => void;
}

const riskBadge: Record<string, string> = {
  Low: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  Medium: 'bg-amber-100 text-amber-800 border-amber-200',
  High: 'bg-red-100 text-red-800 border-red-200',
  Emergency: 'bg-afia-navy text-white border-afia-navy',
};

const riskAccent: Record<string, string> = {
  Low: 'border-l-emerald-500',
  Medium: 'border-l-amber-400',
  High: 'border-l-red-500',
  Emergency: 'border-l-afia-rose',
};

export function UssdPage({
  language,
  symptoms,
  speechStatus,
  apiKeyError,
  listening,
  loading,
  riskResult,
  phrases,
  onSelectLanguage,
  onStartSpeechInput,
  onSymptomsChange,
  onUsePhrase,
  onEvaluate,
  onSpeakPatientMessage,
}: UssdPageProps) {
  return (
    <div className="min-h-screen bg-afia-foam/20 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-afia-rose">USSD Simulator</p>
          <h1 className="mt-2 text-3xl font-black text-afia-navy">AI Symptom Triage</h1>
          <p className="mt-2 text-base text-afia-navy/60">
            Speak or type symptoms in any supported language. The AI will assess risk and respond.
          </p>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1fr_420px]">
          {/* ── Left: Input panel ── */}
          <div className="space-y-6">
            {/* USSD code card */}
            <div className="overflow-hidden rounded-3xl border border-afia-foam bg-white shadow-afia-card">
              <div className="relative h-40 overflow-hidden">
                <img
                  src={ussdCareImageUrl}
                  alt="Ghanaian nurse attending to a pregnant woman"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-afia-navy/60 to-transparent" />
                <div className="absolute bottom-4 left-6">
                  <p className="text-xs font-semibold uppercase tracking-widest text-afia-foam/80">
                    Dial from any phone
                  </p>
                  <p className="text-4xl font-black text-white">*928#</p>
                </div>
              </div>
            </div>

            {/* Language selector */}
            <div className="rounded-3xl border border-afia-foam bg-white p-6 shadow-afia-card">
              <p className="text-sm font-bold text-afia-navy">Select language</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {(['English', 'Twi', 'Dagbani', 'Ewe'] as Language[]).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => onSelectLanguage(option)}
                    className={`rounded-full px-5 py-2 text-sm font-semibold transition-all duration-150 ${
                      language === option
                        ? 'bg-gradient-to-r from-afia-ocean to-afia-sea text-white shadow-afia-blue'
                        : 'border border-afia-foam bg-afia-foam/40 text-afia-navy/70 hover:border-afia-ocean/40 hover:text-afia-ocean'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <div className="mt-4 rounded-2xl border border-afia-ocean/20 bg-afia-foam/50 px-4 py-3 text-sm text-afia-ocean">
                {languagePrompts[language]}
                <span className="mt-1 block text-xs text-afia-navy/50">
                  On phones, tap a language first so voice guidance plays.
                </span>
              </div>
            </div>

            {/* Voice + text input */}
            <div className="rounded-3xl border border-afia-foam bg-white p-6 shadow-afia-card">
              <p className="text-sm font-bold text-afia-navy">Speak or enter symptoms</p>

              {/* Microphone */}
              <div className="mt-4 flex items-center gap-5 rounded-2xl border border-afia-foam bg-afia-foam/30 p-4">
                <button
                  type="button"
                  onClick={onStartSpeechInput}
                  disabled={listening}
                  aria-label={`Use microphone for ${language}`}
                  className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-4 text-white shadow-lg transition-all duration-200 ${
                    listening
                      ? 'animate-pulse border-red-300 bg-red-500 shadow-red-200'
                      : 'border-afia-ocean/30 bg-gradient-to-br from-afia-ocean to-afia-sea shadow-afia-blue hover:scale-105'
                  } disabled:cursor-not-allowed`}
                >
                  <MicrophoneIcon />
                </button>
                <div>
                  <p className="font-semibold text-afia-navy">
                    {listening ? 'Listening…' : recordedLanguages.includes(language) ? `${language} Voice AI` : 'Microphone'}
                  </p>
                  <p className="mt-0.5 text-sm text-afia-navy/50">
                    {listening ? 'Speak clearly, then pause.' : 'Tap to speak your symptoms.'}
                  </p>
                </div>
              </div>

              {/* Textarea */}
              <textarea
                id="symptoms"
                rows={4}
                value={symptoms}
                onChange={(e) => onSymptomsChange(e.target.value)}
                className="mt-4 w-full rounded-2xl border border-afia-foam bg-afia-foam/20 px-4 py-3 text-sm text-afia-navy outline-none transition placeholder:text-afia-navy/30 focus:border-afia-ocean focus:ring-2 focus:ring-afia-ocean/20"
                placeholder="e.g. headache, swelling, fever, no ANC visit. Twi: me ti yare, mogya retu. Dagbani: yelima, zuli. Ewe: ta le vevem, wu le dzom."
              />

              {speechStatus && (
                <div className="mt-3 rounded-2xl border border-afia-ocean/20 bg-afia-foam/50 px-4 py-3 text-sm text-afia-ocean">
                  {speechStatus}
                </div>
              )}

              {apiKeyError && (
                <div className="mt-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {apiKeyError}
                </div>
              )}

              <button
                type="button"
                onClick={onEvaluate}
                disabled={loading}
                className="mt-5 w-full rounded-full bg-gradient-to-r from-afia-ocean to-afia-rose py-3.5 text-sm font-bold text-white shadow-afia-blue transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Analysing…
                  </span>
                ) : (
                  'Assess Risk'
                )}
              </button>
            </div>

            {/* Demo phrases */}
            {phrases && (
              <div className="rounded-3xl border border-afia-foam bg-white p-6 shadow-afia-card">
                <p className="text-sm font-bold text-afia-navy">
                  {language} demo phrases
                  <span className="ml-2 rounded-full bg-afia-ocean/10 px-2 py-0.5 text-xs font-semibold text-afia-ocean">
                    5 trained
                  </span>
                </p>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {phrases.map((phrase) => (
                    <button
                      key={phrase.id}
                      type="button"
                      onClick={() => onUsePhrase(phrase)}
                      className="group rounded-2xl border border-afia-foam bg-afia-foam/30 px-4 py-3 text-left transition hover:border-afia-ocean/40 hover:bg-afia-foam"
                    >
                      <span className="block text-sm font-semibold text-afia-navy group-hover:text-afia-ocean">
                        {phrase.label}
                      </span>
                      <span className="mt-0.5 block text-xs text-afia-navy/50">{phrase.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Right: Results panel ── */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-afia-foam bg-white p-6 shadow-afia-card">
              <p className="text-sm font-bold text-afia-navy">Triage Result</p>

              {riskResult ? (
                <div className="mt-5 space-y-5">
                  {/* Risk level badge */}
                  <div className={`rounded-2xl border-l-4 bg-afia-foam/30 p-5 ${riskAccent[riskResult.level]}`}>
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-afia-navy/50">
                          Risk Level
                        </p>
                        <p className="mt-1 text-3xl font-black text-afia-navy">{riskResult.level}</p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block rounded-full border px-3 py-1 text-sm font-bold ${riskBadge[riskResult.level]}`}>
                          Score {riskResult.riskScore}
                        </span>
                        <p className="mt-1 text-xs text-afia-navy/50">
                          {(riskResult.confidence * 100).toFixed(0)}% confidence
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Condition */}
                  <div className="rounded-2xl border border-afia-foam bg-afia-foam/20 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-afia-navy/50">
                      Possible condition
                    </p>
                    <p className="mt-1.5 text-base font-bold text-afia-navy">
                      {riskResult.possibleCondition}
                    </p>
                  </div>

                  {/* Top reasons */}
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-afia-navy/50">
                      Top reasons
                    </p>
                    <ul className="mt-2 space-y-2">
                      {riskResult.topReasons.map((reason) => (
                        <li
                          key={reason}
                          className="flex items-start gap-2 rounded-xl border border-afia-foam bg-afia-foam/30 px-3 py-2.5 text-sm text-afia-navy"
                        >
                          <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-afia-ocean" />
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Recommended action */}
                  <div className="rounded-2xl border border-afia-ocean/20 bg-afia-foam/40 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-afia-ocean">
                      Recommended action
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-afia-navy">
                      {riskResult.recommendedAction}
                    </p>
                  </div>

                  {/* Patient message */}
                  <div className="rounded-2xl border border-afia-rose/20 bg-afia-petal/30 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-semibold uppercase tracking-wider text-afia-rose">
                        Patient message
                      </p>
                      <button
                        type="button"
                        onClick={onSpeakPatientMessage}
                        className="flex items-center gap-1.5 rounded-full bg-afia-rose px-3 py-1.5 text-xs font-bold text-white transition hover:bg-afia-pink"
                      >
                        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                        Play
                      </button>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-afia-navy">
                      {riskResult.patientMessage}
                    </p>
                  </div>

                  {/* Clinic + CHW alert */}
                  <div className="space-y-3">
                    <div className="rounded-2xl border border-afia-foam bg-afia-foam/20 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-afia-navy/50">
                        Nearest clinic
                      </p>
                      <p className="mt-1 text-sm font-semibold text-afia-navy">{riskResult.clinic}</p>
                    </div>
                    <div className="rounded-2xl border border-afia-foam bg-afia-foam/20 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-afia-navy/50">
                        CHW alert
                      </p>
                      <p className="mt-1 text-sm text-afia-navy">{riskResult.chwAlertMessage}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-6 rounded-2xl border border-dashed border-afia-ocean/30 bg-afia-foam/20 p-8 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-afia-ocean/10 text-2xl">
                    🩺
                  </div>
                  <p className="mt-4 text-sm font-semibold text-afia-navy">No result yet</p>
                  <p className="mt-1 text-xs text-afia-navy/50">
                    Submit symptoms to see the AI triage result. Try: bleeding, fever, headache
                    with swelling, or reduced baby movement.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
