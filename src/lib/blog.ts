import type { Locale } from './dictionaries';
import type { PublicCategory, PublicPostSummary } from '@/sanity/types';

export const blogCopy = {
  id: { empty: 'Belum ada tulisan yang diterbitkan.', noFeatured: 'Belum ada tulisan unggulan.', noRelated: 'Belum ada tulisan terkait.', error: 'Tulisan belum dapat dimuat. Silakan coba lagi.', retry: 'Coba lagi', loading: 'Memuat tulisan…', category: 'Kategori', original: 'Artikel ditampilkan dalam bahasa naskah aslinya.', languages: { id: 'Bahasa Indonesia', en: 'Bahasa Inggris' } },
  en: { empty: 'No writing has been published yet.', noFeatured: 'No featured writing yet.', noRelated: 'No related writing yet.', error: 'Writing could not be loaded. Please try again.', retry: 'Try again', loading: 'Loading writing…', category: 'Category', original: 'Articles are shown in their original language.', languages: { id: 'Indonesian', en: 'English' } },
} as const;
export const postFormats = ['article', 'short-note', 'poem'] as const;
export function formatLabel(format: PublicPostSummary['format'], locale: Locale) {
  return ({ id: { article: 'Artikel', 'short-note': 'Catatan pendek', poem: 'Puisi' }, en: { article: 'Essay', 'short-note': 'Short note', poem: 'Poem' } })[locale][format];
}
export function categoryLabel(category: PublicCategory, locale: Locale) {
  return category.title?.[locale]?.trim() || category.title?.id?.trim() || blogCopy[locale].category;
}
export function postHref(post: Pick<PublicPostSummary, 'slug'>) { return `/id/tulisan/${encodeURIComponent(post.slug)}`; }
export function postDate(value: string, locale: Locale) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : new Intl.DateTimeFormat(locale === 'id' ? 'id-ID' : 'en-GB', { dateStyle: 'long', timeZone: 'UTC' }).format(date);
}
