-- Audit Log Table
create table admin_audit_log (
  id bigserial primary key,
  admin_id uuid references auth.users(id),
  action text not null,
  table_name text not null,
  record_id uuid not null,
  old_data jsonb,
  new_data jsonb,
  created_at timestamptz not null default now()
);

-- RLS untuk admin_audit_log
alter table admin_audit_log enable row level security;
create policy "admin_full_access_audit_log" on admin_audit_log
  for all using (
    exists (select 1 from profiles where profiles.id = auth.uid())
  );

-- Trigger Function for Audit
create or replace function audit_karya_changes()
returns trigger as $$
begin
  if (TG_OP = 'INSERT') then
    insert into admin_audit_log (admin_id, action, table_name, record_id, new_data)
    values (auth.uid(), 'INSERT', TG_TABLE_NAME, NEW.id, row_to_json(NEW));
    return NEW;
  elsif (TG_OP = 'UPDATE') then
    insert into admin_audit_log (admin_id, action, table_name, record_id, old_data, new_data)
    values (auth.uid(), 'UPDATE', TG_TABLE_NAME, NEW.id, row_to_json(OLD), row_to_json(NEW));
    return NEW;
  elsif (TG_OP = 'DELETE') then
    insert into admin_audit_log (admin_id, action, table_name, record_id, old_data)
    values (auth.uid(), 'DELETE', TG_TABLE_NAME, OLD.id, row_to_json(OLD));
    return OLD;
  end if;
  return null;
end;
$$ language plpgsql security definer;

-- Trigger on karya
create trigger audit_karya_trigger
  after insert or update or delete on karya
  for each row execute function audit_karya_changes();

-- Memperbaiki RLS yang terlewat di Stage 1
-- 1. profiles
alter table profiles enable row level security;
-- Admin bisa select, update (baca dan perbarui profile-nya sendiri atau profile siapapun jika dia super_admin/admin)
-- Agar tidak recursive, kita izinkan auth.uid() = id
create policy "allow_read_own_profile" on profiles
  for select using ( auth.uid() = id );
create policy "allow_update_own_profile" on profiles
  for update using ( auth.uid() = id );

-- 2. karya_tech_stack
alter table karya_tech_stack enable row level security;
create policy "public_read_karya_tech_stack" on karya_tech_stack
  for select using (
    exists (select 1 from karya where karya.id = karya_tech_stack.karya_id and karya.status = 'published')
  );
create policy "admin_full_access_karya_tech_stack" on karya_tech_stack
  for all using (
    exists (select 1 from profiles where profiles.id = auth.uid())
  );

-- 3. karya_view_log
alter table karya_view_log enable row level security;
-- Public insert allowed via edge function using service_role, no public direct access needed.
-- Admin can read.
create policy "admin_full_access_karya_view_log" on karya_view_log
  for all using (
    exists (select 1 from profiles where profiles.id = auth.uid())
  );

-- Update RLS karya agar public_read_published bekerja sempurna
-- Sudah ada di initial schema, namun tidak ada salahnya memastikan.
