"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import apiClient from "@/app/utils/apiClient";
import { SeputarUdinusSlide, SeputarUdinusSlideTitle, ApiSlideResponse } from "@/app/types";

export default function SeputarUdinusTitlePage() {
  const params = useParams();
  const id = params.id as string;
  const page = (params.page as string) || "1";

  const [slides, setSlides] = useState<SeputarUdinusSlide[]>([]);
  const [title, setTitle] = useState<SeputarUdinusSlideTitle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
  });

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [slidesRes, titleRes] = await Promise.all([
          apiClient.get(`/seputar-dinus-slider?id_slides_title=${id}&current_page=${page}`),
          apiClient.get(`/seputar-dinus-slides-title/${id}`)
        ]);

        const slidesData: ApiSlideResponse = slidesRes.data;
        const titleData = titleRes.data.data || titleRes.data;

        setSlides(slidesData.data);
        setTitle(titleData);
        setPagination({
          currentPage: slidesData.current_page,
          lastPage: slidesData.last_page,
        });
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Gagal memuat data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, page]);

  if (loading) {
    return (
      <div className="container">
        <div className="text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !title) {
    return (
      <div className="container">
        <div className="alert alert-danger my-5" role="alert">
          {error || "Data tidak ditemukan"}
        </div>
      </div>
    );
  }

  return (
    <>
      <section id="page-title">
        <div className="container clearfix">
          <h1>{title.judul}</h1>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link href="/">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link href="/seputarudinus">Seputar Udinus</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {title.judul}
            </li>
          </ol>
        </div>
      </section>

      <section id="content">
        <div className="content-wrap">
          <div className="container">
            <div className="row col-mb-50">
              {slides.map((slide) => {
                const thumbnailUrl = slide.thumbnail.startsWith("http")
                  ? slide.thumbnail
                  : `https://tvku.tv/storage/sptudinus/${slide.thumbnail}`;
                
                return (
                  <div key={slide.id} className="col-md-4">
                    <div className="entry">
                      <div className="entry-image">
                        <Link href={`/seputarudinus/content/${slide.id}`}>
                          <Image
                            src={thumbnailUrl}
                            alt={slide.teks}
                            width={400}
                            height={250}
                            className="rounded"
                            style={{ width: "100%", height: "auto" }}
                          />
                        </Link>
                      </div>
                      <div className="entry-title">
                        <h3>
                          <Link href={`/seputarudinus/content/${slide.id}`}>
                            {slide.teks}
                          </Link>
                        </h3>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {pagination.lastPage > 1 && (
              <ul className="pagination mt-5">
                {Array.from({ length: pagination.lastPage }, (_, i) => i + 1).map((p) => (
                  <li key={p} className={`page-item ${p === pagination.currentPage ? 'active' : ''}`}>
                    <Link href={`/seputarudinus/title/${id}/${p}`} className="page-link">
                      {p}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
