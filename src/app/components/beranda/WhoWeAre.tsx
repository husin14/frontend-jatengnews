import React from "react";

export const WhoWeAre = () => {
  return (
    <>
      <div className="container clearfix">
        <div className="row align-items-center col-mb-50">
          <div className="col-md-12 col-lg-6 order-lg-2 center">
            <img
              data-animate="fadeInLeft"
              src={PATH_DIR + "whoweare/" + whoweare.gambar}
              alt="Iphone"
            />
          </div>
          <div className="col-md-12 col-lg-6 order-lg-1 text-center text-md-start">
            <div className="heading-block">
              <h2>{whoweare.judul}</h2>
            </div>
            {whoweare.deskripsi}
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
                    <h3>{whoweare[`motto${num}` as keyof typeof whoweare]}</h3>
                    <p>{whoweare[`motto${num}sub` as keyof typeof whoweare]}</p>
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
