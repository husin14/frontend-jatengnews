"use client"
import React, { useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { kerjasama } from "@/app/types";

type KerjasamaSectionProps = {
  data?: kerjasama[];
};

export const KerjasamaSection = ({ data }: KerjasamaSectionProps) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const slides = useMemo(
    () => (data ?? []).filter((item) => Boolean(item.gambar)),
    [data]
  );

  useEffect(() => {
    if (typeof window === "undefined" || !window.jQuery || !sliderRef.current) {
      return;
    }

    if (slides.length === 0) return;

    const sliderElement = sliderRef.current;
    const $ = window.jQuery;
    const $slider = $(sliderElement);

    if ($slider.hasClass('slick-initialized')) {
      $slider.slick('unslick');
    }

    $slider.slick({
      infinite: true,
      autoplay: true,
      autoplaySpeed: 2000,
      slidesToShow: 6,
      slidesToScroll: 1,
      prevArrow: "",
      nextArrow: "",
      responsive: [{
        breakpoint: 1600,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
      ]
    });

    return () => {
      if (typeof window !== "undefined" && window.jQuery) {
        const $ = window.jQuery;
        const $slider = $(sliderElement);
        if ($slider.hasClass('slick-initialized')) {
          $slider.slick('unslick');
        }
      }
    };
  }, [slides]);

  if (slides.length === 0) return null;

  return (
    <div className="section nobottommargin" style={{ paddingTop: 0 }}>
      <div className="container clear-bottommargin clearfix">
        <div className="row topmargin-sm clearfix">
          <div className="heading-block center">
            <h2>Kerjasama yang Terjalin dengan TVKU</h2>
          </div>
        </div>
        <div className="row">
          <div ref={sliderRef} className="kerjasamaterjalin">
            {slides.map((item) => {
              const slide = (
                <div>
                  <Image
                    width={400}
                    height={200}
                    className="kerjasamaterjalin-item-img"
                    src={item.gambar}
                    alt={item.nama || "Logo mitra"}
                  />
                  {item.caption && (
                    <div className="kerjasamaterjalin-item-caption">
                      {item.caption}
                    </div>
                  )}
                </div>
              );

              return item.link ? (
                <a
                  href={item.link}
                  key={item.id}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {slide}
                </a>
              ) : (
                <div key={item.id}>{slide}</div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
