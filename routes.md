# Routes Documentation

This document outlines all the routes in the Next.js application using the App Router structure.

## Route Structure

### Root Routes
- `/` - Home page (Indonesian news homepage)
- `/en` - English news homepage

### Berita Routes (`/[lang]/(berita)`)
- `/[lang]` - News homepage
- `/[lang]/[id_kategori]` - Category-specific news page (numeric category id only)
- `/[lang]/beritaterbaru` - Latest news page
- `/[lang]/search` - Search results page
- `/[lang]/show/[slug]` - Individual news article page

### Iklan Routes (`/[lang]/iklan`)
- `/[lang]/iklan/[id]` - Advertisement detail page

## Route Groups
- `(berita)` - News routes group; does not add a URL segment
- `components` - Reusable components (not a route)
- `utils` - Utility functions (not a route)

## Middleware
The application has middleware that rewrites non-localized paths to the default language (`/id<path>`) and redirects explicit `/id` paths to their non-localized equivalent.

## Removed Routes
The following routes were removed and intentionally return `404` (no redirects):
- `/[lang]/beranda`
- `/[lang]/contact`
- `/[lang]/livestream`
- `/[lang]/program`
- `/[lang]/seputarudinus`
- `/[lang]/berita`
- `/[lang]/berita/[id_kategori]`
- `/[lang]/berita/beritaterbaru`
- `/[lang]/berita/search`
- `/[lang]/berita/show/[slug]`

## Special Files
- `layout.tsx` - Defines the layout for each route segment
- `page.tsx` - Defines the content for each route
- `not-found.tsx` - Custom 404 page for the news routes
- `dictionaries.ts` - Localization dictionaries
- `middleware.ts` - Handles language rewriting/redirects
