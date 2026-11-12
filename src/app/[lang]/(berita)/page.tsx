import React from "react";
import apiClient from "@/app/utils/apiClient";
import { convert } from "html-to-text";
import { berita, kategori } from "@/app/types";
import { formatDate } from "@/app/utils/dateFormatter";
import { getDictionary, Locale } from "@/app/dictionaries";
import { withServerCache, deleteServerCache } from "@/app/utils/serverCache";
import { beritaHref, getKategoriName, kategoriHref } from "@/app/components/jn/newsUtils";
import { Cover, NewsCard, SideItem } from "@/app/components/jn/NewsCard";

type Dictionary = Awaited<ReturnType<typeof getDictionary>>;

const CACHE_TTL_MS = {
  latestNews: 60_000,
  feature: 60_000,
  kategori: 300_000,
  latestPerKategori: 60_000,
  variable: 300_000,
};

// Ambil array dari response API yang bisa berbentuk:
// - { data: [...] }  (paginated)
// - [...]            (array langsung)
// Mengembalikan null jika bentuk response tidak dikenali, supaya pemanggil
// bisa memperlakukannya sebagai kegagalan (bukan crash `.map`).
function extractList<T>(response: unknown): T[] | null {
  const body = (response as { data?: unknown } | null | undefined)?.data;

  if (Array.isArray(body)) {
    return body as T[];
  }

  const nested = (body as { data?: unknown } | null | undefined)?.data;

  if (Array.isArray(nested)) {
    return nested as T[];
  }

  return null;
}

function toPlainText(list: berita[]): berita[] {
  return list.map((item) => ({
    ...item,
    deskripsi: convert(item.deskripsi || "", {
      selectors: [{ selector: "img", format: "skip" }],
    }),
  }));
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
      const res = await withServerCache(
        `variable:${name}:${lang}`,
        CACHE_TTL_MS.variable,
        () =>
          apiClient.get(`/variables/${name}`, {
            params: lang === "en" ? { language_code: "en" } : {},
          })
      );

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
  let dictionary: Dictionary | null = null;
  let error: string | null = null;
  let hadFailure = false;

  const beritaUrl = lang === "en" ? `/berita-translations` : `/berita-public`;

  const featureUrl =
    lang === "en"
      ? `/berita-translations?language_code=en&id_kategori=19`
      : `/berita-public?id_kategori=19`;

  const perKategoriUrl = `/berita-latest-per-kategori`;

  // Jumlah berita yang dipakai section utama (1 besar + 5 samping).
  // Nilai ini juga diteruskan ke API sebagai jumlah berita yang harus
  // dikeluarkan dari daftar latest news supaya tidak ada yang kembar.
  const heroLimit = 6;

  // Promise.allSettled dipakai supaya kegagalan satu endpoint (mis. 429)
  // tidak mengosongkan seluruh halaman. Data di-cache agar jumlah request
  // ke API tidak membengkak dan tidak cepat kena rate limit.
  const [beritaResult, featureResult, kategoriResult, dictionaryResult, perKategoriResult] =
    await Promise.allSettled([
      withServerCache(`berita:${lang}`, CACHE_TTL_MS.latestNews, () =>
        apiClient.get(beritaUrl, {
          params: {
            per_page: 6,
            exclude_latest_per_kategori: heroLimit,
            ...(lang === "en" ? { language_code: "en" } : {}),
          },
        })
      ),
      withServerCache(`feature:${lang}`, CACHE_TTL_MS.feature, () =>
        apiClient.get(featureUrl)
      ),
      withServerCache(`kategori:${lang}`, CACHE_TTL_MS.kategori, () =>
        apiClient.get(`/kategori`)
      ),
      getDictionary(lang),
      withServerCache(`per-kategori:${lang}`, CACHE_TTL_MS.latestPerKategori, () =>
        apiClient.get(perKategoriUrl, {
          params: {
            limit: heroLimit,
            ...(lang === "en" ? { language_code: "en" } : {}),
          },
        })
      ),
    ]);

  if (beritaResult.status === "fulfilled") {
    const list = extractList<berita>(beritaResult.value);
    if (list) {
      beritaTerbaru = toPlainText(list);
    } else {
      hadFailure = true;
      deleteServerCache(`berita:${lang}`);
      console.error("Unexpected berita response shape:", beritaResult.value);
    }
  } else {
    hadFailure = true;
    console.error("Failed to fetch berita terbaru:", beritaResult.reason);
  }

  if (featureResult.status === "fulfilled") {
    const list = extractList<berita>(featureResult.value);
    if (list) {
      featureData = toPlainText(list);
    } else {
      hadFailure = true;
      deleteServerCache(`feature:${lang}`);
      console.error("Unexpected feature response shape:", featureResult.value);
    }
  } else {
    hadFailure = true;
    console.error("Failed to fetch feature:", featureResult.reason);
  }

  if (kategoriResult.status === "fulfilled") {
    const list = extractList<kategori>(kategoriResult.value);
    if (list) {
      kategoriData = list;
    } else {
      hadFailure = true;
      deleteServerCache(`kategori:${lang}`);
      console.error("Unexpected kategori response shape:", kategoriResult.value);
    }
  } else {
    hadFailure = true;
    console.error("Failed to fetch kategori:", kategoriResult.reason);
  }

  if (dictionaryResult.status === "fulfilled") {
    dictionary = dictionaryResult.value;
  } else {
    hadFailure = true;
    console.error("Failed to fetch dictionary:", dictionaryResult.reason);
  }

  if (perKategoriResult.status === "fulfilled") {
    // API sudah mengembalikan 1 berita terbaru per kategori, siap tampil.
    const list = extractList<berita>(perKategoriResult.value);
    if (list) {
      beritaEnam = toPlainText(list);
    } else {
      hadFailure = true;
      deleteServerCache(`per-kategori:${lang}`);
      console.error("Unexpected berita per kategori response shape:", perKategoriResult.value);
    }
  } else {
    hadFailure = true;
    console.error("Failed to fetch berita per kategori:", perKategoriResult.reason);
  }

  const langPrefix = lang === "id" ? "" : `/${lang}`;
  const t = (id: string, en: string) => (lang === "en" ? en : id);

  if (hadFailure && beritaTerbaru.length === 0 && beritaEnam.length === 0) {
    error = "Gagal memuat data. Silakan coba lagi nanti.";
  }

  if (error) {
    return (
      <div className="col-12 jn-empty">
        <p>{error}</p>
        <a href={langPrefix || "/"} className="jn-btn">
          Coba lagi
        </a>
      </div>
    );
  }

  if (beritaTerbaru.length === 0 && beritaEnam.length === 0) {
    return <div className="col-12 jn-empty">{t("Tidak ada berita", "No news available")}</div>;
  }

  const more = await fetchVariable("berita_page.more");
  const beritaUtama = beritaEnam[0];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dict = dictionary as any;

  return (
    <div className="col-12">
      <div className="jn-home">
        {beritaUtama && (
          <section aria-labelledby="sec-utama" className="jn-sec">
            <div className="jn-sec-head">
              <h2 id="sec-utama">{t("Berita Utama", "Top Stories")}</h2>
            </div>
            <div className="jn-hero">
              <article className="jn-hero-main">
                <a href={beritaHref(beritaUtama, lang)} className="jn-media jn-media-16x9" tabIndex={-1} aria-hidden="true">
                  <Cover item={beritaUtama} sizes="(max-width: 991px) 100vw, 800px" priority />
                  <span className="jn-badge">{getKategoriName(beritaUtama, lang)}</span>
                </a>
                <h3 className="jn-hero-title">
                  <a href={beritaHref(beritaUtama, lang)}>{beritaUtama.judul}</a>
                </h3>
                <p className="jn-meta">
                  <b>{getKategoriName(beritaUtama, lang)}</b> · {formatDate(beritaUtama.waktu, lang)}
                </p>
                {beritaUtama.deskripsi && <p className="jn-lede">{beritaUtama.deskripsi}</p>}
              </article>
              <div className="jn-hero-side">
                {beritaEnam.slice(1, 6).map((item) => (
                  <SideItem key={item.id} item={item} lang={lang} />
                ))}
              </div>
            </div>
          </section>
        )}

        <div className="jn-split">
          <div className="jn-split-main">
            {beritaTerbaru.length > 0 && (
              <section aria-labelledby="sec-terbaru" className="jn-sec">
                <div className="jn-sec-head">
                  <h2 id="sec-terbaru">{dict?.berita_page?.latest_news || t("Berita Terbaru", "Latest News")}</h2>
                  <a href={`${langPrefix}/beritaterbaru`}>
                    {more || dict?.berita_page?.more || t("Selengkapnya", "More")} →
                  </a>
                </div>
                <div className="jn-grid">
                  {beritaTerbaru.slice(0, 6).map((item) => (
                    <NewsCard key={item.id} item={item} lang={lang} />
                  ))}
                </div>
              </section>
            )}

            {featureData.length > 0 && (
              <section aria-labelledby="sec-feature" className="jn-sec">
                <div className="jn-sec-head">
                  <h2 id="sec-feature">Feature</h2>
                  <a href={kategoriHref(19, lang)}>{t("Selengkapnya", "More")} →</a>
                </div>
                <div className="jn-grid">
                  {featureData.slice(0, 6).map((item) => (
                    <NewsCard key={item.id} item={item} lang={lang} />
                  ))}
                </div>
              </section>
            )}
          </div>

          {kategoriData.length > 0 && (
            <aside aria-labelledby="sec-kategori" className="jn-split-aside jn-sec">
              <div className="jn-sec-head">
                <h2 id="sec-kategori">{t("Kategori Berita", "News Categories")}</h2>
              </div>
              <nav aria-label={t("Daftar kategori", "Category list")} className="jn-katlist">
                {kategoriData.map((item) => (
                  <a key={item.id_kategori} href={kategoriHref(item.id_kategori, lang)}>
                    <span>{item.nama}</span>
                    <span>
                      {item.berita_count ?? ""}
                      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#185FA5" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 6l6 6-6 6" />
                      </svg>
                    </span>
                  </a>
                ))}
              </nav>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
