"use client";

import { berita } from "./types";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const baseurl = process.env.NEXT_PUBLIC_BASE_URL;
  const [berita, setBerita] = useState([]);

  useEffect(() => {
    const fetchBerita = async () => {
      try {
        const res = await axios.get(`${baseurl}/berita`);
        setBerita(res.data.data);
        console.log(res.data.data);
      } catch (error) {
        console.error("Error fetching berita:", error);
      }
    };
    fetchBerita();
  }, []);

  return (
    <>
      <section id="content">
        <div className="content-wrap">
          <div className="section bg-transparent m-0">
            <div className="container clearfix">
              <h4 className="mb-3 ls1 text-uppercase fw-bold">Popular News</h4>
              {/* Owl Carousel
						============================================= */}
              <div
                id="oc-news"
                className="owl-carousel fixed-nav top-nav carousel-widget posts-md customjs"
              >
                {berita.map((item, index) => (
                  <div
                    key={index}
                    className="entry mb-0"
                    style={{
                      background:
                        'url("/canvas_theme/demos/news/images/posts/fashion/1.jpg") center center',
                      backgroundSize: "cover",
                      height: 400,
                    }}
                  >
                    <div className="bg-overlay">
                      <div className="bg-overlay-content text-overlay-mask dark desc-sm align-items-end justify-content-start p-4">
                        <div className="position-relative w-100">
                          <div className="entry-categories">
                            <a
                              href="demo-news-category.html"
                              className="bg-fashion"
                            >
                              Fashion
                            </a>
                          </div>
                          <div className="entry-title nott">
                            <h3 className="fw-semibold mb-2">
                              <a href="#" className="text-light">
                                The Ultimate Guide To Fashion
                              </a>
                            </h3>
                          </div>
                          <div className="entry-meta no-separator">
                            <ul>
                              <li>
                                <span>by</span> <a href="#">John Doe</a>
                              </li>
                              <li>
                                <i className="icon-time" />
                                <a href="#">11 Mar 2021</a>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {[1,2,3,4].map((_,index) => (
                <div
                  key={index}
                  className="entry mb-0"
                  style={{
                    background:
                      'url("/canvas_theme/demos/news/images/posts/fashion/1.jpg") center center',
                    backgroundSize: "cover",
                    height: 400,
                  }}
                >
                  <div className="bg-overlay">
                    <div className="bg-overlay-content text-overlay-mask dark desc-sm align-items-end justify-content-start p-4">
                      <div className="position-relative w-100">
                        <div className="entry-categories">
                          <a
                            href="demo-news-category.html"
                            className="bg-fashion"
                          >
                            Fashion
                          </a>
                        </div>
                        <div className="entry-title nott">
                          <h3 className="fw-semibold mb-2">
                            <a href="#" className="text-light">
                              The Ultimate Guide To Fashion
                            </a>
                          </h3>
                        </div>
                        <div className="entry-meta no-separator">
                          <ul>
                            <li>
                              <span>by</span> <a href="#">John Doe</a>
                            </li>
                            <li>
                              <i className="icon-time" />
                              <a href="#">11 Mar 2021</a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                ))}
                
              </div>
              {/* Carousel End */}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
