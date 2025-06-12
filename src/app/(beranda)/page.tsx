import React from "react";

const carousels = [
  { judul: "Judul 1", sub_judul: "Sub Judul 1", gambar: "img-1.jpg" },
  { judul: "Judul 2", sub_judul: "Sub Judul 2", gambar: "img-1.jpg" },
];

const enamberitaterbaru = [
  { id: 1, judul: "Berita 1", cover: "cover1.jpg" },
  { id: 2, judul: "Berita 2", cover: "cover2.jpg" },
];

const jadwal = [
  { acara: "Acara 1", jam_awal: "08:00", jam_akhir: "09:00" },
  { acara: "Acara 2", jam_awal: "09:00", jam_akhir: "10:00" },
];

const list_program = [
  "1.webp", "2.webp", "11.webp", "3.webp", "4.webp", "5.webp", "6.webp", "7.webp", "8.webp", "9.webp", "10.webp", "12.webp"
];

const images = [
  'bjateng.png', 'bnn.png', 'esport.png', 'halal.png', 'kominfo.png', 'kemenkumham.png', 'komnasanak.png', 'komnasham.png', 'majt.png', 'perhimpunandokter.png', 'uin.png', 'ypkpi_mrb.png'
];

const captions = [
  'Bank Jateng', 'BNN', 'PBESI', 'Majelis Ulama Indonesia', 'Kominfo', 'Kemenkumham', 'Komnas Anak', 'Komnas HAM', 'MAJT', 'Perhimpunan Dokter', 'UIN WS', 'YPKPI MRB'
];

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
const ourexpertise2_1 = [
  { judul: "Expertise 2.1", thumbnail: "exp2_1.jpg" },
];
const ourexpertise2_2 = [
  { judul: "Expertise 2.2", thumbnail: "exp2_2.jpg" },
];

const hari = "Senin";
const tanggal = "1 Januari 2024";
const jam = "08:30";
const onair = { acara: "Acara On Air" };

const PATH_DIR = "/beranda_assets/";
const PATH_COVER = "/beranda_assets/covers/";
const TVKU_BERITA_SINGLE = "/berita/";
const TVKU_BERITA = "/berita";
const base_url = (path = "") => path ? `/${path}` : "/";

export default function Home() {
  return (
    <div>
      {/* Slider Section */}
      <section
        id="slider"
        className="slider-element slider-parallax swiper_wrapper min-vh-60 min-vh-md-100 include-header"
        data-autoplay="3000"
        data-speed="650"
        data-loop="true"
      >
        <div className="slider-inner">
          <div className="swiper-container swiper-parent">
            <div className="swiper-wrapper">
              {carousels.map((data, idx) => (
                <div className="swiper-slide dark" key={idx}>
                  <div className="container">
                    <div className="slider-caption slider-caption-center">
                      <h2 data-animate="fadeInUp">{data.judul}</h2>
                      <p className="d-none d-sm-block" data-animate="fadeInUp" data-delay="200">
                        {data.sub_judul}
                      </p>
                    </div>
                  </div>
                  <div
                    className="swiper-slide-bg"
                    style={{
                      backgroundImage: `url('${PATH_DIR}images/${data.gambar}')`,
                    }}
                  ></div>
                </div>
              ))}
            </div>
            <div className="slider-arrow-left">
              <i className="icon-angle-left"></i>
            </div>
            <div className="slider-arrow-right">
              <i className="icon-angle-right"></i>
            </div>
          </div>
          <a
            href="#"
            data-scrollto="#content"
            data-offset="100"
            className="one-page-arrow dark"
          >
            <i className="icon-angle-down infinite animated fadeInDown"></i>
          </a>
        </div>
      </section>

      {/* Content Section */}
      <section id="content">
        <div className="content-wrap">
          <div className="container">
            <div className="row rowjadwalsiar">
              <div className="col-12 col-lg-6">
                <div
                  className="fslider flex-thumb-grid grid-6"
                  data-speed="400"
                  data-arrows="true"
                  data-thumbs="true"
                  data-easing="easeOutQuad"
                >
                  <div className="flexslider">
                    <div className="slider-wrap">
                      {enamberitaterbaru.map((item, idx) => (
                        <div
                          className="slide"
                          data-thumb={PATH_COVER + item.cover}
                          key={idx}
                        >
                          <a href={TVKU_BERITA_SINGLE + item.id}>
                            <img src={PATH_COVER + item.cover} alt="Image" />
                            <div className="bg-overlay">
                              <div className="bg-overlay-content text-overlay-mask desc-sm dark desc-sm align-items-end justify-content-start p-4">
                                <div className="portfolio-desc py-0">
                                  <h3>{item.judul}</h3>
                                </div>
                              </div>
                            </div>
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-lg-6">
                <div className="container-fluid">
                  <div className="row rowjadwalsiar">
                    <div className="col-12 col-md-7">
                      <div className="posts-sm row col-mb-30">
                        {enamberitaterbaru.map((item, idx) => (
                          <div className="entry col-12 entry-siar" key={idx}>
                            <div className="entry-title">
                              <h4>
                                <a href={TVKU_BERITA_SINGLE + item.id}>
                                  {item.judul}
                                </a>
                              </h4>
                            </div>
                            <hr style={{ borderTop: "dashed 1px black" }} />
                          </div>
                        ))}
                        <div className="entry col-12 entry-siar">
                          <div className="entry-title">
                            <a href={TVKU_BERITA} style={{ color: "black" }}>
                              <div
                                style={{
                                  fontSize: 17,
                                  textAlign: "center",
                                  backgroundColor: "#f1f1f1",
                                  paddingLeft: 0,
                                  paddingRight: 0,
                                }}
                              >
                                Selengkapnya
                              </div>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-md-5">
                      <div className="widget widget-siaran">
                        <div className="list-type4">
                          <h4>
                            Siaran Hari ini : <br />
                            {hari}, {tanggal}
                          </h4>
                        </div>
                        <div
                          style={{ backgroundColor: "#DB0031" }}
                          className="list-type4"
                        >
                          <h5 style={{ color: "white", paddingLeft: 10 }}>
                            ON AIR :<br /> {onair?.acara ?? "--"}
                          </h5>
                        </div>
                        <div
                          className="list-type4"
                          style={{
                            overflow: "scroll",
                            overflowX: "hidden",
                            height: 250,
                          }}
                        >
                          <ol>
                            {jadwal.map((j, idx) => {
                              const isNow =
                                jam >= j.jam_awal && jam <= j.jam_akhir;
                              return (
                                <li key={idx}>
                                  {j.acara}
                                  {isNow ? (
                                    <span className="badge">Now</span>
                                  ) : (
                                    <>
                                      <br />
                                      <div style={{ fontSize: "0.8em" }}>
                                        {j.jam_awal} - {j.jam_akhir} WIB
                                      </div>
                                    </>
                                  )}
                                </li>
                              );
                            })}
                          </ol>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Our Program */}
          <div
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
          </div>

          {/* Kerjasama */}
          <div className="section nobottommargin" style={{ paddingTop: 0 }}>
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
                          src={base_url("assets") + "/kerjasamaygterjalin/" + img}
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
          </div>

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
                        <h3>{whoweare[`motto${num}` as keyof typeof whoweare]}</h3>
                        <p>{whoweare[`motto${num}sub` as keyof typeof whoweare]}</p>
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
                        <a href={base_url() + "assets/canvas/images/blog/full/17.jpg"} data-lightbox="image">
                          <img src={PATH_DIR + "ourexpertise/" + data.thumbnail} alt="Standard Post with Image" />
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
                  <div id="portfolio" className="portfolio row g-0 portfolio-reveal grid-container portfolio-home" key={idx}>
                    <article className="portfolio-item pf-media pf-icons">
                      <div className="grid-inner">
                        <div className="portfolio-image">
                          <a href="portfolio-single.html">
                            <img src={PATH_DIR + "ourexpertise/" + data.thumbnail} alt="Open Imagination" />
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
                  <div id="portfolio" className="portfolio row g-0 portfolio-reveal grid-container portfolio-home" key={idx}>
                    <article className="portfolio-item pf-media pf-icons">
                      <div className="grid-inner">
                        <div className="portfolio-image">
                          <a href="portfolio-single.html">
                            <img src={PATH_DIR + "ourexpertise/" + data.thumbnail} alt="Open Imagination" />
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