import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Studio — Putri Wella Sibarani', robots: { index: false, follow: false } };
export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return <html lang="id"><body style={{ margin: 0 }}>{children}</body></html>;
}
