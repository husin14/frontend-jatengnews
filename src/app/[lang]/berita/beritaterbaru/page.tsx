"use client";

import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import apiClient from "@/app/utils/apiClient";
import { convert } from "html-to-text";

import { berita, apiResponse } from "@/app/types";
import NewsLayout from "@/app/components/NewsLayout";
import NewsList from "@/app/components/NewsList";
import Pagination from "@/app/components/Pagination";

export default function BeritaTerbaruPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const lang = (params.lang as "id" | "en") || "id";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

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
        const beritaUrl =
          lang === "en"
            ? `/berita-translations?language_code=en&current_page=${currentPage}`
            : `/berita-public?current_page=${currentPage}`;
        
        const dictionaryUrl = `/dictionaries/${lang}.json`;

        const [beritaResponse, dictionaryResponse] = await Promise.all([
          apiClient.get(beritaUrl),
          fetch(dictionaryUrl).then(res => res.json()),
        ]);

        const processedBerita: apiResponse = {
          ...beritaResponse.data,
          data: beritaResponse.data.data.map((item: berita) => ({
            ...item,
            deskripsi: convert(item.deskripsi, {
              selectors: [{ selector: "img", format: "skip" }],
            }),
          })),
        };

        setBeritaApiResponse(processedBerita);
        setDictionary(dictionaryResponse);

      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Gagal memuat data. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [lang, currentPage]);

  if (loading || !dictionary) {
    return <div className="text-center p-5">Loading...</div>;
  }

  if (error) {
    return <div className="text-center p-5 text-red-500">{error}</div>;
  }
  
  if (!beritaApiResponse || beritaApiResponse.data.length === 0) {
    return (
      <div className="text-center p-5">
        {dictionary?.berita_page?.no_news || "Tidak ada berita."}
      </div>
    );
  }

  const langPrefix = lang === "id" ? "" : `/${lang}`;
  const total_no_of_pages = beritaApiResponse.last_page;
  const baseUrlLink = `${langPrefix}/berita/beritaterbaru`;

  return (
    <NewsLayout
      title={dictionary.berita_page.latest_news}
      lang={lang}
      pagination={
        <Pagination
          currentPage={currentPage}
          lastPage={total_no_of_pages}
          getPageUrl={(page) => `${baseUrlLink}?page=${page}`}
        />
      }
    >
      <NewsList news={beritaApiResponse.data} lang={lang} />
    </NewsLayout>
  );
}
