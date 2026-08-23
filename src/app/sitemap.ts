import { MetadataRoute } from 'next';
import { SEO_PLATFORMS } from '@/lib/seo-platforms';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://mediadrop.live';
  const now = new Date();

  // Root homepage
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ];

  // All programmatic SEO platform landing pages
  for (const slug of Object.keys(SEO_PLATFORMS)) {
    routes.push({
      url: `${baseUrl}/${slug}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    });
  }

  return routes;
}
