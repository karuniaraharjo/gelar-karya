-- Kategori karya (pengganti "story" di UI)
create table kategori (
  id uuid primary key default gen_random_uuid(),
  nama text not null unique,
  slug text not null unique,
  icon_url text,
  urutan int not null default 0,
  created_at timestamptz not null default now()
);

-- Angkatan/tahun, untuk pengelompokan arsip jangka panjang
create table angkatan (
  id uuid primary key default gen_random_uuid(),
  tahun int not null unique,
  label text not null,
  created_at timestamptz not null default now()
);

-- Role admin (tabel profil terpisah dari auth.users bawaan Supabase)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nama text,
  role text not null default 'admin' check (role in ('admin','super_admin')),
  created_at timestamptz not null default now()
);

-- Karya utama
create table karya (
  id uuid primary key default gen_random_uuid(),
  judul text not null,
  deskripsi text not null,
  nama_mahasiswa text not null,
  nim text,
  prodi text,
  angkatan_id uuid references angkatan(id),
  kategori_id uuid references kategori(id),
  dosen_pembimbing text,
  link_demo text,
  link_github text,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  view_count bigint not null default 0,
  like_count bigint not null default 0,
  version int not null default 1,          -- optimistic locking, lihat §11
  created_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_karya_status_created on karya (status, created_at desc);
create index idx_karya_kategori on karya (kategori_id);
create index idx_karya_angkatan on karya (angkatan_id);

-- Media per karya (foto carousel / video)
create table karya_media (
  id uuid primary key default gen_random_uuid(),
  karya_id uuid not null references karya(id) on delete cascade,
  tipe text not null check (tipe in ('image','video')),
  url text not null,
  thumbnail_url text,
  alt_text text,
  urutan int not null default 0,
  created_at timestamptz not null default now()
);
create index idx_karya_media_karya on karya_media (karya_id, urutan);

-- Tech stack (many-to-many)
create table tech_stack (
  id uuid primary key default gen_random_uuid(),
  nama text not null unique
);
create table karya_tech_stack (
  karya_id uuid references karya(id) on delete cascade,
  tech_stack_id uuid references tech_stack(id) on delete cascade,
  primary key (karya_id, tech_stack_id)
);

-- Log view anonim (dedup + rate limit, tanpa menyimpan IP mentah)
create table karya_view_log (
  id bigserial primary key,
  karya_id uuid references karya(id) on delete cascade,
  session_hash text not null,
  created_at timestamptz not null default now()
);

-- ROW LEVEL SECURITY (RLS)

alter table karya enable row level security;
alter table karya_media enable row level security;
alter table kategori enable row level security;
alter table angkatan enable row level security;
alter table tech_stack enable row level security;

-- Public read policies (published only for karya, media linked to published karya)
create policy "public_read_published" on karya
  for select using (status = 'published');

create policy "public_read_media" on karya_media
  for select using (
    exists (select 1 from karya where karya.id = karya_media.karya_id and karya.status = 'published')
  );

create policy "public_read_kategori" on kategori
  for select using (true);

create policy "public_read_angkatan" on angkatan
  for select using (true);

create policy "public_read_tech_stack" on tech_stack
  for select using (true);

-- Admin full access policies
create policy "admin_full_access_karya" on karya
  for all using (
    exists (select 1 from profiles where profiles.id = auth.uid())
  );

create policy "admin_full_access_media" on karya_media
  for all using (
    exists (select 1 from profiles where profiles.id = auth.uid())
  );

create policy "admin_full_access_kategori" on kategori
  for all using (
    exists (select 1 from profiles where profiles.id = auth.uid())
  );

create policy "admin_full_access_angkatan" on angkatan
  for all using (
    exists (select 1 from profiles where profiles.id = auth.uid())
  );

create policy "admin_full_access_tech_stack" on tech_stack
  for all using (
    exists (select 1 from profiles where profiles.id = auth.uid())
  );
