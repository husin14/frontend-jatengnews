import React from "react";
import { HomeWhoWeAre } from "../../types";
import Image from "next/image";

type WhoWeAreProps = {
  data: HomeWhoWeAre;
};

export const WhoWeAre: React.FC<WhoWeAreProps> = ({ data }) => {
  return (
    <>
      <div className="container clearfix">
        <div className="row align-items-center col-mb-50">
            <div className="col-md-12 col-lg-6 order-lg-2 center">
            <Image
              src={typeof data.gambar === "string" && data.gambar.startsWith("/") ? data.gambar : "/images/TVKU.jpg"}
              data-animate="fadeInLeft"
              alt="Who We Are"
              width={700}
              height={420}
            />
            </div>
          <div className="col-md-12 col-lg-6 order-lg-1 text-center text-md-start">
            <div className="heading-block">
              <h2>{data.judul || "Who We Are"}</h2>
            </div>
            {data.deskripsi}
          </div>
        </div>
      </div>
      <div className="section my-0">
        <div className="container">
          <div className="row mt-4 col-mb-50">
            {[1, 2, 3].map((num) => (
              <div className="col-md-12 col-lg-4" key={num}>
                <div className="feature-box fbox-plain">
                  <div className="fbox-icon">
                    <a href="#">
                      <i className="i-alt">{num}.</i>
                    </a>
                  </div>
                  <div className="fbox-content">
                    <h3>{data[`motto${num}` as keyof typeof data]}</h3>
                    <p>{data[`motto${num}sub` as keyof typeof data]}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
