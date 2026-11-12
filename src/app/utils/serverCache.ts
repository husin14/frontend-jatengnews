type CacheEntry<T> = {
  value: T;
  expiresAt: number;
};

const cache = new Map<string, CacheEntry<unknown>>();
const inFlight = new Map<string, Promise<unknown>>();

/**
 * Cache in-memory sederhana untuk data server-side.
 *
 * - Mengembalikan data dari cache selama belum kedaluwarsa.
 * - Menggabungkan request bersamaan dengan key yang sama (anti stampede).
 * - Jika fetch gagal tetapi masih ada data lama, data lama dipakai (stale-on-error)
 *   supaya halaman tidak ikut gagal hanya karena satu request error/429.
 */
export async function withServerCache<T>(
  key: string,
  ttlMs: number,
  fetcher: () => Promise<T>
): Promise<T> {
  const now = Date.now();
  const entry = cache.get(key);

  if (entry && entry.expiresAt > now) {
    return entry.value as T;
  }

  const pending = inFlight.get(key);
  if (pending) {
    return pending as Promise<T>;
  }

  const promise = fetcher()
    .then((value) => {
      cache.set(key, { value, expiresAt: Date.now() + ttlMs });
      return value;
    })
    .catch((error) => {
      const stale = cache.get(key);
      if (stale) {
        console.warn(`[serverCache] Serving stale data for "${key}" after fetch error.`);
        return stale.value as T;
      }
      throw error;
    })
    .finally(() => {
      inFlight.delete(key);
    });

  inFlight.set(key, promise);
  return promise;
}

/**
 * Hapus entri cache. Dipakai ketika response berhasil secara HTTP tetapi
 * bentuk datanya tidak valid, supaya response buruk tidak tersimpan sampai TTL.
 */
export function deleteServerCache(key: string): void {
  cache.delete(key);
  inFlight.delete(key);
}
