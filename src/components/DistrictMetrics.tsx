import { districtData } from '../data/appContent';

interface DistrictMetricsProps {
  totalHighRisk: number;
  referralsSent: number;
  ancFollowUp: number;
}

const maxCases = Math.max(...districtData.map((d) => d.cases));

const districtColors = [
  'from-afia-ocean to-afia-sea',
  'from-afia-sea to-afia-sky',
  'from-afia-rose to-afia-pink',
  'from-afia-sky to-afia-mist',
  'from-afia-pink to-afia-blush',
];

export function DistrictMetrics({
  totalHighRisk,
  referralsSent,
  ancFollowUp,
}: DistrictMetricsProps) {
  return (
    <div className="min-h-screen bg-afia-foam/20 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-afia-rose">District Analytics</p>
          <h1 className="mt-2 text-3xl font-black text-afia-navy">Health Metrics Overview</h1>
          <p className="mt-2 text-base text-afia-navy/60">
            Aggregate maternal health data across rural districts. Updated in real time.
          </p>
        </div>

        {/* KPI cards */}
        <div className="mb-8 grid gap-5 sm:grid-cols-3">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-afia-ocean to-afia-sea p-6 text-white shadow-afia-blue">
            <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10" />
            <p className="text-xs font-bold uppercase tracking-widest text-afia-foam/80">High-risk cases</p>
            <p className="mt-3 text-5xl font-black">{totalHighRisk}</p>
            <p className="mt-2 text-sm text-afia-foam/70">Critical patients across rural districts</p>
          </div>

          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-afia-rose to-afia-pink p-6 text-white shadow-afia-pink">
            <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10" />
            <p className="text-xs font-bold uppercase tracking-widest text-afia-blush/80">Referrals sent</p>
            <p className="mt-3 text-5xl font-black">{referralsSent}</p>
            <p className="mt-2 text-sm text-afia-blush/70">CHW-generated clinic referrals</p>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-afia-foam bg-white p-6 shadow-afia-card">
            <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-afia-ocean/5" />
            <p className="text-xs font-bold uppercase tracking-widest text-afia-navy/50">ANC follow-up rate</p>
            <p className="mt-3 text-5xl font-black text-afia-navy">{ancFollowUp}%</p>
            <p className="mt-2 text-sm text-afia-navy/50">Women returning after alerts</p>
            {/* Progress ring visual */}
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-afia-foam">
              <div
                className="h-full rounded-full bg-gradient-to-r from-afia-ocean to-afia-sea transition-all"
                style={{ width: `${ancFollowUp}%` }}
              />
            </div>
          </div>
        </div>

        {/* District chart */}
        <div className="rounded-3xl border border-afia-foam bg-white p-8 shadow-afia-card">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-afia-ocean">Distribution</p>
              <h2 className="mt-1 text-xl font-black text-afia-navy">High-risk cases by district</h2>
              <p className="mt-1 text-sm text-afia-navy/50">Synthetic data for demo purposes</p>
            </div>
            <span className="rounded-full border border-afia-foam bg-afia-foam/50 px-4 py-1.5 text-xs font-semibold text-afia-navy/60">
              Updated today
            </span>
          </div>

          <div className="mt-8 space-y-5">
            {districtData.map((item, idx) => (
              <div key={item.district}>
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br ${districtColors[idx % districtColors.length]} text-xs font-black text-white`}>
                      {idx + 1}
                    </span>
                    <span className="text-sm font-semibold text-afia-navy">{item.district}</span>
                  </div>
                  <span className="text-sm font-bold text-afia-navy">
                    {item.cases} <span className="font-normal text-afia-navy/40">cases</span>
                  </span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-afia-foam">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${districtColors[idx % districtColors.length]} transition-all duration-700`}
                    style={{ width: `${(item.cases / maxCases) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info cards */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <div className="rounded-3xl border border-afia-foam bg-white p-6 shadow-afia-card">
            <p className="text-sm font-bold text-afia-navy">About this data</p>
            <p className="mt-3 text-sm leading-relaxed text-afia-navy/60">
              District metrics are derived from AI triage sessions submitted during this demo.
              In production, data would be aggregated from CHW reports, USSD sessions, and clinic
              records across all registered districts.
            </p>
          </div>
          <div className="rounded-3xl border border-afia-ocean/20 bg-afia-foam/40 p-6">
            <p className="text-sm font-bold text-afia-navy">Intervention thresholds</p>
            <ul className="mt-3 space-y-2">
              {[
                { label: '≥ 8 cases', action: 'District-level emergency response', color: 'text-red-600' },
                { label: '5–7 cases', action: 'Increased CHW deployment', color: 'text-amber-600' },
                { label: '3–4 cases', action: 'Targeted outreach programme', color: 'text-afia-ocean' },
                { label: '< 3 cases', action: 'Routine monitoring', color: 'text-emerald-600' },
              ].map((t) => (
                <li key={t.label} className="flex items-center gap-3 text-xs">
                  <span className={`font-bold ${t.color}`}>{t.label}</span>
                  <span className="text-afia-navy/60">→ {t.action}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
