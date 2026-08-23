'use client';

import React from 'react';
import { Check, Sparkles, Zap, Shield, Crown } from 'lucide-react';

interface PricingSectionProps {
  onSelectPlan: (plan: string) => void;
}

export function PricingSection({ onSelectPlan }: PricingSectionProps) {
  const plans = [
    {
      name: 'Starter',
      price: '$0',
      period: 'forever free',
      description: 'Essential public media downloads for personal use.',
      features: [
        'Single URL downloads',
        'Up to 1080p Full HD resolution',
        'MP3 audio extraction (128 kbps)',
        '30-minute secure file retention',
        'Standard processing queue',
      ],
      cta: 'Current Plan',
      highlighted: false,
      badge: null,
    },
    {
      name: 'Pro Creator',
      price: '$9',
      period: 'per month',
      description: 'Maximum speed, 4K resolution, and high-fidelity audio.',
      features: [
        'Everything in Starter',
        'Ultra 4K & 60 FPS resolution',
        'High-Res MP3 Audio (320 kbps) & M4A',
        'Batch multi-URL queue processing',
        'Priority high-speed worker pool',
        'No daily download rate limits',
        'Custom filename formatting',
      ],
      cta: 'Upgrade to Pro',
      highlighted: true,
      badge: 'MOST POPULAR',
    },
    {
      name: 'Developer API',
      price: '$29',
      period: 'per month',
      description: 'Programmatic media extraction API for apps & creators.',
      features: [
        'Everything in Pro Creator',
        'REST API access (50,000 req/mo)',
        'Webhook completion callbacks',
        'Dedicated worker instances',
        'Custom domain CDN streaming',
        '99.9% uptime SLA guarantee',
        'Priority email & Discord support',
      ],
      cta: 'Get API Access',
      highlighted: false,
      badge: 'FOR DEVELOPERS',
    },
  ];

  return (
    <section id="pricing" className="mt-28 w-full max-w-6xl mx-auto px-4">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-3.5 py-1 text-xs font-semibold text-purple-400 mb-3">
          <Crown className="w-3.5 h-3.5" />
          <span>Simple, Transparent SaaS Pricing</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Choose the Perfect Plan for Your Needs
        </h2>
        <p className="mt-2 text-sm text-neutral-400 max-w-xl mx-auto">
          Start for free, or unlock 4K downloads, batch processing, and high-throughput developer API.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative flex flex-col justify-between rounded-3xl p-6 sm:p-8 backdrop-blur-xl transition-all ${
              plan.highlighted
                ? 'border-2 border-indigo-500 bg-neutral-900/90 shadow-2xl shadow-indigo-950/60 scale-105 z-10'
                : 'border border-neutral-800 bg-neutral-950/60 hover:border-neutral-700'
            }`}
          >
            {plan.badge && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 px-3.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-black shadow-md">
                {plan.badge}
              </div>
            )}

            <div>
              <h3 className="text-xl font-bold text-white">{plan.name}</h3>
              <p className="mt-1 text-xs text-neutral-400 min-h-[32px]">{plan.description}</p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-black text-white">{plan.price}</span>
                <span className="text-xs text-neutral-400">/{plan.period}</span>
              </div>

              <ul className="mt-8 space-y-3">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-xs text-neutral-300">
                    <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => onSelectPlan(plan.name)}
              className={`mt-8 w-full rounded-xl py-3 text-xs font-bold transition-all cursor-pointer ${
                plan.highlighted
                  ? 'bg-gradient-to-r from-indigo-500 to-cyan-400 text-black shadow-lg shadow-indigo-500/25 hover:opacity-95'
                  : 'bg-neutral-800 text-white hover:bg-neutral-700'
              }`}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
