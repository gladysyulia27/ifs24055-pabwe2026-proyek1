import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found-page">
      <h1 className="error-boundary-title">404 - Halaman Tidak Ditemukan</h1>
      <p className="error-boundary-desc">
        Halaman atau rute yang Anda tuju tidak tersedia atau telah dipindahkan.
      </p>
      <Link href="/" className="btn btn-primary">
        Kembali ke Beranda
      </Link>
    </main>
  );
}
