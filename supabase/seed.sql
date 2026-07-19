-- Seed data untuk pengembangan
-- 4 Kategori
insert into kategori (id, nama, slug, icon_url, urutan) values
  ('d888e25b-0000-0000-0000-000000000001', 'Web Development', 'web', '/icons/web.png', 1),
  ('d888e25b-0000-0000-0000-000000000002', 'Mobile Development', 'mobile', '/icons/mobile.png', 2),
  ('d888e25b-0000-0000-0000-000000000003', 'AI/Machine Learning', 'ai-ml', '/icons/ai.png', 3),
  ('d888e25b-0000-0000-0000-000000000004', 'Internet of Things', 'iot', '/icons/iot.png', 4),
  ('d888e25b-0000-0000-0000-000000000005', 'Game Development', 'game', '/icons/game.png', 5);

-- 2 Angkatan
insert into angkatan (id, tahun, label) values
  ('a999e25b-0000-0000-0000-000000000001', 2024, 'Angkatan 2024'),
  ('a999e25b-0000-0000-0000-000000000002', 2025, 'Angkatan 2025');

-- Tech Stack
insert into tech_stack (id, nama) values
  ('t777e25b-0000-0000-0000-000000000001', 'Next.js'),
  ('t777e25b-0000-0000-0000-000000000002', 'React Native'),
  ('t777e25b-0000-0000-0000-000000000003', 'Python'),
  ('t777e25b-0000-0000-0000-000000000004', 'ESP32'),
  ('t777e25b-0000-0000-0000-000000000005', 'Unity');

-- 6 Karya Dummy
insert into karya (id, judul, deskripsi, nama_mahasiswa, nim, prodi, angkatan_id, kategori_id, dosen_pembimbing, link_demo, link_github, status, view_count, like_count) values
  ('k666e25b-0000-0000-0000-000000000001', 'E-Learning Platform', 'Sistem pembelajaran online yang interaktif.', 'Budi Santoso', '2141010', 'S1 Informatika', 'a999e25b-0000-0000-0000-000000000002', 'd888e25b-0000-0000-0000-000000000001', 'Dr. Dosen Web', 'https://demo1.com', 'https://github.com/demo1', 'published', 150, 20),
  ('k666e25b-0000-0000-0000-000000000002', 'Smart Home App', 'Aplikasi pengontrol rumah pintar via mobile.', 'Siti Aminah', '2141011', 'S1 Informatika', 'a999e25b-0000-0000-0000-000000000002', 'd888e25b-0000-0000-0000-000000000002', 'Prof. Mobile', 'https://demo2.com', 'https://github.com/demo2', 'published', 320, 45),
  ('k666e25b-0000-0000-0000-000000000003', 'Face Recognition Absensi', 'Sistem absensi dengan deteksi wajah.', 'Andi Wijaya', '2141012', 'S1 Informatika', 'a999e25b-0000-0000-0000-000000000001', 'd888e25b-0000-0000-0000-000000000003', 'Dr. AI', 'https://demo3.com', 'https://github.com/demo3', 'published', 500, 100),
  ('k666e25b-0000-0000-0000-000000000004', 'Smart Parking System', 'Sistem IoT untuk mendeteksi slot parkir kosong.', 'Dewi Lestari', '2141013', 'S1 Informatika', 'a999e25b-0000-0000-0000-000000000001', 'd888e25b-0000-0000-0000-000000000004', 'Ir. IoT', 'https://demo4.com', 'https://github.com/demo4', 'draft', 10, 0),
  ('k666e25b-0000-0000-0000-000000000005', 'Adventure Game RPG', 'Game petualangan 2D dengan story menarik.', 'Rudi Hartono', '2141014', 'S1 Informatika', 'a999e25b-0000-0000-0000-000000000002', 'd888e25b-0000-0000-0000-000000000005', 'Dr. Game', 'https://demo5.com', 'https://github.com/demo5', 'published', 890, 200),
  ('k666e25b-0000-0000-0000-000000000006', 'Marketplace Mahasiswa', 'Platform jual beli antar mahasiswa.', 'Rina Melati', '2141015', 'S1 Informatika', 'a999e25b-0000-0000-0000-000000000001', 'd888e25b-0000-0000-0000-000000000001', 'Dr. Dosen Web', 'https://demo6.com', 'https://github.com/demo6', 'published', 45, 5);

-- Karya Media (Thumbnails / Images)
insert into karya_media (karya_id, tipe, url, thumbnail_url, alt_text, urutan) values
  ('k666e25b-0000-0000-0000-000000000001', 'image', 'https://placehold.co/800x600/png?text=E-Learning', null, 'Screenshot E-Learning', 0),
  ('k666e25b-0000-0000-0000-000000000002', 'image', 'https://placehold.co/800x600/png?text=Smart+Home', null, 'Screenshot Smart Home', 0),
  ('k666e25b-0000-0000-0000-000000000003', 'image', 'https://placehold.co/800x600/png?text=Face+Recog', null, 'Screenshot Face Recog', 0),
  ('k666e25b-0000-0000-0000-000000000004', 'image', 'https://placehold.co/800x600/png?text=Smart+Parking', null, 'Screenshot Parking', 0),
  ('k666e25b-0000-0000-0000-000000000005', 'image', 'https://placehold.co/800x600/png?text=RPG+Game', null, 'Screenshot Game', 0),
  ('k666e25b-0000-0000-0000-000000000006', 'image', 'https://placehold.co/800x600/png?text=Marketplace', null, 'Screenshot Marketplace', 0);

-- Karya Tech Stack Relations
insert into karya_tech_stack (karya_id, tech_stack_id) values
  ('k666e25b-0000-0000-0000-000000000001', 't777e25b-0000-0000-0000-000000000001'),
  ('k666e25b-0000-0000-0000-000000000002', 't777e25b-0000-0000-0000-000000000002'),
  ('k666e25b-0000-0000-0000-000000000003', 't777e25b-0000-0000-0000-000000000003'),
  ('k666e25b-0000-0000-0000-000000000004', 't777e25b-0000-0000-0000-000000000004'),
  ('k666e25b-0000-0000-0000-000000000005', 't777e25b-0000-0000-0000-000000000005');
