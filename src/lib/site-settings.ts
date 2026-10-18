import { contact } from './contact';
import { dictionaries, type Locale } from './dictionaries';
import { localizedText } from './profile-content';
import type { PublicSettings } from '@/sanity/types';

export const defaultSiteName = 'Putri Wella Sibarani';
export function siteName(settings: PublicSettings | null) { return settings?.siteName?.trim() || defaultSiteName; }
export function siteIntroduction(settings: PublicSettings | null, locale: Locale) {
  return localizedText(settings?.introduction, locale) || dictionaries[locale].intro;
}
export function siteDescription(settings: PublicSettings | null, locale: Locale, fallback = 'Ruang tulisan Putri Wella Sibarani. Preview rancangan website editorial.') {
  return settings?.defaultSeo?.[locale]?.description?.trim() || settings?.defaultSeo?.id?.description?.trim() || fallback;
}
function social(value: string | null | undefined, host: string, fallback: { href: string; label: string }) {
  if (!value?.trim()) return fallback;
  try {
    const url = new URL(value.trim());
    if (url.protocol !== 'https:' || ![host, `www.${host}`].includes(url.hostname) || url.username || url.password || url.port) return fallback;
    url.search = ''; url.hash = '';
    return { href: url.href, label: url.href };
  } catch { return fallback; }
}
export function siteContact(settings: PublicSettings | null) {
  const email = settings?.publicEmail?.trim();
  // Single plain address only: no mailto scheme, query/header injection or whitespace.
  const validEmail = email && /^[A-Z0-9.!#$%&'*+/=^_`{|}~-]+@[A-Z0-9](?:[A-Z0-9-]*[A-Z0-9])?(?:\.[A-Z0-9](?:[A-Z0-9-]*[A-Z0-9])?)+$/i.test(email);
  return {
    email: validEmail ? { href: `mailto:${encodeURIComponent(email).replace('%40', '@')}`, label: email } : contact.email,
    linkedin: social(settings?.linkedInUrl, 'linkedin.com', contact.linkedin),
    instagram: social(settings?.instagramUrl, 'instagram.com', contact.instagram),
  };
}
