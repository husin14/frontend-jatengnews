import React from "react";
import Image from "next/image";
import { berita } from "@/app/types";
import { formatDate } from "@/app/utils/dateFormatter";
import { beritaHref, getKategoriName, Lang } from "@/app/components/jn/newsUtils";

export function Cover({
  item,
  sizes,
  priority,
}: {
  item: berita;
  sizes: string;
  priority?: boolean;
}) {
  if (!item.cover) return null;
  return <Image src={item.cover} alt={item.judul} fill sizes={sizes} priority={priority} />;
}

export function NewsCard({ item, lang }: { item: berita; lang: Lang }) {
  const href = beritaHref(item, lang);
  return (
    <article className="jn-card">
      <a href={href} className="jn-media jn-media-4x3" tabIndex={-1} aria-hidden="true">
        <Cover item={item} sizes="(max-width: 640px) 50vw, 300px" />
      </a>
      <span className="jn-card-kat">{getKategoriName(item, lang)}</span>
      <h3 className="jn-card-title">
        <a href={href}>{item.judul}</a>
      </h3>
      <span className="jn-card-date">{formatDate(item.waktu || item.waktu_publish, lang)}</span>
    </article>
  );
}

export function SideItem({ item, lang, rank }: { item: berita; lang: Lang; rank?: number }) {
  return (
    <a href={beritaHref(item, lang)} className="jn-side-item">
      {rank !== undefined ? (
        <span className="jn-side-rank" aria-hidden="true">
          {rank}
        </span>
      ) : (
        <span className="jn-side-thumb">
          <Cover item={item} sizes="96px" />
        </span>
      )}
      <span className="jn-side-body">
        <span className="jn-side-title">{item.judul}</span>
        <span className="jn-meta">
          <b>{getKategoriName(item, lang)}</b> · {formatDate(item.waktu || item.waktu_publish, lang)}
        </span>
      </span>
    </a>
  );
}
