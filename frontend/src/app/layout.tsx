import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Inventori BEM IT Del",
  description: "Sistem Manajemen Peminjaman Inventori BEM IT Del",
  icons: {
    icon: "/logo-bem-del.png",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
