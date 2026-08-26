import React, { Suspense } from 'react';
import { HomeClient } from '@/components/HomeClient';

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <HomeClient />
    </Suspense>
  );
}
