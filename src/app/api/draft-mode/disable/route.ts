import { draftMode } from 'next/headers';
import { fetchPublished } from '@/sanity/client';
import { postHref } from '@/lib/blog';

export async function POST(request: Request) {
  const url = new URL(request.url);
  // Next's internal URL can use localhost behind its server/proxy; Host is the browser-facing host.
  url.host = request.headers.get('host') || url.host;
  if (request.headers.get('origin') !== url.origin) return new Response('Permintaan tidak diizinkan.', { status: 403 });
  (await draftMode()).disable();
  let target = '/id/tulisan';
  try {
    const slug = (await request.formData()).get('slug');
    if (typeof slug === 'string' && slug.length < 512) {
      const published = await fetchPublished('postRoute', { slug });
      if (published) target = postHref(published);
    }
  } catch { /* Public listing is safe if content is draft-only or upstream is unavailable. */ }
  return new Response(null, { status: 303, headers: { Location: target, 'Cache-Control': 'private, no-store', 'X-Robots-Tag': 'noindex, nofollow' } });
}
