// Utilitas localStorage untuk iklan: rate-limit (dedup 30 detik) impresi & klik,
// plus status popup iklan YouTube. "User yang sama" berarti browser yang sama.

// Prefix key localStorage per jenis pencatatan
const STORAGE_PREFIX_IMPRESSION = "tvku_ads_impression_";
const STORAGE_PREFIX_CLICK = "tvku_ads_click_";
// Jika sudah tercatat dalam 30 detik terakhir, pencatatan baru di-skip
const DEDUP_WINDOW_MS = 30_000;

// Ambil timestamp pencatatan terakhir (0 = belum pernah)
const readLastRecorded = (prefix: string, id: string): number => {
  try {
    const raw = window.localStorage.getItem(prefix + id);
    return raw ? Number(raw) || 0 : 0;
  } catch {
    return 0;
  }
};

// Simpan timestamp pencatatan terakhir
const saveRecorded = (prefix: string, id: string) => {
  try {
    window.localStorage.setItem(prefix + id, String(Date.now()));
  } catch {}
};

// Hapus timestamp pencatatan (dipakai saat POST gagal agar bisa dicoba lagi)
const clearRecorded = (prefix: string, id: string) => {
  try {
    window.localStorage.removeItem(prefix + id);
  } catch {}
};

// true jika id sudah tercatat dalam jendela 30 detik terakhir
const isWithinWindow = (prefix: string, id: string): boolean => {
  const last = readLastRecorded(prefix, id);
  return last > 0 && Date.now() - last < DEDUP_WINDOW_MS;
};

// Popup besar hanya tampil 1x per hari per visitor; reset otomatis saat tanggal lokal berubah (00.00).
const STORAGE_KEY_POPUP_LARGE = "tvku_popup_iklan_large_date";

const getLocalDateKey = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const isLargePopupIklanShownToday = (): boolean => {
  try {
    return window.localStorage.getItem(STORAGE_KEY_POPUP_LARGE) === getLocalDateKey();
  } catch {
    return false;
  }
};

const markLargePopupIklanShown = (): void => {
  try {
    window.localStorage.setItem(STORAGE_KEY_POPUP_LARGE, getLocalDateKey());
  } catch {}
};

export {
  STORAGE_PREFIX_IMPRESSION,
  STORAGE_PREFIX_CLICK,
  DEDUP_WINDOW_MS,
  readLastRecorded,
  saveRecorded,
  clearRecorded,
  isWithinWindow,
  STORAGE_KEY_POPUP_LARGE,
  isLargePopupIklanShownToday,
  markLargePopupIklanShown,
};
