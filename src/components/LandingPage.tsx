import { clinicImageUrl, heroImageUrl } from '../data/appContent';

interface LandingPageProps {
  onStartVoiceDemo: () => void;
  onViewDashboard: () => void;
}

const stats = [
  { value: '4', label: 'Languages', sub: 'English, Twi, Dagbani, Ewe' },
  { value: '*928#', label: 'USSD Code', sub: 'Works on any feature phone' },
  { value: '< 3s', label: 'Triage Time', sub: 'Instant AI risk assessment' },
  { value: '4', label: 'Risk Levels', sub: 'Low · Medium · High · Emergency' },
];

const steps = [
  {
    number: '01',
    title: 'Speak or type symptoms',
    body: 'Women describe symptoms in their own language — English, Twi, Dagbani, or Ewe — by voice or text.',
    bg: 'bg-afia-ocean',
  },
  {
    number: '02',
    title: 'AI analyses the risk',
    body: 'The triage engine scores symptoms, detects danger patterns like preeclampsia or haemorrhage, and classifies risk.',
    bg: 'bg-afia-sea',
  },
  {
    number: '03',
    title: 'Clear next steps',
    body: 'The woman hears a spoken response in her language. The CHW receives an alert with referral guidance.',
    bg: 'bg-afia-rose',
  },
];

const audiences = [
  {
    title: 'Pregnant Women',
    body: 'Speak symptoms in Twi, Dagbani, or Ewe. Hear clear advice instantly — even on a basic phone via USSD.',
  },
  {
    title: 'Community Health Workers',
    body: 'See patients ranked by risk score. Generate referral notes and coordinate care from a single dashboard.',
  },
  {
    title: 'District Health Officers',
    body: 'Track high-risk cases, referral rates, and ANC follow-up across districts with live aggregate metrics.',
  },
  {
    title: 'NGOs & Government',
    body: "Evidence-based platform built for Ghana's health system. Offline-capable, USSD-ready, and extensible.",
  },
];

export function LandingPage({ onStartVoiceDemo, onViewDashboard }: LandingPageProps) {
  return (
    <div className="bg-white">

      {/* Hero */}
      <section className="bg-afia-navy">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="inline-block rounded bg-afia-rose/20 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-afia-blush">
                Maternal Health · Ghana
              </span>
              <h1 className="mt-5 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
                Saving Mothers.<br />
                <span className="text-afia-blush">One Voice at a Time.</span>
              </h1>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-300">
                AfiaCare detects danger before danger becomes death — in the languages Ghanaian
                women actually speak, on any phone, with or without internet.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  onClick={onStartVoiceDemo}
                  className="rounded-md bg-afia-rose px-7 py-3 text-sm font-semibold text-white transition hover:bg-afia-pink"
                >
                  Try Voice Triage
                </button>
                <button
                  onClick={onViewDashboard}
                  className="rounded-md border border-white/30 px-7 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  View CHW Dashboard
                </button>
              </div>
            </div>
            <div className="relative">
              <img
                src={heroImageUrl}
                alt="Pregnant woman in rural Ghana receiving care"
                className="h-[400px] w-full rounded-xl object-cover object-top"
              />
              <div className="absolute -bottom-4 left-4 rounded-lg bg-white px-4 py-3 shadow-md">
                <p className="text-xs font-semibold uppercase tracking-wider text-afia-rose">Risk detected</p>
                <p className="mt-0.5 text-base font-bold text-afia-navy">Emergency · Score 95</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 divide-x divide-slate-200 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="px-6 py-8 text-center">
                <p className="text-3xl font-bold text-afia-ocean">{s.value}</p>
                <p className="mt-1 text-sm font-semibold text-afia-navy">{s.label}</p>
                <p className="mt-0.5 text-xs text-slate-500">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-afia-rose">How it works</p>
            <h2 className="mt-2 text-3xl font-bold text-afia-navy">From symptom to safety in seconds</h2>
            <p className="mt-3 text-base text-slate-500">
              A three-step pipeline that works offline, on feature phones, and in four Ghanaian languages.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.number} className="rounded-xl border border-slate-200 bg-white p-7">
                <div className={`inline-flex h-10 w-10 items-center justify-center rounded-md ${step.bg} text-sm font-bold text-white`}>
                  {step.number}
                </div>
                <h3 className="mt-4 text-base font-semibold text-afia-navy">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-afia-ocean">Built for everyone</p>
            <h2 className="mt-2 text-3xl font-bold text-afia-navy">One platform, four audiences</h2>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {audiences.map((a) => (
              <div key={a.title} className="rounded-xl border border-slate-200 bg-white p-6">
                <h3 className="text-sm font-semibold text-afia-navy">{a.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{a.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* USSD feature */}
      <section className="bg-afia-navy py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-afia-blush">USSD Access</p>
              <h2 className="mt-2 text-3xl font-bold text-white">
                Works on any phone. No internet needed.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-300">
                Dial <span className="font-bold text-white">*928#</span> from any GSM feature phone.
                Select your language, describe your symptoms with number keys, and receive a risk
                assessment in your language — no smartphone, no data, no app required.
              </p>
              <ul className="mt-7 space-y-2.5">
                {[
                  'Works on 2G feature phones',
                  'No internet or data plan needed',
                  'Responses in English, Twi, Dagbani, Ewe',
                  'Connects to CHW alert system automatically',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-slate-300">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-afia-rose text-xs font-bold text-white">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <button
                onClick={onStartVoiceDemo}
                className="mt-9 rounded-md bg-white px-7 py-3 text-sm font-semibold text-afia-navy transition hover:bg-slate-100"
              >
                Try the USSD Simulator
              </button>
            </div>
            <div className="overflow-hidden rounded-xl">
              <img
                src={clinicImageUrl}
                alt="Ghanaian nurse attending to a pregnant woman"
                className="h-[360px] w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-slate-200 bg-white py-16">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <h2 className="text-2xl font-bold text-afia-navy sm:text-3xl">Ready to explore AfiaCare?</h2>
          <p className="mx-auto mt-3 max-w-lg text-base text-slate-500">
            Try the live voice triage demo, explore the CHW dashboard, or review district-level health metrics.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <button
              onClick={onStartVoiceDemo}
              className="rounded-md bg-afia-ocean px-7 py-3 text-sm font-semibold text-white transition hover:bg-afia-sea"
            >
              Start Voice Demo
            </button>
            <button
              onClick={onViewDashboard}
              className="rounded-md border border-slate-300 px-7 py-3 text-sm font-semibold text-afia-navy transition hover:bg-slate-50"
            >
              View Dashboard
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
