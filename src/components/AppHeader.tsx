import { useState } from 'react';
import type { Page } from '../types/app';

interface AppHeaderProps {
  page: Page;
  aiMode: 'demo' | 'live';
  hasServerAI: boolean;
  onChangePage: (page: Page) => void;
  onSelectDemoMode: () => void;
  onSelectLiveMode: () => void;
}

const navItems: Array<{ value: Page; label: string; icon: string }> = [
  { value: 'landing', label: 'Home', icon: '🏠' },
  { value: 'ussd', label: 'Triage', icon: '🩺' },
  { value: 'chw', label: 'CHW Dashboard', icon: '👩‍⚕️' },
  { value: 'district', label: 'District', icon: '📊' },
];

export function AppHeader({
  page,
  aiMode,
  hasServerAI,
  onChangePage,
  onSelectDemoMode,
  onSelectLiveMode,
}: AppHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-afia-foam/60 bg-white/95 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <button
          onClick={() => onChangePage('landing')}
          className="flex items-center gap-3 group"
          aria-label="AfiaCare home"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-afia-ocean to-afia-rose shadow-afia-blue">
            <span className="text-lg font-black text-white">A</span>
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-afia-rose">
              AfiaCare
            </p>
            <p className="text-sm font-bold text-afia-navy leading-tight">
              AI Maternal Health
            </p>
          </div>
        </button>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
          {navItems.map((item) => (
            <button
              key={item.value}
              onClick={() => onChangePage(item.value)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-150 ${
                page === item.value
                  ? 'bg-gradient-to-r from-afia-ocean to-afia-sea text-white shadow-afia-blue'
                  : 'text-afia-navy/70 hover:bg-afia-foam hover:text-afia-ocean'
              }`}
            >
              <span aria-hidden="true">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* AI mode toggle + mobile menu button */}
        <div className="flex items-center gap-3">
          {/* AI mode pill */}
          <div className="hidden items-center gap-1 rounded-full border border-afia-foam bg-afia-foam/40 p-1 sm:flex">
            <button
              onClick={onSelectDemoMode}
              className={`rounded-full px-3 py-1 text-xs font-bold transition-all duration-150 ${
                aiMode === 'demo'
                  ? 'bg-afia-ocean text-white shadow-sm'
                  : 'text-afia-navy/60 hover:text-afia-ocean'
              }`}
            >
              Demo
            </button>
            <button
              onClick={onSelectLiveMode}
              disabled={!hasServerAI}
              title={!hasServerAI ? 'Server integration required' : 'Switch to live AI'}
              className={`rounded-full px-3 py-1 text-xs font-bold transition-all duration-150 ${
                aiMode === 'live'
                  ? 'bg-afia-rose text-white shadow-sm'
                  : 'text-afia-navy/60 hover:text-afia-rose'
              } ${!hasServerAI ? 'cursor-not-allowed opacity-40' : ''}`}
            >
              Live
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-afia-foam text-afia-navy/70 transition hover:bg-afia-foam md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle navigation"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="border-t border-afia-foam bg-white px-4 pb-4 pt-2 md:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
            {navItems.map((item) => (
              <button
                key={item.value}
                onClick={() => {
                  onChangePage(item.value);
                  setMobileOpen(false);
                }}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  page === item.value
                    ? 'bg-gradient-to-r from-afia-ocean to-afia-sea text-white'
                    : 'text-afia-navy/70 hover:bg-afia-foam'
                }`}
              >
                <span aria-hidden="true" className="text-base">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
          {/* AI mode in mobile */}
          <div className="mt-3 flex items-center gap-2 border-t border-afia-foam pt-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-afia-navy/50">AI Mode:</span>
            <button
              onClick={onSelectDemoMode}
              className={`rounded-full px-3 py-1 text-xs font-bold transition ${
                aiMode === 'demo' ? 'bg-afia-ocean text-white' : 'bg-afia-foam text-afia-navy/60'
              }`}
            >
              Demo
            </button>
            <button
              onClick={onSelectLiveMode}
              disabled={!hasServerAI}
              className={`rounded-full px-3 py-1 text-xs font-bold transition ${
                aiMode === 'live' ? 'bg-afia-rose text-white' : 'bg-afia-foam text-afia-navy/60'
              } ${!hasServerAI ? 'cursor-not-allowed opacity-40' : ''}`}
            >
              Live
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
