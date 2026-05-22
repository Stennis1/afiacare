import type { Patient } from '../types/app';

interface ChwDashboardProps {
  orderedPatients: Patient[];
  userRecordCount: number;
  referralNote: string | null;
  onGenerateReferral: (patient: Patient) => void;
}

const riskBadgeStyle: Record<string, string> = {
  Low: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  Medium: 'bg-amber-100 text-amber-800 border-amber-200',
  High: 'bg-red-100 text-red-800 border-red-200',
  Emergency: 'bg-afia-navy text-white border-afia-navy',
};

const riskDot: Record<string, string> = {
  Low: 'bg-emerald-500',
  Medium: 'bg-amber-400',
  High: 'bg-red-500',
  Emergency: 'bg-afia-rose',
};

export function ChwDashboard({
  orderedPatients,
  userRecordCount,
  referralNote,
  onGenerateReferral,
}: ChwDashboardProps) {
  const emergencyCount = orderedPatients.filter((p) => p.riskLevel === 'Emergency' || p.score >= 85).length;
  const highCount = orderedPatients.filter((p) => p.riskLevel === 'High' || (p.score >= 70 && p.score < 85)).length;

  return (
    <div className="min-h-screen bg-afia-foam/20 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-afia-rose">CHW Dashboard</p>
            <h1 className="mt-2 text-3xl font-black text-afia-navy">Patient Priority Queue</h1>
            <p className="mt-2 text-base text-afia-navy/60">
              Patients ranked by AI risk score. Act on the highest-risk cases first.
            </p>
          </div>
          {userRecordCount > 0 && (
            <div className="rounded-2xl border border-afia-ocean/20 bg-afia-ocean/10 px-5 py-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-afia-ocean">
                New this session
              </p>
              <p className="text-2xl font-black text-afia-navy">{userRecordCount}</p>
            </div>
          )}
        </div>

        {/* Summary cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-red-100 bg-red-50 p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-lg">🚨</span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-red-600">Emergency / High</p>
                <p className="text-2xl font-black text-red-700">{emergencyCount + highCount}</p>
              </div>
            </div>
            <p className="mt-2 text-xs text-red-600/70">Require immediate or same-day action</p>
          </div>
          <div className="rounded-2xl border border-afia-ocean/20 bg-afia-foam/60 p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-afia-ocean/10 text-lg">👩‍⚕️</span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-afia-ocean">Total patients</p>
                <p className="text-2xl font-black text-afia-navy">{orderedPatients.length}</p>
              </div>
            </div>
            <p className="mt-2 text-xs text-afia-navy/50">In priority queue</p>
          </div>
          <div className="rounded-2xl border border-afia-foam bg-white p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-afia-rose/10 text-lg">📋</span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-afia-rose">Referral ready</p>
                <p className="text-2xl font-black text-afia-navy">{referralNote ? '1' : '0'}</p>
              </div>
            </div>
            <p className="mt-2 text-xs text-afia-navy/50">Click a patient to generate</p>
          </div>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1fr_360px]">
          {/* Patient list */}
          <div className="space-y-4">
            {orderedPatients.map((patient, idx) => {
              const level = patient.riskLevel ?? (patient.score >= 85 ? 'Emergency' : patient.score >= 70 ? 'High' : patient.score >= 40 ? 'Medium' : 'Low');
              return (
                <div
                  key={`${patient.name}-${patient.createdAt ?? patient.reason}`}
                  className="group rounded-3xl border border-afia-foam bg-white p-5 shadow-afia-card transition hover:-translate-y-0.5 hover:shadow-afia-blue"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      {/* Rank */}
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-afia-foam text-sm font-black text-afia-navy/50">
                        {idx + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-afia-navy">
                            {patient.name}
                            {patient.age ? `, ${patient.age}` : ''}
                          </p>
                          <span className={`flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-bold ${riskBadgeStyle[level]}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${riskDot[level]}`} />
                            {level}
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-afia-navy/50">
                          {patient.weeks ? `Week ${patient.weeks} · ` : ''}
                          {patient.district}
                          {patient.language ? ` · ${patient.language}` : ''}
                          {patient.createdAt ? ` · ${patient.createdAt}` : ''}
                        </p>
                      </div>
                    </div>
                    {/* Score */}
                    <div className="shrink-0 text-right">
                      <p className="text-2xl font-black text-afia-navy">{patient.score}</p>
                      <p className="text-xs text-afia-navy/40">/ 100</p>
                    </div>
                  </div>

                  <p className="mt-3 text-sm text-afia-navy/70">{patient.reason}</p>

                  {/* Score bar */}
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-afia-foam">
                    <div
                      className={`h-full rounded-full transition-all ${
                        patient.score >= 85
                          ? 'bg-afia-rose'
                          : patient.score >= 70
                          ? 'bg-red-400'
                          : patient.score >= 40
                          ? 'bg-amber-400'
                          : 'bg-emerald-400'
                      }`}
                      style={{ width: `${patient.score}%` }}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => onGenerateReferral(patient)}
                    className="mt-4 rounded-full border border-afia-ocean/30 bg-afia-foam/50 px-5 py-2 text-xs font-bold text-afia-ocean transition hover:bg-afia-ocean hover:text-white"
                  >
                    Generate Referral
                  </button>
                </div>
              );
            })}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Referral note */}
            <div className="rounded-3xl border border-afia-foam bg-white p-6 shadow-afia-card">
              <p className="text-sm font-bold text-afia-navy">Referral Note</p>
              <div className="mt-4 min-h-[120px] rounded-2xl border border-dashed border-afia-ocean/30 bg-afia-foam/20 p-4">
                {referralNote ? (
                  <p className="text-sm leading-relaxed text-afia-navy">{referralNote}</p>
                ) : (
                  <p className="text-sm text-afia-navy/40">
                    Select a patient and tap "Generate Referral" to create a referral note.
                  </p>
                )}
              </div>
              {referralNote && (
                <button
                  type="button"
                  onClick={() => navigator.clipboard?.writeText(referralNote)}
                  className="mt-3 w-full rounded-full border border-afia-ocean/30 py-2 text-xs font-bold text-afia-ocean transition hover:bg-afia-foam"
                >
                  Copy to clipboard
                </button>
              )}
            </div>

            {/* Guidance */}
            <div className="rounded-3xl border border-afia-foam bg-white p-6 shadow-afia-card">
              <p className="text-sm font-bold text-afia-navy">CHW Guidance</p>
              <ul className="mt-4 space-y-3">
                {[
                  { icon: '🚨', text: 'Score ≥ 85 — contact immediately, arrange emergency transport' },
                  { icon: '⚠️', text: 'Score 70–84 — same-day clinic visit required' },
                  { icon: '📅', text: 'Score 40–69 — schedule within 48–72 hours' },
                  { icon: '✅', text: 'Score < 40 — routine ANC follow-up' },
                ].map((g) => (
                  <li key={g.text} className="flex items-start gap-3 text-xs text-afia-navy/70">
                    <span className="mt-0.5 shrink-0">{g.icon}</span>
                    {g.text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
