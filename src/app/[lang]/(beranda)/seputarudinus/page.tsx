"use client";

import React, { useState, useEffect } from "react";
import apiClient from "@/app/utils/apiClient";
import Link from "next/link";
import Image from "next/image";
import { SeputarUdinusSlide, SeputarUdinusSlideTitle } from "@/app/types";

async function getSeputarDinusDataWithAxios() {
  try {
    const titlesPromise = apiClient.get(
      `/seputar-dinus-slides-title?sort=id_asc`
    );
    const slidesPromise = apiClient.get(
      `/seputar-dinus-slider?sort=id_asc`
    );

    const [titlesRes, slidesRes] = await Promise.all([
      titlesPromise,
      slidesPromise,
    ]);

    const slideTitles: SeputarUdinusSlideTitle[] = titlesRes.data.data;
    const slides: SeputarUdinusSlide[] = slidesRes.data.data;

    return { slideTitles, slides };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      slideTitles: [],
      slides: [],
    };
  }
}

export default function Page() {
  const [slideTitles, setSlideTitles] = useState<SeputarUdinusSlideTitle[]>([]);
  const [slides, setSlides] = useState<SeputarUdinusSlide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getSeputarDinusDataWithAxios();
        setSlideTitles(data.slideTitles);
        setSlides(data.slides);
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
            {slideTitles.map((title) => {
              const relatedSlides = slides
                .filter((slide) => slide.id_slides_title === title.id)
                .slice(0, 7);

              return (
                <React.Fragment key={title.id}>
                  <div className="row">
                    <div style={{ marginBottom: "10px" }}>
                      <span className="myslick-title">{title.judul}</span>
                      {" | "}
                      <Link
                        href={`/seputarudinus/title/${title.id}`}
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
                                src={`https://tvku.tv/storage/sptudinus/${slide.thumbnail}`}
                                alt={slide.teks}
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
                            <i className="icon-align-right"></i>
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
                            <i className="icon-align-right"></i>
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
