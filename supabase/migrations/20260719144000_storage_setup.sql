-- Buat storage bucket "karya-media" jika belum ada
insert into storage.buckets (id, name, public) 
values ('karya-media', 'karya-media', true)
on conflict (id) do nothing;



-- Hapus policy lama jika ada untuk mencegah error saat re-run
drop policy if exists "Public Access" on storage.objects;
drop policy if exists "Allow authenticated users to insert" on storage.objects;
drop policy if exists "Allow authenticated users to update" on storage.objects;
drop policy if exists "Allow authenticated users to delete" on storage.objects;

-- Policy agar semua orang bisa membaca (melihat) file
create policy "Public Access" 
on storage.objects for select 
using ( bucket_id = 'karya-media' );

-- Policy agar user yang sudah login bisa mengunggah file
create policy "Allow authenticated users to insert" 
on storage.objects for insert 
with check ( bucket_id = 'karya-media' and auth.role() = 'authenticated' );

-- Policy agar user yang sudah login bisa mengubah file
create policy "Allow authenticated users to update" 
on storage.objects for update 
with check ( bucket_id = 'karya-media' and auth.role() = 'authenticated' );

-- Policy agar user yang sudah login bisa menghapus file
create policy "Allow authenticated users to delete" 
on storage.objects for delete 
using ( bucket_id = 'karya-media' and auth.role() = 'authenticated' );
