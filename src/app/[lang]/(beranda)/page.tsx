import React from "react";
import apiClient from "../../utils/apiClient";
import SliderSection from "../../components/beranda/SliderSection";
import { BeritaTerbaruSection } from "../../components/beranda/BeritaTerbaruSection";
import { jadwalAcara } from "../../types";
import { OurProgramSection } from "../../components/beranda/OurProgramSection";
import { KerjasamaSection } from "../../components/beranda/KerjasamaSection";
import { WhoWeAre } from "../../components/beranda/WhoWeAre";
import { ExpertiseSection } from "../../components/beranda/ExpertiseSection";

export default async function Home({
  params,
}: {
  params: Promise<{ lang: "id" | "en" }>;
}) {
  const { lang } = await params;

  const beritaUrl =
    lang === "en"
      ? `/berita-translations?per_page=6`
      : `/berita?per_page=6`;

  const ourExpertise1Url =
    lang === "en"
      ? `/home/our-expertise1-translations`
      : `/home/our-expertise1`;

  const ourExpertise2Url =
    lang === "en"
      ? `/home/our-expertise2-translations`
      : `/home/our-expertise2`;

  let slider, beritaTerbaru, jadwalTayang, ourProgram, whoweare, ourExpertise1, ourExpertise2;

  try {
    const [
      sliderRes,
      beritaTerbaruRes,
      jadwalTayangRes,
      ourProgramRes,
      whoweareRes,
      ourExpertise1Res,
      ourExpertise2Res,
    ] = await Promise.all([
      apiClient.get(`/home/slider`),
      apiClient.get(beritaUrl),
      apiClient.get(`/jadwal-acara`),
      apiClient.get(`/our-programs-static`),
      apiClient.get(`/home/who-we-are`),
      apiClient.get(ourExpertise1Url),
      apiClient.get(ourExpertise2Url),
    ]);

    slider = sliderRes.data;
    beritaTerbaru = beritaTerbaruRes.data;
    jadwalTayang = jadwalTayangRes.data;
    ourProgram = ourProgramRes.data;
    whoweare = whoweareRes.data;
    ourExpertise1 = ourExpertise1Res.data;
    ourExpertise2 = ourExpertise2Res.data;
  } catch (error) {
    console.error("Failed to fetch data for Home page. Check your NEXT_PUBLIC_BASE_URL and API health.");
    // In a real app, you might want to redirect to an error page or show a fallback UI
    throw error; // Re-throw to trigger Next.js error boundary/page
  }

  const expertiseData = {
    expertise1: ourExpertise1?.data || [],
    expertise2_1:
      ourExpertise2?.data?.slice(0, Math.ceil(ourExpertise2.data.length / 2)) ||
      [],
    expertise2_2:
      ourExpertise2?.data?.slice(Math.ceil(ourExpertise2.data.length / 2)) ||
      [],
  };

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
        }`,
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
            activelang={lang}
          />
          {/* Our Program */}
          <OurProgramSection list_program={ourProgram?.data} />
          {/* Kerjasama */}
          <KerjasamaSection />
          {/* Who We Are */}
          {whoweare?.data && whoweare.data.length > 0 && (
            <WhoWeAre data={whoweare.data[0]} />
          )}
          {/* Expertise */}
          <ExpertiseSection data={expertiseData} />
        </div>
      </section>
    </div>
  );
}
