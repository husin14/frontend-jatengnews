import React from "react";
import Image from "next/image";
import apiClient from "@/app/utils/apiClient";
import { convert } from "html-to-text";
import { berita, kategori } from "@/app/types";
import Sidebar from "@/app/components/sideBar";
import Carousel from "@/app/components/carousel";
import { formatDate } from "@/app/utils/dateFormatter";
import { getDictionary, Locale } from "@/app/dictionaries";

function getKategori(item: berita): kategori | undefined {
  return item.berita?.kategori ?? item.kategori;
}

function getKategoriName(item: berita, lang: Locale): string {
  const kategoriItem = getKategori(item);

  if (!kategoriItem) return "Uncategorized";

  if (lang === "en") {
    const translated = kategoriItem.translations?.find(
      (item) => item.translation?.code === "en" && item.nama
    );

    if (translated?.nama) return translated.nama;
  }

  return kategoriItem.nama || "Uncategorized";
}

export default async function BeritaPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: langParam } = await params;
  const lang = (langParam === "id" || langParam === "en" ? langParam : "id") as Locale;

  const fetchVariable = async (name: string): Promise<string | null> => {
    try {
      const res = await apiClient.get(`/variables/${name}`, {
        params: lang === "en" ? { language_code: "en" } : {},
      });

      return res?.data?.data?.value ?? null;
    } catch (err) {
      console.error(`Failed to fetch variable ${name}:`, err);
      return null;
    }
  };

  let kategoriData: kategori[] = [];
  let beritaTerbaru: berita[] = [];
  let beritaEnam: berita[] = [];
  let featureData: berita[] = [];
  let dictionary: any = null;
  let error: string | null = null;

  try {
    const beritaUrl = lang === "en" ? `/berita-translations` : `/berita-public`;

    const featureUrl =
      lang === "en"
        ? `/berita-translations?language_code=en&id_kategori=19`
        : `/berita-public?id_kategori=19`;

    const perKategoriUrl = `/berita-latest-per-kategori`;

    // Jumlah berita yang dipakai section hero (1 utama + 5 sidebar).
    // Nilai ini juga diteruskan ke API sebagai jumlah berita yang harus
    // dikeluarkan dari daftar latest news supaya tidak ada yang kembar.
    const heroLimit = 6;

    const [beritaResponse, featureResponse, kategoriResponse, dictionaryResponse, perKategoriResponse] =
      await Promise.all([
        apiClient.get(beritaUrl, {
          params: {
            per_page: 5,
            exclude_latest_per_kategori: heroLimit,
            ...(lang === "en" ? { language_code: "en" } : {}),
          },
        }),
        apiClient.get(featureUrl),
        apiClient.get(`/kategori`),
        getDictionary(lang),
        apiClient.get(perKategoriUrl, {
          params: {
            limit: heroLimit,
            ...(lang === "en" ? { language_code: "en" } : {}),
          },
        }),
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

    // API sudah mengembalikan 1 berita terbaru per kategori, ready tampil.
    beritaEnam = perKategoriResponse.data.data.map((item: berita) => ({
      ...item,
      deskripsi: convert(item.deskripsi, {
        selectors: [{ selector: "img", format: "skip" }],
      }),
    }));
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
  const beritaUtama = beritaEnam[0];
  const langPrefix = lang === "id" ? "" : `/${lang}`;
  const more = await fetchVariable("berita_page.more");

  return (
    <>
      <div className="row col-mb-50 mb-0">
        <div className="col-lg-8 berita-main-column">
          <div className="posts-md">
            {beritaUtama && (
              <div className="entry">
                <div className="entry-image">
                  <a
                    href={`${langPrefix}/show/${beritaUtama.slug || beritaUtama.id
                      }`}
                  >
                    <Image
                      src={
                        beritaUtama.cover ||
                        `https://apidev.tvku.tv/storage/${beritaUtama.cover}`
                      }
                      alt={beritaUtama.judul}
                      width={600}
                      height={300}
                      priority
                    />
                  </a>
                </div>
                <div className="entry-title title-sm">
                  <h3 style={{ marginBottom: '0px' }}>
                    <a
                      href={`${langPrefix}/show/${beritaUtama.slug || beritaUtama.id
                        }`}
                    >
                      {beritaUtama.judul}
                    </a>
                  </h3>
                </div>
                <div className="entry-meta berita-meta-compact">
                  {/* <ul>
                    <li style={{ color: "black" }}>
                      {getKategoriName(beritaUtama, lang)}
                    </li>
                    <li style={{ color: "black" }}>
                      <i className="icon-calendar3" /> {formatDate(beritaUtama.waktu, lang)}
                    </li>
                    <li style={{ color: "black" }}>
                      <i className="icon-eye" /> {beritaUtama.open ?? 0}
                    </li>
                  </ul> */}
                  {getKategoriName(beritaUtama, lang)} | <i className="icon-calendar3" /> {formatDate(beritaUtama.waktu, lang)} | <i className="icon-eye" /> {beritaUtama.open ?? 0}
                </div>

                <div className="entry-content" style={{ marginTop: '0px' }}>
                  <p className="line-clamp-2 mb-0">
                    {beritaUtama.deskripsi}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="col-lg-4 berita-sidebar-column">
          <div className="posts-sm row col-mb-30">
            {beritaEnam.slice(1, 6).map((item) => (
              <div key={item.id} className="entry col-12 berita-sidebar-entry">
                <div className="grid-inner row g-0">
                  <div className="col-auto">
                    <div className="entry-image">
                      <a href={`${langPrefix}/show/${item.slug || item.id}`}>
                        <Image
                          src={
                            item.cover ||
                            `https://apidev.tvku.tv/storage/${item.cover}`
                          }
                          alt={item.judul}
                          width={100}
                          height={100}
                        />
                      </a>
                    </div>
                  </div>
                  <div className="col ps-3">
                    <div className="entry-title">
                      <h4 className="berita-sidebar-title">
                        <a
                          href={`${langPrefix}/show/${item.slug || item.id}`}
                        >
                          {item.judul}
                        </a>
                      </h4>
                    </div>

                    <div className="entry-meta berita-meta-compact">
                      {/* <ul>
                        <li style={{ color: "black" }}>
                          {getKategoriName(item, lang)}
                        </li>
                        <li style={{ color: "black" }}>
                          <i className="icon-calendar3" /> {formatDate(item.waktu, lang)}
                        </li>
                        <li style={{ color: "black" }}>
                          <i className="icon-eye" /> {item.open ?? 0}
                        </li>
                      </ul> */}
                      {getKategoriName(item, lang)} | <i className="icon-calendar3" /> {formatDate(item.waktu, lang)} | <i className="icon-eye" /> {item.open ?? 0}
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
            | <a href={`${langPrefix}/beritaterbaru`}> {more || dictionary.berita_page.more || "Selengkapnya.."}</a>
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
                        <a href={`${langPrefix}/show/${data.slug || data.id}`}>
                          <Image
                            src={data.cover}
                            alt={data.judul}
                            width={400}
                            height={200}
                            className="img-16x9"
                          />
                        </a>
                        {/* <div className="entry-categories">
                          <a
                            href={`${langPrefix}/show/${data.slug || data.id}`}
                            className="bg-travel"
                          >
                            {getKategoriName(data, lang)}
                          </a>
                        </div> */}
                      </div>
                      <div className="entry-title nott">
                        <h3 className="mb-2">
                          <a href={`${langPrefix}/show/${data.slug || data.id}`}>{data.judul}</a>
                        </h3>
                      </div>
                      <div className="entry-meta berita-meta-compact">
                        {/* <ul>
                          <li style={{ color: "black" }}>
                            <i className="icon-calendar3"></i>
                            {formatDate(data.waktu, lang)}
                          </li>
                          <li style={{ color: "black" }}>
                            <i className="icon-eye"></i>
                            {data.open ?? 0}
                          </li>
                        </ul> */}
                        {getKategoriName(data, lang)} | <i className="icon-calendar3" /> {formatDate(data.waktu, lang)} | <i className="icon-eye" /> {data.open ?? 0}
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
                              <a href={`${langPrefix}/show/${item.slug || item.id}`}>
                                <Image
                                  src={item.cover}
                                  alt={item.judul}
                                  width={400}
                                  height={200}
                                />
                              </a>
                            </div>
                          </div>
                          <div className="col ps-3">
                            <div className="entry-title">
                              <h4 style={{ marginTop: '-5px' }}>
                                <a
                                  href={`${langPrefix}/show/${item.slug || item.id}`}
                                >
                                  {item.judul}
                                </a>
                              </h4>
                            </div>
                            <div className="entry-meta berita-meta-compact">
                              {/* <ul>
                                <li style={{ color: "black" }}>
                                  <i className="icon-calendar3"></i>
                                  {formatDate(item.waktu, lang)}
                                </li>
                                <li style={{ color: "black" }}>
                                  <i className="icon-eye"></i>
                                  {item.open ?? 0}
                                </li>
                              </ul> */}
                              {getKategoriName(item, lang)} | <i className="icon-calendar3" /> {formatDate(item.waktu, lang)} | <i className="icon-eye" /> {item.open ?? 0}
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
                          <a href={`${langPrefix}/show/${item.slug || item.id}`}>
                            <Image
                              src={item.cover}
                              alt={item.judul}
                              width={400}
                              height={200}
                              className="img-16x9"
                            />
                          </a>
                          <div className="entry-categories">
                            <a
                              href={`${langPrefix}/show/${item.slug || item.id}`}
                              className="bg-lifestyle"
                            >
                              {getKategoriName(item, lang)}
                            </a>
                          </div>
                        </div>
                        <div className="entry-title title-sm nott">
                          <h3 className="mb-2">
                            <a href={`${langPrefix}/show/${item.slug || item.id}`}>
                              {item.judul}
                            </a>
                          </h3>
                        </div>
                        <div className="entry-meta berita-meta-compact">
                          {/* <ul>
                            <li style={{ color: "black" }}>
                              <i className="icon-calendar3"></i>
                              {formatDate(item.waktu, lang)}
                            </li>
                            <li style={{ color: "black" }}>
                              <i className="icon-eye"></i>
                              {item.open ?? 0}
                            </li>
                          </ul> */}
                          {getKategoriName(item, lang)} | <i className="icon-calendar3" /> {formatDate(item.waktu, lang)} | <i className="icon-eye" /> {item.open ?? 0}
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
                          <a href={`${langPrefix}/show/${item.slug || item.id}`}>
                            <Image
                              src={item.cover}
                              alt={item.judul}
                              width={400}
                              height={200}
                            />
                          </a>
                        </div>
                      </div>
                      <div className="col ps-3">
                        <div className="entry-title">
                          <h4 className="fw-medium">
                            <a href={`${langPrefix}/show/${item.slug || item.id}`}>
                              {item.judul}
                            </a>
                          </h4>
                        </div>
                        <div className="entry-meta berita-meta-compact">
                          {/* <ul>
                            <li style={{ color: "black" }}>
                              <i className="icon-calendar3"></i>
                              {formatDate(item.waktu, lang)}
                            </li>
                            <li style={{ color: "black" }}>
                              <i className="icon-eye"></i>
                              {item.open ?? 0}
                            </li>
                          </ul> */}
                          {getKategoriName(item, lang)} | <i className="icon-calendar3" /> {formatDate(item.waktu, lang)} | <i className="icon-eye" /> {item.open ?? 0}
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
                          <a href={`${langPrefix}/show/${item.slug || item.id}`}>
                            <Image
                              src={item.cover}
                              alt={item.judul}
                              width={600}
                              height={300}
                              className="rounded"
                            />
                          </a>
                        </div>
                      </div>
                      <div className="col-md-6 mt-3 mt-md-0">
                        <div className="entry-title title-sm nott">
                          <h3>
                            <a href={`${langPrefix}/show/${item.slug || item.id}`}>
                              {item.judul}
                            </a>
                          </h3>
                        </div>
                        <div className="entry-meta berita-meta-compact">
                          {/* <ul>
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
                              <i className="icon-eye" /> {item.open ?? 0}
                            </li>
                          </ul> */}
                          <i className="icon-calendar3" /> {formatDate(item.waktu, lang)} | <i className="icon-eye" /> {item.open ?? 0}
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
                      <a
                        href={`${langPrefix}/${item.id_kategori}`}
                        className="flex-fill text-black"
                      >
                        {item.nama}
                      </a>
                      <span className="badge text-light bg-sports">
                        {item.berita_count || 0}
                      </span>
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
                            <a href={`${langPrefix}/show/${item.slug || item.id}`}>
                              <Image
                                src={item.cover}
                                alt={item.judul}
                                width={400}
                                height={200}
                              />
                            </a>
                          </div>
                        </div>
                        <div className="col ps-3">
                          <div className="entry-title">
                            <h4 className="fw-semibold berita-sidebar-title">
                              <a href={`${langPrefix}/show/${item.slug || item.id}`}>
                                {item.judul}
                              </a>
                            </h4>
                          </div>
                          <div className="entry-meta">
                            <ul>
                              <li style={{ color: "black" }}>
                                <i className="icon-calendar3"></i>
                                <a
                                  href={`${langPrefix}/show/${item.slug || item.id}`}
                                  style={{ color: "black" }}
                                >
                                  {formatDate(item.waktu, lang)}
                                </a>
                              </li>
                              <li style={{ color: "black" }}>
                                <i className="icon-eye"></i>
                                {item.open ?? 0}
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
