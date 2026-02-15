# Routes untuk Aplikasi TVKU Web

File ini berisi dokumentasi rute-rute yang tersedia dalam aplikasi berdasarkan struktur kontroler yang ditemukan.

## Rute Dasar

- **Default Controller**: `auth/login` (diatur di `config/routes.php`)
- **404 Override**: Tidak disetel (akan menggunakan default CodeIgniter)

## Daftar Rute

### Auth Controller (`auth.php`)
- `auth/login` - Halaman login pengguna
- `auth/logout` - Logout pengguna
- `auth/register` - Pendaftaran pengguna baru
- `auth/change_password` - Mengganti password pengguna
- `auth/forgot_password` - Lupa password
- `auth/reset_password/{code}` - Reset password dengan kode
- `auth/activate/{id}/{code}` - Aktivasi akun pengguna
- `auth/deactivate/{id}` - Menonaktifkan akun pengguna
- `auth/index` - Halaman utama untuk admin (daftar pengguna)

### Home Controller (`home.php`)
- `home/index` - Dashboard utama (membutuhkan login)
- `home/maintenance` - Halaman maintenance (membutuhkan login)

### Berita Controller (`berita.php`)
- `berita/allberita` - Menampilkan semua berita (membutuhkan login)
- `berita/add_tampil` - Halaman tambah berita (membutuhkan login)
- `berita/add_berita` - Proses penambahan berita (membutuhkan login)
- `berita/add_berita_coba` - Alternatif proses penambahan berita (membutuhkan login)
- `berita/delete_berita/{id}` - Hapus berita berdasarkan ID (membutuhkan login)
- `berita/edit_tampil/{id}` - Halaman edit berita (membutuhkan login)
- `berita/edit_berita` - Proses update berita (membutuhkan login)
- `berita/change_pass` - Ganti password (membutuhkan login)
- `berita/change_tampil` - Halaman ganti password (membutuhkan login)

### Pengguna Controller (`pengguna.php`)
- `pengguna/allpengguna` - Menampilkan semua pengguna (membutuhkan login)
- `pengguna/add_tampil` - Halaman tambah pengguna (membutuhkan login)
- `pengguna/add_pengguna` - Proses penambahan pengguna (membutuhkan login)
- `pengguna/delete_pengguna/{id}` - Hapus pengguna berdasarkan ID (membutuhkan login)
- `pengguna/edit_tampil/{id}` - Halaman edit pengguna (membutuhkan login)
- `pengguna/edit_pengguna` - Proses update pengguna (membutuhkan login)
- `pengguna/change_pass` - Ganti password (membutuhkan login)
- `pengguna/change_tampil` - Halaman ganti password (membutuhkan login)
- `pengguna/create_user` - Membuat pengguna baru (hanya admin)
- `pengguna/edit_user/{id}` - Edit pengguna (hanya admin atau pengguna itu sendiri)
- `pengguna/create_group` - Membuat grup baru (hanya admin)
- `pengguna/edit_group/{id}` - Edit grup (hanya admin)

### Welcome Controller (`welcome.php`)
- `welcome/index` - Halaman index welcome (sebelumnya default controller)

### Kontroler Lainnya
Aplikasi juga memiliki kontroler tambahan dalam direktori:
- `editor/` - Kontroler untuk editor
- `library/` - Kontroler untuk perpustakaan
- `mcr/` - Kontroler untuk MCR
- `programacara/` - Kontroler untuk program acara
- `redaktur/` - Kontroler untuk redaktur
- `v2/` - Versi kedua dari beberapa fitur

Dan beberapa kontroler lainnya:
- `acara_master.php`
- `acara.php`
- `example.php`
- `kategori.php`
- `login.php`
- `program_baru.php`
- `program_detail.php`
- `program.php`
- `tvku_beranda.php`

## Catatan
- Sebagian besar rute memerlukan otentikasi (harus login)
- Beberapa rute hanya bisa diakses oleh admin atau grup tertentu
- Struktur URL mengikuti pola standar CodeIgniter: `controller/method/parameter`