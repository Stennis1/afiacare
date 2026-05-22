import type { AITriageResult } from '../services/aiTriage';
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
    <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl shadow-slate-950/30">
        <div className="mb-6 overflow-hidden rounded-3xl border border-slate-700 bg-slate-950">
          <img
            src={ussdCareImageUrl}
            alt="Black Ghanaian nurse attending to an adult pregnant woman"
            className="h-48 w-full object-cover"
          />
        </div>
        <div className="mb-6 rounded-3xl border border-slate-700 bg-slate-950 p-6 text-slate-100 shadow-inner shadow-slate-950/40">
          <p className="text-sm uppercase tracking-[0.25em] text-slate-400">USSD Simulator</p>
          <div className="mt-4 rounded-3xl bg-slate-900 p-6 text-center text-5xl font-semibold text-sky-300 ring-1 ring-slate-700">
            *928#
          </div>
        </div>
        <div className="space-y-5">
          <label className="block text-sm font-semibold text-slate-200">Select language</label>
          <div className="flex flex-wrap gap-3">
            {(['English', 'Twi', 'Dagbani', 'Ewe'] as Language[]).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => onSelectLanguage(option)}
                className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                  language === option
                    ? 'bg-sky-500 text-slate-950'
                    : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
          <div className="rounded-3xl border border-sky-500/20 bg-sky-500/10 px-4 py-3 text-sm text-sky-100">
            {languagePrompts[language]}
            <span className="mt-2 block text-xs text-sky-200">
              On phones, tap a language first so voice guidance can play.
            </span>
          </div>
        </div>
        <div className="mt-6 space-y-4">
          <div className="flex flex-col items-center gap-3 rounded-3xl border border-sky-500/20 bg-slate-950/80 p-5 text-center sm:flex-row sm:text-left">
            <div className="flex-1">
              <label htmlFor="symptoms" className="block text-base font-semibold text-white">
                Speak or enter symptoms
              </label>
              <p className="mt-1 text-sm text-slate-300">Tap the microphone, speak slowly, then pause.</p>
            </div>
            <button
              type="button"
              onClick={onStartSpeechInput}
              disabled={listening}
              aria-label={`Use microphone for ${language}`}
              title={`Use microphone for ${language}`}
              className={`flex h-28 w-28 shrink-0 items-center justify-center rounded-full border-4 text-white shadow-2xl transition ${
                listening
                  ? 'border-red-200 bg-red-500 shadow-red-950/40'
                  : 'border-sky-200 bg-sky-500 shadow-sky-950/40 hover:scale-105 hover:bg-sky-400'
              } disabled:cursor-not-allowed`}
            >
              <MicrophoneIcon />
            </button>
            <div className="min-w-28 text-sm font-semibold text-sky-100">
              {listening
                ? 'Listening...'
                : recordedLanguages.includes(language)
                  ? `${language} voice AI`
                  : 'Microphone'}
            </div>
          </div>
          <textarea
            id="symptoms"
            rows={5}
            value={symptoms}
            onChange={(event) => onSymptomsChange(event.target.value)}
            className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
            placeholder="Example: headache, swelling, fever, no ANC visit. Twi: me ti yare, mogya retu. Dagbani: yelima, zuli. Ewe: ta le vevem, wu le dzom."
          />
          {speechStatus && (
            <div className="rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-slate-300">
              {speechStatus}
            </div>
          )}
          {phrases && (
            <div className="rounded-3xl border border-sky-500/20 bg-slate-950/80 p-4">
              <p className="text-sm font-semibold text-sky-200">Five trained {language} demo phrases</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {phrases.map((phrase) => (
                  <button
                    key={phrase.id}
                    type="button"
                    onClick={() => onUsePhrase(phrase)}
                    className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-left text-sm text-slate-100 transition hover:border-sky-400 hover:bg-slate-800"
                  >
                    <span className="block font-semibold text-white">{phrase.label}</span>
                    <span className="mt-1 block text-slate-300">{phrase.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          {apiKeyError && (
            <div className="rounded-3xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {apiKeyError}
            </div>
          )}
          <button
            type="button"
            onClick={onEvaluate}
            disabled={loading}
            className="rounded-full bg-afia-mint px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Analyzing...' : 'Submit'}
          </button>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl shadow-slate-950/30">
        <h3 className="text-xl font-semibold text-white">Results</h3>
        {riskResult ? (
          <div className="mt-6 space-y-6">
            <div className={`rounded-3xl border border-slate-700 p-6 ${riskColors[riskResult.level]}`}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em]">Risk Level</p>
                  <h4 className="mt-2 text-3xl font-bold">{riskResult.level}</h4>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="rounded-3xl bg-slate-950/70 px-4 py-2 text-sm font-semibold text-white">
                    Score: {riskResult.riskScore}
                  </div>
                  <div className="rounded-3xl bg-sky-500/20 px-4 py-2 text-xs font-semibold text-sky-200">
                    Confidence: {(riskResult.confidence * 100).toFixed(0)}%
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-3 rounded-3xl border border-slate-700 bg-slate-950/70 p-5 text-slate-200">
              <div>
                <p className="text-sm text-slate-400">Possible condition</p>
                <p className="mt-2 text-base font-semibold text-white">{riskResult.possibleCondition}</p>
              </div>
            </div>
            <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
              <div className="rounded-3xl border border-slate-700 bg-slate-950/80 p-5 text-slate-200">
                <p className="text-sm text-slate-400">Top reasons</p>
                <ul className="mt-4 space-y-3">
                  {riskResult.topReasons.map((reason) => (
                    <li key={reason} className="rounded-2xl bg-slate-900/90 px-4 py-3 text-slate-100">
                      * {reason}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-3xl border border-slate-700 bg-slate-950/80 p-5 text-slate-200">
                <p className="text-sm text-slate-400">Recommended action</p>
                <p className="mt-3 text-base text-white">{riskResult.recommendedAction}</p>
                <div className="mt-6 rounded-3xl bg-slate-900/80 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Patient message</p>
                    <button
                      type="button"
                      onClick={onSpeakPatientMessage}
                      className="rounded-full bg-sky-500 px-4 py-2 text-xs font-semibold text-slate-950 transition hover:bg-sky-400"
                    >
                      Play voice
                    </button>
                  </div>
                  <p className="mt-3 text-base text-slate-100">{riskResult.patientMessage}</p>
                </div>
              </div>
            </div>
            <div className="space-y-3 rounded-3xl border border-slate-700 bg-slate-950/70 p-5 text-slate-200">
              <div>
                <p className="text-sm text-slate-400">Nearest clinic</p>
                <p className="mt-2 text-base font-semibold text-white">{riskResult.clinic}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">CHW alert message</p>
                <p className="mt-2 text-base">{riskResult.chwAlertMessage}</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="mt-6 text-slate-300">
            Submit symptoms to generate a risk result. Try: bleeding, fever, headache with swelling,
            reduced baby movement, no ANC visit, seizure, or chest pain.
          </p>
        )}
      </div>
    </div>
  );
}
