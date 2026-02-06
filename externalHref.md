# External Href Links

This document lists all external href links found in the project that point to domains outside of the current application.

## External Links Found

### Font Resources
- `https://fonts.googleapis.com/css?family=Lato:300,400,400i,700|Poppins:300,400,500,600,700|PT+Serif:400,400i&display=swap` - Google Fonts CSS (found in `src/app/[lang]/berita/layout.tsx` and `src/app/[lang]/(beranda)/layout.tsx`)

### Social Media Links
- `https://facebook.com/` - Facebook link (found in `src/app/components/socialMedia.tsx`)
- `https://twitter.com/` - Twitter link (found in `src/app/components/socialMedia.tsx`)
- `https://instagram.com/` - Instagram link (found in `src/app/components/socialMedia.tsx`)
- `https://www.youtube.com/semicolonweb` - YouTube channel link (found in `src/app/components/socialMedia.tsx`)
- `https://facebook.com/semiColonWeb` - Facebook page link (found in `src/app/components/header.tsx`)
- `https://twitter.com/__semicolon` - Twitter account link (found in `src/app/components/header.tsx`)
- `https://instagram.com/semicolonweb` - Instagram account link (found in `src/app/components/header.tsx`)

### Third-party Services
- `https://disqus.com/?ref_noscript` - Disqus noscript fallback link (found in `src/app/[lang]/berita/layout.tsx`)
- `https://tvkutv.disqus.com/embed.js` - Disqus embed script (found in `src/app/[lang]/berita/layout.tsx`)
- `https://themeforest.net/item/canvas-the-multipurpose-html5-template/9228123` - ThemeForest template link (found in `src/app/components/socialMedia.tsx`)
- `https://themeforest.net/user/semiColonWeb/follow` - ThemeForest profile link (found in `src/app/components/socialMedia.tsx`)

### CDN Resources
- `https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css` - Slick carousel CSS (found in `src/app/[lang]/(beranda)/layout.tsx`)
- `https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js` - Slick carousel JavaScript (found in `src/app/[lang]/(beranda)/layout.tsx`)
- `https://vjs.zencdn.net/8.10.0/video-js.css` - Video.js CSS (found in `src/app/[lang]/(beranda)/livestream/page.tsx`)
- `https://cdn.jsdelivr.net/npm/hls.js@1.0.3-0.canary.7275/dist/hls.min.js` - HLS.js library (found in `src/app/[lang]/(beranda)/livestream/page.tsx`)

### Advertisement Links
- `https://tvku.tv/advertisement/uploads/Iklan_25-03-05-11-01-35.jpeg` - Advertisement image link (found in `src/app/components/popupIklan.tsx`)

### Social Sharing Links
- `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` - Facebook share URL (found in `src/app/components/SocialShare.tsx`)
- `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}` - Twitter share URL (found in `src/app/components/SocialShare.tsx`)
- `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedTitle}` - Pinterest share URL (found in `src/app/components/SocialShare.tsx`)
- `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}` - LinkedIn share URL (found in `src/app/components/SocialShare.tsx`)

### API Endpoints
- `https://apidev.tvku.tv/api/berita-translations?language_code=en&current_page=${currentPage}` - News translations API (found in `src/app/[lang]/berita/beritaterbaru/page.tsx`)
- `https://apidev.tvku.tv/api/berita-translations?language_code=en&id_kategori=${id_kategori}&current_page=${currentPage}` - Categorized news API (found in `src/app/[lang]/berita/[id_kategori]/page.tsx`)
- `https://apidev.tvku.tv/api/kategori-translations?language_code=en&id_kategori=${id_kategori}` - Category translations API (found in `src/app/[lang]/berita/[id_kategori]/page.tsx`)
- `https://apidev.tvku.tv/api/berita-translations?language_code=en` - News API (found in `src/app/[lang]/berita/page.tsx`)
- `https://apidev.tvku.tv/api/berita-translations?language_code=en&id_kategori=19` - Specific category news API (found in `src/app/[lang]/berita/page.tsx`)
- `https://apidev.tvku.tv/storage/${beritaTerbaru[0].cover}` - News cover image (found in `src/app/[lang]/berita/page.tsx`)
- `https://apidev.tvku.tv/storage/${item.cover}` - News item cover image (found in `src/app/[lang]/berita/page.tsx`)
- `https://apidev.tvku.tv/api/berita-translations?language_code=en&id_berita_master=${id}` - Specific news item API (found in `src/app/[lang]/berita/show/[id]/page.tsx`)
- `https://apidev.tvku.tv/api/kategori-translations-all?language_code=en` - All categories API (found in `src/app/[lang]/(beranda)/navbar.tsx`)

### Other External Resources
- `https://tvku.tv/storage/sptudinus/${slide.thumbnail}` - Seputar Udinus thumbnail (found in `src/app/[lang]/(beranda)/seputarudinus/page.tsx`)
- `https://tvku.tv/hlsstream/hls/live.m3u8` - TV stream URL (found in `src/app/[lang]/(beranda)/livestream/page.tsx`)
- `https://tvku.tv` - Frontend URL (found in `src/app/[lang]/berita/show/[id]/page.tsx`)

## Notes
- Most external links are for social media integration, third-party services (Disqus), CDN resources, and API endpoints
- The project appears to be a news and streaming platform called TVKU
- Several links point to the development API endpoint (apidev.tvku.tv)
- Social sharing functionality is implemented for major platforms