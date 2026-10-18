import 'server-only';
import { fetchPublished } from './client';
import type { PublicAbout } from './types';

export async function readAbout(): Promise<PublicAbout> {
  const [profile, experiences, education, organizations, recognition] = await Promise.all([
    fetchPublished('profile', {}), fetchPublished('experiences', {}), fetchPublished('education', {}),
    fetchPublished('organizations', {}), fetchPublished('recognition', {}),
  ]);
  return { profile, experiences, education, organizations, recognition };
}
