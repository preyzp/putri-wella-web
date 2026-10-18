import LocaleLayout from '../[locale]/layout';
export { metadata } from '../[locale]/layout';

export default function EntryLayout({ children }: { children: React.ReactNode }) {
  return <LocaleLayout params={Promise.resolve({ locale: 'id' })}>{children}</LocaleLayout>;
}
