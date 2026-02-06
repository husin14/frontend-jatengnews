# Routes Documentation

This document outlines all the routes in the Next.js application using the App Router structure.

## Route Structure

### Root Routes
- `/` - Home page
- `/[lang]` - Language-specific home page (e.g., `/id`, `/en`)

### Beranda Routes (`/[lang]/`)
- `/[lang]/` - Main dashboard/home page
- `/[lang]/contact` - Contact page
- `/[lang]/livestream` - Livestream page
- `/[lang]/program` - Program page
- `/[lang]/seputarudinus` - Seputar Udinus page 

### Berita Routes (`/[lang]/berita`)
- `/[lang]/berita` - News homepage
- `/[lang]/berita/[id_kategori]` - Category-specific news page
- `/[lang]/berita/beritaterbaru` - Latest news page
- `/[lang]/berita/show/[id]` - Individual news article page

## Route Groups
- `(beranda)` - Dashboard-related routes group
- `components` - Reusable components (not a route)
- `utils` - Utility functions (not a route)

## Middleware
The application has middleware that redirects `/berita` routes to include the default language (`/id/berita`).

## Special Files
- `layout.tsx` - Defines the layout for each route segment
- `page.tsx` - Defines the content for each route
- `dictionaries.ts` - Localization dictionaries
- `middleware.ts` - Handles language redirection for news routes