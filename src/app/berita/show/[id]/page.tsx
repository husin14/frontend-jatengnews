"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { berita } from "@/app/types";
import SideBar from "@/app/components/sideBar";
import Image from "next/image";
import DisqusComment from "@/app/components/disqus";

const DetailBeritaPage = () => {
  const { id } = useParams<{ id: string }>();
  const [berita, setBerita] = useState<berita | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`https://apidev.tvku.tv/api/berita/${id}`);
        if (!res.ok) {
          const text = await res.text();
          console.error("Fetch error:", res.status, text);
          return;
        }
        const data = await res.json();
        setBerita(data); // Langsung objek, tidak pakai [0]
      } catch (err) {
        console.error("Fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  if (loading) return <p className="text-center py-10">Memuat...</p>;
  if (!berita)
    return <p className="text-center py-10">Berita tidak ditemukan</p>;

  return (
    <>
      {berita.link && (
        <div className="mb-3" style={{ marginTop: "8px" }}>
          <div className="ratio ratio-16x9">
            <iframe
              src={berita.link.replace("watch?v=", "embed/")}
              title="YouTube video preview"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ border: 0, width: "100%", height: "100%" }}
            />
          </div>
        </div>
      )}
      <div className="entry-title nott mt-3">
        <h3 className="mb-2">{berita.judul}</h3>
      </div>
      <div className="entry-meta">
        <ul>
          <li>
            <i className="icon-time"></i> {berita.waktu_publish}
          </li>
        </ul>
      </div>
      <div className="row clearfix" style={{ marginTop: "8px" }}>
        <div className="col-lg-8">
          <div className="tab-content" id="nav-tabContent">
            <div
              className="tab-pane fade show active"
              id="nav-detail"
              role="tabpanel"
              aria-labelledby="nav-detail-tab"
            >
              <div className="row col-mb-30 mb-0">
                {/* Konten utama berita */}
                <div className="col-12">
                  <div className="posts-md">
                    <div className="entry">
                      <div className="entry-image">
                        <Image
                          src={berita.cover}
                          alt={berita.judul}
                          width={800}
                          height={400}
                          style={{ width: "100%", height: "auto" }}
                        />
                        <div className="entry-categories">
                          <a href="#" className="bg-travel">
                            {berita.kategori.nama}
                          </a>
                        </div>
                      </div>
                      {/* Tambahkan link berita di sini */}

                      <div className="entry-content clearfix">
                        <div
                          dangerouslySetInnerHTML={{ __html: berita.deskripsi }}
                          className="text-dark"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <DisqusComment
                  url={`https://apidev.tvku.tv/api${berita.id}`}
                  identifier={berita.id.toString()}
                  shortname="disqus_thread"
                />
                {/* Berita lain yang relevan */}
                {/* ... */}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <SideBar />
      </div>
      <div id="disqus_thread"></div>
    </>
  );
};

export default DetailBeritaPage;
