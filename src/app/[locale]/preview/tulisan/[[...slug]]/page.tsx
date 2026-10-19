import type { Metadata } from 'next';
import { Suspense } from 'react';
import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';
import { VisualEditing } from 'next-sanity/visual-editing';
import { PublicShell } from '@/components/public-shell';
import { ArticleReading } from '@/components/article-reading';
import { previewConfigured, readPreviewPost } from '@/sanity/preview';

export const metadata: Metadata = { title: 'Preview draft', description: 'Pratinjau editorial privat.', robots: { index: false, follow: false, noarchive: true } };
export function generateStaticParams() { return [{ locale: 'id' }]; }
function Banner({ slug }: { slug?: string }) {
  return <><VisualEditing /><aside className="empty-state" aria-label="Preview draft"><strong>Preview draft</strong><p>Belum dipublikasikan. Simpan perubahan di Studio, lalu muat ulang halaman ini untuk memperbarui preview.</p><form action="/api/draft-mode/disable" method="post">{slug && <input type="hidden" name="slug" value={slug} />}<button className="action-button" type="submit">Keluar preview</button></form></aside></>;
}
async function Preview({ params }: { params: Promise<{ locale: string; slug?: string[] }> }) {
  const { locale, slug } = await params;
  if (locale !== 'id' || (slug && slug.length !== 1)) notFound();
  if (!previewConfigured()) return <PublicShell locale="id" title="Preview belum dikonfigurasi" blog><p>Isi SANITY_API_READ_TOKEN pada environment server. Ikuti SANITY_SETUP.md; jangan gunakan NEXT_PUBLIC untuk token.</p></PublicShell>;
  if (!(await draftMode()).isEnabled) notFound();
  if (!slug?.[0]) return <PublicShell locale="id" title="Preview draft" blog><Banner /><p>Pilih tulisan di Studio yang sudah memiliki slug, lalu buka lokasi “Preview draft”.</p></PublicShell>;
  let post;
  try { post = await readPreviewPost(slug[0]); }
  catch { return <PublicShell locale="id" title="Preview belum dapat dimuat" blog><Banner slug={slug[0]} /><p>Periksa izin token pembaca draft dan koneksi Sanity, lalu muat ulang halaman.</p></PublicShell>; }
  if (!post) notFound();
  return <PublicShell locale="id" title={post.title} blog><Banner slug={post.slug} /><ArticleReading post={post} preview /></PublicShell>;
}
export default function PreviewPage(props: { params: Promise<{ locale: string; slug?: string[] }> }) { return <Suspense fallback={<main className="container public-page"><h1>Memuat preview draft…</h1></main>}><Preview {...props} /></Suspense>; }
