import { defineQuery } from 'next-sanity';
import type { PublicActivity, PublicCategory, PublicEducation, PublicExperience, PublicOrganization, PublicPost, PublicPostSummary, PublicProfile, PublicRecognition, PublicSettings } from './types';

// Explicit projections only: no document-wide spread, private data, or editorial newsletter/Instagram fields.
const published = '!(_id in path("drafts.**")) && !(_id in path("versions.**"))';
const localized = '{id,en}';
const image = '{_type,_key,alt,caption,credit,asset->{_id,url,"width":metadata.dimensions.width,"height":metadata.dimensions.height}}';
const localizedImage = `{_type,_key,alt${localized},caption${localized},credit,asset->{_id,url,"width":metadata.dimensions.width,"height":metadata.dimensions.height}}`;
const seo = `{title,description,ogImage${image}}`;
const category = `{_id,title${localized},"slug":slug.current,description${localized}}`;
const body = `[]{_type,_key,_type == "block" => {style,listItem,level,children[]{_type,_key,text,marks},markDefs[]{_type,_key,_type == "link" => {href}}},_type == "poemStanza" => {text},_type == "editorialImage" => {alt,caption,credit,asset->{_id,url,"width":metadata.dimensions.width,"height":metadata.dimensions.height}}}`;
const summary = `{_id,title,"slug":slug.current,language,format,excerpt,publishedAt,"categories":coalesce((categories[]->)[${published}]${category},[]),cover${image}}`;

// Result contracts are maintained alongside each projection until account-backed TypeGen is configured.
export const queries = {
  home: defineQuery(`{"featured":*[_type == "siteSettings" && _id == "siteSettings" && ${published}][0]{"post":(featuredPosts[]->)[${published} && defined(slug.current)][0]${summary}}.post,"latest":*[_type == "post" && defined(slug.current) && ${published}] | order(publishedAt desc, _id asc)[0...3]${summary}}`),
  postRoute: defineQuery(`*[_type == "post" && slug.current == $slug && ${published}][0]{"slug":slug.current,language}`),
  related: defineQuery(`*[_type == "post" && _id != $id && defined(slug.current) && ${published}] | order(count(categories[_ref in $categoryIds]) desc, publishedAt desc)[0...2]${summary}`),
  posts: defineQuery(`*[_type == "post" && defined(slug.current) && ${published}] | order(publishedAt desc, _id asc) ${summary}`),
  post: defineQuery(`*[_type == "post" && slug.current == $slug && ${published}][0]{_id,title,"slug":slug.current,language,format,excerpt,publishedAt,"categories":coalesce((categories[]->)[${published}]${category},[]),cover${image},body${body},"tags":coalesce(tags,[]),"previousSlugs":coalesce(previousSlugs,[]),"relatedPosts":coalesce((relatedPosts[]->)[${published}]${summary},[]),seo${seo}}`),
  categories: defineQuery(`*[_type == "category" && ${published}] | order(sortOrder asc, title.id asc) ${category}`),
  settings: defineQuery(`*[_type == "siteSettings" && _id == "siteSettings" && ${published}][0]{siteName,introduction${localized},navigationLabels{home${localized},writing${localized},about${localized},activities${localized},contact${localized}},publicEmail,linkedInUrl,instagramUrl,defaultSeo{id${seo},en${seo}},"featuredPosts":coalesce((featuredPosts[]->)[${published}]${summary},[]),newsletterIntro${localized},personalViewsNote${localized}}`),
  profile: defineQuery(`*[_type == "profile" && _id == "profile" && ${published}][0]{fullName,shortBio${localized},biography{id${body},en${body}},portrait${image},"skills":coalesce(skills[]{id,en},[]),professionalSummary${localized}}`),
  activities: defineQuery(`*[_type == "activity" && ${published}] | order(sortOrder asc, date desc) {_id,title${localized},date,photos[]${localizedImage}}`),
  experiences: defineQuery(`*[_type == "experience" && ${published}] | order(sortOrder asc) {_id,scopeTitle${localized},scopeDescription${localized},"achievements":coalesce(achievements[]{id,en},[]),periodLabel}`),
  education: defineQuery(`*[_type == "education" && ${published}] | order(sortOrder asc) {_id,qualification${localized},institution,fieldOfStudy${localized},startYear,endYear,description${localized}}`),
  organizations: defineQuery(`*[_type == "organization" && ${published}] | order(sortOrder asc) {_id,name,role${localized},periodLabel,description${localized},publicUrl}`),
  recognition: defineQuery(`*[_type == "recognition" && ${published}] | order(sortOrder asc, date desc) {_id,kind,title${localized},issuer,date,summary${localized},publicUrl}`),
} as const;

export type QueryResults = {
  home: { featured: PublicPostSummary | null; latest: PublicPostSummary[] };
  postRoute: { slug: string; language: 'id' | 'en' } | null;
  related: PublicPostSummary[];
  posts: PublicPostSummary[]; post: PublicPost | null; categories: PublicCategory[];
  settings: PublicSettings | null; profile: PublicProfile | null; activities: PublicActivity[];
  experiences: PublicExperience[]; education: PublicEducation[]; organizations: PublicOrganization[]; recognition: PublicRecognition[];
};
export type QueryParameters = { [Key in keyof QueryResults]: Key extends 'post' | 'postRoute' ? { slug: string } : Key extends 'related' ? { id: string; categoryIds: string[] } : Record<string, never> };
