import type { Patient } from '../types/app';

interface ChwDashboardProps {
  orderedPatients: Patient[];
  userRecordCount: number;
  referralNote: string | null;
  onGenerateReferral: (patient: Patient) => void;
}

export function ChwDashboard({
  orderedPatients,
  userRecordCount,
  referralNote,
  onGenerateReferral,
}: ChwDashboardProps) {
  return (
    <div className="space-y-8">
      <div className="grid gap-6 xl:grid-cols-[0.7fr_0.3fr]">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl shadow-slate-950/30">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Priority queue</p>
          <h3 className="mt-3 text-3xl font-bold text-white">Patients sorted by risk</h3>
          <div className="mt-6 space-y-4">
            {orderedPatients.map((patient) => (
              <div key={`${patient.name}-${patient.createdAt ?? patient.reason}`} className="rounded-3xl border border-slate-700 bg-slate-950/70 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-white">
                      {patient.name}
                      {patient.age ? `, ${patient.age}` : ''}
                    </p>
                    <p className="text-sm text-slate-400">
                      {patient.weeks ? `Week ${patient.weeks} - ` : ''}
                      {patient.district}
                      {patient.language ? ` - ${patient.language}` : ''}
                      {patient.createdAt ? ` - ${patient.createdAt}` : ''}
                    </p>
                  </div>
                  <span className="rounded-full bg-sky-500/20 px-3 py-1 text-sm font-semibold text-sky-200">
                    {patient.riskLevel ? `${patient.riskLevel} ` : ''}Risk {patient.score}
                  </span>
                </div>
                <p className="mt-3 text-slate-300">{patient.reason}</p>
                <button
                  type="button"
                  onClick={() => onGenerateReferral(patient)}
                  className="mt-4 inline-flex rounded-full bg-afia-mint px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
                >
                  Generate Referral
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl shadow-slate-950/30">
          <h4 className="text-xl font-semibold text-white">CHW Summary</h4>
          <div className="mt-6 space-y-4 text-slate-300">
            <div className="rounded-3xl bg-sky-500/10 p-4 text-sky-100">
              <p className="text-sm uppercase tracking-[0.3em] text-sky-300">New reports</p>
              <p className="mt-3 text-3xl font-bold text-white">{userRecordCount}</p>
              <p className="mt-1 text-sm">Voice and phrase reports submitted during this session.</p>
            </div>
            <p>Use this dashboard to focus on the highest-risk women and share referral notes with the care network.</p>
            <div className="rounded-3xl bg-slate-950/70 p-4">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Guidance</p>
              <p className="mt-3">
                Patients with scores above 80 should be contacted immediately. Keep follow-up visits within 48 hours where possible.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl shadow-slate-950/30">
        <h4 className="text-xl font-semibold text-white">Referral note</h4>
        <div className="mt-5 min-h-[140px] rounded-3xl border border-slate-700 bg-slate-950/80 p-6 text-slate-200">
          {referralNote ? (
            <p>{referralNote}</p>
          ) : (
            <p className="text-slate-400">Select a patient and generate a referral note to display it here.</p>
          )}
        </div>
      </div>
    </div>
  );
}
