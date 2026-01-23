"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { recentPostFooter, kategori } from "../types";
import Link from "next/link";
import Image from "next/image";
import { htmlToText } from "html-to-text";

function Footer() {
  const [cleanDeskripsi, setCleanDeskripsi] = useState<recentPostFooter[]>([]);
  const [kategoriList, setKategoriList] = useState<kategori[]>([]);
  const [showAllTags, setShowAllTags] = useState(false);
  const baseurl = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    const getBerita = async () => {
      try {
        const res = await axios.get(`${baseurl}/berita`);
        const data: recentPostFooter[] = res.data.data;

        const cleaned = data.map((item: recentPostFooter) => ({
          ...item,
          deskripsi: htmlToText(item.deskripsi, { wordwrap: false }),
        }));

        setCleanDeskripsi(cleaned);
      } catch (error) {
        console.error("Error fetching berita:", error);
      }
    };

    const getKategori = async () => {
      try {
        const res = await axios.get(`${baseurl}/kategori`);
        const data: kategori[] = res.data.data;
        setKategoriList(data);
      } catch (error) {
        console.error("Error fetching kategori:", error);
      }
    };

    getBerita();
    getKategori();
  }, []);

  return (
    <footer id="footer" className="dark">

      {/* Copyright */}
      <div id="copyrights">
        <div className="container">
          <div className="row justify-content-between col-mb-30">
            <div className="col-12 col-lg-auto text-center text-lg-start order-last order-lg-first">
              <div className="container">
                <div className="row">
                  <div className="col-lg-6">
                    <img
                      style={{ width: 400 }}
                      src="/images/udinus_unggul.jpeg"
                      alt="Image"
                      className="mb-4"
                    />
                    <br />
                  </div>
                  <div className="col-lg-6">
                    <img
                      src="/images/jatengnews.png"
                      alt="Image"
                      className="mb-4"
                    />
                    <br />
                  </div>
                </div>
              </div>
              Copyrights © 2022 All Rights Reserved by TVKU
            </div>
            <div className="col-12 col-lg-auto text-center text-lg-end">
              <a
                href="#"
                className="social-icon inline-block si-small si-borderless mb-0 si-facebook"
              >
                <i className="icon-facebook" />
                <i className="icon-facebook" />
              </a>
              <a
                href="#"
                className="social-icon inline-block si-small si-borderless mb-0 si-instagram"
              >
                <i className="icon-instagram" />
                <i className="icon-instagram" />
              </a>
              <a
                href="#"
                className="social-icon inline-block si-small si-borderless mb-0 si-youtube"
              >
                <i className="icon-youtube" />
                <i className="icon-youtube" />
              </a>
              {/* <a href="#" class="social-icon inline-block si-small si-borderless mb-0 si-twitter">
      <i class="icon-twitter"></i>
      <i class="icon-twitter"></i>
    </a> */}
              {/* <a href="#" class="social-icon inline-block si-small si-borderless mb-0 si-gplus">
      <i class="icon-gplus"></i>
      <i class="icon-gplus"></i>
    </a> */}
              {/* <a href="#" class="social-icon inline-block si-small si-borderless mb-0 si-pinterest">
      <i class="icon-pinterest"></i>
      <i class="icon-pinterest"></i>
    </a> */}
              {/* <a href="#" class="social-icon inline-block si-small si-borderless mb-0 si-vimeo">
      <i class="icon-vimeo"></i>
      <i class="icon-vimeo"></i>
    </a> */}
              {/* <a href="#" class="social-icon inline-block si-small si-borderless mb-0 si-github">
      <i class="icon-github"></i>
      <i class="icon-github"></i>
    </a> */}
              {/* <a href="#" class="social-icon inline-block si-small si-borderless mb-0 si-yahoo">
      <i class="icon-yahoo"></i>
      <i class="icon-yahoo"></i>
    </a> */}
              {/* <a href="#" class="social-icon inline-block si-small si-borderless mb-0 si-linkedin">
      <i class="icon-linkedin"></i>
      <i class="icon-linkedin"></i>
    </a> */}
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
