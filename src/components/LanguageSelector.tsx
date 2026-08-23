'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SUPPORTED_LOCALES, SupportedLocale } from '@/lib/i18n';
import { Globe, ChevronDown } from 'lucide-react';

export function LanguageSelector({ currentLocale = 'en' }: { currentLocale?: SupportedLocale }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname() || '/';

  const current = SUPPORTED_LOCALES.find((l) => l.code === currentLocale) || SUPPORTED_LOCALES[0];

  // Helper to calculate target path when switching language
  const getLocalizedHref = (targetLocale: SupportedLocale) => {
    // Strip existing locale prefix if present
    const segments = pathname.split('/').filter(Boolean);
    const existingLocaleMatch = SUPPORTED_LOCALES.some((l) => l.code === segments[0]);

    const remainingSegments = existingLocaleMatch ? segments.slice(1) : segments;
    const remainingPath = remainingSegments.join('/');

    if (targetLocale === 'en') {
      return remainingPath ? `/${remainingPath}` : '/';
    }

    return remainingPath ? `/${targetLocale}/${remainingPath}` : `/${targetLocale}`;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        className="flex items-center gap-1.5 rounded-xl border border-neutral-800 bg-neutral-900/80 px-2.5 py-1.5 text-xs font-medium text-neutral-300 hover:border-neutral-700 hover:text-white transition-all cursor-pointer"
        aria-label="Select Language"
      >
        <Globe className="w-3.5 h-3.5 text-cyan-400" />
        <span className="hidden sm:inline">{current.flag} {current.nativeName}</span>
        <span className="sm:hidden uppercase">{current.code}</span>
        <ChevronDown className={`w-3 h-3 text-neutral-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-44 rounded-2xl border border-neutral-800 bg-neutral-900/95 p-1.5 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150 z-50 max-h-64 overflow-y-auto">
          {SUPPORTED_LOCALES.map((locale) => {
            const isActive = locale.code === currentLocale;
            return (
              <Link
                key={locale.code}
                href={getLocalizedHref(locale.code)}
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-600/30 text-cyan-300 font-bold'
                    : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{locale.flag}</span>
                  <span>{locale.nativeName}</span>
                </div>
                <span className="text-[10px] text-neutral-500 uppercase">{locale.code}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
