import { notFound } from "next/navigation";
import KategoriBeritaClient from "./KategoriBeritaClient";

export default async function KategoriBeritaPage({
  params,
}: {
  params: Promise<{ lang: string; id_kategori: string }>;
}) {
  const { id_kategori } = await params;

  if (!/^\d+$/.test(id_kategori)) {
    notFound();
  }

  return <KategoriBeritaClient />;
}
