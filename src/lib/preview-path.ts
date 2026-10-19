// Exact allowlist: no external URLs, query strings, encoded separators or traversal.
export function previewPath(value: string | null): string | null {
  if (!value || /[\\?#\s]/.test(value)) return null;
  if (value === '/id/preview/tulisan') return value;
  const match = /^\/id\/preview\/tulisan\/([^/]+)$/.exec(value);
  if (!match) return null;
  try {
    const slug = decodeURIComponent(match[1]);
    if (!slug || /[/\\%?#\s\u0000-\u001f]/.test(slug) || slug === '.' || slug === '..') return null;
    return `/id/preview/tulisan/${encodeURIComponent(slug)}`;
  } catch { return null; }
}
