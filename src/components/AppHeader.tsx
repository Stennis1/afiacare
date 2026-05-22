'use client';

import { useState } from 'react';
import type { Page } from '../types/app';

interface AppHeaderProps {
  page: Page;
  onChangePage: (page: Page) => void;
}

const navItems: Array<{ value: Page; label: string }> = [
  { value: 'landing', label: 'Home' },
  { value: 'ussd', label: 'Triage' },
  { value: 'chw', label: 'CHW Dashboard' },
  { value: 'district', label: 'District' },
];

export function AppHeader({ page, onChangePage }: AppHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center px-4 py-3 sm:px-6 lg:px-8">

        {/* Logo */}
        <button
          onClick={() => onChangePage('landing')}
          className="flex items-center gap-3"
          aria-label="AfiaCare home"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-afia-ocean">
            <span className="text-sm font-bold text-white">AC</span>
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-bold leading-tight text-afia-navy">AfiaCare</p>
            <p className="text-xs text-slate-500">Maternal Health Platform</p>
          </div>
        </button>

        {/* Desktop nav — pushed to the right */}
        <nav className="ml-auto hidden items-center gap-1 md:flex" aria-label="Main navigation">
          {navItems.map((item) => (
            <button
              key={item.value}
              onClick={() => onChangePage(item.value)}
              className={`rounded-md px-4 py-2 text-sm font-medium transition ${
                page === item.value
                  ? 'bg-afia-ocean text-white'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-afia-navy'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="ml-auto flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-600 transition hover:bg-slate-100 md:hidden"
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

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white px-4 pb-4 pt-2 md:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
            {navItems.map((item) => (
              <button
                key={item.value}
                onClick={() => { onChangePage(item.value); setMobileOpen(false); }}
                className={`rounded-md px-4 py-2.5 text-left text-sm font-medium transition ${
                  page === item.value
                    ? 'bg-afia-ocean text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
