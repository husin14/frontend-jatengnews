"use client";

import React, { useState, useEffect } from "react";
import apiClient from "@/app/utils/apiClient";
import Link from "next/link";
import Image from "next/image";
import { SeputarUdinusSlide } from "@/app/types";

interface CombinedSeputarDinus {
  id: number;
  judul: string;
  sliders: SeputarUdinusSlide[];
}

async function getSeputarDinusDataWithAxios() {
  try {
    const res = await apiClient.get(`/seputar-dinus-combined`);
    return res.data.data as CombinedSeputarDinus[];
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

export default function Page() {
  const [data, setData] = useState<CombinedSeputarDinus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const combinedData = await getSeputarDinusDataWithAxios();
        setData(combinedData);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "An error occurred while fetching data"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
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

  if (error) {
    return (
      <div className="container">
        <div className="alert alert-danger my-5" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <>
      <section id="page-title">
        <div className="container clearfix">
          <h1>Seputar Udinus</h1>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link href="/">Home</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Seputar Udinus
            </li>
          </ol>
        </div>
      </section>

      <section id="content">
        <div className="content-wrap">
          <div className="container">
            {data.map((item) => {
              const relatedSlides = item.sliders.slice(0, 7);

              if (relatedSlides.length === 0) return null;

              return (
                <React.Fragment key={item.id}>
                  <div className="row">
                    <div style={{ marginBottom: "10px" }}>
                      <span className="myslick-title">{item.judul}</span>
                      {" | "}
                      <Link
                        href={`/seputarudinus/title/${item.id}`}
                        className="agrey"
                      >
                        more..
                      </Link>
                    </div>

                    <div
                      className="slider-container"
                      style={{ position: "relative", overflow: "hidden" }}
                    >
                      <div
                        className="myslick"
                        style={{
                          display: "flex",
                          gap: "10px",
                          transition: "transform 0.3s ease",
                          transform: `translateX(0px)`,
                        }}
                      >
                        {relatedSlides.map((slide, index) => (
                          <Link
                            key={slide.id}
                            href={`/seputarudinus/content/${slide.id}`}
                            className="myslick-a text-decoration-none"
                            style={{ flexShrink: 0 }}
                          >
                            <div className="myslick-item">
                              <Image
                                id={index === 1 ? "imge1" : undefined}
                                className="myslick-img"
                                width={300}
                                height={200}
                                src={
                                  slide.thumbnail.startsWith("http")
                                    ? slide.thumbnail
                                    : `https://tvku.tv/storage/sptudinus/${slide.thumbnail}`
                                }
                                alt={slide.teks}
                                loading="lazy" // Native lazy loading for performance
                              />
                              <div className="myslick-item-caption">
                                {slide.teks}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>

                      {relatedSlides.length > 3 && (
                        <>
                          <button
                            className="slick-prev"
                            onClick={(e) => {
                              e.preventDefault();
                              const slider =
                                e.currentTarget.parentElement?.querySelector(
                                  ".myslick"
                                ) as HTMLElement;
                              if (slider) {
                                const currentTransform =
                                  slider.style.transform.match(
                                    /translateX\((-?\d+)px\)/
                                  );
                                const currentX = currentTransform
                                  ? parseInt(currentTransform[1])
                                  : 0;
                                const newX = Math.min(currentX + 320, 0);
                                slider.style.transform = `translateX(${newX}px)`;
                              }
                            }}
                          >
                            <i className="icon-angle-left"></i>
                          </button>
                          <button
                            className="slick-next"
                            onClick={(e) => {
                              e.preventDefault();
                              const slider =
                                e.currentTarget.parentElement?.querySelector(
                                  ".myslick"
                                ) as HTMLElement;
                              if (slider) {
                                const currentTransform =
                                  slider.style.transform.match(
                                    /translateX\((-?\d+)px\)/
                                  );
                                const currentX = currentTransform
                                  ? parseInt(currentTransform[1])
                                  : 0;
                                const maxScroll =
                                  -(relatedSlides.length - 3) * 320;
                                const newX = Math.max(
                                  currentX - 320,
                                  maxScroll
                                );
                                slider.style.transform = `translateX(${newX}px)`;
                              }
                            }}
                          >
                            <i className="icon-angle-right"></i>
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="myslick-divider my-4 border-bottom"></div>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
