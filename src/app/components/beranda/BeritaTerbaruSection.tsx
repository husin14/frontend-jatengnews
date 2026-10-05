"use client"
import React, { useEffect, useRef } from "react";
import { berita, jadwalAcara } from "../../types";
import Image from "next/image";
import { formatDate } from "@/app/utils/dateFormatter";
import { Locale } from "@/app/dictionaries";

declare global {
  interface Window {
    SEMICOLON_flexSliderInit: any;
    jQuery: any;
  }
}

type BeritaTerbaruSectionProps = {
  Berita: berita[];
  jadwalAcara: jadwalAcara[];
  hari: string;
  tanggal: string;
  jam: number;
  onair: { acara: string } | null;
  activelang: Locale;
};

export const BeritaTerbaruSection: React.FC<BeritaTerbaruSectionProps> = ({
  Berita,
  jadwalAcara,
  hari,
  tanggal,
  jam,
  onair,
  activelang: lang,
}) => {
  const langPrefix = lang === "id" ? "" : `/${lang}`;
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.jQuery && window.SEMICOLON_flexSliderInit) {
      const $ = window.jQuery;
      const $el = $(sliderRef.current);

      if ($el.length > 0) {
        // Delay slightly to ensure DOM is fully ready
        setTimeout(() => {
          window.SEMICOLON_flexSliderInit($el);
        }, 150);
      }
    }
  }, [Berita]);

  return (
    <div className="container">
      <div className="row rowjadwalsiar">
        <div className="col-12 col-lg-6 mb-1 mb-lg-0">
          <div
            ref={sliderRef}
            className="fslider flex-thumb-grid grid-6"
            data-speed="400"
            data-arrows="true"
            data-thumbs="true"
            data-easing="easeOutQuad"
          >
            {Berita && Berita.length > 0 && (
              <div className="flexslider">
                <div className="slider-wrap">
                  {Berita.map((item) => (
                    <div className="slide" data-thumb={item.cover} key={item.id}>
                      <a href={`${langPrefix}/berita/show/${item.slug || item.id}`}>
                        <img src={item.cover} alt={item.judul}></img>
                        <div className="bg-overlay">
                          <div className="bg-overlay-content text-overlay-mask desc-sm dark desc-sm align-items-end justify-content-start p-4">
                            <div className="portfolio-desc py-0">
                              <h3>{item.judul}</h3>
                            </div>
                          </div>
                        </div>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="col-12 col-lg-6">
          <div className="container-fluid">
            <div className="row rowjadwalsiar">
              <div className="col-12 col-md-7">
                <div className="posts-sm row col-mb-30">
                  {Berita &&
                    Berita.slice(0, 4).map((item, idx) => (
                      <div className="entry col-12 entry-siar" key={idx}>
                        <div className="entry-title">
                          <h4>
                            <a href={`${langPrefix}/berita/show/${item.slug || item.id}`}>
                              {item.judul}
                            </a>
                          </h4>
                        </div>
                        <div className="entry-meta mt-1">
                          <ul>
                            <li style={{ color: "black" }}>
                              <i className="icon-calendar3" /> {formatDate(item.waktu, lang)}
                            </li>
                            <li style={{ color: "black" }}>
                              <i className="icon-eye me-1" /> {item.open ?? 0}
                            </li>
                          </ul>
                        </div>
                        <hr style={{ borderTop: "dashed 1px black" }} />
                      </div>
                    ))}
                  <div className="entry col-12 entry-siar">
                    <div className="entry-title">
                      <a
                        href={`${langPrefix}/berita`}
                        style={{ color: "black" }}
                      >
                        <div
                          style={{
                            fontSize: 17,
                            textAlign: "center",
                            backgroundColor: "#f1f1f1",
                            paddingLeft: 0,
                            paddingRight: 0,
                          }}
                        >
                          Selengkapnya
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-5">
                <div className="widget widget-siaran">
                  <div className="list-type4">
                    <h4>
                      Siaran Hari ini : <br />
                      {hari}, {tanggal}
                    </h4>
                  </div>
                  <div
                    style={{ backgroundColor: "#DB0031" }}
                    className="list-type4"
                  >
                    <h5 style={{ color: "white", paddingLeft: 10 }}>
                      ON AIR :<br /> {onair?.acara ?? "--"}
                    </h5>
                  </div>
                  <div
                    className="list-type4"
                    style={{
                      overflow: "scroll",
                      overflowX: "hidden",
                      height: 250,
                    }}
                  >
                    <ol>
                      {jadwalAcara.map((j, idx) => {
                        const timeToFloat = (timeStr: string) => {
                          if (!timeStr) return 0;
                          const [hours, minutes] = timeStr.split(":").map(Number);
                          return hours + (minutes || 0) / 60;
                        };
                        const jamAwal = timeToFloat(j.jam_awal);
                        const jamAkhir = timeToFloat(j.jam_akhir);
                        const isNow = jam >= jamAwal && jam < jamAkhir;
                        return (
                          <li key={idx}>
                            {j.acara}
                            {isNow ? (
                              <span className="badge">Now</span>
                            ) : (
                              <>
                                <br />
                                <div style={{ fontSize: "0.8em" }}>
                                  {j.jam_awal} - {j.jam_akhir} WIB
                                </div>
                              </>
                            )}
                          </li>
                        );
                      })}
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
