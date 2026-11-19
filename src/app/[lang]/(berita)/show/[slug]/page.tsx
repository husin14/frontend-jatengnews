"use client";

// Versi lama halaman ini disimpan di ../_backup/page.lama.tsx

import React, { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import apiClient from "@/app/utils/apiClient";
import { berita } from "@/app/types";
import DisqusComment from "@/app/components/disqus";
import PopupIklan from "@/app/components/popupIklan";
import YtPreview from "@/app/components/yt-preview";
import { formatDate } from "@/app/utils/dateFormatter";
import useBannerImpression from "@/app/hooks/useBannerImpression";
import {
  isLargePopupIklanShownToday,
  markLargePopupIklanShown,
} from "@/app/utils/adsCounterStorage";
import { getKategori, getKategoriName, Lang } from "@/app/components/jn/newsUtils";
import { NewsCard, SideItem } from "@/app/components/jn/NewsCard";

const shareIcons = {
  facebook: <path d="M7 10v4h3v7h4v-7h3l1-4h-4V8a1 1 0 0 1 1-1h3V3h-3a5 5 0 0 0-5 5v2z" />,
  x: <path d="M4 4l16 16M20 4L4 20" />,
  whatsapp: (
    <>
      <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
      <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
    </>
  ),
  link: (
    <>
      <path d="M9 15l6-6" />
      <path d="M11 6l.46-.54a5 5 0 0 1 7.07 7.07L18 13" />
      <path d="M13 18l-.4.53a5.07 5.07 0 0 1-7.12 0 4.97 4.97 0 0 1 0-7.07L6 11" />
    </>
  ),
};

function ShareBar({ title, url, lang }: { title: string; url: string; lang: Lang }) {
  const [copied, setCopied] = useState(false);
  const t = (id: string, en: string) => (lang === "en" ? en : id);
  const encUrl = encodeURIComponent(url);
  const encTitle = encodeURIComponent(title);

  const links = [
    { key: "facebook", label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encUrl}` },
    { key: "x", label: "X", href: `https://twitter.com/intent/tweet?text=${encTitle}&url=${encUrl}` },
    { key: "whatsapp", label: "WhatsApp", href: `https://wa.me/?text=${encTitle}%20${encUrl}` },
  ] as const;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Gagal menyalin tautan:", err);
    }
  };

  return (
    <div className="jn-share">
      <span className="jn-share-label">{t("Bagikan", "Share")}</span>
      {links.map((l) => (
        <a
          key={l.key}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          className="jn-share-btn"
          aria-label={`${t("Bagikan ke", "Share on")} ${l.label}`}
        >
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {shareIcons[l.key]}
          </svg>
        </a>
      ))}
      <button type="button" className="jn-share-btn" onClick={copyLink} aria-label={t("Salin tautan", "Copy link")}>
        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {shareIcons.link}
        </svg>
      </button>
      <span className="jn-share-status" role="status">
        {copied ? t("Tautan disalin", "Link copied") : ""}
      </span>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="col-12">
      <div className="jn-detail" aria-busy="true">
        <div className="jn-detail-main">
          <div className="jn-skel" style={{ width: "30%", height: 14 }} />
          <div className="jn-skel" style={{ width: "90%", height: 34 }} />
          <div className="jn-skel" style={{ width: "70%", height: 34 }} />
          <div className="jn-skel" style={{ width: "40%", height: 14 }} />
          <div className="jn-skel jn-media-16x9" style={{ width: "100%" }} />
          <div className="jn-skel" style={{ width: "100%", height: 14 }} />
          <div className="jn-skel" style={{ width: "95%", height: 14 }} />
          <div className="jn-skel" style={{ width: "85%", height: 14 }} />
        </div>
      </div>
    </div>
  );
}

export default function BeritaDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const lang = ((params.lang as Lang) || "id") as Lang;

  const [berita, setBerita] = useState<berita | null>(null);
  const [relatedBerita, setRelatedBerita] = useState<berita[]>([]);
  const [recentBerita, setRecentBerita] = useState<berita[]>([]);
  const [popularBerita, setPopularBerita] = useState<berita[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showIklan, setShowIklan] = useState(false);
  const [iklanVariant, setIklanVariant] = useState<"large" | "small">("large");
  const iklanDecided = useRef(false);

  const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || "https://tvku.tv";
  const langPrefix = lang === "id" ? "" : `/${lang}`;
  const t = (id: string, en: string) => (lang === "en" ? en : id);

  // Path berita (/show/ atau /en/show/) untuk pencatatan di API.
  const pathBerita = `${langPrefix}/show/`;

  // Popup besar 1x per hari (reset 00.00); artikel berikutnya memakai popup kecil.
  useEffect(() => {
    if (iklanDecided.current) return;
    iklanDecided.current = true;

    setIklanVariant(isLargePopupIklanShownToday() ? "small" : "large");
    markLargePopupIklanShown();
    setShowIklan(true);
  }, []);

  useBannerImpression(berita);

  useEffect(() => {
    if (!slug || !lang) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const beritaDetailUrl = lang === "en" ? `/berita-translations` : `/berita-public/${slug}`;
        const beritaDetailParams =
          lang === "en"
            ? { language_code: "en", berita_slug: slug, path_berita: pathBerita }
            : { path_berita: pathBerita };

        const beritaResponse = await apiClient.get(beritaDetailUrl, { params: beritaDetailParams });

        // Endpoint terjemahan mengembalikan array, endpoint utama objek langsung.
        const beritaData = lang === "en" ? beritaResponse.data.data[0] : beritaResponse.data;

        setBerita(beritaData || null);
        if (!beritaData) setError("not_found");
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("failed");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, lang]);

  useEffect(() => {
    if (!berita || !lang) return;

    const fetchRelated = async () => {
      try {
        const idKategori = berita.kategori?.id_kategori;
        if (!idKategori) return;

        const relatedUrl =
          lang === "en"
            ? `/berita-translations?language_code=en&id_kategori=${idKategori}&current_page=1`
            : `/berita-public?id_kategori=${idKategori}&current_page=1`;

        const response = await apiClient.get(relatedUrl);
        const items: berita[] = response.data?.data || [];

        // Jangan tampilkan berita yang sedang dibuka di daftar terkait.
        setRelatedBerita(items.filter((item) => item.id !== berita.id).slice(0, 3));
      } catch (err) {
        console.error("Gagal mengambil related posts:", err);
      }
    };

    fetchRelated();
  }, [berita, lang]);

  useEffect(() => {
    if (!lang) return;

    const fetchRecentAndPopular = async () => {
      try {
        const recentUrl = lang === "en" ? `/berita-translations?language_code=en` : `/berita-public`;
        const popularUrl =
          lang === "en" ? `/berita-translations?language_code=en&sort=populer` : `/berita-public?sort=populer`;

        const [recentRes, popularRes] = await Promise.all([apiClient.get(recentUrl), apiClient.get(popularUrl)]);

        setRecentBerita((recentRes.data?.data || []).slice(0, 5));
        setPopularBerita((popularRes.data?.data || []).slice(0, 5));
      } catch (err) {
        console.error("Gagal mengambil recent/popular posts:", err);
      }
    };

    fetchRecentAndPopular();
  }, [lang]);

  if (loading) return <DetailSkeleton />;

  if (error || !berita) {
    return (
      <div className="col-12 jn-empty">
        <p>
          {error === "failed"
            ? t("Gagal memuat berita. Silakan coba lagi nanti.", "Failed to load the article. Please try again later.")
            : t("Berita tidak ditemukan.", "Article not found.")}
        </p>
        <a href={langPrefix || "/"} className="jn-btn">
          {t("Kembali ke beranda berita", "Back to news home")}
        </a>
      </div>
    );
  }

  const pageUrl = `${frontendUrl}${langPrefix}/show/${slug}`;
  const kategoriItem = getKategori(berita);
  const kategoriName = getKategoriName(berita, lang);
  const kategoriHref = kategoriItem ? `${langPrefix}/${kategoriItem.id_kategori}` : null;
  const recentOthers = recentBerita.filter((item) => item.id !== berita.id).slice(0, 5);

  return (
    <>
      {showIklan && (
        <PopupIklan variant={iklanVariant} onClose={() => setShowIklan(false)} />
      )}

      <div className="col-12">
        <div className="jn-detail">
          <article className="jn-detail-main">
            <nav aria-label="Breadcrumb" className="jn-crumbs">
              <a href={langPrefix || "/"}>{t("Beranda", "Home")}</a>
              <span aria-hidden="true">›</span>
              {kategoriHref ? <a href={kategoriHref}>{kategoriName}</a> : <span>{kategoriName}</span>}
            </nav>

            <header className="jn-detail-head">
              {kategoriHref && (
                <a href={kategoriHref} className="jn-pill">
                  {kategoriName}
                </a>
              )}
              <h1 className="jn-detail-title">{berita.judul}</h1>
              <div className="jn-detail-meta">
                {berita.author && (
                  <span>
                    <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" />
                    </svg>
                    {berita.author}
                  </span>
                )}
                <span>
                  <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="5" width="18" height="16" rx="2" />
                    <path d="M16 3v4M8 3v4M3 11h18" />
                  </svg>
                  {formatDate(berita.waktu || berita.waktu_publish, lang)}
                </span>
                <span>
                  <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  {(berita.open ?? 0).toLocaleString("id-ID")} {t("kali dibaca", "views")}
                </span>
              </div>
              <ShareBar title={berita.judul} url={pageUrl} lang={lang} />
            </header>

            {berita.cover && (
              <figure className="jn-detail-cover">
                <div className="jn-media jn-media-16x9">
                  <Image src={berita.cover} alt={berita.judul} fill sizes="(max-width: 991px) 100vw, 820px" priority />
                </div>
              </figure>
            )}

            <div className="jn-article-body" dangerouslySetInnerHTML={{ __html: berita.deskripsi }} />

            <YtPreview link={berita.link} />

            <footer className="jn-detail-foot">
              {kategoriHref && (
                <div className="jn-detail-tags">
                  <span>{t("Kategori", "Category")}:</span>
                  <a href={kategoriHref} className="jn-tag">
                    {kategoriName}
                  </a>
                </div>
              )}
              <ShareBar title={berita.judul} url={pageUrl} lang={lang} />
            </footer>

            {relatedBerita.length > 0 && (
              <section aria-labelledby="sec-terkait" className="jn-sec">
                <div className="jn-sec-head">
                  <h2 id="sec-terkait">{t("Berita Terkait", "Related News")}</h2>
                  {kategoriHref && <a href={kategoriHref}>{t("Selengkapnya", "More")} →</a>}
                </div>
                <div className="jn-grid">
                  {relatedBerita.map((item) => (
                    <NewsCard key={item.id} item={item} lang={lang} />
                  ))}
                </div>
              </section>
            )}

            <section aria-labelledby="sec-komentar" className="jn-sec">
              <div className="jn-sec-head">
                <h2 id="sec-komentar">{t("Komentar", "Comments")}</h2>
              </div>
              <DisqusComment url={pageUrl} identifier={String(berita.id)} shortname="tvkutv" />
            </section>
          </article>

          <aside className="jn-detail-aside" aria-label={t("Berita lainnya", "More news")}>
            {recentOthers.length > 0 && (
              <section aria-labelledby="sec-side-terbaru" className="jn-sec">
                <div className="jn-sec-head">
                  <h2 id="sec-side-terbaru">{t("Berita Terbaru", "Latest News")}</h2>
                </div>
                <div className="jn-side-list">
                  {recentOthers.map((item) => (
                    <SideItem key={item.id} item={item} lang={lang} />
                  ))}
                </div>
              </section>
            )}

            {popularBerita.length > 0 && (
              <section aria-labelledby="sec-side-populer" className="jn-sec">
                <div className="jn-sec-head">
                  <h2 id="sec-side-populer">{t("Terpopuler", "Most Popular")}</h2>
                </div>
                <ol className="jn-side-list jn-rank-list">
                  {popularBerita.map((item, idx) => (
                    <li key={item.id}>
                      <SideItem item={item} lang={lang} rank={idx + 1} />
                    </li>
                  ))}
                </ol>
              </section>
            )}
          </aside>
        </div>
      </div>
    </>
  );
}
