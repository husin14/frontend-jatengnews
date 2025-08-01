import React from "react";
import axios from "axios";
import SliderSection from "../../components/beranda/SliderSection";
import { BeritaTerbaruSection } from "../../components/beranda/BeritaTerbaruSection";
import { jadwalAcara } from "../../types";
import { OurProgramSection } from "../../components/beranda/OurProgramSection";
import { KerjasamaSection } from "../../components/beranda/KerjasamaSection";
import { WhoWeAre } from "../../components/beranda/WhoWeAre";
import { ExpertiseSection } from "../../components/beranda/ExpertiseSection";

export default async function Home() {
  const { data: slider } = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/home/slider`,
  );
  const { data: beritaTerbaru } = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/berita?per_page=6`,
  );
  const { data: jadwalTayang } = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/jadwal-acara`,
  );
  const { data: ourProgram } = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/our-programs`,
  );
  const { data: whoweare } = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/home/who-we-are`,
  );
  const { data: ourExpertise1 } = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/home/our-expertise1`,
  );
  const { data: ourExpertise2 } = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/home/our-expertise2`,
  );

  // console.log("Slider Data:", slider);
  // console.log("Berita Terbaru Data:", beritaTerbaru);
  // console.log("jadwal terbaru", jadwalTayang);
  // console.log("our program", ourProgram);
  // console.log("Who We Are Data:", whoweare);
  // console.log("Our Expertise 1 Data:", ourExpertise1);
  // console.log("Our Expertise 2 Data:", ourExpertise2);

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
