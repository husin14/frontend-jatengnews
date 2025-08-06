import React from "react";
import axios from "axios";
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
  const baseurl = process.env.NEXT_PUBLIC_BASE_URL;

  const beritaUrl =
    lang === "en"
      ? `${baseurl}/berita-translations?per_page=6`
      : `${baseurl}/berita?per_page=6`;

  const ourExpertise1Url =
    lang === "en"
      ? `${baseurl}/home/our-expertise1-translations`
      : `${baseurl}/home/our-expertise1`;

  const ourExpertise2Url =
    lang === "en"
      ? `${baseurl}/home/our-expertise2-translations`
      : `${baseurl}/home/our-expertise2`;
  const [
    sliderRes,
    beritaTerbaruRes,
    jadwalTayangRes,
    ourProgramRes,
    whoweareRes,
    ourExpertise1Res,
    ourExpertise2Res,
  ] = await Promise.all([
    axios.get(`${baseurl}/home/slider`),
    axios.get(beritaUrl),
    axios.get(`${baseurl}/jadwal-acara`),
    axios.get(`${baseurl}/our-programs`),
    axios.get(`${baseurl}/home/who-we-are`),
    axios.get(ourExpertise1Url),
    axios.get(ourExpertise2Url),
  ]);

  const slider = sliderRes.data;
  const beritaTerbaru = beritaTerbaruRes.data;
  const jadwalTayang = jadwalTayangRes.data;
  const ourProgram = ourProgramRes.data;
  const whoweare = whoweareRes.data;
  const ourExpertise1 = ourExpertise1Res.data;
  const ourExpertise2 = ourExpertise2Res.data;

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
