import React from "react";
import axios from "axios";
import SliderSection from "../components/beranda/SliderSection";
import { BeritaTerbaruSection } from "../components/beranda/BeritaTerbaruSection";
import { jadwalAcara } from "../types";
import { OurProgramSection } from "../components/beranda/OurProgramSection";
import { KerjasamaSection } from "../components/beranda/KerjasamaSection";

// const list_program = [
//   "1.webp",
//   "2.webp",
//   "11.webp",
//   "3.webp",
//   "4.webp",
//   "5.webp",
//   "6.webp",
//   "7.webp",
//   "8.webp",
//   "9.webp",
//   "10.webp",
//   "12.webp",
// ];

// const images = [
//   "bjateng.png",
//   "bnn.png",
//   "esport.png",
//   "halal.png",
//   "kominfo.png",
//   "kemenkumham.png",
//   "komnasanak.png",
//   "komnasham.png",
//   "majt.png",
//   "perhimpunandokter.png",
//   "uin.png",
//   "ypkpi_mrb.png",
// ];

// const captions = [
//   "Bank Jateng",
//   "BNN",
//   "PBESI",
//   "Majelis Ulama Indonesia",
//   "Kominfo",
//   "Kemenkumham",
//   "Komnas Anak",
//   "Komnas HAM",
//   "MAJT",
//   "Perhimpunan Dokter",
//   "UIN WS",
//   "YPKPI MRB",
// ];

const whoweare = {
  gambar: "whoweare.jpg",
  judul: "Who We Are",
  deskripsi: "Deskripsi tentang siapa kami.",
  motto1: "Motto 1",
  motto1sub: "Sub Motto 1",
  motto2: "Motto 2",
  motto2sub: "Sub Motto 2",
  motto3: "Motto 3",
  motto3sub: "Sub Motto 3",
};

const ourexpertise1 = [
  { judul: "Expertise 1", deskripsi: "Deskripsi 1", thumbnail: "exp1.jpg" },
];
const ourexpertise2_1 = [{ judul: "Expertise 2.1", thumbnail: "exp2_1.jpg" }];
const ourexpertise2_2 = [{ judul: "Expertise 2.2", thumbnail: "exp2_2.jpg" }];

const PATH_DIR = "/beranda_assets/";
const base_url = (path = "") => (path ? `/${path}` : "/");

export default async function Home() {
  const { data: slider } = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/home/slider`
  );
  const { data: beritaTerbaru } = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/berita`
  );
  const { data: jadwalTayang } = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/jadwal-acara`
  );
  const { data: ourProgram } = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/our-programs`
  );

  console.log("Slider Data:", slider);
  console.log("Berita Terbaru Data:", beritaTerbaru);
  console.log("jadwal terbaru", jadwalTayang);
  console.log("our program", ourProgram);

  const now = new Date();
  const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const hari = days[now.getDay()];
  const tanggal = `${now.getDate()} ${
    months[now.getMonth()]
  } ${now.getFullYear()}`;

  const jam = now.getHours() + now.getMinutes() / 60;

  let onair = null;
  if (jadwalTayang?.data) {
    const currentProgram = jadwalTayang.data.find((program: jadwalAcara) => {
      const jamAwal = parseFloat(program.jam_awal);
      const jamAkhir = parseFloat(program.jam_akhir);
      console.log(
        `Program ${
          program.acara
        }: ${jamAwal} - ${jamAkhir}, current time: ${jam}, match: ${
          jam >= jamAwal && jam <= jamAkhir
        }`
      );

      return jam >= jamAwal && jam <= jamAkhir;
    });

    if (currentProgram) {
      onair = { acara: currentProgram.acara };
    }
  }

  return (
    <div>
      <SliderSection carousels={slider.data} />

      {/* Content Section */}
      <section id="content">
        <div className="content-wrap">
          <BeritaTerbaruSection
            Berita={beritaTerbaru?.data}
            jadwalAcara={jadwalTayang?.data}
            hari={hari}
            tanggal={tanggal}
            jam={jam}
            onair={onair}
          />

          {/* Our Program */}
          <OurProgramSection list_program={ourProgram?.data} />
          {/* <div
            className="container-fluid clearfix"
            style={{
              marginTop: 80,
              backgroundColor: "#f1f2f3",
              paddingTop: 40,
              paddingBottom: 40,
            }}
          >
            <div className="heading-block center">
              <h2>Our Programs</h2>
            </div>
            <div className="container">
              <div className="row">
                <div className="our-program-beranda-slick">
                  {list_program.map((img, idx) => (
                    <a href="" key={idx}>
                      <div
                        style={{
                          backgroundImage: `url('http://tvku.tv/beranda/assets/images/MATERIAL_PROGRAM_WEB_TVKU/${img}')`,
                        }}
                      >
                        <img
                          style={{ visibility: "hidden" }}
                          src={`http://tvku.tv/beranda/assets/images/MATERIAL_PROGRAM_WEB_TVKU/${img}`}
                          alt=""
                        />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
              <div className="myslick-divider"></div>
            </div>
            <div className="container my-3 mt-0">
              <div className="col-md-12 text-center">
                <a
                  href={base_url("program")}
                  className="button button-border button-dark button-rounded button-large ms-0 topmargin-sm"
                >
                  More Programs
                </a>
              </div>
            </div>
          </div> */}

          {/* Kerjasama */}
          <KerjasamaSection />
          {/* <div className="section nobottommargin" style={{ paddingTop: 0 }}>
            <div className="container clear-bottommargin clearfix">
              <div className="row topmargin-sm clearfix">
                <div className="heading-block center">
                  <h2>Kerjasama yang Terjalin dengan TVKU</h2>
                </div>
              </div>
              <div className="row">
                <div className="kerjasamaterjalin">
                  {images.map((img, i) => (
                    <a href="" key={i}>
                      <div>
                        <img
                          className="kerjasamaterjalin-item-img"
                          src={
                            base_url("assets") + "/kerjasamaygterjalin/" + img
                          }
                          alt={captions[i]}
                        />
                        <div className="kerjasamaterjalin-item-caption">
                          {captions[i]}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div> */}

          {/* Who We Are */}
          <div className="container clearfix">
            <div className="row align-items-center col-mb-50">
              <div className="col-md-12 col-lg-6 order-lg-2 center">
                <img
                  data-animate="fadeInLeft"
                  src={PATH_DIR + "whoweare/" + whoweare.gambar}
                  alt="Iphone"
                />
              </div>
              <div className="col-md-12 col-lg-6 order-lg-1 text-center text-md-start">
                <div className="heading-block">
                  <h2>{whoweare.judul}</h2>
                </div>
                {whoweare.deskripsi}
              </div>
            </div>
          </div>
          <div className="section my-0">
            <div className="container">
              <div className="row mt-4 col-mb-50">
                {[1, 2, 3].map((num) => (
                  <div className="col-md-12 col-lg-4" key={num}>
                    <div className="feature-box fbox-plain">
                      <div className="fbox-icon">
                        <a href="#">
                          <i className="i-alt">{num}.</i>
                        </a>
                      </div>
                      <div className="fbox-content">
                        <h3>
                          {whoweare[`motto${num}` as keyof typeof whoweare]}
                        </h3>
                        <p>
                          {whoweare[`motto${num}sub` as keyof typeof whoweare]}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Expertise */}
          <div className="container clearfix mb-5">
            <div className="heading-block topmargin-lg center">
              <h2>Here Are Some of Our Expertise</h2>
            </div>
            <div className="row">
              <div className="col-lg-6 col-12">
                {ourexpertise1.map((data, idx) => (
                  <div className="grid-inner row g-0" key={idx}>
                    <div className="col-md-4">
                      <div className="entry-image">
                        <a
                          href={
                            base_url() + "assets/canvas/images/blog/full/17.jpg"
                          }
                          data-lightbox="image"
                        >
                          <img
                            src={PATH_DIR + "ourexpertise/" + data.thumbnail}
                            alt="Standard Post with Image"
                          />
                        </a>
                      </div>
                    </div>
                    <div className="col-md-8 ps-md-4">
                      <div className="entry-title title-sm">
                        <h3>{data.judul}</h3>
                      </div>
                      <div className="entry-content entry-content-home">
                        <p>{data.deskripsi}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="col-lg-3 col-12">
                {ourexpertise2_1.map((data, idx) => (
                  <div
                    id="portfolio"
                    className="portfolio row g-0 portfolio-reveal grid-container portfolio-home"
                    key={idx}
                  >
                    <article className="portfolio-item pf-media pf-icons">
                      <div className="grid-inner">
                        <div className="portfolio-image">
                          <a href="portfolio-single.html">
                            <img
                              src={PATH_DIR + "ourexpertise/" + data.thumbnail}
                              alt="Open Imagination"
                            />
                          </a>
                        </div>
                        <div className="portfolio-desc">
                          <h3>
                            <a href="portfolio-single.html">{data.judul}</a>
                          </h3>
                        </div>
                      </div>
                    </article>
                  </div>
                ))}
              </div>
              <div className="col-lg-3 col-12 move-to-bottom">
                {ourexpertise2_2.map((data, idx) => (
                  <div
                    id="portfolio"
                    className="portfolio row g-0 portfolio-reveal grid-container portfolio-home"
                    key={idx}
                  >
                    <article className="portfolio-item pf-media pf-icons">
                      <div className="grid-inner">
                        <div className="portfolio-image">
                          <a href="portfolio-single.html">
                            <img
                              src={PATH_DIR + "ourexpertise/" + data.thumbnail}
                              alt="Open Imagination"
                            />
                          </a>
                        </div>
                        <div className="portfolio-desc">
                          <h3>
                            <a href="portfolio-single.html">{data.judul}</a>
                          </h3>
                        </div>
                      </div>
                    </article>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
