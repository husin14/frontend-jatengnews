import React from "react";
import Image from "next/image";
import { formatDate } from "@/app/utils/dateFormatter";

const Header = () => {
  const now = new Date();
  const fullDate = formatDate(now.toISOString(), "id");

  return (
    <div className="container">
      <div className="header-row justify-content-between">
        {/* Logo */}
        <div id="logo" className="col-auto ms-auto ms-mb-0 me-mb-0 order-md-2">
          <a href="/" style={{ display: "inline-block", marginTop: "10px" }}>
            <Image
              className="mx-auto"
              src="/images/jatengnews2.png"
              alt="Logo tvku"
              height={51}
              width={120}
              style={{ width: "125px", height: "auto" }}
            />
          </a>
          {/* <a href="" className="standard-logo"></a> */}
          {/* <a href="<?= base_url() ?>" className="retina-logo">
                  <Image
                    className="mx-auto"
                    src="<?= base_url() ?>assets2/images/tvkublue2x.png"
                    alt="Canvas Logo"
                  />
                </a> */}
        </div>
        {/* #logo end */}
        <div className="w-100 d-block d-md-none" />
        <div className="col-12 col-sm-6 col-md-4 justify-content-center justify-content-sm-start d-flex order-md-1 mb-4 mb-sm-0">
          <a
            href="https://facebook.com/semiColonWeb"
            className="social-icon si-small si-rounded si-dark si-mini si-facebook mb-0"
          >
            <i className="icon-facebook" />
            <i className="icon-facebook" />
          </a>
          <a
            href="https://twitter.com/__semicolon"
            className="social-icon si-small si-rounded si-dark si-mini si-twitter mb-0"
          >
            <i className="icon-twitter" />
            <i className="icon-twitter" />
          </a>
          <a
            href="https://instagram.com/semicolonweb"
            className="social-icon si-small si-rounded si-dark si-mini si-instagram mb-0"
          >
            <i className="icon-instagram" />
            <i className="icon-instagram" />
          </a>
        </div>
        <div className="col-12 col-sm-6 col-md-4 order-md-3 mb-4 mb-md-0">
          <ul className="nav align-items-center justify-content-center justify-content-sm-end">
            <li className="nav-item">
              <div
                className="text-uppercase badge bg-dark rounded-pill py-2 px-3 fw-medium"
                suppressHydrationWarning
              >
                {fullDate}
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Header;
