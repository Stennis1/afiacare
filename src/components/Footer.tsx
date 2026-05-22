import type { Page } from '../types/app';

interface FooterProps {
  onChangePage: (page: Page) => void;
}

export function Footer({ onChangePage }: FooterProps) {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-afia-ocean">
                <span className="text-xs font-bold text-white">AC</span>
              </div>
              <span className="text-sm font-bold text-afia-navy">AfiaCare</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-500">
              Multilingual AI-powered maternal health triage for rural Ghana. Detecting danger
              before danger becomes death.
            </p>
            <p className="mt-3 text-xs text-slate-400">
              Supports English, Twi, Dagbani, and Ewe.
            </p>
          </div>

          {/* Platform links */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Platform</p>
            <ul className="mt-4 space-y-2">
              {(
                [
                  { label: 'Home', page: 'landing' },
                  { label: 'Symptom Triage', page: 'ussd' },
                  { label: 'CHW Dashboard', page: 'chw' },
                  { label: 'District Metrics', page: 'district' },
                ] as { label: string; page: Page }[]
              ).map((item) => (
                <li key={item.label}>
                  <button
                    onClick={() => onChangePage(item.page)}
                    className="text-sm text-slate-600 transition hover:text-afia-ocean"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Access */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Access</p>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li>USSD: <span className="font-semibold text-afia-navy">*928#</span></li>
              <li>Works on feature phones</li>
              <li>No internet required</li>
              <li>Voice input supported</li>
              <li>Offline triage engine</li>
            </ul>
          </div>

          {/* Risk levels */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Risk levels</p>
            <ul className="mt-4 space-y-2">
              {[
                { label: 'Low', bg: 'bg-emerald-100', text: 'text-emerald-800' },
                { label: 'Medium', bg: 'bg-amber-100', text: 'text-amber-800' },
                { label: 'High', bg: 'bg-red-100', text: 'text-red-800' },
                { label: 'Emergency', bg: 'bg-slate-800', text: 'text-white' },
              ].map((r) => (
                <li key={r.label}>
                  <span className={`inline-block rounded px-2.5 py-0.5 text-xs font-medium ${r.bg} ${r.text}`}>
                    {r.label}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">For</p>
              <ul className="mt-2 space-y-1 text-sm text-slate-500">
                <li>Pregnant women</li>
                <li>Community health workers</li>
                <li>District health officers</li>
                <li>NGOs &amp; government</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-6 sm:flex-row">
          <p className="text-xs text-slate-400">
            &copy; {new Date().getFullYear()} AfiaCare. Built to save mothers in rural Ghana.
          </p>
          <p className="text-xs text-slate-400">
            Demo platform &mdash; not for clinical use without medical supervision.
          </p>
        </div>
      </div>
    </footer>
  );
}
