// Data halaman /redaksi.
// Ganti setiap teks dalam [kurung siku] dengan data asli redaksi Jateng News.
// Struktur tampilan ada di src/app/[lang]/redaksi/page.tsx dan tidak perlu diubah
// untuk sekadar mengganti nama, menambah orang, atau menambah peran.

export interface RedaksiPerson {
  role: string;
  name: string;
}

export interface RedaksiGroup {
  role: string;
  names: string[];
}

export const redaksiIntro =
  "Jateng News adalah portal berita yang menyajikan informasi seputar Jawa Tengah, powered by TVKU Semarang. Berikut susunan redaksi yang bertanggung jawab atas pemberitaan di situs ini.";

export const penerbit = {
  label: "Penerbit",
  value: "[Nama badan hukum penerbit]",
};

// Jajaran pimpinan: tampil sebagai kartu.
export const pimpinan: RedaksiPerson[] = [
  { role: "Pemimpin Umum", name: "[Nama Pemimpin Umum]" },
  { role: "Pemimpin Redaksi / Penanggung Jawab", name: "[Nama Pemimpin Redaksi]" },
  { role: "Wakil Pemimpin Redaksi", name: "[Nama Wakil Pemimpin Redaksi]" },
  { role: "Redaktur Pelaksana", name: "[Nama Redaktur Pelaksana]" },
];

// Tim redaksi: setiap peran berisi daftar nama.
export const timRedaksi: RedaksiGroup[] = [
  { role: "Redaktur / Editor", names: ["[Nama Editor 1]", "[Nama Editor 2]"] },
  { role: "Reporter", names: ["[Nama Reporter 1]", "[Nama Reporter 2]", "[Nama Reporter 3]"] },
  { role: "Fotografer / Kamerawan", names: ["[Nama Fotografer 1]"] },
  { role: "Editor Video", names: ["[Nama Editor Video 1]"] },
  { role: "Desain Grafis", names: ["[Nama Desainer 1]"] },
  { role: "Media Sosial", names: ["[Nama Admin Media Sosial 1]"] },
];

// Bagian di luar redaksi (opsional). Kosongkan array bila tidak dipakai.
export const manajemen: RedaksiPerson[] = [
  { role: "Marketing / Iklan", name: "[Nama Penanggung Jawab Iklan]" },
  { role: "IT / Pengembang Web", name: "[Nama Tim IT]" },
];

export const kontak = {
  alamat: "[Alamat lengkap kantor redaksi, Semarang, Jawa Tengah]",
  telepon: "[Nomor telepon redaksi]",
  whatsapp: "[Nomor WhatsApp redaksi]",
  email: "[email redaksi]",
  emailIklan: "[email iklan]",
};

export const hakJawab =
  "Sesuai Undang-Undang Nomor 40 Tahun 1999 tentang Pers dan Pedoman Pemberitaan Media Siber, pembaca berhak mengajukan hak jawab dan hak koreksi atas pemberitaan Jateng News. Kirimkan permohonan ke email redaksi dengan menyertakan tautan berita dan penjelasan bagian yang dimaksud.";
