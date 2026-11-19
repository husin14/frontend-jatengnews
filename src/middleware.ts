import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['id', 'en'];
const defaultLocale = 'id';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    const lang = pathname.split('/')[1];
    if (pathname.startsWith(`/${defaultLocale}/`) || pathname === `/${defaultLocale}`) {
      const newPathname = pathname.replace(`/${defaultLocale}`, '') || '/';
      return NextResponse.redirect(new URL(newPathname, request.url));
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-lang', lang);
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-lang', defaultLocale);
  return NextResponse.rewrite(new URL(`/${defaultLocale}${pathname}`, request.url), {
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|canvas_theme|favicon.ico|images|assets|dictionaries|theme|file.svg|globe.svg|next.svg|vercel.svg|window.svg).*)',
  ],
};
