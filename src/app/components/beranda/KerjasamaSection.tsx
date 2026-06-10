"use client"
import React, { useEffect, useRef } from "react";
import Image from "next/image";

const images = [
  {
    src: "/images/kerjasamaygterjalin/bapenda.png",
    alt: "Logo of BAPENDA",
    caption: "Collaboration with BAPENDA (Regional Revenue Agency).",
  },
  {
    src: "/images/kerjasamaygterjalin/bjateng.png",
    alt: "Logo of Bank Jateng",
    caption: "Partnership with Bank Jateng.",
  },
  {
    src: "/images/kerjasamaygterjalin/bnn.png",
    alt: "Logo of BNN",
    caption: "Cooperation with BNN (National Narcotics Agency).",
  },
  {
    src: "/images/kerjasamaygterjalin/esport.png",
    alt: "Logo of Esports organization",
    caption: "Support for the local Esports community.",
  },
  {
    src: "/images/kerjasamaygterjalin/halal.png",
    alt: "Halal certification logo",
    caption: "Promoting Halal industry standards.",
  },
  {
    src: "/images/kerjasamaygterjalin/kemenkumham.png",
    alt: "Logo of Kemenkumham",
    caption:
      "Collaboration with Kemenkumham ",
  },
  {
    src: "/images/kerjasamaygterjalin/kominfo.png",
    alt: "Logo of Kominfo",
    caption:
      "Partnership with Kominfo ",
  },
  {
    src: "/images/kerjasamaygterjalin/komnasanak.png",
    alt: "Logo of Komnas Anak",
    caption:
      "Supporting Komnas Anak ",
  },
  {
    src: "/images/kerjasamaygterjalin/komnasham.png",
    alt: "Logo of Komnas HAM",
    caption:
      "Partnership with Komnas HAM",
  },
  {
    src: "/images/kerjasamaygterjalin/majt.png",
    alt: "Logo of MAJT",
    caption: "Cooperation with MAJT",
  },
  {
    src: "/images/kerjasamaygterjalin/perhimpunandokter.png",
    alt: "Logo of Perhimpunan Dokter (Medical Association)",
    caption: "Collaboration with Medical Professionals Association.",
  },
  {
    src: "/images/kerjasamaygterjalin/uin.png",
    alt: "Logo of UIN (State Islamic University)",
    caption: "Partnership with UIN (State Islamic University).",
  },
  {
    src: "/images/kerjasamaygterjalin/ypkpi_mrb.png",
    alt: "Logo of YPKPI-MRB",
    caption: "Collaboration with YPKPI-MRB.",
  },
];

export const KerjasamaSection = () => {
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.jQuery) {
      const $ = window.jQuery;
      const $slider = $(sliderRef.current);

      if ($slider.length > 0) {
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
      }
    }

    return () => {
      if (typeof window !== "undefined" && window.jQuery) {
        const $ = window.jQuery;
        const $slider = $(sliderRef.current);
        if ($slider.hasClass('slick-initialized')) {
          $slider.slick('unslick');
        }
      }
    };
  }, []);

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
            {images.map((img, i) => (
              <a href="" key={i}>
                <div>
                  <Image
                    width={400}
                    height={200}
                    className="kerjasamaterjalin-item-img"
                    src={img.src}
                    alt={img.alt}
                  />
                  <div className="kerjasamaterjalin-item-caption">
                    {img.caption}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
