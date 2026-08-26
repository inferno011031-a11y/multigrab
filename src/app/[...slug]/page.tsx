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

  // 1. English SEO landing pages (e.g. /youtube-downloader, /tiktok-downloader)
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
    return { title: 'MultiGrab' };
  }

  // Case A: Non-English homepage (e.g. ['es'])
  if (slug.length === 1) {
    const isLocale = SUPPORTED_LOCALES.some((l) => l.code === slug[0] && l.code !== 'en');
    if (isLocale) {
      const validLocale = slug[0] as SupportedLocale;
      const t = UI_DICTIONARY[validLocale] || UI_DICTIONARY.en;
      const titles: Record<SupportedLocale, string> = {
        en: 'MultiGrab — Free Universal Video & Audio Downloader (4K, 1080p, MP3)',
        es: 'MultiGrab — Descargador Gratuito de Videos y Audio MP3 (YouTube, TikTok, Spotify)',
        pt: 'MultiGrab — Baixar Vídeos e Músicas MP3 Grátis (YouTube, TikTok, Spotify)',
        hi: 'MultiGrab — मुफ़्त वीडियो और MP3 ऑडियो डाउनलोडर (YouTube, Spotify, TikTok)',
        fr: 'MultiGrab — Téléchargeur Gratuit de Vidéos et Musique MP3 (YouTube, TikTok, Spotify)',
        de: 'MultiGrab — Kostenloser Video & MP3 Downloader (YouTube, TikTok, Spotify)',
        ar: 'MultiGrab — أداة تحميل الفيديو والصوت MP3 المجانية (يوتيوب، تيك توك، سبوتيفاي)',
        id: 'MultiGrab — Pengunduh Video dan Audio MP3 Gratis (YouTube, TikTok, Spotify)',
      };

      const title = titles[validLocale] || titles.en;

      return {
        title,
        description: t.heroSubhead,
        alternates: {
          canonical: `https://multigrab.online/${validLocale}`,
          languages: {
            en: 'https://multigrab.online',
            es: 'https://multigrab.online/es',
            pt: 'https://multigrab.online/pt',
            hi: 'https://multigrab.online/hi',
            fr: 'https://multigrab.online/fr',
            de: 'https://multigrab.online/de',
            ar: 'https://multigrab.online/ar',
            id: 'https://multigrab.online/id',
            'x-default': 'https://multigrab.online',
          },
        },
        openGraph: {
          title,
          description: t.heroSubhead,
          url: `https://multigrab.online/${validLocale}`,
          siteName: 'MultiGrab',
          locale: validLocale,
          type: 'website',
        },
        twitter: {
          card: 'summary_large_image',
          title,
          description: t.heroSubhead,
        },
      };
    }

    // Case B: English SEO landing page (e.g. ['youtube-downloader', 'instagram-downloader'])
    const platformData = SEO_PLATFORMS[slug[0]];
    if (platformData) {
      return {
        title: platformData.title,
        description: platformData.metaDescription,
        keywords: [
          platformData.platform,
          `${platformData.platform} downloader`,
          `${platformData.platform} video downloader`,
          `${platformData.platform} mp3`,
          'free video downloader',
          'multigrab',
        ],
        alternates: {
          canonical: `https://multigrab.online/${platformData.slug}`,
          languages: {
            en: `https://multigrab.online/${platformData.slug}`,
            es: `https://multigrab.online/es/${platformData.slug}`,
            pt: `https://multigrab.online/pt/${platformData.slug}`,
            hi: `https://multigrab.online/hi/${platformData.slug}`,
            fr: `https://multigrab.online/fr/${platformData.slug}`,
            de: `https://multigrab.online/de/${platformData.slug}`,
            ar: `https://multigrab.online/ar/${platformData.slug}`,
            id: `https://multigrab.online/id/${platformData.slug}`,
            'x-default': `https://multigrab.online/${platformData.slug}`,
          },
        },
        openGraph: {
          title: platformData.title,
          description: platformData.metaDescription,
          url: `https://multigrab.online/${platformData.slug}`,
          siteName: 'MultiGrab',
          locale: 'en_US',
          type: 'website',
        },
        twitter: {
          card: 'summary_large_image',
          title: platformData.title,
          description: platformData.metaDescription,
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
        es: `Descargar ${platformData.platform.toUpperCase()} - Video HD y Audio MP3 Gratis | MultiGrab`,
        pt: `Baixar ${platformData.platform.toUpperCase()} - Vídeos e Músicas MP3 Grátis | MultiGrab`,
        hi: `${platformData.platform.toUpperCase()} वीडियो और MP3 डाउनलोडर - मुफ़्त | MultiGrab`,
        fr: `Télécharger ${platformData.platform.toUpperCase()} - Vidéos et MP3 Gratuitement | MultiGrab`,
        de: `${platformData.platform.toUpperCase()} Downloader - Videos & MP3 kostenlos herunterladen | MultiGrab`,
        ar: `تحميل فيديو وصوت ${platformData.platform.toUpperCase()} مجاناً بأعلى جودة | MultiGrab`,
        id: `Download Video dan MP3 ${platformData.platform.toUpperCase()} Gratis | MultiGrab`,
      };

      const pageTitle = localizedTitles[validLocale] || platformData.title;

      return {
        title: pageTitle,
        description: `${t.heroSubhead} ${platformData.metaDescription}`,
        alternates: {
          canonical: `https://multigrab.online/${validLocale}/${platformData.slug}`,
          languages: {
            en: `https://multigrab.online/${platformData.slug}`,
            es: `https://multigrab.online/es/${platformData.slug}`,
            pt: `https://multigrab.online/pt/${platformData.slug}`,
            hi: `https://multigrab.online/hi/${platformData.slug}`,
            fr: `https://multigrab.online/fr/${platformData.slug}`,
            de: `https://multigrab.online/de/${platformData.slug}`,
            ar: `https://multigrab.online/ar/${platformData.slug}`,
            id: `https://multigrab.online/id/${platformData.slug}`,
            'x-default': `https://multigrab.online/${platformData.slug}`,
          },
        },
        openGraph: {
          title: pageTitle,
          description: platformData.metaDescription,
          url: `https://multigrab.online/${validLocale}/${platformData.slug}`,
          siteName: 'MultiGrab',
          locale: validLocale,
          type: 'website',
        },
        twitter: {
          card: 'summary_large_image',
          title: pageTitle,
          description: platformData.metaDescription,
        },
      };
    }
  }

  return { title: 'MultiGrab' };
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

    // English SEO landing page (e.g. /youtube-downloader, /tiktok-downloader)
    const platformData = SEO_PLATFORMS[slug[0]];
    if (platformData) {
      const webAppSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: platformData.title,
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'All (Web, iOS, Android, Windows, macOS, Linux)',
        url: `https://multigrab.online/${platformData.slug}`,
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          reviewCount: '15400',
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
        name: `How to Download from ${platformData.platform.toUpperCase()} using MultiGrab`,
        description: platformData.subheading,
        step: platformData.steps.map((step, idx) => ({
          '@type': 'HowToStep',
          position: idx + 1,
          name: step.title,
          text: step.desc,
        })),
      };

      const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://multigrab.online',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: platformData.heading,
            item: `https://multigrab.online/${platformData.slug}`,
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
        url: `https://multigrab.online/${validLocale}/${platformData.slug}`,
        inLanguage: validLocale,
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          reviewCount: '15400',
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
        name: `How to Download from ${platformData.platform.toUpperCase()} using MultiGrab`,
        description: platformData.subheading,
        step: platformData.steps.map((step, idx) => ({
          '@type': 'HowToStep',
          position: idx + 1,
          name: step.title,
          text: step.desc,
        })),
      };

      const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `https://multigrab.online/${validLocale}`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: platformData.heading,
            item: `https://multigrab.online/${validLocale}/${platformData.slug}`,
          },
        ],
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
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
          />
          <SeoLandingClient data={platformData} />
        </div>
      );
    }
  }

  notFound();
}
