'use client';

import React from 'react';

interface AdBannerProps {
  slotId?: string;
  format?: 'horizontal' | 'rectangle' | 'responsive';
  className?: string;
}

export function AdBanner({
  slotId = 'default-slot',
  format = 'responsive',
  className = '',
}: AdBannerProps) {
  // Only render if explicitly enabled via environment variable
  const adsEnabled = process.env.NEXT_PUBLIC_ENABLE_ADS === 'true';

  if (!adsEnabled) {
    return null;
  }

  return (
    <div
      className={`mx-auto my-6 flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/30 p-4 text-center ${className}`}
    >
      <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-600 mb-2">
        Advertisement
      </span>

      {/* Ad slot placeholder or script mount */}
      <div
        id={`ad-slot-${slotId}`}
        data-ad-format={format}
        className="flex min-h-[90px] w-full max-w-[728px] items-center justify-center rounded-xl bg-neutral-950/50 border border-neutral-800/60 text-xs text-neutral-500"
      >
        <span>Ad Slot #{slotId}</span>
      </div>
    </div>
  );
}
