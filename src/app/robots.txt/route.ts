import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-static';
export const revalidate = 86400;

export async function GET() {
  const filePath = path.join(process.cwd(), 'public', 'robots.txt');
  try {
    const robotsContent = fs.readFileSync(filePath, 'utf-8');
    return new NextResponse(robotsContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    });
  } catch {
    return new NextResponse(
      "User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: https://www.multigrab.online/sitemap.xml\n",
      {
        status: 200,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
        },
      }
    );
  }
}
