export function safeHref(value: unknown): string | null {
  if (typeof value !== 'string' || !value || /[\u0000-\u0020\\]/.test(value) || value.startsWith('//')) return null;
  try {
    const parsed = new URL(value, 'https://relative.invalid');
    return ['https:', 'http:', 'mailto:'].includes(parsed.protocol) ? value : null;
  } catch { return null; }
}
