-- Tambah kolom tampilkan_nim untuk mengontrol privasi data mahasiswa (Edge Case #19)
alter table karya add column if not exists tampilkan_nim boolean not null default false;
