import { defineArrayMember, defineField, defineType } from 'sanity';
import { httpsUrl, languageField, localized, periodLabel, references, slugField, sortOrder, text } from './shared';

const siteSettings = defineType({ name: 'siteSettings', title: 'Pengaturan', type: 'document', fields: [
  text('siteName', 'Nama situs', true), localized('introduction', 'Perkenalan', 'localizedText'),
  defineField({ name: 'navigationLabels', title: 'Label navigasi', type: 'navigationLabels' }),
  defineField({ name: 'publicEmail', title: 'Email publik yang disetujui', type: 'string', validation: rule => rule.email() }),
  httpsUrl('linkedInUrl', 'LinkedIn'), httpsUrl('instagramUrl', 'Instagram'),
  defineField({ name: 'defaultSeo', title: 'SEO default', type: 'localizedSeo' }),
  defineField({ ...references('featuredPosts', 'Tulisan pilihan', 'post'), validation: rule => rule.unique().max(3) }),
  localized('newsletterIntro', 'Pengantar newsletter', 'localizedText', false), localized('personalViewsNote', 'Catatan pandangan pribadi untuk ditinjau', 'localizedText', false),
], preview: { prepare: () => ({ title: 'Pengaturan situs' }) } });

const profile = defineType({ name: 'profile', title: 'Profil', type: 'document', fields: [
  text('fullName', 'Nama lengkap', true), localized('shortBio', 'Bio singkat', 'localizedText'), localized('biography', 'Biografi', 'localizedRichText'),
  defineField({ name: 'portrait', title: 'Foto diri — hanya halaman Tentang', type: 'editorialImage', description: 'Gunakan foto Putri yang disetujui. Tidak dipakai pada beranda atau badge penulis.' }),
  defineField({ name: 'skills', title: 'Keahlian', type: 'array', of: [defineArrayMember({ type: 'localizedString' })] }),
  localized('professionalSummary', 'Ringkasan ruang lingkup profesional', 'localizedText', false),
], preview: { select: { title: 'fullName' } } });

const post = defineType({ name: 'post', title: 'Tulisan', type: 'document', fields: [
  defineField({ name: 'title', title: 'Judul', type: 'string', validation: rule => [rule.required(), rule.max(100).warning('Saran: judul tidak lebih dari 100 karakter.')] }),
  slugField, languageField, text('translationGroup', 'Grup terjemahan (hanya jika naskah terjemahan tersedia)'),
  defineField({ name: 'format', title: 'Format', type: 'string', options: { list: [{ title: 'Artikel panjang', value: 'article' }, { title: 'Catatan pendek', value: 'short-note' }, { title: 'Puisi', value: 'poem' }] }, validation: rule => rule.required() }),
  references('categories', 'Kategori', 'category', true),
  defineField({ name: 'tags', title: 'Tag', type: 'array', of: [defineArrayMember({ type: 'string' })], validation: rule => rule.unique().max(20) }),
  defineField({ name: 'excerpt', title: 'Ringkasan', type: 'text', rows: 3, validation: rule => rule.max(240).warning('Saran: ringkasan maksimal 240 karakter.') }),
  defineField({ name: 'cover', title: 'Cover (opsional)', type: 'editorialImage' }),
  defineField({ name: 'body', title: 'Isi', type: 'body', validation: rule => rule.required().min(1) }),
  defineField({ name: 'publishedAt', title: 'Tanggal editorial pertama terbit', type: 'datetime', description: 'Bukan jadwal publish otomatis.', validation: rule => rule.required() }),
  defineField({ name: 'seo', title: 'SEO', type: 'seo' }),
  defineField({ name: 'previousSlugs', title: 'Riwayat slug', type: 'array', description: 'Catat slug published sebelumnya sebelum mengganti slug. Redirect publik belum terhubung pada tahap ini.', of: [defineArrayMember({ type: 'string', validation: rule => rule.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/) })], validation: rule => rule.unique() }),
  references('relatedPosts', 'Tulisan terkait', 'post'),
  defineField({ name: 'instagram', title: 'Catatan Instagram (data editorial saja)', type: 'instagramFields', hidden: true }),
], orderings: [{ title: 'Tanggal terbaru', name: 'dateDesc', by: [{ field: 'publishedAt', direction: 'desc' }] }], preview: { select: { title: 'title', subtitle: 'language' } } });

const category = defineType({ name: 'category', title: 'Kategori', type: 'document', fields: [localized('title', 'Judul'), defineField({ ...slugField, options: { source: 'title.id', maxLength: 96 } }), localized('description', 'Deskripsi', 'localizedText', false), sortOrder], preview: { select: { title: 'title.id', subtitle: 'title.en' } } });
const activity = defineType({ name: 'activity', title: 'Aktivitas', type: 'document', fields: [localized('title', 'Judul'), defineField({ name: 'date', title: 'Tanggal (opsional)', type: 'date' }), defineField({ name: 'photos', title: 'Foto dan caption', type: 'array', of: [defineArrayMember({ type: 'galleryImage' })], validation: rule => rule.required().min(1) }), sortOrder], preview: { select: { title: 'title.id' } } });
const experience = defineType({ name: 'experience', title: 'Pengalaman', type: 'document', fields: [localized('scopeTitle', 'Judul ruang lingkup'), localized('scopeDescription', 'Deskripsi ruang lingkup', 'localizedText'), defineField({ name: 'achievements', title: 'Pencapaian yang disetujui', type: 'array', of: [defineArrayMember({ type: 'localizedText' })] }), periodLabel, sortOrder], preview: { select: { title: 'scopeTitle.id' } } });
const education = defineType({ name: 'education', title: 'Pendidikan', type: 'document', fields: [localized('qualification', 'Kualifikasi'), text('institution', 'Institusi pendidikan', true), localized('fieldOfStudy', 'Bidang studi'), defineField({ name: 'startYear', title: 'Tahun mulai', type: 'number', validation: rule => rule.integer().min(1900).max(2200) }), defineField({ name: 'endYear', title: 'Tahun selesai', type: 'number', validation: rule => rule.integer().min(rule.valueOfField('startYear')).max(2200) }), localized('description', 'Deskripsi', 'localizedText', false), sortOrder], preview: { select: { title: 'qualification.id', subtitle: 'institution' } } });
const organization = defineType({ name: 'organization', title: 'Organisasi', type: 'document', fields: [text('name', 'Nama organisasi', true), localized('role', 'Peran'), periodLabel, localized('description', 'Deskripsi', 'localizedText', false), httpsUrl('publicUrl', 'URL publik (opsional)'), sortOrder], preview: { select: { title: 'name' } } });
const recognition = defineType({ name: 'recognition', title: 'Penghargaan/Publikasi', type: 'document', fields: [defineField({ name: 'kind', title: 'Jenis', type: 'string', options: { list: [{ title: 'Penghargaan', value: 'award' }, { title: 'Publikasi', value: 'publication' }] }, validation: rule => rule.required() }), localized('title', 'Judul'), text('issuer', 'Pemberi/penerbit (opsional)'), defineField({ name: 'date', title: 'Tanggal (opsional)', type: 'date' }), localized('summary', 'Ringkasan', 'localizedText', false), httpsUrl('publicUrl', 'URL publik (opsional)'), sortOrder], preview: { select: { title: 'title.id', subtitle: 'kind' } } });
const newsletterIssue = defineType({ name: 'newsletterIssue', title: 'Draft Newsletter', type: 'document', description: 'Draft editorial saja. Tidak menyimpan penerima dan tidak mengirim email.', fields: [text('title', 'Judul', true), defineField({ name: 'introduction', title: 'Pengantar', type: 'text', validation: rule => rule.required() }), languageField, references('selectedPosts', 'Tulisan untuk ditinjau', 'post', true), defineField({ name: 'footerText', title: 'Teks penutup', type: 'text' })], preview: { select: { title: 'title' } } });

export const documentTypes = [siteSettings, profile, post, category, activity, experience, education, organization, recognition, newsletterIssue];
