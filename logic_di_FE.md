# Logic di FE yang Seharusnya Berada di API

Catatan hasil audit frontend `frontend-tvku-public` terhadap backend `api-tvku-laravel`.
Semua line reference sudah diverifikasi manual terhadap source saat penulisan.

- **Tanggal audit**: 2026-10-05
- **Commit FE**: `59f6e72` — *feat(berita): use latest news per kategori*
- **Cakupan**: seluruh `src/app/**` (55 file)
- **Status**: dokumen ini hanya catatan, **belum ada perbaikan yang dikerjakan**

---

## Ringkasan

Audit ini menemukan bahwa sebagian besar masalah yang tersisa justru ada di FE, bukan di API.
Dari temuan yang ada:

| Kategori | Jumlah | Keterangan |
|---|---|---|
| **A** — Butuh perubahan/penambahan API | 5 | Logic bisnis benar-benar ada di FE |
| **B** — FE-only, API sudah benar | 6 | FE salah memakai data / memakai data palsu / over-fetch |
| **C** — Duplikasi FE | 4 | Bukan urusan backend, tapi perlu dirapikan |

> **Penting**: Mayoritas temuan (**B**) justru tidak perlu menyentuh API sama sekali — API
> sudah mengirim data yang benar, FE yang tidak memakainya. Kerjakan B lebih dulu: gratis
> dan dampaknya besar.

---

## Bagian A — Butuh perubahan API

### A1. Related posts di halaman detail berita ⭐ (prioritas tertinggi)

**Status**: API **sudah menghitung** related berita, tapi tidak mengirimnya ke FE. FE jadi
fetch ulang satu halaman penuh kategori dan melakukan filter sendiri.

**Bukti API** — `api-tvku-laravel/app/Http/Controllers/Api/BeritaController.php:676-682`

```php
$relatedBerita = Berita::with('translations')
    ->where('id', '!=', $berita->id)
    ->where('id_kategori', $berita->id_kategori)
    ->where('publish', 1)
    ->latest('id')
    ->limit(5)
    ->get();
```

Data ini hanya dipakai untuk menyisipkan link "baca juga" ke HTML (`applyBacaJuga`,
`BeritaController.php:689`), lalu **tidak ikut di response** — `BeritaController.php:697`
hanya `return response()->json($berita, ...)`.

**Bukti FE** — `src/app/[lang]/berita/show/[slug]/page.tsx:100-116`

```tsx
const relatedUrl =
  lang === "en"
    ? `/berita-translations?language_code=en&id_kategori=${idKategori}&current_page=1`
    : `/berita-public?id_kategori=${idKategori}&current_page=1`;

const response = await apiClient.get(relatedUrl);
const items = response.data?.data || [];

// Saring berita saat ini agar tidak muncul di related posts
const filtered = items
  .filter((item: berita) => item.id !== berita.id)
  .slice(0, 4);
```

**Dampak**: satu round-trip penuh (default 20 baris, termasuk `deskripsi` HTML panjang)
diambil untuk menampilkan 4 item. Di Tekanan juga oleh throttle global `60/1` di
`api-tvku-laravel/bootstrap/app.php:28`.

**Usulan**: tambahkan key `related` pada response `publicShow`

```php
return response()->json([
    'data' => $berita,
    'related' => $relatedBerita,
], Response::HTTP_OK);
```

Hapus `fetchRelated` + state `relatedBerita` di FE.

**Catatan**: `publicShow` saat ini mengembalikan object polos (bukan `{data: ...}`).
Kalau dibungkus jadi `{data, related}`, FE yang membacanya di `show/[slug]/page.tsx:68-79`
harus disesuaikan.

---

### A2. Status "on air" untuk jadwal acara

**Status**: FE menentukan acara yang sedang tayang sendiri, dan logikanya diduplikasi di 2 file.

**Bukti FE** — `src/app/[lang]/(beranda)/page.tsx:106-133` (duplikat di
`src/app/components/beranda/BeritaTerbaruSection.tsx:162-170`)

```tsx
const timeToFloat = (timeStr: string) => {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours + (minutes || 0) / 60;
};

const currentProgram = jadwalTayang.data.find((program: jadwalAcara) => {
  const jamAwal = timeToFloat(program.jam_awal);
  const jamAkhir = timeToFloat(program.jam_akhir);
  return jam >= jamAwal && jam < jamAkhir;
});
```

**Bukti API** — `api-tvku-laravel/app/Http/Controllers/Api/JadwalAcaraController.php:76-109`
(`indexPublic`) hanya menerima `id_hari`, mengurutkan `jam_awal asc`, dan mengembalikan
`['data' => ...]`. Tidak ada `is_on_air`, tidak ada parameter waktu.

**Dampak**: FE menebak-nebak zona waktu (label "WIB" di-hardcode di
`BeritaTerbaruSection.tsx:180`) dan hasilnya bisa salah kalau server berbeda zona waktu.

**Usulan**: tambahkan flag `is_on_air` per baris di `/jadwal-acara-public`, dihitung di
server dengan zona waktu `Asia/Jakarta`. Cukup 1 endpoint, tidak perlu endpoint baru.

---

### A3. ID kategori yang di-hardcode di FE

| Nilai | Lokasi | Kegunaan |
|---|---|---|
| `19` | `src/app/[lang]/berita/page.tsx:52-53` | Slot "Feature" |
| `27` | `src/app/components/navbar.tsx:156-159` | Fallback cari kategori "Pendidikan" |
| `27` | `src/app/components/navbar.tsx:254-257` | Duplikat dari baris di atas |

**Masalah**: kategori di-hardcode sebagai angka. Kalau admin membuat atau mengubah kategori
di CMS, FE menampilkan kategori yang salah atau kosong. Pencarian juga mencampur nama
Indonesia (`cat.nama.toLowerCase() === "pendidikan"`) dengan ID numerik.

**Usulan**: pakai `slug` (yang sudah ada di `tb_kategori`), atau tambahkan flag CMS
`is_feature` / kolom `weight`. Untuk slot Feature, endpoint khusus `GET /home/feature`
juga bisa dipakai supaya FE tidak perlu tahu soal ID.

---

### A4. Urutan kategori di navbar ditentukan FE

**Bukti FE** — `src/app/components/navbar.tsx:83-103`

```tsx
const sortedCategories = useMemo(() => {
  const moveToFront = ["pendidikan", "kesehatan"];
  const moveToBack = ["pemilu", "liputan khusus"];

  const frontItems: KategoriType[] = [];
  const backItems: KategoriType[] = [];
  const middleItems: KategoriType[] = [];

  categories.forEach((cat) => {
    const name = cat.nama.toLowerCase();
    if (moveToFront.includes(name)) {
      frontItems.push(cat);
    } else if (moveToBack.includes(name)) {
      backItems.push(cat);
    } else {
      middleItems.push(cat);
    }
  });

  return [...frontItems, ...middleItems, ...backItems];
}, [categories]);
```

**Masalah**: ini keputusan editorial (prioritas navigasi) yang ditulis sebagai kode, memakai
nama kategori berbahasa Indonesia. Di route `/en` nama kategori sudah diterjemahkan, jadi
bucket ini tidak akan cocok.

**Kabar baik**: API **sudah** mendukung sorting — `KategoriController.php:49-54` sudah
menangani `sort=urutan_asc` dan `sort=urutan_desc` untuk kolom `urutan` yang sudah ada di
`tb_kategori`. Jadi ini tidak butuh skema DB — cukup FE memakai `?sort=urutan_asc`.
(Hanya jika `urutan` memang dimaksudkan sebagai prioritas navigasi; kalau tidak, perlu kolom
`weight` baru.)

---

### A5. Konversi HTML → teks di FE (6x)

**Bukti FE** — 4 file, 6 pemanggilan dengan kode identik:

```tsx
deskripsi: convert(item.deskripsi, {
  selectors: [{ selector: "img", format: "skip" }],
}),
```

| File | Baris |
|---|---|
| `src/app/[lang]/berita/page.tsx` | 73, 80, 91 |
| `src/app/[lang]/berita/beritaterbaru/page.tsx` | 49 |
| `src/app/[lang]/berita/[id_kategori]/page.tsx` | 59 |
| `src/app/[lang]/berita/search/page.tsx` | 46 |

**Usulan**: API menyertakan field teks polos / excerpt (mis. `deskripsi_teks`) sehingga
browser tidak perlu menjalankan parser HTML untuk tiap list, dan crawler melihat teks yang
sama dengan yang ditampilkan.

**Status**: opsional. `convert()` adalah urusan presentasi dan masih wajar di FE. Yang perlu
diperbaiki minimal: panggil **satu kali** lewat util `toPlainText()` di `src/app/utils/`
agar tidak 6x duplikat.

---

## Bagian B — FE-only (API sudah benar, FE yang salah)

### B1. View count palsu dari `Math.random()` ⭐ (19 tempat, 8 file)

FE menampilkan angka acak **200–999** sebagai jumlah dilihat. Angka ini berubah-ubah setiap
re-render.

```tsx
{item.views || Math.floor(Math.random() * (999 - 200 + 1) + 200)}
```

| File | Baris |
|---|---|
| `src/app/[lang]/berita/page.tsx` | 163, 166, 218, 221, 299, 344, 394, 440, 503, 585 |
| `src/app/[lang]/berita/show/[slug]/page.tsx` | 208, 285 |
| `src/app/components/sideBar.tsx` | 63, 116 |
| `src/app/components/carousel.tsx` | 173 |
| `src/app/components/NewsList.tsx` | 56 |
| `src/app/components/navbar.tsx` | 360 |
| `src/app/components/beranda/BeritaTerbaruSection.tsx` | 108 |
| `src/app/components/detail-berita.tsx` | 44 |

**Kabar baik — API sudah mengirim data aslinya**: kolom `open` ada di `tb_berita` dan tidak
di-`$hidden`, jadi sudah ikut di semua payload berita — termasuk path terjemahan, karena
`BeritaController.php:157` menyalin `open` dari berita master.

**Akar masalah**: FE membaca `item.views`, padahal field itu tidak pernah ada di payload.
`src/app/types.ts:43` mendeklarasikan `views?: number` — itulah yang membuat FE mengira field
tersebut ada. `carousel.tsx:173` dan `NewsList.tsx:56` bahkan mengabaikan `item.views` sama
sekali dan selalu menampilkan angka acak.

**Perbaikan**: baca `item.open`, hapus deklarasi `views` dari `types.ts`.
Tidak perlu perubahan API sama sekali.

---

### B2. `per_page` tidak dikirim — over-fetch di 5 tempat

API sudah mendukung `per_page` (default 20) di semua endpoint berita, tapi FE membiarkan
default-nya dan melakukan slicing sendiri di JS.

API **tidak punya** param `limit` — yang ada `per_page` (`BeritaController.php:482`). Dan
`?page=` diabaikan karena ada custom `Paginator::currentPageResolver`
(`BeritaController.php:498`), jadi harus pakai `current_page`.

| Lokasi | Request saat ini | Butuh |
|---|---|---|
| `src/app/components/carousel.tsx:30` | `/berita-public?sort=populer` (merender semua baris di `:139`) | `per_page=6` |
| `src/app/[lang]/berita/show/[slug]/page.tsx:130-133` | `/berita-public` (`slice(0,5)` di `:148`) | `per_page=5` |
| `src/app/[lang]/berita/show/[slug]/page.tsx:135-138` | `/berita-public?sort=populer` (`slice(0,5)` di `:149`) | `per_page=5` |
| `src/app/[lang]/berita/page.tsx:47-48` | `/berita-public` (pakai sampai indeks 10, `slice(7,11)` di `:409`) | `per_page=11` |
| `src/app/components/navbar.tsx:127` | `/berita-public?id_kategori=${id}` (`slice(0,3)` di `:319`) | `per_page=3` |

**Perbaikan**: cukup tambahkan `per_page=N` di URL.

---

### B3. `last_page` diabaikan, `total` dihitung ulang di FE

**Bukti FE** — `src/app/[lang]/(beranda)/program/page.tsx:88-93`

```tsx
const apiUrl =
  lang === "en"
    ? `/our-programs-translation?sort=id_asc&current_page=${currentPage}&per_page=6`
    : `/our-programs?sort=id_asc&current_page=${currentPage}&per_page=6`;

const response = await apiClient.get(apiUrl);
setPrograms(response.data.data);
setTotalPages(Math.ceil(response.data.total / 6));
```

**Kabar baik**: `OurProgramsController.php:53` sudah mengirim `last_page`. FE cuma
menghitung ulang dengan `Math.ceil(total / 6)` — dan angka `6` ikut diduplikasi di query
string dan di kalkulasi.

**Perbaikan**: `setTotalPages(response.data.last_page)`.

---

### B4. `slice(0, 7)` yang sudah redundant

**Bukti FE** — `src/app/[lang]/(beranda)/seputarudinus/page.tsx:36`

```tsx
const relatedSlides = item.sliders.slice(0, 7);
```

Diulang di file yang sama, `:244` — dan hasilnya hanya dipakai sebagai cek panjang, karena
render-nya didelegasikan ke `<SliderRow>` yang menghitung ulang di `:36`.

**Kabar baik**: `SeputarDinusSlidesTitleController.php:26-30` sudah membatasi 7 slide per
judul di sisi server:

```php
$allSliders = SeputarDinusSlider::whereIn('id_slides_title', $titleIds)
    ->orderBy('id', 'desc')
    ->get()
    ->groupBy('id_slides_title')
    ->map(fn($group) => $group->take(7));
```

**Perbaikan**: hapus kedua `slice`, pakai `item.sliders` langsung.

---

### B5. Endpoint yang salah / param yang tidak didukung

| # | Lokasi FE | Masalah |
|---|---|---|
| 1 | `[lang]/(beranda)/program/page.tsx:88` | Panggil `/our-programs-translation` (tunggal). Route sebenarnya `/our-programs-translations` (jamak, `routes/api.php:65`) → **404 di halaman `/en/program`** |
| 2 | `[lang]/berita/search/page.tsx:34` | Hardcode `/berita-public?search=...`, mengabaikan `lang`. Di `/en` seharusnya mencari versi terjemahan |
| 3 | `components/navbar.tsx:126` | Untuk `en` mengambil **berita** tapi memanggil endpoint **kategori** (`/kategori-translations?language_code=en&kategori_id=...`). Selain itu `kategori_id` **tidak didukung** `KategoriController@indexTranslations` (`:72-118`), jadi filter-nya diabaikan diam-diam |
| 4 | `components/carousel.tsx:169` | Render `{new Date().toLocaleDateString()}` — **tanggal hari ini**, bukan tanggal berita. Mestinya `item.waktu` |
| 5 | `[lang]/berita/page.tsx:135, 189` | Fallback gambar memakai hostname dev: `` `https://apidev.tvku.tv/storage/${item.cover}` ``. Cabang ini cuma jalan saat `cover` falsy, jadi hasilnya URL seperti `.../storage/undefined` |

---

### B6. Dead code yang membuang bandwidth

**`src/app/components/footer.tsx`** — 3 variabel state dideklarasikan tapi **tidak pernah
dibaca** (verifikasi: `cleanDeskripsi` hanya muncul di baris 10 dan 25, `kategoriList` di 11
dan 35, `showAllTags` hanya di 12; nol pembacaan). Padahal ada 2 request di `useEffect`:

```tsx
// footer.tsx:7
import { htmlToText } from "html-to-text";   // <-- TIDAK ADA di html-to-text v9

// footer.tsx:17 dan :33
apiClient.get(`/berita-public`);
apiClient.get(`/kategori`);
```

`package.json` mem-pin `html-to-text: ^9.0.5`, yang tidak mengekspor `htmlToText` (v9
mengekspor `convert`, `compile`, `Formatters`). Panggilan di `:22` melempar `TypeError`,
tertangkap `catch` di `:26`, jadi seluruh blok mati. Komponen hanya me-render 2 logo + ikon
sosial dengan `href="#"`.

**Perbaikan**: hapus `useEffect` + 3 state + import yang tidak terpakai.

**`src/app/components/detail-berita.tsx:17`** — fetch endpoint yang tidak ada sama sekali:

```tsx
const res = await fetch(`/api/berita/${id}`);
```

Tidak ada route `/api/berita/{id}` di project ini — API juga sudah tidak memakai prefix
`/api` sejak `bootstrap/app.php:12`. Komponen ini tidak pernah dipakai → hapus.

---

## Bagian C — Duplikasi di FE (bukan urusan backend)

| # | Helper | Definisi | Dibypass di |
|---|---|---|---|
| C1 | `getKategoriName` / `getKategori` | `[lang]/berita/page.tsx:11-29` | `carousel.tsx:154`, `navbar.tsx:339`, `show/[slug]/page.tsx:178` dan `:226`, `[id_kategori]/page.tsx:119` — semuanya render `item.kategori.nama` polos, **jadi nama kategori tidak pernah ter-i18n di route `/en`** |
| C2 | `formatDate` (`utils/dateFormatter.ts`) | sudah tersedia | `berita/page.tsx:493-500` (hardcode `"id-ID"`, jadi bulan Indonesia muncul di halaman `/en`), `NewsList.tsx:46-53`, `carousel.tsx:169` |
| C3 | `timeToFloat` | `[lang]/(beranda)/page.tsx:108-112` | duplikat identik di `beranda/BeritaTerbaruSection.tsx:163-167` |
| C4 | `getPageRange` | `components/Pagination.tsx:16-52` | di-inline ulang lengkap dengan markup `<ul class="pagination pagination-rounded">` di `[lang]/(beranda)/seputarudinus/title/[id]/page.tsx:56-94` dan `:174-239` |

**Perbaikan**: pindahkan `getKategoriName`, `getKategori`, `timeToFloat`, dan `getPageRange`
ke `src/app/utils/`, lalu pakai helper yang sudah ada. Tidak ada perubahan API.

---

## Catatan lain (di luar scope)

- **Response envelope tidak konsisten** — `/berita-public/{slug}` (`publicShow`) mengembalikan
  object polos, sementara `/berita-translations` mengembalikan `{data: [...]}`. FE harus
  bercabang di 4 tempat: `show/[slug]/page.tsx:72-79`, `[id_kategori]/page.tsx:66-74`,
  `seputarudinus/content/[id]/page.tsx:25`, `seputarudinus/title/[id]/page.tsx:37`.
- **`dangerouslySetInnerHTML` tanpa sanitasi** — 4 sumber HTML dari DB di-inject apa adanya:
  `show/[slug]/page.tsx:235`, `seputarudinus/content/[id]/page.tsx:97`,
  `iklan/[id]/page.tsx:117`, `detail-berita.tsx:63`. Tidak ada DOMPurify di `package.json`.
  Sanitasi idealnya dilakukan di API.
- **URL absolut seharusnya dari API** — FE merakit sendiri URL gambar
  (`seputarudinus/page.tsx:134`, `seputarudinus/title/[id]/page.tsx:144`) dan menebak
  `youtube_id` dari `link` dengan regex (`yt-preview.tsx:11-15`,
  `seputarudinus/content/[id]/page.tsx:61-69`, dengan sentinel `let youtubeId = "aaa"`).
- **Placeholder yang belum jadi** — `KerksamSection.tsx:5-75` (13 mitra hardcode),
  `socialMedia.tsx:19-109` (angka pengikut palsu + link themeforest),
  `NewsletterWidget.tsx:15-19` (`alert()` palsu, tidak ada API),
  `popupIklan.tsx:6, 26` (pilih video id acak).
- **Risiko off-by-one jadwal** — `(beranda)/page.tsx:19` mengirim `idHari = now.getDay()`
  (JS: 0 = Minggu) ke `/jadwal-acara-public?id_hari=`, sedangkan API memfilter foreign key ke
  `tb_hari.id` (`JadwalAcaraController.php:85`, validasi `exists:tb_hari,id` di `:114`). Kalau
  `tb_hari` memakai konvensi 1 = Minggu, maka Minggu mengirim `0` (tidak match, semua hari
  dikembalikan) dan Senin mendapat jadwal Minggu. **Belum terverifikasi** — butuh cek
  `SELECT id, hari FROM tb_hari`.

---

## Urutan pengerjaan yang disarankan

| Urutan | Item | Alasan |
|---|---|---|
| 1 | **A1** related posts | Menghapus satu round-trip penuh; API sudah punya datanya, cuma perlu dikirim |
| 2 | **B1** view count pakai `open` | Menghapus angka palsu di 19 tempat; 0 perubahan API |
| 3 | **B2** tambah `per_page` | Menekan payload di 5 tempat; 0 perubahan API |
| 4 | **B3, B4** | 1 baris + hapus 2 slice |
| 5 | **B5** perbaikan endpoint | Menghapus 404 di `/en/program` dan 4 bug serupa |
| 6 | **B6** hapus dead code | Source + 2 request sia-sia per halaman |
| 7 | **A2** `is_on_air` | Perubahan API kecil, zona waktu jadi benar |
| 8 | **A4** urutan kategori | Kemungkinan cukup pakai `sort=urutan_asc` yang sudah ada |
| 9 | **A3** hardcoded kategori ID | Butuh keputusan CMS (slot / slug) |
| 10 | **C1–C4** duplikasi FE | Perawatan, bukan desain ulang |
| 11 | **A5** `deskripsi_teks` | Opsional; banalkan dulu jadi util `toPlainText()` |