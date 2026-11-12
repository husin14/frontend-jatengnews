import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['id', 'en'];
const defaultLocale = 'id';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the pathname starts with a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    // If it's the default locale, redirect to a path without the locale prefix
    if (pathname.startsWith(`/${defaultLocale}/`) || pathname === `/${defaultLocale}`) {
      const newPathname = pathname.replace(`/${defaultLocale}`, '') || '/';
      return NextResponse.redirect(new URL(newPathname, request.url));
    }
    // If it's another locale (e.g. /en), let it be
    return NextResponse.next();
  }

  // Rewrite to the default locale internally
  return NextResponse.rewrite(new URL(`/${defaultLocale}${pathname}`, request.url));
}

export const config = {
  matcher: [
    // Skip all internal paths (_next) and static assets
    '/((?!api|_next/static|_next/image|canvas_theme|favicon.ico|images|assets|dictionaries|theme|file.svg|globe.svg|next.svg|vercel.svg|window.svg).*)',
  ],
};