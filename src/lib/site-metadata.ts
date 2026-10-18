import type { Metadata } from 'next';
import { isLocale } from './dictionaries';
import { siteDescription, siteName } from './site-settings';
import { readSettings } from '@/sanity/settings';

export function siteOrigin(): URL {
  const value = process.env.SITE_URL || 'https://putriwellasibarani.vercel.app';
  try {
    const url = new URL(value);
    if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) throw new Error();
    return new URL(url.origin);
  } catch { throw new Error('SITE_URL must be an absolute HTTP(S) site URL.'); }
}
export async function pageMetadata(params: Promise<{ locale: string }>, path: string, title?: string, fallbackDescription?: string): Promise<Metadata> {
  const { locale } = await params;
  const settings = await readSettings();
  const language = isLocale(locale) ? locale : 'id';
  return { metadataBase: siteOrigin(), title: title ? `${title} — ${siteName(settings)}` : `${siteName(settings)} — Preview`, description: siteDescription(settings, language, fallbackDescription), alternates: { canonical: `/${language}${path}` } };
}
