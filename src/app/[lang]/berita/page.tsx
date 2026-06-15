import React from "react";
import Link from "next/link";
import Image from "next/image";
import apiClient from "@/app/utils/apiClient";
import { convert } from "html-to-text";
import { berita, kategori } from "@/app/types";
import Sidebar from "@/app/components/sideBar";
import Carousel from "@/app/components/carousel";
import { formatDate } from "@/app/utils/dateFormatter";
import { getDictionary, Locale } from "@/app/dictionaries";

export default async function BeritaPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: langParam } = await params;
  const lang = (langParam === "id" || langParam === "en" ? langParam : "id") as Locale;

  let kategoriData: kategori[] = [];
  let beritaTerbaru: berita[] = [];
  let featureData: berita[] = [];
  let dictionary: any = null;
  let error: string | null = null;

  try {
    const beritaUrl =
      lang === "en" ? `/berita-translations?language_code=en` : `/berita`;

    const featureUrl =
      lang === "en"
        ? `/berita-translations?language_code=en&id_kategori=19`
        : `/berita?id_kategori=19`;

    const [beritaResponse, featureResponse, kategoriResponse, dictionaryResponse] =
      await Promise.all([
        apiClient.get(beritaUrl),
        apiClient.get(featureUrl),
        apiClient.get(`/kategori`),
        getDictionary(lang),
      ]);

    beritaTerbaru = beritaResponse.data.data.map((item: berita) => ({
      ...item,
      deskripsi: convert(item.deskripsi, {
        selectors: [{ selector: "img", format: "skip" }],
      }),
    }));

    featureData = featureResponse.data.data.map((item: berita) => ({
      ...item,
      deskripsi: convert(item.deskripsi, {
        selectors: [{ selector: "img", format: "skip" }],
      }),
    }));

    kategoriData = kategoriResponse.data.data;
    dictionary = dictionaryResponse;
  } catch (err) {
    console.error("Failed to fetch data:", err);
    error = "Gagal memuat data. Silakan coba lagi nanti.";
  }

  if (error) {
    return <div className="text-center p-5 text-red-500">{error}</div>;
  }

  if (!dictionary) {
    return <div className="text-center p-5">Loading...</div>;
  }

  if (!beritaTerbaru || beritaTerbaru.length === 0) {
    return (
      <div className="text-center p-5">
        {dictionary?.berita_page?.no_news || "Tidak ada berita"}
      </div>
    );
  }

  const data = beritaTerbaru[0];
  const langPrefix = lang === "id" ? "" : `/${lang}`;

  return (
    <>
      <div className="row col-mb-50 mb-0">
        <div className="col-lg-8 berita-main-column">
          <div className="posts-md">
            {beritaTerbaru.length > 0 && (
              <div className="entry">
                <div className="entry-image">
                  <Link
                    href={`${langPrefix}/berita/show/${beritaTerbaru[0].id
                      }`}
                  >
                    <Image
                      src={
                        beritaTerbaru[0].cover ||
                        `https://apidev.tvku.tv/storage/${beritaTerbaru[0].cover}`
                      }
                      alt={beritaTerbaru[0].judul}
                      width={600}
                      height={300}
                      priority
                    />
                  </Link>
                </div>
                <div className="entry-title title-sm">
                  <h3 style={{ marginBottom: '0px' }}>
                    <Link
                      href={`${langPrefix}/berita/show/${beritaTerbaru[0].id
                        }`}
                    >
                      {beritaTerbaru[0].judul}
                    </Link>
                  </h3>
                </div>
                <div className="entry-meta">
                  <ul>
                    <li style={{ color: "black" }}>
                      <i className="icon-calendar3" /> {formatDate(beritaTerbaru[0].waktu, lang)}
                    </li>
                    <li style={{ color: "black" }}>
                      <i className="icon-eye" /> {Math.floor(Math.random() * (999 - 200 + 1) + 200)}
                    </li>
                  </ul>
                </div>

                <div className="entry-content" style={{ marginTop: '0px' }}>
                  <p className="line-clamp-2 mb-0">
                    {beritaTerbaru[0].deskripsi}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="col-lg-4 berita-sidebar-column">
          <div className="posts-sm row col-mb-30">
            {beritaTerbaru.slice(1, 6).map((item) => (
              <div key={item.id} className="entry col-12 berita-sidebar-entry">
                <div className="grid-inner row g-0">
                  <div className="col-auto">
                    <div className="entry-image">
                      <Link href={`${langPrefix}/berita/show/${item.id}`}>
                        <Image
                          src={
                            item.cover ||
                            `https://apidev.tvku.tv/storage/${item.cover}`
                          }
                          alt={item.judul}
                          width={100}
                          height={100}
                        />
                      </Link>
                    </div>
                  </div>
                  <div className="col ps-3">
                    <div className="entry-title">
                      <h4 className="berita-sidebar-title">
                        <Link
                          href={`${langPrefix}/berita/show/${item.id}`}
                        >
                          {item.judul}
                        </Link>
                      </h4>
                    </div>

                    <div className="entry-meta">
                      <ul>
                        <li style={{ color: "black" }}>
                          <i className="icon-calendar3" /> {formatDate(item.waktu, lang)}
                        </li>
                        <li style={{ color: "black" }}>
                          <i className="icon-eye" /> {Math.floor(Math.random() * (999 - 200 + 1) + 200)}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* latest news */}
      <div className="row clearfix">
        <div className="col-lg-8">
          <nav
            className="navbar navbar-expand-lg navbar-light p-0"
            style={{ justifyContent: "flex-start" }}
          >
            <h4 className="mb-0 pe-2 ls1 text-uppercase fw-bold">
              {dictionary.berita_page.latest_news}
            </h4>
            | <Link href={`${langPrefix}/berita/beritaterbaru`}>more..</Link>
            <button
              className="navbar-toggler"
              style={{ visibility: "hidden" }}
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarToggler1"
              aria-controls="navbarToggler1"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <i className="icon-line-menu"></i>
            </button>
          </nav>
          <div className="line line-xs line-dark"></div>

          <div className="tab-content" id="nav-tabContent">
            <div
              className="tab-pane fade show active"
              id="nav-outdoor"
              role="tabpanel"
              aria-labelledby="nav-outdoor-tab"
            >
              <div className="row col-mb-30 mb-0">
                <div className="col-lg-6 beritaterbaru">
                  <div className="posts-md">
                    <div className="entry">
                      <div className="entry-image">
                        <Link href={`${langPrefix}/berita/show/${data.id}`}>
                          <Image
                            src={data.cover}
                            alt={data.judul}
                            width={400}
                            height={200}
                            style={{ width: "416px", height: "233px" }}
                          />
                        </Link>
                        <div className="entry-categories">
                          <Link
                            href={`${langPrefix}/berita/show/${data.id}`}
                            className="bg-travel"
                          >
                            {data.kategori?.nama || "Uncategorized"}
                          </Link>
                        </div>
                      </div>
                      <div className="entry-title nott">
                        <h3 className="mb-2">
                          <Link href={`${langPrefix}/berita/show/${data.id}`}>{data.judul}</Link>
                        </h3>
                      </div>
                      <div className="entry-meta">
                        <ul>
                          <li style={{ color: "black" }}>
                            <i className="icon-calendar3"></i>
                            {formatDate(data.waktu, lang)}
                          </li>
                          <li style={{ color: "black" }}>
                            <i className="icon-eye"></i>
                            {Math.floor(Math.random() * (999 - 200 + 1) + 200)}
                          </li>
                        </ul>
                      </div>
                      <div className="entry-content clearfix line-clamp-1">
                        <p className="line-clamp-2">{data.deskripsi}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="posts-sm row col-mb-30">
                    {beritaTerbaru.slice(1, 5).map((item) => (
                      <div key={item.id} className="entry col-12">
                        <div className="grid-inner row align-items-start g-0">
                          <div className="col-auto">
                            <div className="entry-image">
                              <Link href={`${langPrefix}/berita/show/${item.id}`}>
                                <Image
                                  src={item.cover}
                                  alt={item.judul}
                                  width={400}
                                  height={200}
                                />
                              </Link>
                            </div>
                          </div>
                          <div className="col ps-3">
                            <div className="entry-title">
                              <h4 style={{ marginTop: '-5px' }}>
                                <Link
                                  href={`${langPrefix}/berita/show/${item.id}`}
                                >
                                  {item.judul}
                                </Link>
                              </h4>
                            </div>
                            <div className="entry-meta">
                              <ul>
                                <li style={{ color: "black" }}>
                                  <i className="icon-calendar3"></i>
                                  {formatDate(item.waktu, lang)}
                                </li>
                                <li style={{ color: "black" }}>
                                  <i className="icon-eye"></i>
                                  {Math.floor(Math.random() * (999 - 200 + 1) + 200)}
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="row justify-content-center col-mb-50 mb-0">
                {beritaTerbaru.slice(5, 7).map((item) => (
                    <div key={item.id} className="col-md-6 mt-4 beritaterbaru2 d-flex justify-content-center">
                      <div className="posts-md">
                        <div className="entry">
                          <div className="entry-image">
                            <Link href={`${langPrefix}/berita/show/${item.id}`}>
                              <Image
                                src={item.cover}
                                alt={item.judul}
                                width={400}
                                height={200}
                                style={{ width: "416px", height: "233px" }}
                              />
                            </Link>
                            <div className="entry-categories">
                              <Link
                                href={`${langPrefix}/berita/show/${item.id}`}
                                className="bg-lifestyle"
                              >
                                {item.kategori?.nama || "Uncategorized"}
                              </Link>
                            </div>
                          </div>
                          <div className="entry-title title-sm nott">
                            <h3 className="mb-2">
                              <Link href={`${langPrefix}/berita/show/${item.id}`}>
                                {item.judul}
                              </Link>
                            </h3>
                          </div>
                          <div className="entry-meta">
                            <ul>
                              <li style={{ color: "black" }}>
                                <i className="icon-calendar3"></i>
                                {formatDate(item.waktu, lang)}
                              </li>
                              <li style={{ color: "black" }}>
                                <i className="icon-eye"></i>
                                {Math.floor(Math.random() * (999 - 200 + 1) + 200)}
                              </li>
                            </ul>
                          </div>
                          <div className="entry-content clearfix">
                            <p className="line-clamp-2 mb-0">
                              {item.deskripsi}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="posts-sm row col-mb-30">
                  {beritaTerbaru.slice(7, 11).map((item) => (
                    <div key={item.id} className="entry col-md-6">
                      <div className="grid-inner row align-items-start no-gutter">
                        <div className="col-auto">
                          <div className="entry-image">
                            <Link href={`${langPrefix}/berita/show/${item.id}`}>
                              <Image
                                src={item.cover}
                                alt={item.judul}
                                width={400}
                                height={200}
                              />
                            </Link>
                          </div>
                        </div>
                        <div className="col ps-3">
                          <div className="entry-title">
                            <h4 className="fw-medium">
                              <Link href={`${langPrefix}/berita/show/${item.id}`}>
                                {item.judul}
                              </Link>
                            </h4>
                          </div>
                          <div className="entry-meta">
                            <ul>
                              <li style={{ color: "black" }}>
                                <i className="icon-calendar3"></i>
                                {formatDate(item.waktu, lang)}
                              </li>
                              <li style={{ color: "black" }}>
                                <i className="icon-eye"></i>
                                {Math.floor(Math.random() * (999 - 200 + 1) + 200)}
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        <Sidebar />
      </div>

      <Carousel />

      <div className="container clearfix">
        <div className="row clearfix">
          <div className="col-lg-8">
            <div className="mt-0">
              <h4 className="mb-2 ls1 text-uppercase fw-bold">Feature</h4>
              <div className="line line-xs line-sports"></div>

              <div className="row col-mb-50 mb-0">
                {featureData.map((item) => (
                  <div key={item.id} className="posts-md">
                    <div className="entry row mb-5">
                      <div className="col-md-6">
                        <div className="entry-image">
                          <Link href={`${langPrefix}/berita/show/${item.id}`}>
                            <Image
                              src={item.cover}
                              alt={item.judul}
                              width={600}
                              height={300}
                              className="rounded"
                            />
                          </Link>
                        </div>
                      </div>
                      <div className="col-md-6 mt-3 mt-md-0">
                        <div className="entry-title title-sm nott">
                          <h3>
                            <Link href={`${langPrefix}/berita/show/${item.id}`}>
                              {item.judul}
                            </Link>
                          </h3>
                        </div>
                        <div className="entry-meta">
                          <ul>
                            <li style={{ color: "black" }}>
                              <i className="icon-calendar3" />{" "}
                              {new Date(item.waktu || item.waktu_publish).toLocaleDateString(
                                "id-ID",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </li>
                            <li style={{ color: "black" }}>
                              <i className="icon-eye" /> {Math.floor(Math.random() * (999 - 200 + 1) + 200)}
                            </li>
                          </ul>
                        </div>
                        <div className="entry-content">
                          <p className="mb-0 line-clamp-3">{item.deskripsi}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="col-lg-4 sticky-sidebar-wrap kategoriberita">
            <div className="sticky-sidebar">
              <div className="widget widget_links clearfix">
                <h4 className="mb-2 ls1 text-uppercase fw-bold">
                  Kategori Berita
                </h4>
                <div className="line line-xs line-sports"></div>
                <ul>
                  {kategoriData.map((item) => (
                    <li
                      key={item.id_kategori}
                      className="d-flex align-items-center"
                    >
                      <Link
                        href={`${langPrefix}/berita/show/${item.id_kategori}`}
                        className="flex-fill text-black"
                      >
                        {item.nama}
                      </Link>
                      <span className="badge text-light bg-sports">10</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="widget clearfix">
                <h4 className="mb-2 ls1 text-uppercase fw-bold">
                  Recent Posts
                </h4>
                <div className="line line-xs line-home"></div>
                <div className="posts-sm row col-mb-30">
                  {beritaTerbaru.slice(0, 4).map((item) => (
                    <div key={item.id} className="entry col-12">
                      <div className="grid-inner row align-items-start g-0">
                        <div className="col-auto">
                          <div className="entry-image">
                            <Link href={`${langPrefix}/berita/show/${item.id}`}>
                              <Image
                                src={item.cover}
                                alt={item.judul}
                                width={400}
                                height={200}
                              />
                            </Link>
                          </div>
                        </div>
                        <div className="col ps-3">
                          <div className="entry-title">
                            <h4 className="fw-semibold berita-sidebar-title">
                              <Link href={`${langPrefix}/berita/show/${item.id}`}>
                                {item.judul}
                              </Link>
                            </h4>
                          </div>
                          <div className="entry-meta">
                            <ul>
                              <li style={{ color: "black" }}>
                                <i className="icon-calendar3"></i>
                                <Link
                                  href={`${langPrefix}/berita/show/${item.id}`}
                                  style={{ color: "black" }}
                                >
                                  {formatDate(item.waktu, lang)}
                                </Link>
                              </li>
                              <li style={{ color: "black" }}>
                                <i className="icon-eye"></i>
                                {Math.floor(Math.random() * (999 - 200 + 1) + 200)}
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
