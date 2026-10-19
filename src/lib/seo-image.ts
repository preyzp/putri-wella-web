import { getSanityEnvironment } from '@/sanity/env';
import type { PublicImage } from '@/sanity/types';

export function seoImage(image: PublicImage | null | undefined) {
  const environment = getSanityEnvironment();
  if (!image?.asset || !environment.configured) return undefined;
  try {
    const url = new URL(image.asset.url);
    if (url.protocol !== 'https:' || url.hostname !== 'cdn.sanity.io' || url.username || url.password || url.port || !url.pathname.startsWith(`/images/${environment.value.projectId}/${environment.value.dataset}/`)) return undefined;
    return { url: url.href, ...(image.asset.width > 0 ? { width: image.asset.width } : {}), ...(image.asset.height > 0 ? { height: image.asset.height } : {}), alt: image.alt || '' };
  } catch { return undefined; }
}
