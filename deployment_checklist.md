# Deployment Checklist (Manual) - KaryaFeed
Dokumen ini merupakan langkah-langkah manual yang wajib Anda eksekusi sebelum hari-H peluncuran (go-live).

## 1. Persiapan Environment Variables (Production)
Pastikan environment variables berikut sudah diatur di dashboard **Vercel** (Settings > Environment Variables):
- `NEXT_PUBLIC_SUPABASE_URL` = URL project Supabase production Anda (mis. `https://xyz.supabase.co`)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Anon key dari Supabase production.
- `SUPABASE_SERVICE_ROLE_KEY` = Service role key dari Supabase production (JANGAN gunakan awalan `NEXT_PUBLIC_` agar tidak ter-expose ke client).

## 2. Eksekusi Migrasi Supabase ke Production
Langkah migrasi Supabase untuk production harus dilakukan secara manual (tidak diotomatisasi di GitHub Actions demi keamanan).
Jalankan perintah berikut di lokal terminal Anda yang terhubung dengan akun production:
```bash
# Login ke Supabase CLI (jika belum)
npx supabase login

# Link project lokal ke Supabase project production
npx supabase link --project-ref <PROJECT_REF_PRODUCTION>

# Push seluruh skema dan file migrasi ke server production
npx supabase db push
```

## 3. Konfigurasi Security Khusus di Dashboard Supabase
- **CORS:** Buka Dashboard Supabase > **Project Settings** > **API**. Pada bagian **CORS**, batasi sumber (Origin) dari `*` (allow all) menjadi domain resmi aplikasi Anda, misalnya `https://gelar-karya.vercel.app`.

## 4. Pastikan Backup Database Aktif
- Buka Dashboard Supabase > **Database** > **Backups**.
- Pastikan PITR (Point-in-Time Recovery) atau Daily Backups dalam status **Active**. Jika Anda menggunakan tier gratis, pertimbangkan upgrade tier sementara untuk PITR menjelang dan saat acara berlangsung.

## 5. Uji Coba Deployment (Staging / Production)
- Setelah berhasil push ke `main`, GitHub Actions akan men-deploy aplikasi Anda ke Vercel.
- Akses domain production Vercel.
- Buka DevTools (F12) > tab **Network** > lihat header HTTP, pastikan ada header `Content-Security-Policy`, `X-Frame-Options`, dsb.
- Coba login admin dan tambahkan dummy karya. Pastikan log masuk ke tabel `admin_audit_log` (bisa dicek via Table Editor Supabase).
- Pastikan gambar/video bisa diunggah (artinya storage dan RLS di production sudah tepat).
