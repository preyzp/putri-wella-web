import { NextResponse, type NextRequest } from 'next/server';
import { fetchPublished } from '@/sanity/client';
import { postHref } from '@/lib/blog';

// Check published existence before streaming, including slugs added after deployment.
export async function proxy(request: NextRequest) {
  if (/^\/(id|en)\/preview\//.test(request.nextUrl.pathname)) {
    const response = NextResponse.next();
    response.headers.set('Cache-Control', 'private, no-store');
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
    response.headers.set('Referrer-Policy', 'same-origin');
    return response;
  }
  const [, locale, , slug] = request.nextUrl.pathname.split('/');
  if (locale !== 'id' && locale !== 'en') return NextResponse.next();
  let post;
  try { post = await fetchPublished('postRoute', { slug: decodeURIComponent(slug) }); }
  catch {
    // Connection failure is not an absent article. The page renders a safe retry state.
    return NextResponse.next();
  }
  if (!post) return NextResponse.rewrite(new URL('/_not-found', request.url), { status: 404 });
  if (locale === 'en') return NextResponse.redirect(new URL(postHref(post), request.url), 308);
  return NextResponse.next();
}
export const config = { matcher: ['/:locale/tulisan/:slug', '/:locale/preview/:path*'] };
