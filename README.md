# Sistem Manajemen Peminjaman Inventori BEM IT Del

Monorepo starter: **Next.js frontend + Express.js REST API + SQLite + Jenkins CI/CD**.

## Departemen awal
- DEPKOMINFO: Kamera, Microphone rekam, Lightning
- DIPTEK
- DEPAGSOS: Vas bunga, Alkitab, Lilin
- DPDK
- DHPM
- DESARPRAS: Microphone, Speaker, Kabel
- DEPOL: Bola basket, Bola futsal, Raket, Kok badminton, Net
- DEPSENBUD: Gitar, Bass, Pita tali, Kuas

## Prasyarat
- Node.js 20+
- npm
- Jenkins (untuk pipeline deployment)

> Bun boleh dipakai untuk workflow lokal, tetapi proyek ini menggunakan npm scripts agar Jenkins agent lebih mudah dikonfigurasi.

## Menjalankan lokal
Terminal 1:
```bash
cd backend
npm install
npm run dev
```
API berjalan di `http://localhost:4000`. SQLite dibuat otomatis di `backend/data/inventory.db`.

Terminal 2:
```bash
cd frontend
npm install
npm run dev
```
Frontend berjalan di `http://localhost:3000`.

Buat `frontend/.env.local` bila diperlukan:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

## API utama
- `GET /api/health`
- `GET /api/departments`
- `GET /api/inventory?departmentId=1&search=kamera`
- `POST /api/inventory`
- `PATCH /api/inventory/:id`
- `DELETE /api/inventory/:id`
- `GET /api/loans`
- `POST /api/loans`
- `PATCH /api/loans/:id/approve`
- `PATCH /api/loans/:id/reject`
- `PATCH /api/loans/:id/return` (terima URL bukti pengembalian)
- `GET /api/loans/calendar`

## Catatan penting sebelum produksi
Implementasi ini adalah MVP fungsional untuk pengembangan dan demo. Role switcher di UI adalah simulasi, **bukan autentikasi aman**. Sebelum digunakan sungguhan, tambahkan login SSO/email kampus, session/JWT yang tervalidasi di backend, kontrol akses berbasis peran dan departemen, upload bukti ke object storage, audit log, backup SQLite, rate limiting, validasi file, dan HTTPS. Jangan mengekspos endpoint CRUD/approval tanpa autentikasi.

## Jenkins
Pipeline di `Jenkinsfile` menjalankan instalasi dependency, lint/build frontend, dan pemeriksaan backend. Untuk deployment sungguhan, sesuaikan agent, kredensial, dan target server. Jenkins job harus mengambil repository ini dari Git.
