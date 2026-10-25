# API Contract & Service Layer Documentation

Spesifikasi kontrak komunikasi data antara Frontend Next.js dan Backend Express REST API BEM IT Del.

---

## 1. Standar Format Request & Response

### Base URL
- Lokal: `http://localhost:4000/api`
- Produksi Vercel: `https://ifs24055-pabwe2026-proyek1-backend.vercel.app/api`

### Header Autentikasi
Semua endpoint privat (selain Login, Register, Health) membutuhkan header Bearer Token:
```http
Authorization: Bearer <session_token>
```
Frontend menyimpan token secara aman menggunakan cookie dengan atribut `SameSite=Lax` dan fallback memori terisolasi.

### Format Standar Error
```json
{
  "error": "Pesan deskripsi kesalahan yang mudah dipahami pengguna"
}
```

---

## 2. Katalog Endpoint API

| Method | Endpoint | Peran Minimum | Deskripsi |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | Publik | Health check status server API |
| `POST` | `/auth/login` | Publik | Autentikasi pengguna & pembuatan sesi baru |
| `POST` | `/auth/register` | Publik | Pendaftaran akun mahasiswa atau admin departemen |
| `GET` | `/auth/me` | Autentikasi | Mendapatkan data profil pengguna yang sedang login |
| `POST` | `/auth/logout` | Autentikasi | Menghapus token sesi dari server |
| `GET` | `/auth/demo-accounts` | Publik | Daftar akun cepat untuk demonstrasi & testing |
| `GET` | `/departments` | Publik | Mengambil seluruh departemen beserta jumlah inventori |
| `GET` | `/inventory` | Publik | Filter & pencarian inventori (`departmentId`, `search`, `category`) |
| `POST` | `/inventory` | Admin Departemen | Menambahkan barang baru ke departemen sendiri |
| `PATCH` | `/inventory/:id` | Admin Departemen | Memperbarui informasi barang |
| `DELETE` | `/inventory/:id` | Admin Departemen | Menghapus barang dari inventori |
| `GET` | `/loans` | Autentikasi | Mengambil daftar pengajuan & riwayat peminjaman |
| `POST` | `/loans` | Mahasiswa | Mengajukan permohonan peminjaman inventori |
| `PATCH` | `/loans/:id/:action` | Admin Departemen | Memproses aksi peminjaman (`approve`, `reject`, `confirm-return`) |
| `PATCH` | `/loans/:id/return` | Mahasiswa / Peminjam | Mengirim bukti foto dan catatan pengembalian |
| `GET` | `/loans/calendar` | Autentikasi | Mengambil agenda kalender peminjaman bulanan |
| `GET` | `/notifications` | Autentikasi | Rekap batas pengembalian & pengajuan tertunda |

---

## 3. Layer Layanan Frontend (Service Layer)

Seluruh pemanggilan API dienkapsulasi ke dalam layer layanan (`src/services/`):
- `authService.ts`: Validasi kredensial login/registrasi dan normalisasi objek `User`.
- `inventoryService.ts`: Validasi payload barang, query params builder, dan normalisasi `Item`.
- `loanService.ts`: Validasi pengajuan peminjaman, aturan tanggal, dan normalisasi `Loan`.
- `notificationService.ts`: Penanganan array aman untuk `due_returns` dan `pending`.

Semua fungsi layanan telah dilengkapi unit test komprehensif di `src/__tests__/services/`.
