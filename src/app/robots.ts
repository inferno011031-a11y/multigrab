import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/'],
    },
    sitemap: [
      'https://www.multigrab.online/sitemap.xml',
      'https://multigrab.online/sitemap.xml',
    ],
    host: 'https://www.multigrab.online',
  };
}
