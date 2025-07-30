"use client";

import Head from "next/head";

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
            <div className="row g-4">
              {/* Email */}
              <div className="col-md-6">
                <div className="card text-center p-4">
                  <div className="mb-3">
                    <img src="/icons/email.svg" alt="email icon" width={40} />
                  </div>
                  <h5 className="fw-bold">EMAIL</h5>
                  <p className="mb-0">tvku.semarang@tvku.tv</p>
                </div>
              </div>

              {/* Telepon */}
              <div className="col-md-6">
                <div className="card text-center p-4">
                  <div className="mb-3">
                    <img src="/icons/phone.svg" alt="phone icon" width={40} />
                  </div>
                  <h5 className="fw-bold">TELEPON</h5>
                  <p className="mb-0">024 - 3520334</p>
                </div>
              </div>

              {/* Alamat */}
              <div className="col-md-6">
                <div className="card text-center p-4">
                  <div className="mb-3">
                    <img src="/icons/location.svg" alt="location icon" width={40} />
                  </div>
                  <h5 className="fw-bold">ALAMAT</h5>
                  <p className="mb-0">
                    Nakula I 5–11, Semarang Tengah, E Building 2nd Floor,<br />
                    Universitas Dian Nuswantoro Semarang
                  </p>
                </div>
              </div>

              {/* Contact Person */}
              <div className="col-md-6">
                <div className="card text-center p-4">
                  <div className="mb-3">
                    <img src="/icons/whatsapp.svg" alt="whatsapp icon" width={40} />
                  </div>
                  <h5 className="fw-bold">CONTACT PERSON</h5>
                  <p className="mb-0">Bagus – +62 812-2811-5941</p>
                  <p className="mb-0">Fitri – +62 812-2724-1195</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <br />
      <br />
      <br />
    </>
  );
}
