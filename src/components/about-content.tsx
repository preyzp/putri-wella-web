import type { ReactNode } from 'react';
import type { Locale } from '@/lib/dictionaries';
import type { PublicAbout } from '@/sanity/types';
import { localizedBody, localizedText, profileCopy } from '@/lib/profile-content';
import { publicCopy } from '@/lib/public-copy';
import { safeHref } from '@/sanity/links';
import { CroppedImage, croppedImageSource } from '@/sanity/cropped-image';
import { SanityPortableText } from '@/sanity/portable-text';
import { postDate } from '@/lib/blog';
import { ContentState } from './content-state';

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return <section id={`profile-${id}`} aria-labelledby={`heading-${id}`}><h2 id={`heading-${id}`}>{title}</h2>{children}</section>;
}
function SourceLink({ href, locale }: { href: string | null; locale: Locale }) {
  const safe = safeHref(href);
  return safe ? <a className="text-link" href={safe}>{profileCopy[locale].website}</a> : null;
}

export function AboutContent({ data, locale }: { data: PublicAbout; locale: Locale }) {
  const profile = data.profile;
  const t = publicCopy[locale].profileSections;
  const text = (value: Parameters<typeof localizedText>[0]) => localizedText(value, locale);
  const biography = localizedBody(profile?.biography, locale);
  const shortBio = text(profile?.shortBio);
  const summary = text(profile?.professionalSummary);
  const fullName = profile?.fullName?.trim();
  const portrait = profile?.portrait && croppedImageSource(profile.portrait, 640, 800) ? profile.portrait : null;
  const work = data.experiences.filter(item => text(item.scopeTitle) || text(item.scopeDescription) || item.periodLabel?.trim());
  const achievements = data.experiences.map(item => ({ id: item._id, title: text(item.scopeTitle), items: (item.achievements || []).map(text).filter(Boolean) })).filter(item => item.items.length);
  const education = data.education.filter(item => text(item.qualification) || item.institution?.trim() || text(item.fieldOfStudy) || text(item.description) || item.startYear != null || item.endYear != null);
  const skills = (profile?.skills || []).map(text).filter(Boolean);
  const organizations = data.organizations.filter(item => item.name?.trim() || text(item.role) || text(item.description));
  const recognition = data.recognition.filter(item => text(item.title) || item.issuer?.trim() || text(item.summary));
  const sections = [
    (fullName || shortBio || biography.length > 0) ? <Section key="bio" id="bio" title={t[0]}>
      {fullName && <p className="footer-name">{fullName}</p>}
      {shortBio && <p className="excerpt">{shortBio}</p>}
      {biography.length > 0 && <SanityPortableText value={biography} />}
    </Section> : null,
    (summary || work.length > 0) ? <Section key="work" id="work" title={t[1]}>
      {summary && <p className="excerpt">{summary}</p>}
      {work.map(item => <div className="profile-entry" key={item._id}>
        {text(item.scopeTitle) && <h3>{text(item.scopeTitle)}</h3>}
        {item.periodLabel && <p className="meta">{item.periodLabel}</p>}
        {text(item.scopeDescription) && <p className="excerpt">{text(item.scopeDescription)}</p>}
      </div>)}
    </Section> : null,
    achievements.length ? <Section key="achievements" id="achievements" title={t[2]}>{achievements.map(item => <div className="profile-entry" key={item.id}>
      {item.title && <h3>{item.title}</h3>}<ul className="profile-list">{item.items.map((achievement, index) => <li key={index}>{achievement}</li>)}</ul>
    </div>)}</Section> : null,
    education.length ? <Section key="education" id="education" title={t[3]}>{education.map(item => <div className="profile-entry" key={item._id}>
      {text(item.qualification) && <h3>{text(item.qualification)}</h3>}
      {item.institution && <p>{item.institution}</p>}{text(item.fieldOfStudy) && <p>{text(item.fieldOfStudy)}</p>}
      {(item.startYear != null || item.endYear != null) && <p className="meta">{[item.startYear, item.endYear].filter(year => year != null).join('–')}</p>}
      {text(item.description) && <p className="excerpt">{text(item.description)}</p>}
    </div>)}</Section> : null,
    skills.length ? <Section key="skills" id="skills" title={t[4]}><ul className="profile-list">{skills.map((skill, index) => <li key={index}>{skill}</li>)}</ul></Section> : null,
    organizations.length ? <Section key="organizations" id="organizations" title={t[5]}>{organizations.map(item => <div className="profile-entry" key={item._id}>
      {item.name && <h3>{item.name}</h3>}{text(item.role) && <p>{text(item.role)}</p>}{item.periodLabel && <p className="meta">{item.periodLabel}</p>}
      {text(item.description) && <p className="excerpt">{text(item.description)}</p>}<SourceLink href={item.publicUrl} locale={locale} />
    </div>)}</Section> : null,
    recognition.length ? <Section key="recognition" id="recognition" title={t[6]}>{recognition.map(item => <div className="profile-entry" key={item._id}>
      {text(item.title) && <h3>{text(item.title)}</h3>}{item.issuer && <p>{item.issuer}</p>}
      {item.date && postDate(item.date, locale) && <p className="meta"><time dateTime={item.date}>{postDate(item.date, locale)}</time></p>}
      {text(item.summary) && <p className="excerpt">{text(item.summary)}</p>}<SourceLink href={item.publicUrl} locale={locale} />
    </div>)}</Section> : null,
  ].filter(Boolean);
  if (!portrait && !sections.length) return <ContentState locale={locale} page="about" state="empty" />;
  return <div className={`about-layout${portrait ? '' : ' without-portrait'}`} data-about-content>
    {portrait && <CroppedImage value={portrait} width={640} height={800} sizes="(max-width: 639px) calc(100vw - 40px), 320px" className="profile-portrait" />}
    {sections.length > 0 && <div className="profile-sections">{sections}</div>}
  </div>;
}
