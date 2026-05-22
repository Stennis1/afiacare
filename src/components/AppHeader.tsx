import type { Page } from '../types/app';

interface AppHeaderProps {
  page: Page;
  aiMode: 'demo' | 'live';
  hasServerAI: boolean;
  onChangePage: (page: Page) => void;
  onSelectDemoMode: () => void;
  onSelectLiveMode: () => void;
}

const navItems: Array<{ value: Page; label: string }> = [
  { value: 'landing', label: 'Landing' },
  { value: 'ussd', label: 'USSD' },
  { value: 'chw', label: 'CHW' },
  { value: 'district', label: 'District' },
];

export function AppHeader({
  page,
  aiMode,
  hasServerAI,
  onChangePage,
  onSelectDemoMode,
  onSelectLiveMode,
}: AppHeaderProps) {
  return (
    <header className="mb-8 flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/40 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-3 text-sky-300">
          <div className="h-12 w-12 rounded-2xl bg-sky-500/20 ring-1 ring-sky-300/40" />
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-sky-300">AfiaCare</p>
            <h1 className="text-3xl font-bold text-white">AI Maternal Health Companion</h1>
          </div>
        </div>
        <p className="mt-3 max-w-2xl text-slate-300">
          A demo for rural Ghana healthcare teams: triage risk, manage referrals, and support
          pregnant women through AI-guided insights.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        {navItems.map((item) => (
          <button
            key={item.value}
            onClick={() => onChangePage(item.value)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              page === item.value
                ? 'bg-white text-afia-navy shadow-lg'
                : 'text-slate-200 hover:bg-slate-800 hover:text-white'
            }`}
          >
            {item.label}
          </button>
        ))}
        <div className="ml-4 flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800 px-4 py-2">
          <span className="text-xs uppercase tracking-[0.2em] text-slate-400">AI Mode:</span>
          <button
            onClick={onSelectDemoMode}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
              aiMode === 'demo'
                ? 'bg-sky-500 text-slate-950'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Demo
          </button>
          <button
            onClick={onSelectLiveMode}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
              aiMode === 'live'
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            } ${!hasServerAI ? 'cursor-not-allowed opacity-50' : ''}`}
            title={!hasServerAI ? 'Server integration required' : ''}
          >
            Live
          </button>
        </div>
      </div>
    </header>
  );
}
