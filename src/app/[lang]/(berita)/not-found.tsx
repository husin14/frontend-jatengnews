import Link from "next/link";

export default function BeritaNotFound() {
  return (
    <div className="col-12 text-center py-5">
      <h1 className="fw-bold mb-3">404</h1>
      <p className="mb-4">Halaman yang Anda cari tidak ditemukan.</p>
      <Link href="/" className="button button-rounded button-large">
        Kembali ke Beranda
      </Link>
    </div>
  );
}
