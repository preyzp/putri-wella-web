import type { Metadata } from 'next';
import { isLocale } from './dictionaries';
import { siteDescription, siteName } from './site-settings';
import { readSettings } from '@/sanity/settings';
import { seoImage } from './seo-image';

export function siteOrigin(): URL {
  const value = process.env.SITE_URL || 'https://putriwella.web.id';
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
  const pageTitle = title ? `${title} — ${siteName(settings)}` : settings?.defaultSeo?.[language]?.title?.trim() || settings?.defaultSeo?.id?.title?.trim() || siteName(settings);
  const description = siteDescription(settings, language, fallbackDescription);
  const image = seoImage(settings?.defaultSeo?.[language]?.ogImage) || seoImage(settings?.defaultSeo?.id?.ogImage);
  return { metadataBase: siteOrigin(), title: pageTitle, description, robots: { index: true, follow: true }, alternates: { canonical: `/${language}${path}` }, openGraph: { type: 'website', url: `/${language}${path}`, title: pageTitle, description, siteName: siteName(settings), locale: language === 'en' ? 'en_US' : 'id_ID', images: image ? [image] : [] } };
}
