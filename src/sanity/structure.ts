import type { StructureResolver } from 'sanity/structure';

export const singletonTypes = new Set(['siteSettings', 'profile']);
export const structure: StructureResolver = S => S.list().title('Konten').items([
  S.documentTypeListItem('post').title('Tulisan'),
  S.documentTypeListItem('activity').title('Aktivitas'),
  S.listItem().id('profile').title('Profil').child(S.document().schemaType('profile').documentId('profile')),
  S.documentTypeListItem('experience').title('Pengalaman'),
  S.documentTypeListItem('education').title('Pendidikan'),
  S.documentTypeListItem('organization').title('Organisasi'),
  S.documentTypeListItem('recognition').title('Penghargaan/Publikasi'),
  S.documentTypeListItem('category').title('Kategori'),
  S.listItem().id('siteSettings').title('Pengaturan').child(S.document().schemaType('siteSettings').documentId('siteSettings')),
  S.documentTypeListItem('newsletterIssue').title('Draft Newsletter'),
]);
