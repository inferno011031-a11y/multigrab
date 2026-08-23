import { MetadataRoute } from 'next';
import { SEO_PLATFORMS } from '@/lib/seo-platforms';
import { SUPPORTED_LOCALES } from '@/lib/i18n';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://mediadrop.live';
  const now = new Date();
  const routes: MetadataRoute.Sitemap = [];

  // 1. Root homepage (English)
  routes.push({
    url: baseUrl,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 1.0,
  });

  // 2. Localized Homepages (Spanish, Portuguese, Hindi, French, German, Arabic, Indonesian)
  for (const locale of SUPPORTED_LOCALES.filter((l) => l.code !== 'en')) {
    routes.push({
      url: `${baseUrl}/${locale.code}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    });
  }

  // 3. English Programmatic SEO platform pages
  for (const slug of Object.keys(SEO_PLATFORMS)) {
    routes.push({
      url: `${baseUrl}/${slug}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    });
  }

  // 4. Localized Programmatic SEO platform pages
  for (const locale of SUPPORTED_LOCALES.filter((l) => l.code !== 'en')) {
    for (const slug of Object.keys(SEO_PLATFORMS)) {
      routes.push({
        url: `${baseUrl}/${locale.code}/${slug}`,
        lastModified: now,
        changeFrequency: 'daily',
        priority: 0.8,
      });
    }
  }

  return routes;
}
