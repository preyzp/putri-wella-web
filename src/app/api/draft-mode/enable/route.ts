import { validatePreviewUrl, urlSearchParamPreviewPathname, urlSearchParamPreviewSecret } from '@sanity/preview-url-secret';
import { cookies, draftMode } from 'next/headers';
import { previewClient, previewConfigured } from '@/sanity/preview';
import { previewPath } from '@/lib/preview-path';

const headers = { 'Cache-Control': 'private, no-store', 'X-Robots-Tag': 'noindex, nofollow', 'Referrer-Policy': 'no-referrer' };
export async function GET(request: Request) {
  if (!previewConfigured()) return new Response('Preview belum dikonfigurasi. Isi SANITY_API_READ_TOKEN di environment server dan ikuti SANITY_SETUP.md. Website publik tetap tersedia.', { status: 503, headers });
  const url = new URL(request.url);
  const path = previewPath(url.searchParams.get(urlSearchParamPreviewPathname));
  if (!path) return new Response('Tujuan preview tidak diizinkan.', { status: 400, headers });
  if (!url.searchParams.get(urlSearchParamPreviewSecret)?.trim()) return new Response('Akses preview tidak valid.', { status: 401, headers });
  try {
    const validation = await validatePreviewUrl(previewClient(), request.url);
    if (!validation.isValid) return new Response('Akses preview tidak valid atau kedaluwarsa.', { status: 401, headers });
  } catch { return new Response('Validasi preview belum dapat dilakukan. Periksa konfigurasi dan izin token server.', { status: 503, headers }); }
  (await draftMode()).enable();
  const store = await cookies();
  const bypass = store.get('__prerender_bypass');
  if (bypass) store.set('__prerender_bypass', bypass.value, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 3600 });
  return new Response(null, { status: 303, headers: { ...headers, Location: path } });
}
