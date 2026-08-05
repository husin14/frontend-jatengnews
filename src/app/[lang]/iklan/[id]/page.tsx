"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import apiClient from "@/app/utils/apiClient";

interface IklanData {
  id: number;
  judul: string;
  foto: string | null;
  isi: string;
  video: string | null;
  user_id?: number | null;
}

export default function IklanDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const lang = (params.lang as "id" | "en") || "id";

  const [iklan, setIklan] = useState<IklanData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const clickRecorded = useRef(false);

  useEffect(() => {
    if (!id) return;

    const fetchIklan = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.get(`/iklan/banner/${id}`);
        setIklan(response.data);
      } catch (err) {
        console.error("Gagal mengambil data iklan:", err);
        setError("Iklan tidak ditemukan.");
      } finally {
        setLoading(false);
      }
    };

    fetchIklan();
  }, [id]);

  useEffect(() => {
    if (!id || clickRecorded.current) return;
    clickRecorded.current = true;

    apiClient
      .post("/ads-click", { ads_id: Number(id) })
      .then(() => console.log("[ads-click] recorded for iklan", id))
      .catch((err) => {
        clickRecorded.current = false;
        console.error("[ads-click] gagal mencatat klik", err);
      });
  }, [id]);

  const visitUrl =
    iklan?.video && /^https?:\/\//i.test(iklan.video.trim())
      ? iklan.video.trim()
      : null;

  if (loading) {
    return <p className="text-center py-10">Memuat...</p>;
  }

  if (error || !iklan) {
    return (
      <p className="text-center py-10">
        {error || "Iklan tidak ditemukan"}
      </p>
    );
  }

  return (
    <div className="container my-0" style={{ maxWidth: 720 }}>
      <article className="entry">
        <h1 className="fw-bold mb-4">{iklan.judul}</h1>

        {iklan.foto && (
          <div className="entry-image mb-4" style={{ textAlign: "center" }}>
            <img
              src={iklan.foto}
              alt={iklan.judul}
              style={{
                maxWidth: "100%",
                height: "auto",
                borderRadius: 8,
              }}
            />
          </div>
        )}

        {iklan.isi && (
          <div
            className="text-dark"
            dangerouslySetInnerHTML={{ __html: iklan.isi }}
          />
        )}

        {visitUrl && (
          <div className="text-center mt-4">
            <a
              href={visitUrl}
              target="_blank"
              rel="noopener nofollow"
              className="btn btn-primary"
            >
              Kunjungi
            </a>
          </div>
        )}
      </article>
    </div>
  );
}
