'use client';

import React from 'react';

export function MediaInspectorSkeleton() {
  return (
    <div className="w-full max-w-4xl mx-auto mt-8 rounded-3xl border border-neutral-800 bg-neutral-900/60 p-6 sm:p-8 backdrop-blur-xl shadow-2xl animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Thumbnail Box */}
        <div className="w-full md:w-72 aspect-video rounded-2xl bg-neutral-800/60 shrink-0" />

        {/* Title & Metadata Details */}
        <div className="flex-1 w-full space-y-3">
          <div className="h-6 w-3/4 bg-neutral-800 rounded-lg" />
          <div className="h-4 w-1/2 bg-neutral-800/60 rounded-md" />
          <div className="flex gap-2 pt-2">
            <div className="h-4 w-20 bg-neutral-800/40 rounded-md" />
            <div className="h-4 w-24 bg-neutral-800/40 rounded-md" />
          </div>

          {/* Tab Skeleton */}
          <div className="flex gap-2 pt-4 border-t border-neutral-800/60">
            <div className="h-8 w-20 bg-neutral-800 rounded-xl" />
            <div className="h-8 w-24 bg-neutral-800/50 rounded-xl" />
            <div className="h-8 w-24 bg-neutral-800/50 rounded-xl" />
          </div>
        </div>
      </div>

      {/* Cards Skeleton Grid */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-neutral-800/60 bg-neutral-950/40 p-4 space-y-3"
          >
            <div className="flex justify-between">
              <div className="h-5 w-24 bg-neutral-800 rounded-md" />
              <div className="h-5 w-12 bg-neutral-800/60 rounded-md" />
            </div>
            <div className="h-3 w-32 bg-neutral-800/40 rounded-md" />
            <div className="h-9 w-full bg-neutral-800/70 rounded-xl mt-3" />
          </div>
        ))}
      </div>
    </div>
  );
}
