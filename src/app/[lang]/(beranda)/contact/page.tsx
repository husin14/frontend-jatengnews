"use client";

import Head from "next/head";
import Image from "next/image";

export default function ContactPage() {
  return (
    <>
      <Head>
        <title>Contact - TVKU Semarang</title>
      </Head>

      {/* Section Title */}
      <section id="page-title">
        <div className="container clearfix">
          <h1>Contact</h1>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="#">Home</a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Contact
            </li>
          </ol>
        </div>
      </section>

      {/* Section Content */}
      <section id="content">
        <div className="content-wrap">
          <div className="container clearfix">

            <div className="row col-mb-50">
              <div className="col-lg-6">
                <div className="feature-box fbox-center fbox-bg fbox-plain">
                  <div className="fbox-icon">
                    <a href="#">
                      <i className="icon-email3 contact-icon" />
                    </a>
                  </div>
                  <div className="fbox-content">
                    <h3>
                      Email
                      <span className="subtitle">
                        tvku.semarang@tvku.tv
                      </span>
                    </h3>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="feature-box fbox-center fbox-bg fbox-plain">
                  <div className="fbox-icon">
                    <a href="#">
                      <i className="icon-phone3 contact-icon" />
                    </a>
                  </div>
                  <div className="fbox-content">
                    <h3>
                      Telepon
                      <span className="subtitle">
                        024 - 3520334
                      </span>
                    </h3>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="feature-box fbox-center fbox-bg fbox-plain">
                  <div className="fbox-icon">
                    <a href="#">
                      <i className="icon-map contact-icon" />
                    </a>
                  </div>
                  <div className="fbox-content">
                    <h3>
                      Alamat
                      <span className="subtitle">
                        Nakula I 5-11, Semarang Tengah, E Building 2nd Floor, Universitas Dian Nuswantoro Semarang
                      </span>
                    </h3>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="feature-box fbox-center fbox-bg fbox-plain">
                  <div className="fbox-icon">
                    <a href="#">
                      <i className="icon-whatsapp contact-icon" />
                    </a>
                  </div>
                  <div className="fbox-content">
                    <h3>
                      Contact Person
                      <span className="subtitle">
                        Bagus - +62 812-2811-5941
                        <br />
                        Fitri - +62 812-2724-1195
                      </span>
                    </h3>
                  </div>
                </div>
              </div>
            </div>
            {/* Contact Info End */}

          </div>
        </div>
      </section>

      <br />
      <br />
      <br />
    </>
  );
}
