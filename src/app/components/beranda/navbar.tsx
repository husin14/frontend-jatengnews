"use client";

import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import TvkuBlue from "../../../../public/beranda_assets/images/tvkublue2x.png";
import TvkuWhite from "../../../../public/beranda_assets/images/tvkuwhite2x.png";
import { ChevronDown } from "lucide-react";
import enDictionary from "../../../../public/dictionaries/en.json";
import idDictionary from "../../../../public/dictionaries/id.json";

declare global {
  interface Window {
    jQuery: any;
  }
}

interface NavbarProps {
  lang?: "id" | "en";
  dictionary?: any; // eslint-disable-line
}

export default function Navbar({
  lang: propLang,
  dictionary: propDictionary,
}: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const activeLang = propLang || (pathname.startsWith("/en") ? "en" : "id");

  const dictionary =
    propDictionary || (activeLang === "en" ? enDictionary : idDictionary);

  const langPrefix = activeLang === "id" ? "" : `/${activeLang}`;

  useEffect(() => {
    const handleLinkClick = () => {
      if (typeof window !== "undefined" && window.jQuery) {
        const $ = window.jQuery;
        $("body").removeClass("primary-menu-open");
        $(".primary-menu:not(.mobile-menu-off-canvas) .menu-container").hide();
        $(".primary-menu.mobile-menu-off-canvas .menu-container").removeClass("d-block");
      }
    };

    // Attach listener to all menu links
    const menuLinks = document.querySelectorAll('.menu-link');
    menuLinks.forEach(link => {
      link.addEventListener('click', handleLinkClick);
    });

    // Cleanup
    return () => {
      menuLinks.forEach(link => {
        link.removeEventListener('click', handleLinkClick);
      });
    };
  }, []);

  useEffect(() => {
    // Close mobile menu on route change (already handled by link click for most cases, but good for direct router.push)
    if (typeof window !== "undefined" && window.jQuery) {
      const $ = window.jQuery;
      $("body").removeClass("primary-menu-open");
      $(".primary-menu:not(.mobile-menu-off-canvas) .menu-container").hide();
      $(".primary-menu.mobile-menu-off-canvas .menu-container").removeClass("d-block");
    }
  }, [pathname]);

  const handleLanguageChange = (newLang: "id" | "en") => {
    const newPathname = pathname.startsWith(`/${activeLang}`)
      ? pathname.replace(`/${activeLang}`, newLang === "id" ? "" : `/${newLang}`)
      : newLang === "id" ? pathname : `/${newLang}${pathname}`;
    router.push(newPathname || "/");
  };

  return (
    <header
      id="header"
      className="full-header transparent-header"
      data-sticky-class="not-dark"
    >
      <div id="header-wrap">
        <div className="container">
          <div className="header-row">
            <div id="logo">
              <a href="/" className="standard-logo" data-dark-logo="/images/tvkuwhite2x.png"><img src="/images/tvkublue2x.png" alt="TVKU Logo"></img></a>
              <a href="/" className="retina-logo" data-dark-logo="/images/tvkuwhite2x.png"><img src="/images/tvkublue2x.png" alt="TVKU Logo"></img></a>
              {/* <a
                href={`${langPrefix}/`}
                className="standard-logo"
                data-dark-logo={TvkuWhite}
              >
                <Image
                  src={TvkuBlue}
                  alt="TVKU Logo"
                  width={125}
                  height={100}
                />
              </a>
              <a
                href={`${langPrefix}/`}
                className="retina-logo"
                data-dark-logo={TvkuWhite}
              >
                <Image
                  src={TvkuBlue}
                  alt="TVKU Logo"
                  width={125}
                  height={100}
                />
              </a> */}
            </div>

            <div id="primary-menu-trigger">
              <svg className="svg-trigger" viewBox="0 0 100 100">
                <path d="m 30,33 h 40 c 3.722839,0 7.5,3.126468 7.5,8.578427 0,5.451959 -2.727029,8.421573 -7.5,8.421573 h -20"></path>
                <path d="m 30,50 h 40"></path>
                <path d="m 70,67 h -40 c 0,0 -7.5,-0.802118 -7.5,-8.365747 0,-7.563629 7.5,-8.634253 7.5,-8.634253 h 20"></path>
              </svg>
            </div>

            <nav className="primary-menu">
              <ul className="menu-container">
                <li className="menu-item">
                  <Link className="menu-link" href={`${langPrefix}/`}>
                    <div>{dictionary.navbar.home}</div>
                  </Link>
                </li>
                <li className="menu-item">
                  <a className="menu-link" href={`${langPrefix}/berita`}>
                    <div>{dictionary.navbar.news}</div>
                  </a>
                </li>
                <li className="menu-item">
                  <Link className="menu-link" href={`${langPrefix}/program`}>
                    <div>Program</div>
                  </Link>
                </li>
                <li className="menu-item">
                  <Link
                    className="menu-link"
                    href={`${langPrefix}/seputarudinus`}
                  >
                    <div>{dictionary.navbar.seputar_udinus} </div>
                  </Link>
                </li>
                <li className="menu-item">
                  <Link
                    className="menu-link"
                    href={`${langPrefix}/livestream`}
                  >
                    <div>Live Streaming</div>
                  </Link>
                </li>
                {/* <li className="menu-item">
                  <div className="menu-link" style={{ cursor: "pointer" }}>
                    <div>
                      {dictionary.navbar.language}
                      <ChevronDown />
                    </div>
                  </div>
                  <ul className="sub-menu-container">
                    <li className="menu-item">
                      <Link
                        className="menu-link"
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleLanguageChange("id");
                        }}
                      >
                        <div>{dictionary.navbar.indonesia}</div>
                      </Link>
                    </li>
                    <li className="menu-item">
                      <Link
                        className="menu-link"
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleLanguageChange("en");
                        }}
                      >
                        <div>{dictionary.navbar.english}</div>
                      </Link>
                    </li>
                  </ul>
                </li> */}
                <li className="menu-item menu-item-lainnya">
                  <Link className="menu-link" href="#lainnya">
                    <div>
                      Lainnya
                      <ChevronDown id="menu-lainnya" />
                      {/*<i id="menu-lainnya" className="icon-angle-down"></i>*/}
                    </div>
                  </Link>
                  <ul className="sub-menu-container">
                    <li className="menu-item">
                      <Link
                        className="menu-link"
                        href={`${langPrefix}/contact`}
                      >
                        <div>Contact</div>
                      </Link>
                    </li>
                    <li className="menu-item">
                      <a
                        className="menu-link"
                        href="http://tvku.tv/dma/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div>Digital Marketing</div>
                      </a>
                    </li>
                    <li className="menu-item">
                      <a
                        className="menu-link"
                        href="http://tvku.tv/marketing/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div>Sales</div>
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
      <div className="header-wrap-clone"></div>
    </header>
  );
}
