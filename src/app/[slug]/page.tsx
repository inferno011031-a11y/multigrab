import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { SEO_PLATFORMS } from '@/lib/seo-platforms';
import { SeoLandingClient } from '@/components/SeoLandingClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(SEO_PLATFORMS).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = SEO_PLATFORMS[slug];

  if (!data) {
    return {
      title: 'Media Downloader | MediaDrop',
      description: 'Universal media and audio downloader.',
    };
  }

  return {
    title: data.title,
    description: data.metaDescription,
    keywords: [
      data.platform,
      `${data.platform} downloader`,
      `${data.platform} mp3`,
      `${data.platform} video download`,
      'free media downloader',
      'mediadrop',
    ],
    openGraph: {
      title: data.title,
      description: data.metaDescription,
      type: 'website',
      url: `https://mediadrop.live/${data.slug}`,
      siteName: 'MediaDrop',
    },
    twitter: {
      card: 'summary_large_image',
      title: data.title,
      description: data.metaDescription,
    },
    alternates: {
      canonical: `https://mediadrop.live/${data.slug}`,
    },
  };
}

export default async function SeoLandingPage({ params }: Props) {
  const { slug } = await params;
  const data = SEO_PLATFORMS[slug];

  if (!data) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: data.title,
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description: data.metaDescription,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SeoLandingClient data={data} />
    </>
  );
}
