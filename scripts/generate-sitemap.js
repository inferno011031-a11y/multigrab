const fs = require('fs');
const path = require('path');

const baseUrl = 'https://www.multigrab.online';
const now = new Date().toISOString();

const platforms = [
  'youtube-downloader',
  'youtube-to-mp3',
  'youtube-shorts-downloader',
  'spotify-downloader',
  'spotify-to-mp3',
  'tiktok-downloader',
  'tiktok-mp3-downloader',
  'instagram-downloader',
  'instagram-reels-downloader',
  'instagram-stories-downloader',
  'twitter-downloader',
  'x-video-downloader',
  'facebook-downloader',
  'facebook-reels-downloader',
  'reddit-downloader',
  'pinterest-downloader',
  'vimeo-downloader',
  'audio-extractor',
  'mp4-downloader'
];

const locales = ['es', 'pt', 'hi', 'fr', 'de', 'ar', 'id'];

let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

// 1. Root homepage
xml += `  <url>\n    <loc>${baseUrl}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;

// 2. Localized homepages
for (const loc of locales) {
  xml += `  <url>\n    <loc>${baseUrl}/${loc}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
}

// 3. English platform landing pages
for (const slug of platforms) {
  xml += `  <url>\n    <loc>${baseUrl}/${slug}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
}

// 4. Localized platform landing pages
for (const loc of locales) {
  for (const slug of platforms) {
    xml += `  <url>\n    <loc>${baseUrl}/${loc}/${slug}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
  }
}

xml += `</urlset>\n`;

fs.writeFileSync(path.join(process.cwd(), 'public', 'sitemap.xml'), xml, 'utf8');
console.log('Successfully generated public/sitemap.xml with all 160 routes!');
