import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: '/inventori', destination: '/inventory' },
      { source: '/departemen', destination: '/departments' },
      { source: '/peminjaman', destination: '/loans' },
      { source: '/kalender', destination: '/calendar' },
      { source: '/notifikasi', destination: '/notifications' },
      { source: '/profil', destination: '/profile' },
      { source: '/settings', destination: '/profile' },
      { source: '/masuk', destination: '/login' },
      { source: '/daftar', destination: '/register' },
    ];
  },
};

export default nextConfig;
