create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique not null,
  full_name text not null,
  email text unique not null,
  avatar_color text,
  created_at timestamptz not null default now()
);

create table if not exists public.meals (
  id text primary key,
  host_id uuid references public.profiles(id) on delete cascade,
  title text not null,
  neighborhood text not null,
  seats_total integer not null default 8,
  seats_left integer not null default 8,
  price_per_person integer not null default 12,
  created_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  thread_id text not null,
  author_name text not null,
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  meal_id text references public.meals(id) on delete cascade,
  seats integer not null default 1,
  payment_status text not null default 'simulated',
  created_at timestamptz not null default now()
);

alter publication supabase_realtime add table public.messages;

alter table public.profiles enable row level security;
alter table public.meals enable row level security;
alter table public.messages enable row level security;
alter table public.reservations enable row level security;

create policy if not exists "profiles_read_for_authenticated"
  on public.profiles
  for select
  using (true);

create policy if not exists "profiles_insert_self"
  on public.profiles
  for insert
  with check (true);

create policy if not exists "messages_read_for_authenticated"
  on public.messages
  for select
  using (true);

create policy if not exists "messages_insert_for_authenticated"
  on public.messages
  for insert
  with check (true);

create policy if not exists "reservations_read_for_authenticated"
  on public.reservations
  for select
  using (true);

create policy if not exists "reservations_insert_for_authenticated"
  on public.reservations
  for insert
  with check (true);
