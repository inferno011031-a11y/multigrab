import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { SEO_PLATFORMS } from '@/lib/seo-platforms';
import { SUPPORTED_LOCALES, SupportedLocale, UI_DICTIONARY } from '@/lib/i18n';
import { SeoLandingClient } from '@/components/SeoLandingClient';
import { LocalizedHomeClient } from '@/components/LocalizedHomeClient';

interface Props {
  params: Promise<{ slug: string[] }>;
}

export async function generateStaticParams() {
  const params: { slug: string[] }[] = [];

  // 1. English SEO landing pages (e.g. /youtube-downloader)
  for (const slug of Object.keys(SEO_PLATFORMS)) {
    params.push({ slug: [slug] });
  }

  // 2. Non-English homepages (e.g. /es, /pt, /hi, /fr, /de, /ar, /id)
  const nonEnglishLocales = SUPPORTED_LOCALES.filter((l) => l.code !== 'en');
  for (const locale of nonEnglishLocales) {
    params.push({ slug: [locale.code] });
  }

  // 3. Localized SEO landing pages (e.g. /es/youtube-downloader)
  for (const locale of nonEnglishLocales) {
    for (const slug of Object.keys(SEO_PLATFORMS)) {
      params.push({ slug: [locale.code, slug] });
    }
  }

  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  if (!slug || slug.length === 0 || slug.length > 2) {
    return { title: 'MediaDrop' };
  }

  // Case A: Non-English homepage (e.g. ['es'])
  if (slug.length === 1) {
    const isLocale = SUPPORTED_LOCALES.some((l) => l.code === slug[0] && l.code !== 'en');
    if (isLocale) {
      const validLocale = slug[0] as SupportedLocale;
      const t = UI_DICTIONARY[validLocale] || UI_DICTIONARY.en;
      const titles: Record<SupportedLocale, string> = {
        en: 'MediaDrop — Free Universal Video & Audio Downloader (4K, 1080p, MP3)',
        es: 'MediaDrop — Descargador Gratuito de Videos y Audio MP3 (YouTube, TikTok, Spotify)',
        pt: 'MediaDrop — Baixar Vídeos e Músicas MP3 Grátis (YouTube, TikTok, Spotify)',
        hi: 'MediaDrop — मुफ़्त वीडियो और MP3 ऑडियो डाउनलोडर (YouTube, Spotify, TikTok)',
        fr: 'MediaDrop — Téléchargeur Gratuit de Vidéos et Musique MP3 (YouTube, TikTok, Spotify)',
        de: 'MediaDrop — Kostenloser Video & MP3 Downloader (YouTube, TikTok, Spotify)',
        ar: 'MediaDrop — أداة تحميل الفيديو والصوت MP3 المجانية (يوتيوب، تيك توك، سبوتيفاي)',
        id: 'MediaDrop — Pengunduh Video dan Audio MP3 Gratis (YouTube, TikTok, Spotify)',
      };

      return {
        title: titles[validLocale] || titles.en,
        description: t.heroSubhead,
        alternates: {
          canonical: `https://mediadrop.live/${validLocale}`,
          languages: {
            en: 'https://mediadrop.live',
            es: 'https://mediadrop.live/es',
            pt: 'https://mediadrop.live/pt',
            hi: 'https://mediadrop.live/hi',
            fr: 'https://mediadrop.live/fr',
            de: 'https://mediadrop.live/de',
            ar: 'https://mediadrop.live/ar',
            id: 'https://mediadrop.live/id',
            'x-default': 'https://mediadrop.live',
          },
        },
        openGraph: {
          title: titles[validLocale] || titles.en,
          description: t.heroSubhead,
          url: `https://mediadrop.live/${validLocale}`,
          siteName: 'MediaDrop',
        },
      };
    }

    // Case B: English SEO landing page (e.g. ['youtube-downloader'])
    const platformData = SEO_PLATFORMS[slug[0]];
    if (platformData) {
      return {
        title: platformData.title,
        description: platformData.metaDescription,
        keywords: [
          platformData.platform,
          `${platformData.platform} downloader`,
          `${platformData.platform} mp3`,
          'free video downloader',
          'mediadrop',
        ],
        alternates: {
          canonical: `https://mediadrop.live/${platformData.slug}`,
          languages: {
            en: `https://mediadrop.live/${platformData.slug}`,
            es: `https://mediadrop.live/es/${platformData.slug}`,
            pt: `https://mediadrop.live/pt/${platformData.slug}`,
            hi: `https://mediadrop.live/hi/${platformData.slug}`,
            fr: `https://mediadrop.live/fr/${platformData.slug}`,
            de: `https://mediadrop.live/de/${platformData.slug}`,
            ar: `https://mediadrop.live/ar/${platformData.slug}`,
            id: `https://mediadrop.live/id/${platformData.slug}`,
            'x-default': `https://mediadrop.live/${platformData.slug}`,
          },
        },
        openGraph: {
          title: platformData.title,
          description: platformData.metaDescription,
          url: `https://mediadrop.live/${platformData.slug}`,
          siteName: 'MediaDrop',
        },
      };
    }
  }

  // Case C: Localized SEO landing page (e.g. ['es', 'youtube-downloader'])
  if (slug.length === 2) {
    const [localeCode, platformSlug] = slug;
    const isSupportedLocale = SUPPORTED_LOCALES.some((l) => l.code === localeCode && l.code !== 'en');
    const platformData = SEO_PLATFORMS[platformSlug];

    if (isSupportedLocale && platformData) {
      const validLocale = localeCode as SupportedLocale;
      const t = UI_DICTIONARY[validLocale] || UI_DICTIONARY.en;

      const localizedTitles: Record<SupportedLocale, string> = {
        en: platformData.title,
        es: `Descargar ${platformData.platform.toUpperCase()} - Video HD y Audio MP3 Gratis | MediaDrop`,
        pt: `Baixar ${platformData.platform.toUpperCase()} - Vídeos e Músicas MP3 Grátis | MediaDrop`,
        hi: `${platformData.platform.toUpperCase()} वीडियो और MP3 डाउनलोडर - मुफ़्त | MediaDrop`,
        fr: `Télécharger ${platformData.platform.toUpperCase()} - Vidéos et MP3 Gratuitement | MediaDrop`,
        de: `${platformData.platform.toUpperCase()} Downloader - Videos & MP3 kostenlos herunterladen | MediaDrop`,
        ar: `تحميل فيديو وصوت ${platformData.platform.toUpperCase()} مجاناً بأعلى جودة | MediaDrop`,
        id: `Download Video dan MP3 ${platformData.platform.toUpperCase()} Gratis | MediaDrop`,
      };

      const pageTitle = localizedTitles[validLocale] || platformData.title;

      return {
        title: pageTitle,
        description: `${t.heroSubhead} ${platformData.metaDescription}`,
        alternates: {
          canonical: `https://mediadrop.live/${validLocale}/${platformData.slug}`,
          languages: {
            en: `https://mediadrop.live/${platformData.slug}`,
            es: `https://mediadrop.live/es/${platformData.slug}`,
            pt: `https://mediadrop.live/pt/${platformData.slug}`,
            hi: `https://mediadrop.live/hi/${platformData.slug}`,
            fr: `https://mediadrop.live/fr/${platformData.slug}`,
            de: `https://mediadrop.live/de/${platformData.slug}`,
            ar: `https://mediadrop.live/ar/${platformData.slug}`,
            id: `https://mediadrop.live/id/${platformData.slug}`,
            'x-default': `https://mediadrop.live/${platformData.slug}`,
          },
        },
        openGraph: {
          title: pageTitle,
          description: platformData.metaDescription,
          url: `https://mediadrop.live/${validLocale}/${platformData.slug}`,
          siteName: 'MediaDrop',
        },
      };
    }
  }

  return { title: 'MediaDrop' };
}

export default async function CatchAllSlugPage({ params }: Props) {
  const { slug } = await params;

  if (!slug || slug.length === 0 || slug.length > 2) {
    notFound();
  }

  // 1. Single Segment handling
  if (slug.length === 1) {
    // Non-English Homepage (e.g. /es, /pt)
    const isLocale = SUPPORTED_LOCALES.some((l) => l.code === slug[0] && l.code !== 'en');
    if (isLocale) {
      const validLocale = slug[0] as SupportedLocale;
      return (
        <Suspense fallback={<div className="min-h-screen bg-black" />}>
          <LocalizedHomeClient locale={validLocale} />
        </Suspense>
      );
    }

    // English SEO landing page (e.g. /youtube-downloader)
    const platformData = SEO_PLATFORMS[slug[0]];
    if (platformData) {
      const webAppSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: platformData.title,
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'All (Web, iOS, Android, Windows, macOS, Linux)',
        url: `https://mediadrop.live/${platformData.slug}`,
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          reviewCount: '12850',
        },
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        description: platformData.metaDescription,
      };

      const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: platformData.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.a,
          },
        })),
      };

      const howToSchema = {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: `How to Download from ${platformData.platform.toUpperCase()} using MediaDrop`,
        description: platformData.subheading,
        step: platformData.steps.map((step, idx) => ({
          '@type': 'HowToStep',
          position: idx + 1,
          name: step.title,
          text: step.desc,
        })),
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
          <SeoLandingClient data={platformData} />
        </>
      );
    }
  }

  // 2. Two Segments handling (e.g. /es/youtube-downloader)
  if (slug.length === 2) {
    const [localeCode, platformSlug] = slug;
    const isSupportedLocale = SUPPORTED_LOCALES.some((l) => l.code === localeCode && l.code !== 'en');
    const platformData = SEO_PLATFORMS[platformSlug];

    if (isSupportedLocale && platformData) {
      const validLocale = localeCode as SupportedLocale;

      const webAppSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: platformData.title,
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'All',
        url: `https://mediadrop.live/${validLocale}/${platformData.slug}`,
        inLanguage: validLocale,
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          reviewCount: '12850',
        },
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        description: platformData.metaDescription,
      };

      const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: platformData.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.a,
          },
        })),
      };

      const howToSchema = {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: `How to Download from ${platformData.platform.toUpperCase()} using MediaDrop`,
        description: platformData.subheading,
        step: platformData.steps.map((step, idx) => ({
          '@type': 'HowToStep',
          position: idx + 1,
          name: step.title,
          text: step.desc,
        })),
      };

      return (
        <div dir={validLocale === 'ar' ? 'rtl' : 'ltr'}>
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
          <SeoLandingClient data={platformData} />
        </div>
      );
    }
  }

  notFound();
}
