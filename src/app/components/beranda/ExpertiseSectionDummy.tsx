import React from "react";
import Image from "next/image";

type Expertise1 = {
    thumbnail: string;
    judul: string;
    deskripsi: string;
};

type Expertise2 = {
    thumbnail: string;
    judul: string;
};

export const ExpertiseSection2: React.FC = () => {
    const expertise1Data: Expertise1[] = [
        {
            thumbnail: "/images/tvku-logo.png",
            judul: "THE BEST LOCAL TELEVISION IN CENTRAL JAVA",
            deskripsi:
                "Education-based television that has been on the air since 2003. Committed to providing the best programs for viewers.",
        },
        {
            thumbnail: "/images/tvku-logo.png",
            judul: "THE MOST ACCURATE LOCAL NEWS PORTAL",
            deskripsi:
                "Become the best news portal in Central Java. Presenting actual and trusted news.",
        },
        {
            thumbnail: "/images/tvku-logo.png",
            judul: "PROFESIONAL EVENT ORGANIZER",
            deskripsi: "Providing event management services.",
        },
        {
            thumbnail: "/images/tvku-logo.png",
            judul: "DIGITAL MARKETING AGENCY",
            deskripsi:
                "Memberikan layanan pemasaran dengan menggunakan teknologi dan media digital. Layanan mencakup pemasaran media sosial.",
        },
    ];

    const expertise2_1: Expertise2[] = [
        {
            thumbnail: "/images/expertise1.jpg",
            judul: "Studio Production",
        },
        {
            thumbnail: "/images/expertise2.jpg",
            judul: "TV Talkshow",
        },
    ];

    const expertise2_2: Expertise2[] = [
        {
            thumbnail: "/images/expertise3.jpg",
            judul: "Control Room",
        },
        {
            thumbnail: "/images/expertise4.jpg",
            judul: "Award Event",
        },
    ];

    return (
        <div className="container clearfix mb-5">
            <div className="heading-block topmargin-lg center">
                <h2>HERE ARE SOME OF OUR EXPERTISE</h2>
                <div className="divider"><hr /></div>
            </div>
            <div className="row">
                {/* Left side */}
                <div className="col-lg-6 col-12">
                    {expertise1Data.map((item, idx) => (
                        <div className="grid-inner row g-0 mb-4" key={idx}>
                            <div className="col-md-4">
                                <div className="entry-image">
                                    <Image
                                        src={item.thumbnail}
                                        alt={item.judul}
                                        width={100}
                                        height={100}
                                    />
                                </div>
                            </div>
                            <div className="col-md-8 ps-md-4">
                                <div className="entry-title title-sm">
                                    <h5 className="mb-1 fw-bold text-uppercase">{item.judul}</h5>
                                </div>
                                <div className="entry-content entry-content-home">
                                    <p className="mb-0">{item.deskripsi}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right side - 2 columns with 2 images each */}
                <div className="col-lg-3 col-12">
                    {expertise2_1.map((item, idx) => (
                        <div
                            id="portfolio"
                            className="portfolio row g-0 portfolio-reveal grid-container portfolio-home mb-4"
                            key={idx}
                        >
                            <article className="portfolio-item pf-media pf-icons">
                                <div className="grid-inner">
                                    <div className="portfolio-image overflow-hidden rounded shadow-sm">
                                        <a href="#">
                                            <Image
                                                src={item.thumbnail}
                                                alt={item.judul}
                                                width={300}
                                                height={200}
                                                className="img-fluid hover-zoom"
                                                style={{
                                                    transition: "transform 0.3s ease",
                                                }}
                                                onMouseOver={(e) =>
                                                    (e.currentTarget.style.transform = "scale(1.05)")
                                                }
                                                onMouseOut={(e) =>
                                                    (e.currentTarget.style.transform = "scale(1)")
                                                }
                                            />
                                        </a>
                                    </div>
                                </div>
                            </article>
                        </div>
                    ))}
                </div>

                <div className="col-lg-3 col-12">
                    {expertise2_2.map((item, idx) => (
                        <div
                            id="portfolio"
                            className="portfolio row g-0 portfolio-reveal grid-container portfolio-home mb-4"
                            key={idx}
                        >
                            <article className="portfolio-item pf-media pf-icons">
                                <div className="grid-inner">
                                    <div className="portfolio-image overflow-hidden rounded shadow-sm">
                                        <a href="#">
                                            <Image
                                                src={item.thumbnail}
                                                alt={item.judul}
                                                width={300}
                                                height={200}
                                                className="img-fluid hover-zoom"
                                                style={{
                                                    transition: "transform 0.3s ease",
                                                }}
                                                onMouseOver={(e) =>
                                                    (e.currentTarget.style.transform = "scale(1.05)")
                                                }
                                                onMouseOut={(e) =>
                                                    (e.currentTarget.style.transform = "scale(1)")
                                                }
                                            />
                                        </a>
                                    </div>
                                </div>
                            </article>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
