"use client";

import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import apiClient from "@/app/utils/apiClient";
import { convert } from "html-to-text";

import { berita, apiResponse } from "@/app/types";
import NewsLayout from "@/app/components/NewsLayout";
import NewsList from "@/app/components/NewsList";
import Pagination from "@/app/components/Pagination";

export default function BeritaSearchPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const lang = (params.lang as "id" | "en") || "id";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const searchQuery = searchParams.get("search") || searchParams.get("q") || "";

  const [beritaApiResponse, setBeritaApiResponse] = useState<apiResponse | null>(null);
  const [dictionary, setDictionary] = useState<any>(null); // eslint-disable-line
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!lang) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const beritaUrl = `/berita-public?search=${encodeURIComponent(searchQuery)}&current_page=${currentPage}`;
        const dictionaryUrl = `/dictionaries/${lang}.json`;

        const [beritaResponse, dictionaryResponse] = await Promise.all([
          apiClient.get(beritaUrl),
          fetch(dictionaryUrl).then((res) => res.json()),
        ]);

        const processedBerita: apiResponse = {
          ...beritaResponse.data,
          data: (beritaResponse.data.data || []).map((item: berita) => ({
            ...item,
            deskripsi: convert(item.deskripsi, {
              selectors: [{ selector: "img", format: "skip" }],
            }),
          })),
        };

        setBeritaApiResponse(processedBerita);
        setDictionary(dictionaryResponse);
      } catch (err) {
        console.error("Failed to fetch search data:", err);
        setError(
          lang === "en"
            ? "Failed to load search results. Please try again later."
            : "Gagal memuat hasil pencarian. Silakan coba lagi nanti."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [lang, currentPage, searchQuery]);

  if (loading || !dictionary) {
    return <div className="text-center p-5">Loading...</div>;
  }

  if (error) {
    return <div className="text-center p-5 text-red-500">{error}</div>;
  }

  const langPrefix = lang === "id" ? "" : `/${lang}`;
  const total_no_of_pages = beritaApiResponse?.last_page || 0;
  const baseUrlLink = `${langPrefix}/berita/search`;

  const titleText =
    lang === "en"
      ? `Search Results for "${searchQuery}"`
      : `Hasil Pencarian untuk "${searchQuery}"`;

  return (
    <NewsLayout
      title={titleText}
      lang={lang}
      pagination={
        <Pagination
          currentPage={currentPage}
          lastPage={total_no_of_pages}
          getPageUrl={(page) =>
            `${baseUrlLink}?search=${encodeURIComponent(searchQuery)}&page=${page}`
          }
        />
      }
    >
      {!beritaApiResponse || beritaApiResponse.data.length === 0 ? (
        <div className="text-center p-5">
          {lang === "en"
            ? "No news found matching your query."
            : "Tidak ada berita yang cocok dengan pencarian Anda."}
        </div>
      ) : (
        <NewsList news={beritaApiResponse.data} lang={lang} />
      )}
    </NewsLayout>
  );
}
