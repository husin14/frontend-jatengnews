import React from "react";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";


type Carousel = {
    judul: string;
    sub_judul: string;
    gambar: string;
};

type SliderSectionProps = {
    carousels: Carousel[];
};

const SliderSection: React.FC<SliderSectionProps> = ({ carousels }) => (
    <>
    <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 767.98px) {
            .slider-16-9-mobile {
                min-height: 56.25vw !important; /* 16:9 Aspect Ratio (9/16 = 0.5625) */
                height: 56.25vw !important;
                margin-bottom: 10px !important;
            }
        }
    `}} />
    <section
        id="slider"
        className="slider-element slider-parallax swiper_wrapper slider-16-9-mobile min-vh-md-100 include-header"
        data-autoplay="3000"
        data-speed="650"
        data-loop="true"
    >
        <div className="slider-inner">
            <div className="swiper-container swiper-parent">
                <div className="swiper-wrapper">
                    {carousels.map((data, idx) => (
                        <div className="swiper-slide dark" key={idx}>
                            {/* <div className="container">
                                <div className="slider-caption slider-caption-center">
                                    <h2 data-animate="fadeInUp">{data.judul ? data.judul : ""}</h2>
                                    <p className="d-none d-sm-block" data-animate="fadeInUp" data-delay="200">
                                        {data.sub_judul ? data.sub_judul : ""}
                                    </p>
                                </div>
                            </div> */}
                            <div
                                className="swiper-slide-bg"
                                style={{
                                    backgroundImage: `url('${data.gambar}')`,
                                }}
                            ></div>
                        </div>
                    ))}
                </div>
                <div className="slider-arrow-left">
                    <ChevronLeft style={{ width: "40px", height: "40px", color: "#fff", position: "absolute", top: "10%" }} />

                </div>
                <div className="slider-arrow-right">
                    <ChevronRight style={{ width: "40px", height: "40px", color: "#fff", position: "absolute", top: "10%" }} />
                </div>
            </div>
            <a
                href="#"
                data-scrollto="#content"
                data-offset="100"
                className="one-page-arrow dark"
            >
                <ChevronDown className="w-10 h-10 infinite animated fadeInDown" style={{ width: "40px", height: "40px", color: "#fff", position: "absolute", top: "10%" }}  />
            </a>
        </div>
    </section>
    </>
);

export default SliderSection;