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
      `${data.platform} to mp3`,
      `${data.platform} video download`,
      'online video downloader',
      'free mp4 downloader',
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

  // 1. WebApplication Schema
  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: data.title,
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'All (Web, iOS, Android, Windows, macOS, Linux)',
    url: `https://mediadrop.live/${data.slug}`,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '12850',
      bestRating: '5',
      worstRating: '1',
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description: data.metaDescription,
  };

  // 2. FAQPage Schema for Google Rich Snippets
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: data.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };

  // 3. HowTo Schema for Step-by-Step Rich Cards
  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to Download from ${data.platform.toUpperCase()} using MediaDrop`,
    description: data.subheading,
    step: data.steps.map((step, idx) => ({
      '@type': 'HowToStep',
      position: idx + 1,
      name: step.title,
      text: step.desc,
    })),
  };

  // 4. BreadcrumbList Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://mediadrop.live',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: `${data.platform.toUpperCase()} Downloader`,
        item: `https://mediadrop.live/${data.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <SeoLandingClient data={data} />
    </>
  );
}
