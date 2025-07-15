"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import { OurProgram } from "@/app/types";

export default function Home() {
  const baseurl = process.env.NEXT_PUBLIC_BASE_URL;
  const [programs, setPrograms] = useState<OurProgram[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    const getProgram = async () => {
      try {
        const response = await axios.get(
          `${baseurl}/our-programs?sort=id_asc&current_page=${currentPage}&per_page=6`
        );
        setPrograms(response.data.data);
        setTotalPages(Math.ceil(response.data.total / 6)); 
      } catch {
        setError("Failed to load programs");
      } finally {
        setLoading(false);
      }
    };

    getProgram();
  }, [currentPage]); 

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page); 
    }
  };

  if (loading) {
    return (
      <div>
        <h2>Loading...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1>Program</h1>
        <div>
          <p>Error: {error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <>
      <section id="page-title">
        <div className="container clearfix">
          <h1>Program Unggulan Kami</h1>
          <span>Program Unggulan Kami</span>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="#">Home</a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Program
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
