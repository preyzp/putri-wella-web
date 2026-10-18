import type { PortableTextBlock } from '@portabletext/types';

export type Localized<T> = { id: T; en: T };
export type PublicImage = {
  _key?: string; _type: 'editorialImage' | 'galleryImage'; alt: string; caption: string | null; credit: string | null;
  asset: { _id: string; url: string; width: number; height: number } | null;
  crop?: { top: number; bottom: number; left: number; right: number } | null;
  hotspot?: { x: number; y: number; width: number; height: number } | null;
};
export type PoemStanza = { _type: 'poemStanza'; _key: string; text: string };
export type PublicBody = (PortableTextBlock | PublicImage | PoemStanza)[];
export type PublicCategory = { _id: string; title: Localized<string>; slug: string; description: Localized<string> | null };
export type PublicPostSummary = { _id: string; title: string; slug: string; language: 'id' | 'en'; format: 'article' | 'short-note' | 'poem'; excerpt: string | null; publishedAt: string; categories: PublicCategory[]; cover: PublicImage | null };
export type PublicSeo = { title: string | null; description: string | null; ogImage: PublicImage | null };
export type PublicPost = PublicPostSummary & { body: PublicBody; tags: string[]; previousSlugs: string[]; relatedPosts: PublicPostSummary[]; seo: PublicSeo | null };
export type PublicSettings = {
  siteName: string; introduction: Localized<string>; navigationLabels: Record<'home' | 'writing' | 'about' | 'activities' | 'contact', Localized<string>> | null;
  publicEmail: string | null; linkedInUrl: string | null; instagramUrl: string | null; defaultSeo: Localized<PublicSeo> | null;
  featuredPosts: PublicPostSummary[]; newsletterIntro: Localized<string> | null; personalViewsNote: Localized<string> | null;
};
export type PublicProfile = { fullName: string; shortBio: Localized<string>; biography: Localized<PublicBody>; portrait: PublicImage | null; skills: Localized<string>[]; professionalSummary: Localized<string> | null };
export type PublicActivity = { _id: string; title: Localized<string>; date: string | null; photos: (Omit<PublicImage, 'alt' | 'caption'> & { alt: Localized<string>; caption: Localized<string> })[] };
export type PublicExperience = { _id: string; scopeTitle: Localized<string>; scopeDescription: Localized<string>; achievements: Localized<string>[]; periodLabel: string | null };
export type PublicEducation = { _id: string; qualification: Localized<string>; institution: string; fieldOfStudy: Localized<string>; startYear: number | null; endYear: number | null; description: Localized<string> | null };
export type PublicOrganization = { _id: string; name: string; role: Localized<string>; periodLabel: string | null; description: Localized<string> | null; publicUrl: string | null };
export type PublicRecognition = { _id: string; kind: 'award' | 'publication'; title: Localized<string>; issuer: string | null; date: string | null; summary: Localized<string> | null; publicUrl: string | null };
export type PublicAbout = { profile: PublicProfile | null; experiences: PublicExperience[]; education: PublicEducation[]; organizations: PublicOrganization[]; recognition: PublicRecognition[] };
