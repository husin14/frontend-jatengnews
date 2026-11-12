import { berita, kategori } from "@/app/types";

export type Lang = "id" | "en";

export function getKategori(item: berita): kategori | undefined {
  return item.berita?.kategori ?? item.kategori;
}

export function getKategoriName(item: berita, lang: Lang): string {
  const kategoriItem = getKategori(item);

  if (!kategoriItem) return "Uncategorized";

  if (lang === "en") {
    const translated = kategoriItem.translations?.find(
      (t) => t.translation?.code === "en" && t.nama
    );

    if (translated?.nama) return translated.nama;
  }

  return kategoriItem.nama || "Uncategorized";
}

export function langPrefixOf(lang: Lang): string {
  return lang === "id" ? "" : `/${lang}`;
}

// Struktur URL (lihat routes.md): beranda "/", kategori "/{id}", detail "/show/{slug}".
export function homeHref(lang: Lang): string {
  return langPrefixOf(lang) || "/";
}

export function kategoriHref(id: number | string, lang: Lang): string {
  return `${langPrefixOf(lang)}/${id}`;
}

export function beritaHref(item: berita, lang: Lang): string {
  return `${langPrefixOf(lang)}/show/${item.slug || item.id}`;
}
