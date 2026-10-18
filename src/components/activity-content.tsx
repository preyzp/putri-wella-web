import type { Locale } from '@/lib/dictionaries';
import type { PublicActivity, PublicImage } from '@/sanity/types';
import { localizedText } from '@/lib/profile-content';
import { postDate } from '@/lib/blog';
import { CroppedImage, croppedImageSource } from '@/sanity/cropped-image';
import { ContentState } from './content-state';

export function ActivityContent({ activities, locale }: { activities: PublicActivity[]; locale: Locale }) {
  const photos = activities.flatMap(activity => (activity.photos || []).map((photo, index) => {
    const image: PublicImage = { ...photo, alt: localizedText(photo.alt, locale), caption: localizedText(photo.caption, locale) };
    return { key: `${activity._id}-${photo._key || index}`, image, title: localizedText(activity.title, locale), date: activity.date };
  })).filter(photo => croppedImageSource(photo.image, 1200, 750));
  if (!photos.length) return <ContentState locale={locale} page="activity" state="empty" />;
  return <div className="gallery" data-activity-gallery>{photos.map(photo => <div className="activity-photo" key={photo.key}>
    <CroppedImage value={photo.image} width={1200} height={750} sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw" />
    {(photo.title || (photo.date && postDate(photo.date, locale))) && <div className="activity-meta">
      {photo.title && <p className="eyebrow">{photo.title}</p>}
      {photo.date && postDate(photo.date, locale) && <p className="meta"><time dateTime={photo.date}>{postDate(photo.date, locale)}</time></p>}
    </div>}
  </div>)}</div>;
}
