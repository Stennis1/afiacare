import { districtData } from '../data/appContent';

interface DistrictMetricsProps {
  totalHighRisk: number;
  referralsSent: number;
  ancFollowUp: number;
}

const maxCases = Math.max(...districtData.map((d) => d.cases));

const barColors = ['bg-afia-ocean', 'bg-afia-sea', 'bg-afia-rose', 'bg-afia-sky', 'bg-afia-pink'];

export function DistrictMetrics({ totalHighRisk, referralsSent, ancFollowUp }: DistrictMetricsProps) {
  return (
    <div className="bg-slate-50 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Page header */}
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-afia-rose">District Analytics</p>
          <h1 className="mt-1 text-2xl font-bold text-afia-navy">Health Metrics Overview</h1>
          <p className="mt-1 text-sm text-slate-500">
            Aggregate maternal health data across rural districts.
          </p>
        </div>

        {/* KPI cards */}
        <div className="mb-8 grid gap-5 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-afia-ocean p-6 text-white">
            <p className="text-xs font-semibold uppercase tracking-wider text-white/70">High-risk cases</p>
            <p className="mt-3 text-5xl font-bold">{totalHighRisk}</p>
            <p className="mt-2 text-sm text-white/70">Critical patients across rural districts</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-afia-rose p-6 text-white">
            <p className="text-xs font-semibold uppercase tracking-wider text-white/70">Referrals sent</p>
            <p className="mt-3 text-5xl font-bold">{referralsSent}</p>
            <p className="mt-2 text-sm text-white/70">CHW-generated clinic referrals</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">ANC follow-up rate</p>
            <p className="mt-3 text-5xl font-bold text-afia-navy">{ancFollowUp}%</p>
            <p className="mt-2 text-sm text-slate-500">Women returning after alerts</p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-afia-ocean transition-all"
                style={{ width: `${ancFollowUp}%` }}
              />
            </div>
          </div>
        </div>

        {/* District chart */}
        <div className="rounded-xl border border-slate-200 bg-white p-7">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-afia-navy">High-risk cases by district</h2>
              <p className="mt-0.5 text-sm text-slate-400">Synthetic data for demo purposes</p>
            </div>
            <span className="rounded border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-500">
              Updated today
            </span>
          </div>

          <div className="mt-7 space-y-5">
            {districtData.map((item, idx) => (
              <div key={item.district}>
                <div className="mb-1.5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className={`flex h-6 w-6 items-center justify-center rounded text-xs font-bold text-white ${barColors[idx % barColors.length]}`}>
                      {idx + 1}
                    </span>
                    <span className="text-sm font-medium text-afia-navy">{item.district}</span>
                  </div>
                  <span className="text-sm text-slate-500">{item.cases} cases</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${barColors[idx % barColors.length]} transition-all duration-500`}
                    style={{ width: `${(item.cases / maxCases) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info cards */}
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <p className="text-sm font-semibold text-afia-navy">About this data</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              District metrics are derived from AI triage sessions submitted during this demo.
              In production, data would be aggregated from CHW reports, USSD sessions, and clinic
              records across all registered districts.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <p className="text-sm font-semibold text-afia-navy">Intervention thresholds</p>
            <ul className="mt-3 space-y-2">
              {[
                { label: '≥ 8 cases', action: 'District-level emergency response', color: 'text-red-600' },
                { label: '5–7 cases', action: 'Increased CHW deployment', color: 'text-amber-600' },
                { label: '3–4 cases', action: 'Targeted outreach programme', color: 'text-afia-ocean' },
                { label: '< 3 cases', action: 'Routine monitoring', color: 'text-emerald-600' },
              ].map((t) => (
                <li key={t.label} className="flex items-center gap-3 text-xs">
                  <span className={`font-semibold ${t.color}`}>{t.label}</span>
                  <span className="text-slate-500">— {t.action}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
