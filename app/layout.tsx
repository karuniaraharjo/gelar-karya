import type { Metadata, Viewport } from "next";
import "./globals.css";
import QueryProvider from "@/components/providers/QueryProvider";

import { OfflineBanner } from "@/components/features/pwa/OfflineBanner";
import { InstallPrompt } from "@/components/features/pwa/InstallPrompt";

export const viewport: Viewport = {
  themeColor: "#0B0B0F",
};

export const metadata: Metadata = {
  title: "KaryaFeed — Galeri Karya Mahasiswa Informatika",
  description:
    "Platform showcase karya mahasiswa Informatika. Jelajahi proyek, skripsi, dan inovasi dari berbagai angkatan.",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full antialiased">
      <head>
        {/* Inter font via Google Fonts CDN — won't break build if offline */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <QueryProvider>
          <OfflineBanner />
          {children}
          <InstallPrompt />
        </QueryProvider>
      </body>
    </html>
  );
}
