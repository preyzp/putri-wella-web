import 'server-only';
import { getSanityEnvironment, selectContentSource } from './env';

// Future adapter boundary; public pages intentionally still import their labeled preview fixtures.
// A configured CMS failure is never converted into a fixture success.
export function getContentSource() {
  return selectContentSource(getSanityEnvironment(), process.env.NODE_ENV);
}
