-- Enable RLS for profiles table
alter table profiles enable row level security;

-- Only users can read their own profile
create policy "users_read_own_profile" on profiles
  for select using (auth.uid() = id);

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, nama, role)
  values (new.id, new.email, 'admin');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call the function after a user is created
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
