"use client";

import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import apiClient, { getApiErrorMessage } from "@/app/utils/apiClient";
import { convert } from "html-to-text";

import { berita, kategori, apiResponse } from "@/app/types";
import NewsLayout from "@/app/components/NewsLayout";
import NewsList from "@/app/components/NewsList";
import Pagination from "@/app/components/Pagination";

export default function KategoriBeritaClient() {
  const params = useParams();
  const searchParams = useSearchParams();

  const id_kategori = params.id_kategori as string;
  const lang = (params.lang as "id" | "en") || "id";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const [kategori, setKategori] = useState<kategori | null>(null);
  const [beritaApiResponse, setBeritaApiResponse] =
    useState<apiResponse | null>(null);
  const [dictionary, setDictionary] = useState<any>(null); //eslint-disable-line
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!lang || !id_kategori) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const beritaUrl =
          lang === "en"
            ? `/berita-translations?language_code=en&id_kategori=${id_kategori}&current_page=${currentPage}`
            : `/berita-public?id_kategori=${id_kategori}&current_page=${currentPage}`;

        const kategoriUrl =
          lang === "en"
            ? `/kategori-translations?language_code=en&id_kategori=${id_kategori}`
            : `/kategori/${id_kategori}`;
        
        const dictionaryUrl = `/dictionaries/${lang}.json`;

        const [beritaResponse, kategoriResponse, dictionaryResponse] =
          await Promise.all([
            apiClient.get(beritaUrl),
            apiClient.get(kategoriUrl),
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

        if (
          lang === "en" &&
          kategoriResponse.data.data &&
          kategoriResponse.data.data.length > 0
        ) {
          setKategori(kategoriResponse.data.data[0]);
        } else {
          setKategori(kategoriResponse.data);
        }
        setDictionary(dictionaryResponse);
        console.log("Kategori:", kategoriResponse.data);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError(getApiErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [lang, id_kategori, currentPage]);

  if (error) {
    return <div className="text-center p-5 text-red-500">{error}</div>;
  }

  if (loading || !dictionary) {
    return <div className="text-center p-5">Loading...</div>;
  }

  if (!kategori) {
    return (
      <div className="text-center p-5">
        {dictionary?.kategori_page?.not_found || "Kategori tidak ditemukan."}
      </div>
    );
  }

  if (!beritaApiResponse || beritaApiResponse.data.length === 0) {
    return (
      <div className="text-center p-5">
        {dictionary?.kategori_page?.no_news ||
          "Tidak ada berita untuk kategori ini."}
      </div>
    );
  }

  const langPrefix = lang === "id" ? "" : `/${lang}`;
  const total_no_of_pages = beritaApiResponse.last_page;
  const baseUrlLink = `${langPrefix}/${id_kategori}`;

  return (
    <NewsLayout
      title={kategori.nama}
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
