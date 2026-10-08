# Fitur Branch develop_trans yang Belum Diterapkan di develop

Branch `develop_trans` memiliki banyak perubahan dibanding `develop` (4275 insertions, 1873 deletions di 64 files). Berikut adalah daftar fitur dan perubahan utama yang **belum ada** di branch `develop`, dibagi berdasarkan keterkaitannya dengan multi-bahasa.

> Commit base comparison: `develop` (619a58f) vs `develop_trans` (e8559b1) dengan merge-base `17b3c1b0fb83f85969a4d5adb52878f62dc63713`

## SECTION 1 - Fitur yang TIDAK Berhubungan dengan Multi-Bahasa

Fitur arsitektur, refactor teknis, routing, data fetching, dan state management yang berdiri sendiri terpisah dari sistem terjemahan.

### 1.1 Arsitektur Routing & Infrastruktur

| File | Status | Deskripsi |
|---|---|---|
| `src/proxy.ts` | **BARU** | Proxy layer terpisah untuk routing (pemisahan logic routing dari middleware). |
| `src/middleware.ts` | **Berbeda** | Perubahan implementasi middleware dibanding `develop` (pemindahan/separasi sebagian logic ke proxy). |

### 1.2 Migrasi SSR/RSC (Arsitektural)

Migrasi ini bersifat refactor teknis ke Server-Side Rendering/React Server Component.

| Halaman/File | Deskripsi |
|---|---|
| `src/app/[lang]/berita/page.tsx` | Migrasi halaman daftar berita ke pendekatan server-side (aspek struktural SSR). |
| `src/app/[lang]/berita/layout.tsx` | Refactor struktur/layout berita. |
| `src/app/[lang]/berita/beritaterbaru/page.tsx` | Migrasi halaman "berita terbaru" ke RSC (React Server Component). |
| `src/app/[lang]/berita/search/page.tsx` | Refactor struktur halaman pencarian berita. |
| `src/app/[lang]/berita/[id_kategori]/page.tsx` | Refactor struktural halaman berita per kategori. |
| `src/app/[lang]/berita/show/[slug]/page.tsx` | Migrasi halaman detail berita ke arsitektur server-side. |
| `src/app/[lang]/berita/show/[slug]/BeritaDetailClient.tsx` | **BARU** - Pemisahan komponen client untuk detail berita (client/server boundary). |

### 1.3 Routing & SEO (Non-Terjemahan)

| Perubahan | Deskripsi |
|---|---|
| Slug-based news routing (`4e1a343 feat(news): support slug-based news routing`) | Peningkatan routing berita menggunakan slug (perbaikan URL/SEO). |

### 1.4 Fitur Data Fetching & Konten Dinamis

| File/Perubahan | Deskripsi |
|---|---|
| `src/app/components/socialMedia.tsx` | Fetch dynamic social media links (pengambilan link sosial media dari API). |
| Dynamic program slider (`e8559b1 feat(beranda): switch to dynamic program slider`) | Beralih ke dynamic program slider (pengambilan data dinamis). |

### 1.5 State Management & Komponen Utilitas UI

| File Baru | Deskripsi |
|---|---|
| `src/app/context/HomepageContext.tsx` | React Context untuk state homepage (manajemen state UI). |
| `src/app/components/SetHomepageFlag.tsx` | Komponen untuk mengatur flag homepage (logic state UI). |

### 1.6 File Dokumentasi & Testing (Non-Fungsional)

| File | Deskripsi |
|---|---|
| `routes.md` | Dokumentasi routes. |
| `tesroute.md`, `tesroute_desktop.md` | File testing routes. |
| `.env.example` | Update environment example (konfigurasi environment). |

## SECTION 2 - Fitur yang BERHUBUNGAN dengan Multi-Bahasa (i18n, Auto-Translate, Lokalisasi)

Seluruh sistem terjemahan dinamis, auto-translate, lokalisasi UI/konten, ekstraksi komponen untuk mendukung i18n, serta scripts dan dokumentasi terkait terjemahan.

### 2.1 Sistem Auto-Translate & Terjemahan Dinamis

#### Utility Files (Core System)

| File | Deskripsi |
|---|---|
| `src/app/utils/autoTranslate.ts` | Client-side auto-translate utility (MyMemory API / Google Translate, caching & error handling). |
| `src/app/utils/autoTranslateServer.ts` | Server-side auto-translate untuk rendering SSR. |
| `src/app/utils/languages.ts` | Utility untuk mengelola daftar bahasa (client-side). |
| `src/app/utils/serverLanguages.ts` | Utility bahasa untuk server-side. |
| `src/app/hooks/useAutoTranslateText.ts` | React hook untuk auto-translate teks secara dinamis. |
| `src/app/hooks/useDictionary.ts` | Hook untuk mengelola dictionary per bahasa. |
| `src/app/dictionaries.ts` | Perubahan signifikan pada manajemen dictionary & tipe `Locale` untuk mendukung multi-bahasa dinamis. |

#### Commits Kunci - Sistem Terjemah

| Commit | Deskripsi |
|---|---|
| `a414809 feat(i18n): implement dynamic translation system` | Implementasi sistem terjemahan dinamis. |
| `d1a4a28 feat(i18n): add dynamic multi-language support` | Penambahan dukungan multi-bahasa dinamis. |
| `485c341 feat(translate): add google translate support` | Penambahan dukungan Google Translate. |
| `dd2d94f refactor(translate): separate server translation logic` | Pemisahan logic terjemahan server-side. |

### 2.2 Komponen HTML & Aksesibilitas Bahasa

| File Baru | Deskripsi |
|---|---|
| `src/app/components/HtmlLang.tsx` | Komponen untuk mengatur HTML `lang` attribute secara dinamis berdasarkan bahasa aktif. |

### 2.3 Ekstraksi Komponen Beranda untuk Mendukung i18n

| Komponen Baru | Digunakan di Halaman | Tujuan |
|---|---|---|
| `src/app/components/beranda/ContactContent.tsx` | `contact/page.tsx` | Ekstraksi logic client dengan support dictionary & variabel terjemahan. |
| `src/app/components/beranda/LiveStreamingContent.tsx` | `livestream/page.tsx` | Komponen client untuk livestream dengan dukungan i18n. |
| `src/app/components/beranda/ProgramContent.tsx` | `program/page.tsx` | Ekstraksi halaman program ke komponen terpisah untuk dukungan i18n/SSR. |
| `src/app/components/beranda/SeputarUdinusContent.tsx` | `seputarudinus/page.tsx` | Ekstraksi seputarudinus ke komponen client terpisah dengan dukungan i18n. |

### 2.4 Lokalisasi Halaman Beranda (Beranda Group)

| File | Fitur Lokalisasi di develop_trans |
|---|---|
| `src/app/[lang]/(beranda)/page.tsx` | Dynamic translation variables, lokalisasi section, slider translation endpoint. |
| `src/app/[lang]/(beranda)/layout.tsx` | Penyesuaian layout beranda untuk mendukung i18n & integrasi context. |
| `src/app/[lang]/(beranda)/program/page.tsx` | Migrasi ke `ProgramContent` dengan dukungan SSR/i18n. |
| `src/app/[lang]/(beranda)/livestream/page.tsx` | Ekstraksi ke `LiveStreamingContent` dengan SSR metadata & i18n. |
| `src/app/[lang]/(beranda)/contact/page.tsx` | Ekstraksi ke `ContactContent` dengan dukungan i18n. |
| `src/app/[lang]/(beranda)/seputarudinus/page.tsx` | Ekstraksi ke `SeputarUdinusContent` + auto-translate untuk Seputar Udinus. |
| `src/app/[lang]/(beranda)/seputarudinus/title/[id]/page.tsx` | Penyesuaian untuk dukungan i18n. |
| `src/app/[lang]/(beranda)/seputarudinus/content/[id]/page.tsx` | Penyesuaian untuk dukungan i18n. |

### 2.5 Lokalisasi Halaman Berita

| Halaman | Fitur Lokalisasi |
|---|---|
| `src/app/[lang]/berita/page.tsx` | Dukungan terjemahan dinamis, metadata terlokalisasi, pemilihan fetch berdasarkan bahasa. |
| `src/app/[lang]/berita/[id_kategori]/page.tsx` | Dukungan terjemahan kategori. |
| `src/app/[lang]/berita/beritaterbaru/page.tsx` | Dukungan i18n pada halaman berita terbaru. |
| `src/app/[lang]/berita/search/page.tsx` | Dukungan bahasa & terjemahan dinamis pada pencarian. |
| `src/app/[lang]/berita/show/[slug]/page.tsx` | Category translation, dukungan bahasa untuk Disqus, parameter terjemahan dinamis. |

### 2.6 Navbar, Komponen UI & Lokalisasi Global

| Komponen | Perubahan Terkait Multi-Bahasa |
|---|---|
| `src/app/components/navbar.tsx` | Dukungan i18n untuk menu items, category ordering, language handling. |
| `src/app/components/beranda/navbar.tsx` | Integrasi dengan `HomepageContext`, persist `navbar-home` class, penyesuaian logic bahasa. |
| `src/app/components/sideBar.tsx` | Auto-translation untuk social media, dukungan bahasa. |
| `src/app/components/carousel.tsx` | Dukungan terjemahan slider, parameter bahasa. |
| `src/app/components/disqus.tsx` | Language support untuk komentar Disqus. |
| `src/app/components/header.tsx` | Localize date format by language. |
| `src/app/components/NewsList.tsx` | Penyesuaian untuk dukungan i18n. |
| `src/app/components/NewsLayout.tsx` | Penyesuaian layout berita terkait kebutuhan i18n. |

### 2.7 Lokalisasi Halaman Lain

| File | Perubahan |
|---|---|
| `src/app/[lang]/iklan/layout.tsx` | Penyesuaian layout iklan untuk dukungan bahasa. |
| `src/app/[lang]/iklan/[id]/page.tsx` | Penyesuaian terkait parameter bahasa. |

### 2.8 Utilities Terkait Format & Bahasa

| File | Deskripsi |
|---|---|
| `src/app/utils/dateFormatter.ts` | Perbaikan formatting tanggal dengan dukungan i18n (native Intl). |

### 2.9 Auto-Translate Features (Fitur Spesifik)

| Fitur/Commit | Deskripsi |
|---|---|
| `ac4a3f9 fix(navbar): preserve current route on language change` | Menjaga route saat berpindah bahasa. |
| `1efb320 feat(i18n): add auto-translation for seputar udinus` | Auto-translate untuk konten Seputar Udinus. |
| `0be8792 feat(sidebar): add auto-translation to social media` | Auto-translate untuk social media di sidebar. |
| `76e0adf feat(home): add localization to homepage sections` | Lokalisasi berbagai section homepage. |
| `9c2bb32 feat(beranda): localize expertise section title` | Lokalisasi judul expertise section. |
| `bae90e1 feat(beranda): localize latest news section` | Lokalisasi section berita terbaru. |
| `9c4f30d feat(navbar): add i18n support for menu items` | Dukungan i18n untuk menu navbar. |
| `4e1f48d fix(header): localize date format by language` | Lokalisasi format tanggal di header. |
| `00e70e1 feat(seo): localize page metadata titles` | Lokalisasi metadata SEO per bahasa. |
| `ad02660 feat(i18n): localize news page titles` | Lokalisasi judul halaman berita. |
| `aa05ee4 feat(i18n): support dynamic metadata on homepage` | Dukungan metadata dinamis per bahasa di homepage. |
| `d3912f3 feat(livestream): add localization support` | Dukungan lokalisasi halaman livestream. |
| `b4aadbf feat(contact): add i18n to contact page` | Dukungan i18n halaman kontak. |

### 2.10 Scripts & Alat Bantuan Terjemah

| Script | Tujuan |
|---|---|
| `scripts/translate-expertise.cjs` | Script bantuan terjemah massal untuk expertise section. |
| `scripts/translate-whoweare.cjs` | Script bantuan terjemah massal untuk who-we-are section. |

### 2.11 Dokumentasi Terkait Terjemahan

| File | Deskripsi |
|---|---|
| `AI/conditional-messages.md` | Dokumentasi pesan kondisional terkait i18n/lokalisasi. |
| `AI/yang_belum_auto_translate.md` | Catatan item yang belum di-auto-translate. |
| `list_teks_terjemah_otomatis_home.md` | List teks untuk auto-translate homepage. |

**Catatan:** Perbedaan ini didasarkan pada `git diff --stat develop...develop_trans` (55 commits unik di `develop_trans` vs 16 di `develop`). Tidak semua perubahan otomatis bisa di-merge tanpa konflik - terutama migrasi SSR berita dan ekstraksi komponen beranda yang dikombinasikan dengan penambahan lapisan i18n.