"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import apiClient from "@/app/utils/apiClient";
import { berita, kategori } from "@/app/types";

// Konten iklan header. Ganti di sini bila materi iklan berubah.
const headerAd = {
  href: "https://pmb.dinus.ac.id",
  label: "Iklan: Daftar kuliah di Universitas Dian Nuswantoro",
  eyebrow: "UDINUS · JALUR RAPOR & PRESTASI",
  title: "Beasiswa USPI hingga",
  highlight: "100%",
  subtitle: "Pendaftaran ditutup",
  deadline: "27 November 2026",
  cta: "Daftar sekarang",
};

// Tautan media sosial diambil dari API /social-media-links (sama seperti socialMedia.tsx).
// Hanya platform yang punya URL yang ditampilkan.
type SocialPlatform = "facebook" | "x" | "instagram" | "youtube" | "tiktok";
interface SocialLink {
  platform: string;
  url: string;
}

const liveUrl = "https://tvku.tv/live";

// Lebar layar (px) di bawahnya bar kategori memakai mode geser (mobile).
const mobileBreakpoint = 991;

interface SiteHeaderProps {
  lang?: "id" | "en";
}

function sortKategori(list: kategori[]): kategori[] {
  const front = ["pendidikan", "kesehatan"];
  const back = ["pemilu", "liputan khusus"];
  const rank = (k: kategori) => {
    const name = k.nama.toLowerCase();
    if (front.includes(name)) return 0;
    if (back.includes(name)) return 2;
    return 1;
  };
  return [...list].sort((a, b) => rank(a) - rank(b));
}

function useJakartaClock(lang: "id" | "en") {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  if (!now) return { tanggal: "", jam: "" };

  const locale = lang === "en" ? "en-GB" : "id-ID";
  const tanggal = new Intl.DateTimeFormat(locale, {
    timeZone: "Asia/Jakarta",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(now);
  const jam = new Intl.DateTimeFormat(locale, {
    timeZone: "Asia/Jakarta",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
    .format(now)
    .replace(".", ":");

  return { tanggal, jam };
}

const Icon = {
  calendar: (
    <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 11h18" />
    </svg>
  ),
  clock: (
    <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  ),
  home: (
    <svg aria-hidden="true" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12H3l9-9 9 9h-2M5 12v7a2 2 0 0 0 2 2h3v-6h4v6h3a2 2 0 0 0 2-2v-7" />
    </svg>
  ),
  chevron: (
    <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9l6 6 6-6" />
    </svg>
  ),
  search: (
    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M20 20l-4.5-4.5" />
    </svg>
  ),
  close: (
    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  ),
  menu: (
    <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  ),
  arrow: (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  ),
};

const socialIcons: { key: SocialPlatform; label: string; path: React.ReactNode }[] = [
  { key: "facebook", label: "Facebook", path: <path d="M7 10v4h3v7h4v-7h3l1-4h-4V8a1 1 0 0 1 1-1h3V3h-3a5 5 0 0 0-5 5v2z" /> },
  { key: "x", label: "X", path: <path d="M4 4l16 16M20 4L4 20" /> },
  {
    key: "instagram",
    label: "Instagram",
    path: (
      <>
        <rect x="4" y="4" width="16" height="16" rx="4" />
        <circle cx="12" cy="12" r="3.5" />
        <path d="M16.5 7.5v.01" />
      </>
    ),
  },
  {
    key: "youtube",
    label: "YouTube",
    path: (
      <>
        <rect x="2.5" y="5" width="19" height="14" rx="4" />
        <path d="M10 9l5 3-5 3z" />
      </>
    ),
  },
  { key: "tiktok", label: "TikTok", path: <path d="M21 7.9a4.9 4.9 0 0 1-4.9-4.9H13v12.4a2.9 2.9 0 1 1-2.9-2.9V9.4a6.1 6.1 0 1 0 6 6.1V9.2A8 8 0 0 0 21 11z" /> },
];

export default function SiteHeader({ lang: propLang }: SiteHeaderProps) {
  const pathname = usePathname();
  const lang = propLang || (pathname.startsWith("/en") ? "en" : "id");
  const langPrefix = lang === "id" ? "" : `/${lang}`;
  const { tanggal, jam } = useJakartaClock(lang);

  const [categories, setCategories] = useState<kategori[]>([]);
  const [ticker, setTicker] = useState<berita[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const getKategori = async () => {
      try {
        const url = lang === "en" ? `/kategori-translations-all?language_code=en` : `/kategori`;
        const res = await apiClient.get(url);
        setCategories(res.data.data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const getTicker = async () => {
      try {
        const url = lang === "en" ? `/berita-translations` : `/berita-public`;
        const res = await apiClient.get(url, {
          params: { per_page: 8, ...(lang === "en" ? { language_code: "en" } : {}) },
        });
        setTicker((res.data.data || []).slice(0, 8));
      } catch (error) {
        console.error("Error fetching breaking news:", error);
      }
    };

    getKategori();
    getTicker();
  }, [lang]);

  useEffect(() => {
    const getSocial = async () => {
      try {
        const res = await apiClient.get(`/social-media-links`);
        const data = res.data?.data;
        if (Array.isArray(data)) setSocialLinks(data);
      } catch (error) {
        console.error("Failed to fetch social media links:", error);
      }
    };
    getSocial();
  }, []);

  // Tutup panel saat pindah halaman.
  useEffect(() => {
    setMoreOpen(false);
    setMobileOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  // Tutup panel dengan tombol Escape.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMoreOpen(false);
        setSearchOpen(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const sorted = useMemo(() => sortKategori(categories), [categories]);

  // Desktop: tampilkan kategori sebanyak yang muat, sisanya masuk "Lainnya".
  // Mobile: tampilkan semua kategori dalam bar yang bisa digeser.
  const linksRef = useRef<HTMLElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [fitCount, setFitCount] = useState<number | null>(null);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${mobileBreakpoint}px)`);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const recomputeFit = useCallback(() => {
    const nav = linksRef.current;
    const measure = measureRef.current;
    if (!nav || !measure || sorted.length === 0) return;

    const widths = Array.from(measure.children).map((el) => (el as HTMLElement).offsetWidth);
    // Urutan elemen ukur: [home, terkini, ...kategori, lainnya]
    const fixed = widths[0] + widths[1];
    const moreWidth = widths[widths.length - 1];
    const catWidths = widths.slice(2, -1);
    const available = nav.clientWidth;

    let used = fixed;
    let count = 0;
    for (let i = 0; i < catWidths.length; i++) {
      const restAfter = catWidths.length - (i + 1);
      const reserve = restAfter > 0 ? moreWidth : 0;
      if (used + catWidths[i] + reserve > available) break;
      used += catWidths[i];
      count++;
    }
    setFitCount(count);
  }, [sorted]);

  const updateScrollHint = useCallback(() => {
    const nav = linksRef.current;
    if (!nav) return;
    setCanScrollRight(nav.scrollLeft + nav.clientWidth < nav.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const nav = linksRef.current;
    if (!nav) return;
    const onResize = () => {
      recomputeFit();
      updateScrollHint();
    };
    onResize();
    const observer = new ResizeObserver(onResize);
    observer.observe(nav);
    // Ukur ulang setelah font web selesai dimuat (lebar teks berubah).
    document.fonts?.ready.then(onResize).catch(() => {});
    return () => observer.disconnect();
  }, [recomputeFit, updateScrollHint, isMobile]);

  const desktopCount = fitCount ?? 6;
  const navItems = isMobile ? sorted : sorted.slice(0, desktopCount);
  const moreItems = isMobile ? [] : sorted.slice(desktopCount);

  useEffect(() => {
    if (moreItems.length === 0) setMoreOpen(false);
  }, [moreItems.length]);

  const tickerLoop = ticker.length > 0 ? [...ticker, ...ticker] : [];

  const homeHref = langPrefix || "/";
  const isHome = pathname === "/" || pathname === langPrefix;
  const isActive = (id: number) => pathname === `${langPrefix}/${id}`;
  const t = (id: string, en: string) => (lang === "en" ? en : id);

  const onSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const query = (new FormData(e.currentTarget).get("search") as string) || "";
    if (query.trim()) {
      window.location.href = `${langPrefix}/search?search=${encodeURIComponent(query.trim())}`;
    }
  };

  return (
    <header className="jn-header">
      <div className="jn-topbar">
        <div className="jn-wrap">
          <div className="jn-topbar-info" suppressHydrationWarning>
            <span>
              {Icon.calendar}
              {tanggal}
            </span>
            <span>
              {Icon.clock}
              {jam ? `${jam} WIB` : ""}
            </span>
          </div>
          <nav aria-label={t("Tautan redaksi dan media sosial", "Newsroom and social links")} className="jn-social">
            <a href={`${langPrefix}/redaksi`} className={`jn-topbar-link ${pathname.endsWith("/redaksi") ? "is-active" : ""}`}>
              {t("Redaksi", "Newsroom")}
            </a>
            <span aria-hidden="true" className="jn-topbar-sep" />
            {socialIcons
              .map((s) => ({ ...s, url: socialLinks.find((l) => l.platform === s.key)?.url }))
              .filter((s) => Boolean(s.url))
              .map((s) => (
              <a key={s.key} href={s.url} aria-label={s.label} target="_blank" rel="noopener noreferrer">
                <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {s.path}
                </svg>
              </a>
            ))}
          </nav>
        </div>
      </div>

      <div className="jn-brand">
        <div className="jn-wrap">
          <a href={homeHref} className="jn-logo" aria-label={t("Jateng News, ke beranda", "Jateng News, home")}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/jatengnews-logo.svg" alt="Jateng News powered by TVKU" width={397} height={76} />
          </a>
          <a href={headerAd.href} target="_blank" rel="noopener sponsored" aria-label={headerAd.label} className="jn-ad">
            <span aria-hidden="true" className="jn-ad-blob1" />
            <span aria-hidden="true" className="jn-ad-blob2" />
            <span className="jn-ad-logo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/udinus-logo.png" alt="Logo UDINUS" />
            </span>
            <span className="jn-ad-text">
              <span className="jn-ad-eyebrow">{headerAd.eyebrow}</span>
              <span className="jn-ad-title">
                {headerAd.title} <em>{headerAd.highlight}</em>
              </span>
              <span className="jn-ad-sub">
                {headerAd.subtitle} <b>{headerAd.deadline}</b>
              </span>
            </span>
            <span className="jn-ad-cta">
              {headerAd.cta}
              {Icon.arrow}
            </span>
            <span className="jn-ad-tag">Iklan</span>
          </a>
        </div>
      </div>

      <div className="jn-nav">
        <div className="jn-wrap">
          <button
            type="button"
            className="jn-icon-btn jn-nav-menu-btn"
            aria-label={t("Menu kategori", "Category menu")}
            aria-expanded={mobileOpen}
            aria-controls="jn-mobile-menu"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? Icon.close : Icon.menu}
          </button>
          {/* Salinan tak terlihat untuk mengukur lebar tiap menu. */}
          <div ref={measureRef} className="jn-nav-measure" aria-hidden="true">
            <span className="jn-nav-home">{Icon.home}</span>
            <span>{t("Terkini", "Latest")}</span>
            {sorted.map((item) => (
              <span key={item.id_kategori}>{item.nama}</span>
            ))}
            <span>
              {t("Lainnya", "More")}
              {Icon.chevron}
            </span>
          </div>
          <div className={`jn-nav-scroll ${isMobile && canScrollRight ? "has-more" : ""}`}>
          <nav
            ref={linksRef}
            aria-label={t("Kategori berita", "News categories")}
            className="jn-nav-links"
            onScroll={updateScrollHint}
          >
            <a href={homeHref} aria-label={t("Beranda berita", "News home")} className={`jn-nav-home ${isHome ? "is-active" : ""}`}>
              {Icon.home}
            </a>
            <a href={`${langPrefix}/beritaterbaru`} className={pathname.endsWith("/beritaterbaru") ? "is-active" : ""}>
              {t("Terkini", "Latest")}
            </a>
            {navItems.map((item) => (
              <a key={item.id_kategori} href={`${langPrefix}/${item.id_kategori}`} className={isActive(item.id_kategori) ? "is-active" : ""}>
                {item.nama}
              </a>
            ))}
            {moreItems.length > 0 && (
              <div className={`jn-more ${moreOpen ? "is-open" : ""}`}>
                <button type="button" aria-expanded={moreOpen} aria-controls="jn-more-panel" onClick={() => setMoreOpen((v) => !v)}>
                  {t("Lainnya", "More")}
                  {Icon.chevron}
                </button>
              </div>
            )}
          </nav>
          </div>
          <a href={liveUrl} className="jn-live" target="_blank" rel="noopener noreferrer">
            <span className="jn-dot" aria-hidden="true" />
            LIVE<span className="jn-live-long">&nbsp;TVKU</span>
          </a>
          <button
            type="button"
            className="jn-icon-btn"
            aria-label={searchOpen ? t("Tutup pencarian", "Close search") : t("Cari berita", "Search news")}
            aria-expanded={searchOpen}
            aria-controls="jn-search"
            onClick={() => setSearchOpen((v) => !v)}
          >
            {searchOpen ? Icon.close : Icon.search}
          </button>
        </div>

        {moreOpen && moreItems.length > 0 && (
          <div id="jn-more-panel" className="jn-more-panel">
            <div className="jn-wrap">
              {moreItems.map((item) => (
                <a key={item.id_kategori} href={`${langPrefix}/${item.id_kategori}`}>
                  {item.nama}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      <div id="jn-mobile-menu" className={`jn-mobile-menu ${mobileOpen ? "is-open" : ""}`}>
        <div className="jn-wrap">
          {sorted.map((item) => (
            <a key={item.id_kategori} href={`${langPrefix}/${item.id_kategori}`}>
              {item.nama}
            </a>
          ))}
          <a href={`${langPrefix}/redaksi`} className="jn-mobile-extra">
            {t("Redaksi", "Newsroom")}
          </a>
        </div>
      </div>

      {searchOpen && (
        <div id="jn-search" className="jn-search">
          <form className="jn-wrap" role="search" onSubmit={onSearch}>
            <label htmlFor="jn-search-input">{t("Cari berita", "Search news")}</label>
            <input id="jn-search-input" type="search" name="search" placeholder={t("Cari berita…", "Search news…")} autoComplete="off" autoFocus />
            <button type="submit">{t("Cari", "Search")}</button>
          </form>
        </div>
      )}

      {tickerLoop.length > 0 && (
        <div className="jn-ticker">
          <div className="jn-wrap">
            <span className="jn-ticker-label">
              <span className="jn-dot" aria-hidden="true" />
              BREAKING<span className="jn-ticker-long">&nbsp;NEWS</span>
            </span>
            <div className="jn-ticker-view">
              <div className="jn-ticker-track">
                {tickerLoop.map((item, idx) => (
                  <a key={`${item.id}-${idx}`} href={`${langPrefix}/show/${item.slug || item.id}`} aria-hidden={idx >= ticker.length ? true : undefined} tabIndex={idx >= ticker.length ? -1 : undefined}>
                    {item.judul}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
