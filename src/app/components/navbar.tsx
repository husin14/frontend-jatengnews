"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import apiClient from "../utils/apiClient";
import { kategori as KategoriType, berita as BeritaType } from "../types";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { formatDate } from "../utils/dateFormatter";

interface NavbarProps {
  lang?: "id" | "en";
  dictionary?: any; // eslint-disable-line
}

declare global {
  interface Window {
    jQuery: any;
  }
}

const Navbar = ({
  lang: propLang,
  dictionary: propDictionary,
}: NavbarProps) => {
  const pathname = usePathname();

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const menuLink = target.closest(".menu-link");

      if (menuLink) {
        if (typeof window !== "undefined" && window.innerWidth < 992) {
          const menuItem = menuLink.closest(".menu-item");
          if (
            menuItem &&
            (menuItem.querySelector(".sub-menu-container") ||
              menuItem.querySelector(".mega-menu-content"))
          ) {
            // If it's a mobile view and has sub-menu, don't close the menu
            return;
          }
        }

        if (typeof window !== "undefined" && window.jQuery && window.innerWidth < 992) {
          const $ = window.jQuery;
          $("body").removeClass("primary-menu-open");
          $(".primary-menu:not(.mobile-menu-off-canvas) .menu-container").hide();
          $(".primary-menu.mobile-menu-off-canvas .menu-container").removeClass(
            "d-block"
          );
        }
      }
    };

    document.addEventListener("click", handleGlobalClick);

    // Cleanup
    return () => {
      document.removeEventListener("click", handleGlobalClick);
    };
  }, []);

  useEffect(() => {
    // Close mobile menu on route change
    if (typeof window !== "undefined" && window.jQuery && window.innerWidth < 992) {
      const $ = window.jQuery;
      $("body").removeClass("primary-menu-open");
      $(".primary-menu:not(.mobile-menu-off-canvas) .menu-container").hide();
      $(".primary-menu.mobile-menu-off-canvas .menu-container").removeClass("d-block");
    }
  }, [pathname]);

  const activeLang = propLang || (pathname.startsWith("/en") ? "en" : "id");

  const [categories, setCategories] = useState<KategoriType[]>([]);
  const [megaMenuNews, setMegaMenuNews] = useState<BeritaType[]>([]);
  const [activeMegaMenuCategory, setActiveMegaMenuCategory] = useState<
    number | null
  >(null);
  const [loadingMegaMenuNews, setLoadingMegaMenuNews] = useState(false);

  const sortedCategories = useMemo(() => {
    const moveToFront = ["pendidikan", "kesehatan"];
    const moveToBack = ["pemilu", "liputan khusus"];

    const frontItems: KategoriType[] = [];
    const backItems: KategoriType[] = [];
    const middleItems: KategoriType[] = [];

    categories.forEach((cat) => {
      const name = cat.nama.toLowerCase();
      if (moveToFront.includes(name)) {
        frontItems.push(cat);
      } else if (moveToBack.includes(name)) {
        backItems.push(cat);
      } else {
        middleItems.push(cat);
      }
    });

    return [...frontItems, ...middleItems, ...backItems];
  }, [categories]);

  const dictionary = propDictionary || {
    Navbar: {
      home: "Beranda",
      news: "Berita",
      language: "Bahasa",
      indonesia: "Indonesia",
      english: "Inggris",
    },
    Messages: {
      loading: "Memuat...",
      no_news_category: "Tidak ada berita untuk kategori ini.",
      hover_category: "Arahkan kursor ke kategori untuk melihat berita.",
    },
  };

  const fetchNewsForMegaMenu = useCallback(
    async (categoryId: number) => {
      setLoadingMegaMenuNews(true);
      try {
        const url =
          activeLang === "en"
            ? `/kategori-translations?language_code=en&kategori_id=${categoryId}`
            : `/berita-public?id_kategori=${categoryId}`;
        const res = await apiClient.get(url);
        setMegaMenuNews(res.data.data);
      } catch (error) {
        console.error(`Error fetching news for category ${categoryId}:`, error);
        setMegaMenuNews([]);
      } finally {
        setLoadingMegaMenuNews(false);
      }
    },
    [activeLang]
  );

  useEffect(() => {
    let idleId: number;
    let timeoutId: NodeJS.Timeout;

    const getKategori = async () => {
      try {
        const url =
          activeLang === "en"
            ? `/kategori-translations-all?language_code=en`
            : `/kategori`;
        const resKategori = await apiClient.get(url);
        const cats = resKategori.data.data;
        setCategories(cats);
        
        // Strategy: Background fetch news when browser is idle or after a safety timeout
        const startBackgroundFetch = () => {
          const pendidikanCat = cats.find(
            (cat: any) =>
              cat.nama.toLowerCase() === "pendidikan" ||
              cat.id_kategori === 27
          );
          if (pendidikanCat) {
            setActiveMegaMenuCategory(pendidikanCat.id_kategori);
            fetchNewsForMegaMenu(pendidikanCat.id_kategori);
          }
        };

        if (typeof window !== "undefined") {
          if ("requestIdleCallback" in window) {
            // Use requestIdleCallback to fetch when browser is not busy
            idleId = (window as any).requestIdleCallback(startBackgroundFetch, { timeout: 3000 });
          } else {
            // Fallback for older browsers (like old Safari)
            timeoutId = setTimeout(startBackgroundFetch, 2000);
          }
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    getKategori();

    return () => {
      if (idleId && typeof window !== "undefined" && "cancelIdleCallback" in window) {
        (window as any).cancelIdleCallback(idleId);
      }
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [activeLang, fetchNewsForMegaMenu]);

  const handleMegaMenuCategoryHover = (categoryId: number) => {
    setActiveMegaMenuCategory(categoryId);
    fetchNewsForMegaMenu(categoryId);
  };

  const handleMegaMenuCategoryLeave = () => {
    setActiveMegaMenuCategory(null);
    setMegaMenuNews([]);
  };

  const langPrefix = activeLang === "id" ? "" : `/${activeLang}`;

  const handleLanguageChange = (newLang: "id" | "en") => {
    const newPrefix = newLang === "id" ? "" : `/${newLang}`;
    if (pathname.startsWith(`/${activeLang}/berita`)) {
      const newPathname = pathname.replace(`/${activeLang}/`, `${newPrefix}/`);
      window.location.href = newPathname;
    } else {
      window.location.href = `${newPrefix}/berita`;
    }
  };

  return (
    <>
      <div id="header-wrap" className="border-top border-f5 ">
        <div className="container">
          <div className="header-row justify-content-between flex-row-reverse flex-lg-row">
            <div className="header-misc">
              {/* Top Search */}
              <div id="top-search" className="header-misc-icon">
                <a href="#" id="top-search-trigger">
                  <i className="icon-line-search" />
                  <i className="icon-line-cross" />
                </a>
              </div>
            </div>
            <div id="primary-menu-trigger">
              <svg className="svg-trigger" viewBox="0 0 100 100">
                <path d="m 30,33 h 40 c 3.722839,0 7.5,3.126468 7.5,8.578427 0,5.451959 -2.727029,8.421573 -7.5,8.421573 h -20" />
                <path d="m 30,50 h 40" />
                <path d="m 70,67 h -40 c 0,0 -7.5,-0.802118 -7.5,-8.365747 0,-7.563629 7.5,-8.634253 7.5,-8.634253 h 20" />
              </svg>
            </div>
            {/* Primary Navigation */}
            <nav className="primary-menu style-6">
              <ul className="menu-container">
                <li className="menu-item menu-color-home">
                  <a className="menu-link" href={`${langPrefix}/berita`}>
                    <div>Beranda</div>
                  </a>
                </li>
                {sortedCategories.slice(0, 5).map((item, idx) => (
                  <li key={idx} className="menu-item menu-color-home">
                    <a
                      className="menu-link"
                      href={`${langPrefix}/berita/${item.id_kategori}`}
                    >
                      <div>{item.nama}</div>
                    </a>
                  </li>
                ))}
                <li className="menu-item mega-menu menu-item-lainnya"
                    onMouseEnter={() => {
                      const pendidikanCat = categories.find(
                        (cat) =>
                          cat.nama.toLowerCase() === "pendidikan" ||
                          cat.id_kategori === 27
                      );
                      if (pendidikanCat) {
                        setActiveMegaMenuCategory(pendidikanCat.id_kategori);
                        fetchNewsForMegaMenu(pendidikanCat.id_kategori);
                      }
                    }}
                  >
                    <a className="menu-link" href="#">
                      <div className="dropdown-toggle">Lainnya</div>
                    </a>
                  <div className="mega-menu-content mega-menu-style-2 border-top-0">
                    <div className="container">
                      <div className="row">
                        {/* Mega Menu - Category Links */}
                        <ul className="sub-menu-container mega-menu-column col-lg-4">
                          <li className="menu-item">
                            <div
                              className="nav nav-sm tab-hover nav-pills"
                              id="v-pills-tab"
                              role="tablist"
                              aria-orientation="vertical"
                              style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(2, 1fr)",
                                gap: "5px 10px",
                              }}
                            >
                              {sortedCategories.slice(5, 16).map((item) => (
                                <a
                                  key={item.id_kategori}
                                  className={`nav-link bg-color-home ${
                                    activeMegaMenuCategory === item.id_kategori
                                      ? "active"
                                      : ""
                                  }`}
                                  onMouseEnter={() =>
                                    handleMegaMenuCategoryHover(
                                      item.id_kategori
                                    )
                                  }
                                  href={`${langPrefix}/berita/${item.id_kategori}`}
                                >
                                  {item.nama}
                                </a>
                              ))}
                            </div>
                          </li>
                        </ul>
                        {/* Mega Menu - News Display */}
                        <ul className="sub-menu-container mega-menu-column col-lg-8">
                          <li className="menu-item">
                            <div
                              className="tab-content"
                              id="v-pills-tabContent"
                            >
                              {loadingMegaMenuNews ? (
                                <div className="text-center p-4">
                                  Loading news...
                                </div>
                              ) : megaMenuNews.length > 0 ? (
                                <div className="row justify-content-around posts-md">
                                  {megaMenuNews.slice(0, 3).map((item) => (
                                    <div className="col-4" key={item.id}>
                                      <div className="entry">
                                        <div className="entry-image mb-3">
                                          <a
                                            href={`${langPrefix}/berita/show/${item.slug || item.id}`}
                                          >
                                            <Image
                                              src={item.cover}
                                              alt={item.judul}
                                              width={300}
                                              height={200}
                                              objectFit="fill"
                                            />
                                          </a>
                                          <div className="entry-categories">
                                            <a
                                              href={`${langPrefix}/berita/${item.kategori?.id_kategori}`}
                                              className="bg-lifestyle"
                                            >
                                              {item.kategori?.nama}
                                            </a>
                                          </div>
                                        </div>
                                        <div className="entry-title title-xs nott">
                                          <h3 className="mb-1">
                                            <a
                                              href={`${langPrefix}/berita/show/${item.slug || item.id}`}
                                            >
                                              {item.judul}
                                            </a>
                                          </h3>
                                        </div>
                                        <div className="entry-meta">
                                          <ul>
                                            <li>
                                              <i className="icon-time"></i>
                                              {formatDate(item.waktu || item.waktu_publish, activeLang)}
                                            </li>
                                            <li>
                                              <i className="icon-eye"></i>
                                              {item.views || Math.floor(Math.random() * (999 - 200 + 1) + 200)}
                                            </li>
                                          </ul>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-center p-4">
                                  {activeMegaMenuCategory
                                    ? "No news found for this category."
                                    : "Hover over a category to see news."}
                                </div>
                              )}
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </li>

                {/* <li className="menu-item">
                  <div className="menu-link" style={{ cursor: "pointer" }}>
                    <div>
                      {dictionary.navbar.language}
                      <i className="icon-angle-down"></i>
                    </div>
                  </div>
                  <ul className="sub-menu-container">
                    <li className="menu-item">
                      <a
                        className="menu-link"
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleLanguageChange("id");
                        }}
                      >
                        <div>{dictionary.navbar.indonesia}</div>
                      </a>
                    </li>
                    <li className="menu-item">
                      <a
                        className="menu-link"
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleLanguageChange("en");
                        }}
                      >
                        <div>{dictionary.navbar.english}</div>
                      </a>
                    </li>
                  </ul>
                </li> */}

              </ul>
            </nav>
            {/* #primary-menu end */}
            <form
              className="top-search-form"
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const query = formData.get("search") as string;
                if (query && query.trim()) {
                  const langPrefix = activeLang === "id" ? "" : `/${activeLang}`;
                  window.location.href = `${langPrefix}/berita/search?search=${encodeURIComponent(query.trim())}`;
                  if (typeof window !== "undefined" && window.jQuery) {
                    window.jQuery("body").removeClass("top-search-open");
                  }
                }
              }}
            >
              <input
                type="text"
                name="search"
                className="form-control"
                defaultValue=""
                placeholder={activeLang === "en" ? "Type & Hit Enter.." : "Ketik & Tekan Enter.."}
                autoComplete="off"
              />
            </form>
          </div>
        </div>
      </div>
      <div className="header-wrap-clone"></div>
    </>
  );
};

export default Navbar;
