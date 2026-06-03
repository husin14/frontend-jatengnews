import React from "react";
import Link from "next/link";
import Image from "next/image";
import SocialMedia from "./socialMedia";
import { berita } from "@/app/types";
import { formatDate } from "@/app/utils/dateFormatter";

interface SideBarProps {
  recentPosts?: berita[];
  popularPosts?: berita[];
  lang?: "id" | "en";
}

const SideBar: React.FC<SideBarProps> = ({ recentPosts, popularPosts, lang = "id" }) => {
  const langPrefix = lang === "id" ? "" : `/${lang}`;

  return (
    <div className="col-lg-4 sticky-sidebar-wrap mt-5 mt-lg-0">
      <div className="sticky-sidebar">
        <SocialMedia />

        {/* Recent Posts Widget */}
        {recentPosts && recentPosts.length > 0 && (
          <div className="widget clearfix">
            <h4 className="mb-2 ls1 text-uppercase fw-bold">
              {lang === "en" ? "Recent Posts" : "Berita Terbaru"}
            </h4>
            <div className="line line-xs line-home"></div>
            <div className="posts-sm row col-mb-30">
              {recentPosts.map((item) => (
                <div key={item.id} className="entry col-12">
                  <div className="grid-inner row align-items-start g-0">
                    <div className="col-auto">
                      <div className="entry-image mb-0">
                        <Link href={`${langPrefix}/berita/show/${item.id}`}>
                          <Image
                            src={item.cover}
                            alt={item.judul}
                            width={80}
                            height={50}
                            className="rounded"
                            style={{ width: "80px", height: "50px", objectFit: "cover" }}
                          />
                        </Link>
                      </div>
                    </div>
                    <div className="col ps-3">
                      <div className="entry-title">
                        <h4 className="fw-semibold mb-1" style={{ fontSize: "0.95rem", lineHeight: "1.3" }}>
                          <Link href={`${langPrefix}/berita/show/${item.id}`} className="text-dark">
                            {item.judul}
                          </Link>
                        </h4>
                      </div>
                      <div className="entry-meta">
                        <ul>
                          <li style={{ color: "#000" }}>
                            <i className="icon-calendar3"></i>{" "}
                            {formatDate(item.waktu || item.waktu_publish, lang)}
                          </li>
                          <li style={{ color: "#000" }}>
                            <i className="icon-eye"></i>{" "}
                            {item.views || Math.floor(Math.random() * (999 - 200 + 1) + 200)}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Popular Posts Widget */}
        {popularPosts && popularPosts.length > 0 && (
          <div className="widget clearfix">
            <h4 className="mb-2 ls1 text-uppercase fw-bold">
              {lang === "en" ? "Popular Posts" : "Berita Populer"}
            </h4>
            <div className="line line-xs line-sports"></div>
            <div className="posts-sm row col-mb-30">
              {popularPosts.map((item) => (
                <div key={item.id} className="entry col-12">
                  <div className="grid-inner row align-items-start g-0">
                    <div className="col-auto">
                      <div className="entry-image mb-0">
                        <Link href={`${langPrefix}/berita/show/${item.id}`}>
                          <Image
                            src={item.cover}
                            alt={item.judul}
                            width={80}
                            height={50}
                            className="rounded"
                            style={{ width: "80px", height: "50px", objectFit: "cover" }}
                          />
                        </Link>
                      </div>
                    </div>
                    <div className="col ps-3">
                      <div className="entry-title">
                        <h4 className="fw-semibold mb-1" style={{ fontSize: "0.95rem", lineHeight: "1.3" }}>
                          <Link href={`${langPrefix}/berita/show/${item.id}`} className="text-dark">
                            {item.judul}
                          </Link>
                        </h4>
                      </div>
                      <div className="entry-meta">
                        <ul>
                          <li style={{ color: "#000" }}>
                            <i className="icon-calendar3"></i>{" "}
                            {formatDate(item.waktu || item.waktu_publish, lang)}
                          </li>
                          <li style={{ color: "#000" }}>
                            <i className="icon-eye"></i>{" "}
                            {item.views || Math.floor(Math.random() * (999 - 200 + 1) + 200)}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Newsletter Subscription Card */}
        <div className="widget clearfix">
          <div className="card">
            <div className="card-body">
              <form className="form-signin">
                <div className="text-center">
                  <i
                    className="icon-line-mail text-muted mb-3"
                    style={{ fontSize: "48px", lineHeight: 1 }}
                  ></i>
                  <h3 className="h3 mb-3 fw-normal font-primary">
                    Subscribe to Our Newsletter
                  </h3>
                  <p className="font-secondary mb-2">
                    Lorem ipsum dolor sit adipisicing elit.
                  </p>
                </div>

                <div className="form-label-group">
                  <input
                    type="email"
                    id="inputEmail"
                    className="form-control"
                    required
                  />
                  <label htmlFor="inputEmail">Email address</label>
                </div>
                <button
                  className="btn btn-lg bg-color text-white w-100 text-uppercase ls1"
                  type="submit"
                >
                  Sign in
                </button>
                <div className="text-center">
                  <small className="mt-5 text-muted fst-italic">
                    We also Hate Spam
                  </small>
                </div>
              </form>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SideBar;
