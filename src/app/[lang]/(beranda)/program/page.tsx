"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import apiClient from "@/app/utils/apiClient";
import { OurProgram } from "@/app/types";

type Dictionary = {
  program_page: {
    title: string;
    breadcrumb_home: string;
    breadcrumb_program: string;
    loading: string;
    error: string;
    try_again: string;
  };
};

export default function Page({
  params,
}: {
  params: Promise<{ lang: "id" | "en" }>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageParam = searchParams.get("page");
  
  const [programs, setPrograms] = useState<OurProgram[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(pageParam ? parseInt(pageParam) : 1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [lang, setLang] = useState<"id" | "en">("id");
  const [dictionary, setDictionary] = useState<Dictionary | null>(null);

  // Sync state with URL parameter on mount or URL change
  useEffect(() => {
    const page = searchParams.get("page");
    if (page) {
      const pageNum = parseInt(page);
      if (!isNaN(pageNum) && pageNum !== currentPage) {
        setCurrentPage(pageNum);
      }
    } else if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [searchParams]);

  useEffect(() => {
    const getLangAndDictionary = async () => {
      const resolvedParams = await params;
      setLang(resolvedParams.lang);

      try {
        const response = await fetch(
          `/dictionaries/${resolvedParams.lang}.json`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch dictionary: ${response.status}`);
        }
        const dictData = await response.json();
        setDictionary(dictData);
      } catch (error) {
        console.error("Error loading dictionary:", error);
        try {
          const fallbackResponse = await fetch("/dictionaries/id.json");
          if (fallbackResponse.ok) {
            const fallbackData = await fallbackResponse.json();
            setDictionary(fallbackData);
          }
        } catch (fallbackError) {
          console.error("Error loading fallback dictionary:", fallbackError);
        }
      }
    };
    getLangAndDictionary();
  }, [params]);

  useEffect(() => {
    if (!lang) return;

    const getProgram = async () => {
      setLoading(true);
      try {
        const apiUrl =
          lang === "en"
            ? `/our-programs-translation?sort=id_asc&current_page=${currentPage}&per_page=6`
            : `/our-programs?sort=id_asc&current_page=${currentPage}&per_page=6`;

        const response = await apiClient.get(apiUrl);
        setPrograms(response.data.data);
        setTotalPages(Math.ceil(response.data.total / 6));
      } catch {
        setError("Failed to load programs");
      } finally {
        setLoading(false);
      }
    };

    getProgram();
  }, [currentPage, lang]);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
      
      // Update URL
      const params = new URLSearchParams(searchParams.toString());
      if (page === 1) {
        params.delete("page");
      } else {
        params.set("page", page.toString());
      }
      
      const queryString = params.toString();
      const url = `${window.location.pathname}${queryString ? "?" + queryString : ""}`;
      router.push(url, { scroll: false });

      // Scroll to content
      const contentElement = document.getElementById("content");
      if (contentElement) {
        const topOffset = contentElement.offsetTop;
        window.scrollTo({
          top: topOffset,
          behavior: "smooth",
        });
      }
    }
  };

  if (loading || !dictionary) {
    return (
      <div>
        <h2>{dictionary?.program_page.loading || "Loading..."}</h2>
      </div>
    );
  }
  if (error) {
    return (
      <section id="page-title">
        <div className="container clearfix">
          <h1>{dictionary?.program_page.title || "Program Unggulan Kami"}</h1>
          <span>
            {dictionary?.program_page.title || "Program Unggulan Kami"}
          </span>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="#">
                {dictionary?.program_page.breadcrumb_home || "Home"}
              </a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {dictionary?.program_page.breadcrumb_program || "Program"}
            </li>
          </ol>
        </div>
      </section>
    );
  }

  return (
    <>
      <section id="page-title">
        <div className="container clearfix">
          <h1>{dictionary?.program_page.title || "Program Unggulan Kami"}</h1>
          <span>
            {dictionary?.program_page.title || "Program Unggulan Kami"}
          </span>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="#">
                {dictionary?.program_page.breadcrumb_home || "Home"}
              </a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {dictionary?.program_page.breadcrumb_program || "Program"}
            </li>
          </ol>
        </div>
      </section>

      <section id="content">
        <div className="content-wrap">
          <div className="container clearfix">
            <div className="row justify-content-center col-mb-50">
              {programs.map((program) => (
                <div key={program.id} className="col-sm-12 col-md-6 col-lg-4">
                  <div className="feature-box media-box">
                    <div className="fbox-media">
                      <Image
                        src={program.thumbnail}
                        alt={program.judul}
                        width={500}
                        height={300}
                      />
                    </div>
                    <div className="fbox-content px-0">
                      <a
                        href={program.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <h3>{program.judul}</h3>
                      </a>
                      <p>{program.deskripsi}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Section */}
            <div className="pagination-container text-center mt-4">
              <ul className="pagination pagination-rounded">
                <li
                  className={`page-item ${currentPage <= 1 ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                  >
                    &lsaquo;
                  </button>
                </li>

                {[...Array(totalPages)].map((_, index) => {
                  const pageNumber = index + 1;
                  return (
                    <li
                      key={pageNumber}
                      className={`page-item ${
                        pageNumber === currentPage ? "active" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(pageNumber)}
                      >
                        {pageNumber}
                      </button>
                    </li>
                  );
                })}

                <li
                  className={`page-item ${
                    currentPage >= totalPages ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                  >
                    &rsaquo;
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
