"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import apiClient from "@/app/utils/apiClient";
import { SeputarUdinusSlide } from "@/app/types";
import YtPreview from "@/app/components/yt-preview";

export default function SeputarUdinusDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [slide, setSlide] = useState<SeputarUdinusSlide | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiClient.get(`/seputar-dinus-slider/${id}`);
        // Assuming the API returns the object directly or wrapped in .data
        const data = response.data.data || response.data;
        setSlide(data);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Gagal memuat data atau konten tidak ditemukan.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

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

  if (error || !slide) {
    return (
      <div className="container">
        <div className="alert alert-danger my-5" role="alert">
          {error || "Konten tidak ditemukan"}
        </div>
      </div>
    );
  }

  const thumbnailUrl = slide.thumbnail.startsWith("http")
    ? slide.thumbnail
    : `https://tvku.tv/storage/sptudinus/${slide.thumbnail}`;

  return (
    <>
      <section id="page-title">
        <div className="container clearfix">
          <h1>{slide.teks}</h1>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link href="/">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link href="/seputarudinus">Seputar Udinus</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Detail
            </li>
          </ol>
        </div>
      </section>

      <section id="content">
        <div className="content-wrap">
          <div className="container">
            <div className="row">
              <div className="col-lg-8">
                <div className="entry-image mb-4">
                  <Image
                    src={thumbnailUrl}
                    alt={slide.teks}
                    width={1200}
                    height={675}
                    style={{ width: "100%", height: "auto" }}
                    priority
                  />
                </div>
                <div className="entry-content">
                  <div
                    dangerouslySetInnerHTML={{ __html: slide.deskripsi }}
                    className="text-dark mb-4"
                  />
                  {slide.link && <YtPreview link={slide.link} />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
