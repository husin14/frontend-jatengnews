"use client";

import React from "react";
import Image from "next/image";
import axios from "axios";
import { OurProgram } from "@/app/types";
import { useState, useEffect } from "react";

export default function Home() {
  const [programs, setPrograms] = useState<OurProgram[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getProgram = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/our-programs`
        );
        setPrograms(response.data.data);
      } catch {
        setError("Failed to load programs");
      } finally {
        setLoading(false);
      }
    };

    getProgram();
  }, []);

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
        <h1 className="">Program</h1>
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
          </div>
        </div>
      </section>
    </>
  );
}
