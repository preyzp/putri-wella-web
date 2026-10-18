import { defineArrayMember, defineField, defineType } from 'sanity';

const languages = [{ name: 'id', title: 'Indonesia' }, { name: 'en', title: 'English' }] as const;
export const localizedString = defineType({ name: 'localizedString', title: 'Teks ID/EN', type: 'object', fields: languages.map(language => defineField({ ...language, type: 'string', validation: rule => rule.required() })) });
export const localizedText = defineType({ name: 'localizedText', title: 'Paragraf ID/EN', type: 'object', fields: languages.map(language => defineField({ ...language, type: 'text', rows: 3, validation: rule => rule.required() })) });
export const localizedRichText = defineType({ name: 'localizedRichText', title: 'Naskah ID/EN', type: 'object', fields: languages.map(language => defineField({ ...language, type: 'body', validation: rule => rule.required() })) });

export function localized(name: string, title: string, type = 'localizedString', required = true) {
  return defineField({ name, title, type, validation: rule => required ? rule.required() : rule });
}
export function text(name: string, title: string, required = false) {
  return defineField({ name, title, type: 'string', validation: rule => required ? rule.required() : rule });
}
export function httpsUrl(name: string, title: string) {
  return defineField({ name, title, type: 'url', validation: rule => rule.uri({ scheme: ['https'] }) });
}
export const sortOrder = defineField({ name: 'sortOrder', title: 'Urutan', type: 'number', validation: rule => rule.integer().min(0) });
export const periodLabel = text('periodLabel', 'Label periode (opsional)');
export const languageField = defineField({ name: 'language', title: 'Bahasa naskah', type: 'string', options: { list: [{ title: 'Indonesia', value: 'id' }, { title: 'English', value: 'en' }], layout: 'radio' }, validation: rule => rule.required() });
export function references(name: string, title: string, to: string, required = false) {
  return defineField({ name, title, type: 'array', of: [defineArrayMember({ type: 'reference', to: [{ type: to }] })], validation: rule => required ? rule.required().min(1).unique() : rule.unique() });
}
export const slugField = defineField({
  name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title', maxLength: 96 },
  description: 'Unik untuk semua dokumen sejenis, termasuk bahasa lain. Setelah terbit, catat slug lama di previousSlugs sebelum mengganti.',
  validation: rule => rule.required().custom(value => !value?.current || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.current) || 'Gunakan lowercase kebab-case.'),
});

export const editorialImage = defineType({
  name: 'editorialImage', title: 'Gambar editorial', type: 'image', options: { hotspot: true },
  fields: [
    defineField({ name: 'alt', title: 'Teks alternatif', type: 'string', validation: rule => rule.custom((value, context) => !(context.parent as { asset?: unknown } | undefined)?.asset || !!value?.trim() || 'Alt wajib untuk gambar.') }),
    defineField({ name: 'caption', title: 'Caption', type: 'text', rows: 2 }), text('credit', 'Kredit gambar'),
  ],
});
export const galleryImage = defineType({
  name: 'galleryImage', title: 'Foto aktivitas', type: 'image', options: { hotspot: true },
  fields: [localized('alt', 'Teks alternatif'), localized('caption', 'Caption singkat'), text('credit', 'Kredit foto')],
  validation: rule => rule.required().assetRequired(),
});
export const poemStanza = defineType({ name: 'poemStanza', title: 'Bait puisi', type: 'object', fields: [defineField({ name: 'text', title: 'Bait (baris dipertahankan)', type: 'text', rows: 6, validation: rule => rule.required() })], preview: { select: { title: 'text' }, prepare: ({ title }) => ({ title: title || 'Bait puisi', subtitle: 'Puisi — baris asli' }) } });
export const body = defineType({
  name: 'body', title: 'Isi', type: 'array',
  of: [
    defineArrayMember({ type: 'block', styles: [{ title: 'Paragraf', value: 'normal' }, { title: 'Heading 2', value: 'h2' }, { title: 'Heading 3', value: 'h3' }, { title: 'Heading 4', value: 'h4' }, { title: 'Kutipan', value: 'blockquote' }], lists: [{ title: 'Bullet', value: 'bullet' }, { title: 'Nomor', value: 'number' }], marks: { decorators: [{ title: 'Tebal', value: 'strong' }, { title: 'Miring', value: 'em' }], annotations: [defineArrayMember({ name: 'link', type: 'object', title: 'Tautan', fields: [defineField({ name: 'href', type: 'url', title: 'URL', validation: rule => rule.required().uri({ allowRelative: true, scheme: ['http', 'https', 'mailto'] }) })] })] } }),
    defineArrayMember({ type: 'editorialImage' }), defineArrayMember({ type: 'poemStanza' }),
  ],
});
export const seo = defineType({ name: 'seo', title: 'SEO', type: 'object', fields: [text('title', 'Meta title'), defineField({ name: 'description', title: 'Meta description', type: 'text', rows: 3 }), defineField({ name: 'ogImage', title: 'OG image (opsional)', type: 'editorialImage' })] });
export const localizedSeo = defineType({ name: 'localizedSeo', title: 'SEO ID/EN', type: 'object', fields: languages.map(language => defineField({ ...language, type: 'seo' })) });
export const navigationLabels = defineType({ name: 'navigationLabels', title: 'Label navigasi', type: 'object', fields: ['home', 'writing', 'about', 'activities', 'contact'].map(name => localized(name, name)) });
export const instagramFields = defineType({ name: 'instagramFields', title: 'Catatan Instagram (belum aktif)', type: 'object', description: 'Data editorial opsional saja. Belum ada export, salin, atau pengiriman otomatis.', fields: [text('socialTitle', 'Judul pendek'), defineField({ name: 'caption', title: 'Caption manual', type: 'text' }), defineField({ name: 'imageOverride', title: 'Gambar opsional', type: 'editorialImage' }), defineField({ name: 'exportFormat', title: 'Format rancangan', type: 'string', options: { list: ['portrait', 'story'] } })] });

export const sharedTypes = [localizedString, localizedText, localizedRichText, editorialImage, galleryImage, poemStanza, body, seo, localizedSeo, navigationLabels, instagramFields];
