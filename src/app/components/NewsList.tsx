import React from "react";
import Image from "next/image";
import { berita } from "@/app/types";

interface NewsListProps {
  news: berita[];
  lang: "id" | "en";
}

const truncate = (text: string, max: number) =>
  text.length > max ? text.slice(0, max) + "..." : text;

export const NewsList: React.FC<NewsListProps> = ({ news, lang }) => {
  const langPrefix = lang === "id" ? "" : `/${lang}`;

  return (
    <>
      {news.map((item) => (
        <div key={item.id} className="posts-md">
          <div className="entry row mb-custom">
            <div className="col-md-6">
              <div className="entry-image">
                <a href={`${langPrefix}/berita/show/${item.id}`}>
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
                  <a href={`${langPrefix}/berita/show/${item.id}`}>
                    {item.judul}
                  </a>
                </h3>
              </div>
              <div className="entry-meta">
                <ul>
                  <li style={{ color: "var(--entry-meta-color)" }}>
                    <i className="icon-calendar3" style={{ color: "var(--entry-meta-color)" }} />{" "}
                    {new Date(item.waktu || item.waktu_publish).toLocaleDateString(
                      lang === "id" ? "id-ID" : "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </li>
                  <li style={{ color: "var(--entry-meta-color)" }}>
                    <i className="icon-eye" style={{ color: "var(--entry-meta-color)" }} /> {Math.floor(Math.random() * (999 - 200 + 1) + 200)}
                  </li>
                </ul>
              </div>
              <div className="entry-content">
                <p className="mb-0 line-clamp-3">{truncate(item.deskripsi, 188)}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default NewsList;
