import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Inventori BEM IT Del",
  description: "Sistem Manajemen Peminjaman Inventori BEM IT Del",
  icons: {
    icon: "/logo-bem-del.png",
  },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id"><body>{children}</body></html>;
}
