"use client"
import React, { useEffect, useRef } from "react";
import { OurProgram } from "../../types";
import Image from "next/image";

type OurProgramSectionProps = {
  list_program: OurProgram[];
};

export const OurProgramSection: React.FC<OurProgramSectionProps> = ({
  list_program,
}) => {
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.jQuery && list_program.length > 0) {
      const $ = window.jQuery;
      const $slider = $(sliderRef.current);

      if ($slider.length > 0) {
        // Destroy existing if any
        if ($slider.hasClass('slick-initialized')) {
          $slider.slick('unslick');
        }

        $slider.slick({
          infinite: true,
          slidesToScroll: 1,
          variableWidth: false,
          autoplay: true,
          autoplaySpeed: 5000,
          slidesToShow: 4,
          prevArrow: "<button class='slick-prev slick-arrow' type='button'><i class='icon-angle-left'></i></button>",
          nextArrow: "<button class='slick-next slick-arrow' type='button'><i class='icon-angle-right'></i></button>",
          responsive: [{
            breakpoint: 576,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              prevArrow: "",
              nextArrow: "",
            }
          },
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 1,
              prevArrow: "",
              nextArrow: "",
            }
          },
          {
            breakpoint: 992,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 1,
              prevArrow: "",
              nextArrow: "",
            }
          },
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
  }, [list_program]);

  return (
    <div
      className="container-fluid clearfix"
      style={{
        marginTop: 80,
        backgroundColor: "#f1f2f3",
        paddingTop: 40,
        paddingBottom: 40,
      }}
    >
      <div className="heading-block center">
        <h2>Our Programs</h2>
      </div>
      <div className="container">
        <div className="row">
          <div ref={sliderRef} className="our-program-beranda-slick">
            {list_program.map((item) => (
              <a href="" key={item.id} onClick={(e) => e.preventDefault()}>
                <div
                  style={{
                    backgroundImage: `url('${item.thumbnail}')`,
                  }}
                >
                  <img style={{ visibility: "hidden" }} src={item.thumbnail}></img>
                </div>
              </a>
            ))}
          </div>
        </div>
        <div className="myslick-divider"></div>
      </div>
      <div className="container my-3 mt-0">
        <div className="col-md-12 text-center">
          <a
            href=""
            className="button button-border button-dark button-rounded button-large ms-0 topmargin-sm"
          >
            More Programs
          </a>
        </div>
      </div>
    </div>
  );
};


