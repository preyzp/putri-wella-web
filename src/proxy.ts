import { NextResponse, type NextRequest } from 'next/server';
import { getPost, postHref } from '@/fixtures/posts';

// Check fixture existence before streaming so missing article URLs return HTTP 404.
export function proxy(request: NextRequest) {
  const [, locale, , slug] = request.nextUrl.pathname.split('/');
  if (locale !== 'id' && locale !== 'en') return NextResponse.next();
  const post = getPost(slug);
  if (!post) return NextResponse.rewrite(new URL('/_not-found', request.url), { status: 404 });
  if (locale !== post.language) return NextResponse.redirect(new URL(postHref(post), request.url), 308);
  return NextResponse.next();
}
export const config = { matcher: ['/:locale/tulisan/:slug'] };
