"use client";

import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import TvkuBlue from "../../../../public/beranda_assets/images/tvkublue2x.png";
import TvkuWhite from "../../../../public/beranda_assets/images/tvkuwhite2x.png";
import { ChevronDown } from "lucide-react";

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

  const dictionary = propDictionary || {
    navbar: {
      home: "Beranda",
      news: "Berita",
      program: "Program",
      seputar_udinus: "Seputar Udinus",
      livestream: "Live Streaming",
      lainnya: "Lainnya",
      language: "Bahasa",
      indonesia: "Indonesia",
      english: "Inggris",
    },
    messages: {
      loading: "Memuat...",
      no_news_category: "Tidak ada berita untuk kategori ini.",
      hover_category: "Arahkan kursor ke kategori untuk melihat berita.",
    },
  };

  const handleLanguageChange = (newLang: "id" | "en") => {
    const newPathname = pathname.startsWith(`/${activeLang}`)
      ? pathname.replace(`/${activeLang}`, `/${newLang}`)
      : `/${newLang}${pathname}`;
    router.push(newPathname);
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
              <Link
                href={`/${activeLang}`}
                className="standard-logo"
                data-dark-logo={TvkuWhite}
              >
                <Image
                  src={TvkuBlue}
                  alt="TVKU Logo"
                  width={125}
                  height={100}
                />
              </Link>
              <Link
                href={`/${activeLang}`}
                className="retina-logo"
                data-dark-logo={TvkuWhite}
              >
                <Image
                  src={TvkuBlue}
                  alt="TVKU Logo"
                  width={125}
                  height={100}
                />
              </Link>
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
                  <Link className="menu-link" href={`/${activeLang}`}>
                    <div>{dictionary.navbar.home}</div>
                  </Link>
                </li>
                <li className="menu-item">
                  <Link className="menu-link" href={`/${activeLang}/berita`}>
                    <div>{dictionary.navbar.news}</div>
                  </Link>
                </li>
                <li className="menu-item">
                  <Link className="menu-link" href={`/${activeLang}/program`}>
                    <div>Program</div>
                  </Link>
                </li>
                <li className="menu-item">
                  <Link
                    className="menu-link"
                    href={`/${activeLang}/seputarudinus`}
                  >
                    <div>{dictionary.navbar.seputar_udinus} </div>
                  </Link>
                </li>
                <li className="menu-item">
                  <Link
                    className="menu-link"
                    href={`/${activeLang}/livestream`}
                  >
                    <div>Live Streaming</div>
                  </Link>
                </li>
                <li className="menu-item">
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
                          handleLanguageChange("id");
                        }}
                      >
                        <div>{dictionary.navbar.english}</div>
                      </Link>
                    </li>
                  </ul>
                </li>
                <li className="menu-item">
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
                        href={`/${activeLang}/contact`}
                      >
                        <div>Contact</div>
                      </Link>
                    </li>
                    <li className="menu-item">
                      <Link className="menu-link" href="">
                        <div>Digital Marketing</div>
                      </Link>
                    </li>
                    <li className="menu-item">
                      <Link className="menu-link" href="">
                        <div>Sales</div>
                      </Link>
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
