import Image from 'next/image';
import { PortableText, type PortableTextComponents } from '@portabletext/react';
import { getSanityEnvironment } from './env';
import { safeHref } from './links';
import type { PoemStanza, PublicBody, PublicImage } from './types';

function SanityImage({ value }: { value: PublicImage }) {
  const environment = getSanityEnvironment();
  const asset = value.asset;
  let src: string | null = null;
  if (asset && environment.configured) {
    try {
      const url = new URL(asset.url);
      const { projectId, dataset } = environment.value;
      if (url.protocol === 'https:' && url.hostname === 'cdn.sanity.io' && url.pathname.startsWith(`/images/${projectId}/${dataset}/`)) src = url.href;
    } catch { /* Invalid or unresolved image reference: show a readable placeholder. */ }
  }
  return <figure>
    {src && asset && asset.width > 0 && asset.height > 0 ? <Image unoptimized src={src} alt={value.alt || ''} width={asset.width} height={asset.height} sizes="(max-width: 768px) 100vw, 720px" /> : <p>Gambar belum tersedia.</p>}
    {(value.caption || value.credit) && <figcaption>{value.caption}{value.credit && <span> — {value.credit}</span>}</figcaption>}
  </figure>;
}

const components: PortableTextComponents = {
  types: {
    poemStanza: ({ value }: { value: PoemStanza }) => <p className="poem">{value.text}</p>,
    editorialImage: ({ value }: { value: PublicImage }) => <SanityImage value={value} />,
  },
  marks: {
    link: ({ children, value }) => {
      const href = safeHref(value?.href);
      return href ? <a href={href} style={{ textDecoration: 'underline', textUnderlineOffset: '3px' }}>{children}</a> : <>{children}</>;
    },
  },
  unknownType: () => <p>Blok konten ini belum didukung.</p>,
};

// Separate renderer: deliberately not connected to fixture pages during local setup.
export function SanityPortableText({ value }: { value: PublicBody }) {
  return <div className="article-body"><PortableText value={value} components={components} /></div>;
}
