-- 1. Add idempotency_key to karya table
alter table karya add column if not exists idempotency_key uuid unique;

-- 2. Create RPC for atomic insertion of karya + media + tech_stack
create or replace function public.create_karya_with_media(
  payload jsonb,
  media jsonb[],
  tech_stacks uuid[],
  idempotency_key uuid
) returns uuid
language plpgsql
security definer
as $$
declare
  new_id uuid;
begin
  -- Check idempotency first (if already exists, return its ID instead of inserting again)
  select id into new_id from public.karya where karya.idempotency_key = create_karya_with_media.idempotency_key;
  if found then
    return new_id;
  end if;

  -- Insert karya
  insert into public.karya (
    judul, 
    deskripsi, 
    nama_mahasiswa, 
    nim,
    tampilkan_nim,
    prodi,
    angkatan_id,
    kategori_id,
    dosen_pembimbing,
    link_demo,
    link_github,
    status,
    created_by,
    idempotency_key
  )
  values (
    payload->>'judul',
    payload->>'deskripsi',
    payload->>'nama_mahasiswa',
    payload->>'nim',
    coalesce((payload->>'tampilkan_nim')::boolean, false),
    payload->>'prodi',
    nullif(payload->>'angkatan_id', '')::uuid,
    nullif(payload->>'kategori_id', '')::uuid,
    payload->>'dosen_pembimbing',
    payload->>'link_demo',
    payload->>'link_github',
    coalesce(payload->>'status', 'draft'),
    auth.uid(),
    create_karya_with_media.idempotency_key
  )
  returning id into new_id;

  -- Insert media if any
  if array_length(media, 1) > 0 then
    insert into public.karya_media (karya_id, tipe, url, thumbnail_url, urutan)
    select 
      new_id, 
      m->>'tipe', 
      m->>'url', 
      m->>'thumbnail_url', 
      coalesce((m->>'urutan')::int, 0)
    from unnest(media) as m;
  end if;

  -- Insert tech_stack if any
  if array_length(tech_stacks, 1) > 0 then
    insert into public.karya_tech_stack (karya_id, tech_stack_id)
    select new_id, ts_id from unnest(tech_stacks) as ts_id;
  end if;

  return new_id;
end;
$$;

-- 3. Create RPC for atomic view counter increment
create or replace function public.increment_karya_view(k_id uuid)
returns void
language plpgsql
security definer
as $$
begin
  update public.karya
  set view_count = view_count + 1
  where id = k_id;
end;
$$;
