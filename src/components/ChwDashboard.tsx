import type { Patient } from '../types/app';

interface ChwDashboardProps {
  orderedPatients: Patient[];
  userRecordCount: number;
  referralNote: string | null;
  onGenerateReferral: (patient: Patient) => void;
}

const riskBadge: Record<string, string> = {
  Low: 'bg-emerald-100 text-emerald-800',
  Medium: 'bg-amber-100 text-amber-800',
  High: 'bg-red-100 text-red-800',
  Emergency: 'bg-slate-800 text-white',
};

const riskBar: Record<string, string> = {
  Low: 'bg-emerald-400',
  Medium: 'bg-amber-400',
  High: 'bg-red-500',
  Emergency: 'bg-afia-rose',
};

function getLevel(patient: Patient): string {
  if (patient.riskLevel) return patient.riskLevel;
  if (patient.score >= 85) return 'Emergency';
  if (patient.score >= 70) return 'High';
  if (patient.score >= 40) return 'Medium';
  return 'Low';
}

export function ChwDashboard({
  orderedPatients,
  userRecordCount,
  referralNote,
  onGenerateReferral,
}: ChwDashboardProps) {
  const urgentCount = orderedPatients.filter((p) => p.score >= 70).length;

  return (
    <div className="bg-slate-50 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Page header */}
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-afia-rose">CHW Dashboard</p>
            <h1 className="mt-1 text-2xl font-bold text-afia-navy">Patient Priority Queue</h1>
            <p className="mt-1 text-sm text-slate-500">
              Patients ranked by AI risk score. Act on the highest-risk cases first.
            </p>
          </div>
          {userRecordCount > 0 && (
            <div className="rounded-lg border border-slate-200 bg-white px-5 py-3">
              <p className="text-xs font-medium text-afia-ocean">New this session</p>
              <p className="text-2xl font-bold text-afia-navy">{userRecordCount}</p>
            </div>
          )}
        </div>

        {/* Summary cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-red-100 bg-red-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-red-600">Urgent cases</p>
            <p className="mt-2 text-3xl font-bold text-red-700">{urgentCount}</p>
            <p className="mt-1 text-xs text-red-500">Score ≥ 70 — require same-day action</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-afia-ocean">Total patients</p>
            <p className="mt-2 text-3xl font-bold text-afia-navy">{orderedPatients.length}</p>
            <p className="mt-1 text-xs text-slate-400">In priority queue</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-afia-rose">Referral ready</p>
            <p className="mt-2 text-3xl font-bold text-afia-navy">{referralNote ? '1' : '0'}</p>
            <p className="mt-1 text-xs text-slate-400">Click a patient to generate</p>
          </div>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1fr_340px]">

          {/* Patient list */}
          <div className="space-y-3">
            {orderedPatients.map((patient, idx) => {
              const level = getLevel(patient);
              return (
                <div
                  key={`${patient.name}-${patient.createdAt ?? patient.reason}`}
                  className="rounded-xl border border-slate-200 bg-white p-5 transition hover:border-afia-ocean/40"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-slate-100 text-sm font-bold text-slate-500">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-semibold text-afia-navy">
                            {patient.name}{patient.age ? `, ${patient.age}` : ''}
                          </p>
                          <span className={`rounded px-2 py-0.5 text-xs font-medium ${riskBadge[level]}`}>
                            {level}
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-slate-400">
                          {patient.weeks ? `Week ${patient.weeks} · ` : ''}
                          {patient.district}
                          {patient.language ? ` · ${patient.language}` : ''}
                          {patient.createdAt ? ` · ${patient.createdAt}` : ''}
                        </p>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-xl font-bold text-afia-navy">{patient.score}</p>
                      <p className="text-xs text-slate-400">/ 100</p>
                    </div>
                  </div>

                  <p className="mt-3 text-sm text-slate-500">{patient.reason}</p>

                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${riskBar[level]}`}
                      style={{ width: `${patient.score}%` }}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => onGenerateReferral(patient)}
                    className="mt-4 rounded-md border border-slate-200 bg-slate-50 px-4 py-1.5 text-xs font-medium text-afia-ocean transition hover:bg-afia-ocean hover:text-white"
                  >
                    Generate Referral
                  </button>
                </div>
              );
            })}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">

            {/* Referral note */}
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <p className="text-sm font-semibold text-afia-navy">Referral Note</p>
              <div className="mt-3 min-h-[100px] rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4">
                {referralNote ? (
                  <p className="text-sm leading-relaxed text-afia-navy">{referralNote}</p>
                ) : (
                  <p className="text-sm text-slate-400">
                    Select a patient and tap "Generate Referral" to create a note.
                  </p>
                )}
              </div>
              {referralNote && (
                <button
                  type="button"
                  onClick={() => navigator.clipboard?.writeText(referralNote)}
                  className="mt-3 w-full rounded-md border border-slate-200 py-2 text-xs font-medium text-afia-ocean transition hover:bg-slate-50"
                >
                  Copy to clipboard
                </button>
              )}
            </div>

            {/* Guidance */}
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <p className="text-sm font-semibold text-afia-navy">Action thresholds</p>
              <ul className="mt-3 space-y-2.5">
                {[
                  { dot: 'bg-afia-rose', score: 'Score ≥ 85', action: 'Emergency transport immediately' },
                  { dot: 'bg-red-500', score: 'Score 70–84', action: 'Same-day clinic visit' },
                  { dot: 'bg-amber-400', score: 'Score 40–69', action: 'Schedule within 48–72 hours' },
                  { dot: 'bg-emerald-400', score: 'Score < 40', action: 'Routine ANC follow-up' },
                ].map((g) => (
                  <li key={g.score} className="flex items-start gap-3 text-xs text-slate-600">
                    <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${g.dot}`} />
                    <span><span className="font-semibold text-afia-navy">{g.score}</span> — {g.action}</span>
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
