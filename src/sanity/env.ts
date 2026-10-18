// Only public identifiers belong here. Never add a token to NEXT_PUBLIC variables.
export const SANITY_API_VERSION = '2026-10-18';
export type SanityEnvironment = { projectId: string; dataset: string; apiVersion: string };
export type SanityEnvironmentResult = { configured: true; value: SanityEnvironment } | { configured: false };

export function parseSanityEnvironment(projectId?: string, dataset?: string): SanityEnvironmentResult {
  const project = projectId?.trim();
  const data = dataset?.trim();
  // Empty values and copied placeholders are deliberately not treated as configuration.
  if (!project || !data || !/^[a-z0-9]{8}$/.test(project) || !/^[a-z0-9][a-z0-9_-]{0,63}$/.test(data) || /placeholder|your[-_]|replace|change[-_]?me|<|>/i.test(`${project} ${data}`)) return { configured: false };
  return { configured: true, value: { projectId: project, dataset: data, apiVersion: SANITY_API_VERSION } };
}

export function getSanityEnvironment() {
  return parseSanityEnvironment(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID, process.env.NEXT_PUBLIC_SANITY_DATASET);
}

export function selectContentSource(environment: SanityEnvironmentResult, mode: string | undefined): 'sanity' | 'fixtures' {
  if (environment.configured) return 'sanity';
  if (mode === 'development') return 'fixtures';
  throw new Error('Konfigurasi Sanity wajib belum lengkap. Isi NEXT_PUBLIC_SANITY_PROJECT_ID dan NEXT_PUBLIC_SANITY_DATASET. Fallback fixture hanya tersedia pada development.');
}
