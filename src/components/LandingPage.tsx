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
    color: 'from-afia-ocean to-afia-sea',
  },
  {
    number: '02',
    title: 'AI analyses the risk',
    body: 'The triage engine scores symptoms, detects danger patterns like preeclampsia or hemorrhage, and classifies risk.',
    color: 'from-afia-sea to-afia-sky',
  },
  {
    number: '03',
    title: 'Clear next steps',
    body: 'The woman hears a spoken response in her language. The CHW receives an alert with referral guidance.',
    color: 'from-afia-rose to-afia-pink',
  },
];

const audiences = [
  {
    icon: '🤰',
    title: 'Pregnant Women',
    body: 'Speak symptoms in Twi, Dagbani, or Ewe. Hear clear advice instantly — even on a basic phone via USSD.',
    accent: 'border-afia-rose/30 bg-afia-petal/40',
    badge: 'bg-afia-rose text-white',
  },
  {
    icon: '👩‍⚕️',
    title: 'Community Health Workers',
    body: 'See patients ranked by risk score. Generate referral notes and coordinate care from a single dashboard.',
    accent: 'border-afia-ocean/30 bg-afia-foam/40',
    badge: 'bg-afia-ocean text-white',
  },
  {
    icon: '🏥',
    title: 'District Health Officers',
    body: 'Track high-risk cases, referral rates, and ANC follow-up across districts with live aggregate metrics.',
    accent: 'border-afia-sea/30 bg-afia-foam/40',
    badge: 'bg-afia-sea text-white',
  },
  {
    icon: '🌍',
    title: 'NGOs & Government',
    body: 'Evidence-based platform built for Ghana\'s health system. Offline-capable, USSD-ready, and extensible.',
    accent: 'border-afia-navy/20 bg-slate-50',
    badge: 'bg-afia-navy text-white',
  },
];

export function LandingPage({ onStartVoiceDemo, onViewDashboard }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-afia-navy via-afia-ocean to-afia-sea">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-afia-rose/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-afia-sky/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Copy */}
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-afia-rose/40 bg-afia-rose/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-afia-blush">
                <span className="h-1.5 w-1.5 rounded-full bg-afia-rose" />
                AI Maternal Health · Ghana
              </span>
              <h1 className="mt-6 text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
                Saving Mothers.{' '}
                <span className="bg-gradient-to-r from-afia-blush to-afia-rose bg-clip-text text-transparent">
                  One Voice
                </span>{' '}
                at a Time.
              </h1>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-afia-foam/90">
                AfiaCare detects danger before danger becomes death — in the languages Ghanaian
                women actually speak, on any phone, with or without internet.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <button
                  onClick={onStartVoiceDemo}
                  className="group flex items-center gap-2 rounded-full bg-afia-rose px-8 py-3.5 text-sm font-bold text-white shadow-afia-pink transition hover:bg-afia-pink hover:shadow-lg"
                >
                  <span>Try Voice Triage</span>
                  <svg className="h-4 w-4 transition group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </button>
                <button
                  onClick={onViewDashboard}
                  className="rounded-full border border-white/30 bg-white/10 px-8 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/20"
                >
                  View CHW Dashboard
                </button>
              </div>
            </div>

            {/* Hero image */}
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-afia-rose/30 to-afia-sky/20 blur-xl" />
              <img
                src={heroImageUrl}
                alt="Pregnant woman in rural Ghana receiving care"
                className="relative h-[420px] w-full rounded-3xl object-cover object-top shadow-2xl ring-1 ring-white/20"
              />
              {/* Floating badge */}
              <div className="absolute -bottom-5 -left-5 rounded-2xl bg-white px-5 py-3 shadow-afia-card">
                <p className="text-xs font-semibold uppercase tracking-wider text-afia-rose">Risk detected</p>
                <p className="mt-0.5 text-lg font-black text-afia-navy">Emergency · Score 95</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="border-b border-afia-foam bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 divide-x divide-afia-foam md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="px-6 py-8 text-center">
                <p className="text-3xl font-black text-afia-ocean">{s.value}</p>
                <p className="mt-1 text-sm font-bold text-afia-navy">{s.label}</p>
                <p className="mt-0.5 text-xs text-afia-navy/50">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="bg-afia-foam/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-afia-rose">How it works</p>
            <h2 className="mt-3 text-3xl font-black text-afia-navy sm:text-4xl">
              From symptom to safety in seconds
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-afia-navy/60">
              A three-step pipeline that works offline, on feature phones, and in four Ghanaian languages.
            </p>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.number}
                className="relative overflow-hidden rounded-3xl border border-afia-foam bg-white p-8 shadow-afia-card"
              >
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${step.color} text-lg font-black text-white shadow-sm`}>
                  {step.number}
                </div>
                <h3 className="mt-5 text-lg font-bold text-afia-navy">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-afia-navy/60">{step.body}</p>
                {/* Decorative corner */}
                <div className={`pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${step.color} opacity-10`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Who it's for ── */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-afia-ocean">Built for everyone</p>
            <h2 className="mt-3 text-3xl font-black text-afia-navy sm:text-4xl">
              One platform, four audiences
            </h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {audiences.map((a) => (
              <div
                key={a.title}
                className={`rounded-3xl border p-6 transition hover:-translate-y-1 hover:shadow-afia-card ${a.accent}`}
              >
                <span className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl text-xl ${a.badge}`}>
                  {a.icon}
                </span>
                <h3 className="mt-4 text-base font-bold text-afia-navy">{a.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-afia-navy/60">{a.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Feature highlight ── */}
      <section className="bg-gradient-to-br from-afia-navy via-afia-ocean to-afia-sea py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-afia-blush">USSD Access</p>
              <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">
                Works on any phone.{' '}
                <span className="text-afia-blush">No internet needed.</span>
              </h2>
              <p className="mt-5 text-base leading-relaxed text-afia-foam/80">
                Dial <span className="font-bold text-white">*928#</span> from any GSM feature phone.
                Select your language, describe your symptoms with number keys, and receive a risk
                assessment and action in your language — no smartphone, no data, no app required.
              </p>
              <ul className="mt-8 space-y-3">
                {[
                  'Works on 2G feature phones',
                  'No internet or data plan needed',
                  'Responses in English, Twi, Dagbani, Ewe',
                  'Connects to CHW alert system automatically',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-afia-foam/90">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-afia-rose text-xs text-white">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <button
                onClick={onStartVoiceDemo}
                className="mt-10 rounded-full bg-white px-8 py-3.5 text-sm font-bold text-afia-ocean shadow-afia-blue transition hover:bg-afia-foam"
              >
                Try the USSD Simulator
              </button>
            </div>
            <div className="overflow-hidden rounded-3xl shadow-2xl ring-1 ring-white/10">
              <img
                src={clinicImageUrl}
                alt="Ghanaian nurse attending to a pregnant woman"
                className="h-[380px] w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA footer ── */}
      <section className="border-t border-afia-foam bg-white py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-black text-afia-navy sm:text-4xl">
            Ready to explore AfiaCare?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base text-afia-navy/60">
            Try the live voice triage demo, explore the CHW dashboard, or review district-level
            health metrics.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button
              onClick={onStartVoiceDemo}
              className="rounded-full bg-gradient-to-r from-afia-ocean to-afia-rose px-8 py-3.5 text-sm font-bold text-white shadow-afia-blue transition hover:opacity-90"
            >
              Start Voice Demo
            </button>
            <button
              onClick={onViewDashboard}
              className="rounded-full border border-afia-ocean/30 px-8 py-3.5 text-sm font-bold text-afia-ocean transition hover:bg-afia-foam"
            >
              View Dashboard
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
