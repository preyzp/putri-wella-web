import type { Locale } from './dictionaries';
import type { Localized, PublicBody } from '@/sanity/types';

export function localizedText(value: Partial<Localized<string>> | null | undefined, locale: Locale): string {
  return value?.[locale]?.trim() || value?.id?.trim() || '';
}
export function hasBody(value: PublicBody | null | undefined): value is PublicBody {
  return !!value?.some(block => {
    if (block._type === 'poemStanza' && 'text' in block) return typeof block.text === 'string' && !!block.text.trim();
    if (block._type === 'editorialImage' && 'asset' in block) return !!block.asset;
    if (block._type === 'block' && 'children' in block) return block.children.some(span => typeof span.text === 'string' && !!span.text.trim());
    return false;
  });
}
export function localizedBody(value: Partial<Localized<PublicBody>> | null | undefined, locale: Locale): PublicBody {
  const selected = value?.[locale];
  if (hasBody(selected)) return selected;
  return hasBody(value?.id) ? value.id : [];
}
export const profileCopy = {
  id: { aboutEmpty: 'Informasi profil belum tersedia.', activityEmpty: 'Belum ada foto aktivitas yang dapat ditampilkan.', error: 'Konten belum dapat dimuat. Silakan coba lagi.', loading: 'Memuat konten…', retry: 'Coba lagi', website: 'Lihat sumber' },
  en: { aboutEmpty: 'Profile information is not available yet.', activityEmpty: 'No activity photos are available to display yet.', error: 'Content could not be loaded. Please try again.', loading: 'Loading content…', retry: 'Try again', website: 'View source' },
} as const;
