import type { LocalLanguagePhrase } from '../services/localLanguagePhrases';
import { languagePrompts, recordedLanguages, ussdCareImageUrl } from '../data/appContent';
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

const riskBorderLeft: Record<string, string> = {
  Low: 'border-l-afia-ocean',
  Medium: 'border-l-amber-500',
  High: 'border-l-amber-600',
  Emergency: 'border-l-afia-rose',
};

const riskBadge: Record<string, string> = {
  Low: 'bg-afia-ocean/10 text-afia-ocean',
  Medium: 'bg-amber-100 text-amber-800',
  High: 'bg-amber-200 text-amber-900',
  Emergency: 'bg-afia-rose text-white',
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
    <div className="bg-slate-50 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Page header */}
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-afia-rose">USSD Simulator</p>
          <h1 className="mt-1 text-2xl font-bold text-afia-navy">Symptom Triage</h1>
          <p className="mt-1 text-sm text-slate-500">
            Speak or type symptoms in any supported language. You will receive a risk assessment and next steps.
          </p>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1fr_400px]">

          {/* Left: input */}
          <div className="space-y-5">

            {/* USSD code banner */}
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              <div className="relative h-36 overflow-hidden">
                <img
                  src={ussdCareImageUrl}
                  alt="Ghanaian nurse attending to a pregnant woman"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-afia-navy/50" />
                <div className="absolute bottom-4 left-5">
                  <p className="text-xs font-medium uppercase tracking-widest text-white/70">Dial from any phone</p>
                  <p className="text-3xl font-bold text-white">*928#</p>
                </div>
              </div>
            </div>

            {/* Language selector */}
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <p className="text-sm font-semibold text-afia-navy">Select language</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {(['English', 'Twi', 'Dagbani', 'Ewe'] as Language[]).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => onSelectLanguage(option)}
                    className={`rounded-md px-4 py-2 text-sm font-medium transition ${
                      language === option
                        ? 'bg-afia-ocean text-white'
                        : 'border border-slate-200 bg-white text-slate-600 hover:border-afia-ocean hover:text-afia-ocean'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <p className="mt-3 text-sm text-slate-500">{languagePrompts[language]}</p>
              <p className="mt-1 text-xs text-slate-400">
                On phones, tap a language first so voice guidance plays.
              </p>
            </div>

            {/* Voice + text input */}
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <p className="text-sm font-semibold text-afia-navy">Speak or enter symptoms</p>

              {/* Microphone row */}
              <div className="mt-4 flex items-center gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
                <button
                  type="button"
                  onClick={onStartSpeechInput}
                  disabled={listening}
                  aria-label={`Use microphone for ${language}`}
                  className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-white transition ${
                    listening
                      ? 'animate-pulse bg-red-500'
                      : 'bg-afia-ocean hover:bg-afia-sea'
                  } disabled:cursor-not-allowed`}
                >
                  <MicrophoneIcon />
                </button>
                <div>
                  <p className="text-sm font-medium text-afia-navy">
                    {listening
                      ? 'Listening…'
                      : recordedLanguages.includes(language)
                      ? `${language} voice`
                      : 'Microphone'}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-400">
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
                className="mt-4 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-afia-navy outline-none transition placeholder:text-slate-400 focus:border-afia-ocean focus:ring-2 focus:ring-afia-ocean/20"
                placeholder="e.g. headache, swelling, fever, no ANC visit. Twi: me ti yare, mogya retu. Dagbani: yelima, zuli. Ewe: ta le vevem, wu le dzom."
              />

              {speechStatus && (
                <p className="mt-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-600">
                  {speechStatus}
                </p>
              )}

              {apiKeyError && (
                <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
                  {apiKeyError}
                </p>
              )}

              <button
                type="button"
                onClick={onEvaluate}
                disabled={loading}
                className="mt-4 w-full rounded-md bg-afia-ocean py-3 text-sm font-semibold text-white transition hover:bg-afia-sea disabled:cursor-not-allowed disabled:opacity-50"
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
              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <p className="text-sm font-semibold text-afia-navy">
                  {language} demo phrases
                  <span className="ml-2 rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
                    5 trained
                  </span>
                </p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {phrases.map((phrase) => (
                    <button
                      key={phrase.id}
                      type="button"
                      onClick={() => onUsePhrase(phrase)}
                      className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-left transition hover:border-afia-ocean hover:bg-white"
                    >
                      <span className="block text-sm font-medium text-afia-navy">{phrase.label}</span>
                      <span className="mt-0.5 block text-xs text-slate-400">{phrase.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: results */}
          <div>
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <p className="text-sm font-semibold text-afia-navy">Triage Result</p>

              {riskResult ? (
                <div className="mt-4 space-y-4">

                  {/* Risk level */}
                  <div className={`rounded-lg border-l-4 bg-slate-50 p-4 ${riskBorderLeft[riskResult.level]}`}>
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Risk Level</p>
                        <p className="mt-1 text-2xl font-bold text-afia-navy">{riskResult.level}</p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block rounded px-2.5 py-1 text-sm font-semibold ${riskBadge[riskResult.level]}`}>
                          Score {riskResult.riskScore}
                        </span>
                        <p className="mt-1 text-xs text-slate-400">
                          {(riskResult.confidence * 100).toFixed(0)}% confidence
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Condition */}
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Possible condition</p>
                    <p className="mt-1 text-sm font-semibold text-afia-navy">{riskResult.possibleCondition}</p>
                  </div>

                  {/* Top reasons */}
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Top reasons</p>
                    <ul className="mt-2 space-y-1.5">
                      {riskResult.topReasons.map((reason) => (
                        <li key={reason} className="flex items-start gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-afia-navy">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-afia-ocean" />
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Recommended action */}
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-medium uppercase tracking-wider text-afia-ocean">Recommended action</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-afia-navy">{riskResult.recommendedAction}</p>
                  </div>

                  {/* Patient message */}
                  <div className="rounded-lg border border-slate-200 bg-afia-petal/30 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-medium uppercase tracking-wider text-afia-rose">Patient message</p>
                      <button
                        type="button"
                        onClick={onSpeakPatientMessage}
                        className="flex items-center gap-1.5 rounded bg-afia-rose px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-afia-pink"
                      >
                        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                        Play
                      </button>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-afia-navy">{riskResult.patientMessage}</p>
                  </div>

                  {/* Clinic + CHW alert */}
                  <div className="space-y-2">
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Nearest clinic</p>
                      <p className="mt-1 text-sm font-medium text-afia-navy">{riskResult.clinic}</p>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs font-medium uppercase tracking-wider text-slate-400">CHW alert</p>
                      <p className="mt-1 text-sm text-afia-navy">{riskResult.chwAlertMessage}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-6 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                  <p className="text-sm font-medium text-slate-500">No result yet</p>
                  <p className="mt-1 text-xs text-slate-400">
                    Submit symptoms to see the triage result. Try: bleeding, fever, headache with
                    swelling, or reduced baby movement.
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
