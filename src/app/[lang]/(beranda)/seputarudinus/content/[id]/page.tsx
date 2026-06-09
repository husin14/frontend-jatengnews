"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import apiClient from "@/app/utils/apiClient";
import { SeputarUdinusSlide } from "@/app/types";

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

  // Extract YouTube ID
  let youtubeId = "aaa";
  if (slide.link) {
    const match = slide.link.match(
      /(?:youtube(?:-nocookie)?\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i
    );
    if (match) {
      youtubeId = match[1];
    }
  }

  return (
    <section id="content">
      <div className="content-wrap">
        <div className="container clearfix">
          <div className="single-post mb-0">
            <div className="entry clearfix">
              <div className="entry-title">
                <h2>{slide.teks}</h2>
              </div>

              <div className="entry-meta">
                {/* Meta list can be added here if needed in the future */}
              </div>

              <iframe
                src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&`}
                allow="autoplay"
                allowFullScreen
                style={{
                  width: "100%",
                  aspectRatio: "16 / 9",
                  border: "none",
                }}
              ></iframe>

              <div className="entry-content mt-4">
                <div dangerouslySetInnerHTML={{ __html: slide.deskripsi }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
