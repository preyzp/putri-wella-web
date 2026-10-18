import Image from 'next/image';
import { createImageUrlBuilder } from '@sanity/image-url';
import { getSanityEnvironment } from './env';
import type { PublicImage } from './types';

export function croppedImageSource(image: PublicImage, width: number, height: number): string | null {
  const environment = getSanityEnvironment();
  if (!environment.configured || !image.asset || !image.alt?.trim()) return null;
  try {
    const url = new URL(image.asset.url);
    const { projectId, dataset } = environment.value;
    if (url.protocol !== 'https:' || url.hostname !== 'cdn.sanity.io' || !url.pathname.startsWith(`/images/${projectId}/${dataset}/`)) return null;
    return createImageUrlBuilder({ projectId, dataset }).image({ asset: { _ref: image.asset._id }, crop: image.crop || undefined, hotspot: image.hotspot || undefined }).width(width).height(height).fit('crop').url();
  } catch { return null; }
}

export function CroppedImage({ value, width, height, sizes, className }: { value: PublicImage; width: number; height: number; sizes: string; className?: string }) {
  const src = croppedImageSource(value, width, height);
  if (!src) return null;
  return <figure className={className}>
    <Image src={src} width={width} height={height} alt={value.alt} sizes={sizes} />
    {(value.caption || value.credit) && <figcaption>{value.caption}{value.credit && <span>{value.caption ? ' — ' : ''}{value.credit}</span>}</figcaption>}
  </figure>;
}
