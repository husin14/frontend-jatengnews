"use client";

import React, { useEffect, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import apiClient from "@/app/utils/apiClient";

import { berita } from "@/app/types";
import Sidebar from "@/app/components/sideBar";
import DisqusComment from "@/app/components/disqus";
import PopupIklan from "@/app/components/popupIklan";
import YtPreview from "@/app/components/yt-preview";
import { formatDate } from "@/app/utils/dateFormatter";

export default function BeritaDetailPage() {
  const params = useParams();
  const pathname = usePathname();
  const id = params.id as string;
  const lang = (params.lang as "id" | "en") || "id";

  const [berita, setBerita] = useState<berita | null>(null);
  const [relatedBerita, setRelatedBerita] = useState<berita[]>([]);
  const [recentBerita, setRecentBerita] = useState<berita[]>([]);
  const [popularBerita, setPopularBerita] = useState<berita[]>([]);
  const [dictionary, setDictionary] = useState<any>(null); //eslint-disable-line
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showIklan, setShowIklan] = useState(false);

  const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || "https://tvku.tv";
  const langPrefix = lang === "id" ? "" : `/${lang}`;

  // Automatically get the path for news links (e.g., /berita/show/ or /en/berita/show/)
  const pathBerita = pathname.substring(0, pathname.lastIndexOf('/') + 1);

  useEffect(() => {
    setShowIklan(true);
  }, []);

  const handleCloseIklan = () => {
    setShowIklan(false);
  };

  useEffect(() => {
    if (!id || !lang) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const beritaDetailUrl =
          lang === "en"
            ? `/berita-translations?language_code=en&id_berita_master=${id}`
            : `/berita/${id}`;

        const dictionaryUrl = `/dictionaries/${lang}.json`;

        const [beritaResponse, dictionaryResponse] = await Promise.all([
          apiClient.get(beritaDetailUrl, { params: { path_berita: pathBerita } }),
          fetch(dictionaryUrl).then(res => res.json()),
        ]);

        let beritaData;
        if (lang === 'en') {
          // Endpoint terjemahan mengembalikan array, ambil item pertama
          beritaData = beritaResponse.data.data[0];
        } else {
          // Endpoint utama mengembalikan objek langsung
          beritaData = beritaResponse.data;
        }

        setBerita(beritaData);
        setDictionary(dictionaryResponse);

      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Gagal memuat data atau berita tidak ditemukan.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, lang]);

  useEffect(() => {
    if (!berita || !lang) return;

    const fetchRelated = async () => {
      try {
        const idKategori = berita.kategori?.id_kategori;
        if (!idKategori) return;

        const relatedUrl =
          lang === "en"
            ? `/berita-translations?language_code=en&id_kategori=${idKategori}&current_page=1`
            : `/berita?id_kategori=${idKategori}&current_page=1`;

        const response = await apiClient.get(relatedUrl);
        const items = response.data?.data || [];

        // Saring berita saat ini agar tidak muncul di related posts
        const filtered = items
          .filter((item: berita) => item.id !== berita.id)
          .slice(0, 4);

        setRelatedBerita(filtered);
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
        const recentUrl =
          lang === "en"
            ? `/berita-translations?language_code=en`
            : `/berita`;

        const popularUrl =
          lang === "en"
            ? `/berita-translations?language_code=en&sort=populer`
            : `/berita?sort=populer`;

        const [recentRes, popularRes] = await Promise.all([
          apiClient.get(recentUrl),
          apiClient.get(popularUrl),
        ]);

        const recentItems = recentRes.data?.data || [];
        const popularItems = popularRes.data?.data || [];

        setRecentBerita(recentItems.slice(0, 5));
        setPopularBerita(popularItems.slice(0, 5));
      } catch (err) {
        console.error("Gagal mengambil recent/popular posts:", err);
      }
    };

    fetchRecentAndPopular();
  }, [lang]);

  if (loading || !dictionary) {
    return <p className="text-center py-10">{dictionary?.messages?.loading || "Memuat..."}</p>;
  }

  if (error || !berita) {
    return <p className="text-center py-10">{dictionary?.messages?.news_not_found || "Berita tidak ditemukan"}</p>;
  }

  // URL kanonis untuk Disqus dan social share
  const pageUrl = `${frontendUrl}${langPrefix}/berita/show/${id}`;

  return (
    <>
      {showIklan && <PopupIklan onClose={handleCloseIklan} />}
      
      <div className="row clearfix" style={{ marginTop: "8px" }}>
        <div className="col-lg-8">
          {berita.kategori && !berita.cover && (
            <div className="mb-3 ms-2">
              <Link href={`${langPrefix}/berita/${berita.kategori.id_kategori}`} className="badge bg-secondary text-white p-2">
                {berita.kategori.nama}
              </Link>
            </div>
          )}

          <h2
            className="fw-bold lh-sm mb-3"
            style={{
              fontSize: "2.5rem",
              // Responsive font size: 70% on screens <= 600px
                ...(typeof window !== "undefined" && window.innerWidth <= 600
                ? { fontSize: "1.25rem" }
                : {}),
              }}
              >
            {berita.judul}
          </h2>

          <div className="d-flex align-items-center mb-3 ms-2 small" style={{ color: "#000" }}>
            <div className="me-2 d-flex flex-column justify-content-center align-items-center">
              {/* Decorative dots */}
              <div className="rounded-circle bg-secondary" style={{ width: "2px", height: "2px", margin: "1px 0" }}></div>
              <div className="rounded-circle bg-secondary" style={{ width: "2px", height: "2px", margin: "1px 0" }}></div>
              <div className="rounded-circle bg-secondary" style={{ width: "2px", height: "2px", margin: "1px 0" }}></div>
            </div>
            <div className="d-flex align-items-center">
              <i className="icon-calendar3 me-2"></i>
              {/* Format tanggal sesuai bahasa */}
              {formatDate(berita.waktu || berita.waktu_publish, lang)}
              <i className="icon-eye ms-3 me-2"></i>
              {berita.views || Math.floor(Math.random() * (999 - 200 + 1) + 200)}
            </div>
          </div>

          <div className="entry">
            {berita.cover && (
              <div className="entry-image mb-3" style={{ marginTop: "8px" }}>
                <Image
                  src={berita.cover}
                  alt={berita.judul}
                  width={1200}
                  height={675}
                  style={{ width: "100%", height: "auto" }}
                  priority
                />
                {berita.kategori && (
                  <div className="entry-categories">
                    <Link href={`${langPrefix}/berita/${berita.kategori.id_kategori}`} className="bg-travel">
                      {berita.kategori.nama}
                    </Link>
                  </div>
                )}
              </div>
            )}

            <div className="entry-content clearfix mt-4">
              <div
                dangerouslySetInnerHTML={{ __html: berita.deskripsi }}
                className="text-dark"
              />
              <YtPreview link={berita.link} />
            </div>
          </div>
          
          <DisqusComment
            url={pageUrl}
            identifier={id} 
            shortname="tvku" 
          />

          {relatedBerita.length > 0 && (
            <div className="mt-5">
              <h4 className="fw-bold">Related Posts:</h4>
              <div className="related-posts row posts-md col-mb-30">
                {relatedBerita.map((item) => (
                  <div key={item.id} className="entry col-12 col-md-6">
                    <div className="grid-inner row align-items-start gutter-20">
                      <div className="col-4">
                        <div className="entry-image mb-0">
                          <Link href={`${langPrefix}/berita/show/${item.id}`}>
                            <Image
                              src={item.cover}
                              alt={item.judul}
                              width={150}
                              height={100}
                              className="rounded"
                              style={{ width: "100%", height: "auto" }}
                            />
                          </Link>
                        </div>
                      </div>
                      <div className="col-8">
                        <div className="entry-title title-xs mb-2">
                          <h3 className="mb-0">
                            <Link href={`${langPrefix}/berita/show/${item.id}`}>
                              {item.judul}
                            </Link>
                          </h3>
                        </div>
                        <div className="entry-meta">
                          <ul>
                            <li>
                              <i className="icon-calendar3"></i>{" "}
                              {formatDate(item.waktu || item.waktu_publish, lang)}
                            </li>
                            <li>
                              <i className="icon-eye"></i>{" "}
                              {item.views || Math.floor(Math.random() * (999 - 200 + 1) + 200)}
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <Sidebar
          recentPosts={recentBerita}
          popularPosts={popularBerita}
          lang={lang}
        />
      </div>
    </>
  );
}