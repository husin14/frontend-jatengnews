"use client";

import { useEffect } from "react";
import apiClient from "@/app/utils/apiClient";

// Prefix key localStorage untuk menyimpan waktu impresi terakhir per banner
const STORAGE_PREFIX = "tvku_ads_impression_";
// Jika refresh dan banner yang sama sudah tercatat dalam 30 detik terakhir,
// impresi baru tidak dihitung (dedup antar refresh).
const DEDUP_WINDOW_MS = 30_000;

// Ambil timestamp impresi terakhir untuk sebuah banner (0 = belum pernah)
const readLastImpression = (id: string): number => {
  try {
    const raw = window.localStorage.getItem(STORAGE_PREFIX + id);
    return raw ? Number(raw) || 0 : 0;
  } catch {
    return 0;
  }
};

// Simpan timestamp impresi terakhir untuk sebuah banner
const saveImpression = (id: string) => {
  try {
    window.localStorage.setItem(STORAGE_PREFIX + id, String(Date.now()));
  } catch {}
};

// Hapus timestamp impresi sebuah banner
const clearImpression = (id: string) => {
  try {
    window.localStorage.removeItem(STORAGE_PREFIX + id);
  } catch {}
};

/**
 * Hook untuk mencatat "impression" banner iklan.
 *
 * Cara kerja (alur sederhana):
 * 1. Setiap 500ms, hook memindai semua elemen <div data-banner-id="...">
 *    yang sudah dirender oleh halaman (disisipkan backend di dalam deskripsi berita).
 * 2. Untuk setiap banner yang BELUM dihitung, cek dulu riwayat di localStorage:
 *    - Jika banner yang sama sudah tercatat impresinya < 30 detik lalu
 *      (misalnya habis refresh), banner langsung dilewati / tidak dihitung lagi.
 * 3. Hitung berapa persen bagian banner yang terlihat di layar memakai
 *    getBoundingClientRect(). Jika minimal 70% terlihat, mulai timer 1 detik.
 *    Setelah 1 detik penuh banner masih dianggap terlihat, kirim POST
 *    /ads-impression ke backend untuk mencatat impression, lalu simpan
 *    timestamp-nya ke localStorage.
 * 4. Setiap banner hanya dihitung SATU KALI per kunjungan halaman (Set "counted"),
 *    dan di-skip jika masih dalam jendela 30 detik sejak impresi terakhir.
 *    Jika user scroll melewati banner sebelum 1 detik, timer dibatalkan.
 *
 * Pendekatan memakai polling interval (bukan hanya event scroll) supaya tetap
 * bekerja walau banner sudah terlihat sejak awal tanpa perlu user scroll.
 */
export default function useBannerImpression(trigger?: unknown) {
  useEffect(() => {
    // id banner yang sudah tercatat, agar tidak dihitung berulang kali
    const counted = new Set<string>();
    // timer 1 detik yang sedang berjalan per banner
    const timers = new Map<string, ReturnType<typeof setTimeout>>();
    // interval pemindai banner
    let interval: ReturnType<typeof setInterval> | null = null;
    // agar pesan "found N banner element(s)" hanya dicetak sekali
    let logged = false;

    const log = (...args: unknown[]) => {
      if (process.env.NODE_ENV === "development") {
        console.log("[banner-impression]", ...args);
      }
    };

    // Kirim POST /ads-impression untuk mencatat impression banner
    const postImpression = (id: string) => {
      if (counted.has(id)) return;
      counted.add(id);
      apiClient
        .post("/ads-impression", { ads_id: Number(id) })
        .then(() => {
          // simpan waktu impresi agar tidak dihitung lagi bila refresh < 30 detik
          saveImpression(id);
          log(`recorded impression for banner ${id}`);
        })
        .catch((err) => {
          // gagal dikirim -> hapus dari counted & riwayat agar bisa dicoba lagi
          counted.delete(id);
          clearImpression(id);
          console.error(`[banner-impression] failed to record banner ${id}`, err);
        });
    };

    // Periksa visibilitas semua banner di layar
    const check = () => {
      const elements = document.querySelectorAll<HTMLElement>("[data-banner-id]");

      if (!logged) {
        logged = true;
        log(`found ${elements.length} banner element(s)`);
      }

      // asumsikan semua banner sudah terhitung; jika ada yang belum, jadi false
      let allCounted = true;

      // tinggi area viewport yang terlihat
      const vh = window.innerHeight || document.documentElement.clientHeight;

      elements.forEach((el) => {
        const id = el.dataset.bannerId;
        if (!id) return;

        // masih ada banner yang belum dihitung
        if (!counted.has(id)) allCounted = false;
        // lewati yang sudah dihitung atau sedang menunggu timer
        if (counted.has(id) || timers.has(id)) return;

        // dedup antar refresh: banner yang sama tercatat < 30 detik lalu -> skip
        const lastImpression = readLastImpression(id);
        if (lastImpression > 0 && Date.now() - lastImpression < DEDUP_WINDOW_MS) {
          counted.add(id);
          log(`banner ${id}: impresi baru di-skip (masih dalam jendela 30 detik)`);
          return;
        }

        // posisi & ukuran banner relatif terhadap viewport
        const rect = el.getBoundingClientRect();
        // kalau tingginya 0 (gambar belum load / tidak tampil), lewati dulu
        if (rect.height <= 0) return;

        // tinggi bagian banner yang benar-benar terlihat di dalam viewport
        const visibleHeight =
          Math.max(0, Math.min(rect.bottom, vh) - Math.max(rect.top, 0));
        // persentase banner yang terlihat (dibatasi maks 100%)
        const ratio = Math.min(1, visibleHeight / rect.height);

        // minimal 70% banner terlihat -> mulai hitung mundur 1 detik
        if (ratio >= 0.7) {
          log(`banner ${id}: ratio=${ratio.toFixed(2)}, starting 1s timer`);
          timers.set(
            id,
            setTimeout(() => {
              // setelah 1 detik penuh, catat impression
              timers.delete(id);
              postImpression(id);
            }, 1000)
          );
        }
      });

      // kalau semua banner sudah terhitung, hentikan interval (hemat resource)
      if (allCounted && interval) {
        clearInterval(interval);
        interval = null;
      }
    };

    // pemicu ekstra saat user scroll / resize / halaman selesai dimuat
    const onScroll = () => requestAnimationFrame(check);

    check();
    interval = setInterval(check, 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("load", check);

    // bersih-bersih saat komponen dilepas / trigger berubah
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("load", check);
      if (interval) clearInterval(interval);
      timers.forEach((t) => clearTimeout(t));
      timers.clear();
    };
  }, [trigger]);
}
