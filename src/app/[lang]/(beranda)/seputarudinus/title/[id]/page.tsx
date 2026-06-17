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

  const getPageRange = () => {
    const pages: (number | string)[] = [];
    const total_no_of_pages = pagination.lastPage;
    const adjacents = 2;
    const currPage = pagination.currentPage;

    if (total_no_of_pages <= 10) {
      for (let counter = 1; counter <= total_no_of_pages; counter++) {
        pages.push(counter);
      }
    } else {
      if (currPage <= 5) {
        for (let counter = 1; counter < 9; counter++) {
          pages.push(counter);
        }
        pages.push("...");
      } else if (currPage > 5 && currPage < total_no_of_pages - 4) {
        pages.push("...");
        for (
          let counter = currPage - adjacents;
          counter <= currPage + adjacents;
          counter++
        ) {
          pages.push(counter);
        }
        pages.push("...");
      } else {
        pages.push("...");
        for (
          let counter = total_no_of_pages - 6;
          counter <= total_no_of_pages;
          counter++
        ) {
          pages.push(counter);
        }
      }
    }
    return pages;
  };

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
            <div className="row justify-content-center col-mb-50">
              {slides.map((slide) => {
                const thumbnailUrl = slide.thumbnail.startsWith("http")
                  ? slide.thumbnail
                  : `https://tvku.tv/storage/sptudinus/${slide.thumbnail}`;
                
                return (
                  <div key={slide.id} className="col-sm-12 col-md-6 col-lg-4">
                    <div className="feature-box media-box">
                      <div className="fbox-media">
                        <Link href={`/seputarudinus/content/${slide.id}`}>
                          <Image
                            src={thumbnailUrl}
                            alt={slide.teks}
                            width={500}
                            height={300}
                          />
                        </Link>
                      </div>
                      <div className="fbox-content px-0">
                        <Link href={`/seputarudinus/content/${slide.id}`}>
                          <h3>{slide.teks}</h3>
                        </Link>
                        
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Section */}
            {pagination.lastPage > 1 && (
              <div className="pagination-container text-center mt-4">
                <ul className="pagination pagination-rounded justify-content-center flex-wrap">
                  {/* First Page */}
                  <li className={`page-item ${pagination.currentPage <= 1 ? "disabled" : ""}`}>
                    <Link
                      className="page-link"
                      href={`/seputarudinus/title/${id}/1`}
                      aria-label="First"
                    >
                      <span aria-hidden="true">&laquo;</span>
                    </Link>
                  </li>

                  {/* Previous Page */}
                  <li className={`page-item ${pagination.currentPage <= 1 ? "disabled" : ""}`}>
                    <Link
                      className="page-link"
                      href={`/seputarudinus/title/${id}/${Math.max(1, pagination.currentPage - 1)}`}
                      aria-label="Previous"
                    >
                      <span aria-hidden="true">&lsaquo;</span>
                    </Link>
                  </li>

                  {/* Dynamic Page Numbers */}
                  {getPageRange().map((pageNumber, index) => (
                    <li
                      key={index}
                      className={`page-item ${
                        pageNumber === pagination.currentPage ? "active" : ""
                      } ${typeof pageNumber === "string" ? "disabled" : ""}`}
                    >
                      {typeof pageNumber === "number" ? (
                        <Link
                          href={`/seputarudinus/title/${id}/${pageNumber}`}
                          className="page-link"
                        >
                          {pageNumber}
                        </Link>
                      ) : (
                        <span className="page-link">{pageNumber}</span>
                      )}
                    </li>
                  ))}

                  {/* Next Page */}
                  <li className={`page-item ${pagination.currentPage >= pagination.lastPage ? "disabled" : ""}`}>
                    <Link
                      className="page-link"
                      href={`/seputarudinus/title/${id}/${Math.min(pagination.lastPage, pagination.currentPage + 1)}`}
                      aria-label="Next"
                    >
                      <span aria-hidden="true">&rsaquo;</span>
                    </Link>
                  </li>

                  {/* Last Page */}
                  <li className={`page-item ${pagination.currentPage >= pagination.lastPage ? "disabled" : ""}`}>
                    <Link
                      className="page-link"
                      href={`/seputarudinus/title/${id}/${pagination.lastPage}`}
                      aria-label="Last"
                    >
                      <span aria-hidden="true">&raquo;</span>
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
