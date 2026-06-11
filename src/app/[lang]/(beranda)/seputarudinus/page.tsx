"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
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

interface SliderRowProps {
  title: SeputarUdinusSlideTitle;
  relatedSlides: SeputarUdinusSlide[];
}

function SliderRow({ title, relatedSlides }: SliderRowProps) {
  const [scrollX, setScrollX] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<number>(0);
  const touchScrollRef = useRef<number>(0);
  const isDraggingRef = useRef(false);

  const getScrollStep = useCallback(() => {
    if (!trackRef.current) return 320;
    const firstItem = trackRef.current.querySelector(".myslick-item") as HTMLElement;
    if (!firstItem) return 320;
    return firstItem.offsetWidth + 10; // item width + gap
  }, []);

  const getMaxScroll = useCallback(() => {
    if (!trackRef.current || !containerRef.current) return 0;
    const trackWidth = trackRef.current.scrollWidth;
    const containerWidth = containerRef.current.offsetWidth;
    return Math.max(0, trackWidth - containerWidth);
  }, []);

  const handlePrev = useCallback(() => {
    const step = getScrollStep();
    setScrollX((prev) => Math.max(prev - step, 0));
  }, [getScrollStep]);

  const handleNext = useCallback(() => {
    const step = getScrollStep();
    const maxScroll = getMaxScroll();
    setScrollX((prev) => Math.min(prev + step, maxScroll));
  }, [getScrollStep, getMaxScroll]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientX;
    touchScrollRef.current = scrollX;
    isDraggingRef.current = true;
  }, [scrollX]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDraggingRef.current) return;
    const diff = touchStartRef.current - e.touches[0].clientX;
    const maxScroll = getMaxScroll();
    const newX = Math.max(0, Math.min(touchScrollRef.current + diff, maxScroll));
    setScrollX(newX);
  }, [getMaxScroll]);

  const handleTouchEnd = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  return (
    <>
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
          style={{ position: "relative" }}
        >
          <div
            ref={containerRef}
            style={{ overflow: "hidden" }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              ref={trackRef}
              className="myslick"
              style={{
                display: "flex",
                gap: "10px",
                transition: isDraggingRef.current ? "none" : "transform 0.3s ease",
                transform: `translateX(-${scrollX}px)`,
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
                    />
                    <div className="myslick-item-caption">
                      {slide.teks}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {relatedSlides.length > 3 && (
            <>
              <button
                type="button"
                className="slick-prev"
                style={{ zIndex: 2 }}
                onClick={handlePrev}
              >
                <i className="icon-angle-left"></i>
              </button>
              <button
                type="button"
                className="slick-next"
                style={{ zIndex: 2 }}
                onClick={handleNext}
              >
                <i className="icon-angle-right"></i>
              </button>
            </>
          )}
        </div>
      </div>

      <div className="myslick-divider my-4 border-bottom"></div>
    </>
  );
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
                <SliderRow
                  key={title.id}
                  title={title}
                  relatedSlides={relatedSlides}
                />
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
