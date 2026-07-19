# KaryaFeed - Platform Showcase Karya Mahasiswa Informatika

Ini adalah project PWA untuk showcase karya mahasiswa, dibangun dengan **Next.js (App Router)** dan **Tailwind CSS**.

## Cara Install

1. Pastikan Anda sudah menginstal **Node.js** (v18+).
2. Clone repository dan jalankan:
   ```bash
   npm install
   ```

## Cara Menjalankan (Development)

Jalankan perintah berikut:
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) di browser untuk melihat hasilnya.

## Struktur Folder Utama

Proyek ini mengikuti arsitektur folder berdasarkan domain/fitur (Feature-Sliced Design ringan):

- `/app` - Konfigurasi rute menggunakan Next.js App Router (Pemisahan `/public` dan `/admin`).
- `/features` - Logika spesifik fitur (hooks, services, state).
- `/components/ui` - Komponen presentasional yang dapat digunakan ulang (reusable UI).
- `/lib` - Konfigurasi dan utilitas pihak ketiga.
  - `/lib/supabase` - Supabase client init dan type definitions.
  - `/lib/utils` - Utilitas umum.
- `/supabase` - File khusus Supabase.
  - `/supabase/migrations` - File migrasi database (schema).
  - `/supabase/functions` - Supabase Edge Functions (Deno).

## Catatan Konfigurasi

Semua token warna desain (dark mode) telah dikonfigurasi di `app/globals.css` menggunakan CSS Variables dan fitur Tailwind v4 `@theme`.
