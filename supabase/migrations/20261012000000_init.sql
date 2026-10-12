-- Omegs core schema: profiles, bookings, contact messages, waitlist, settings.

create type public.user_role as enum ('customer', 'admin');
create type public.booking_status as enum ('requested', 'confirmed', 'completed', 'cancelled');
create type public.payment_status as enum ('unpaid', 'pending', 'paid', 'refunded', 'failed');

-- Single-row settings editable by admins (price applies to every service).
create table public.app_settings (
  id boolean primary key default true check (id),
  price_minor integer not null default 20000,
  currency text not null default 'USD',
  admin_email text not null default 'bramkirimi@gmail.com',
  updated_at timestamptz not null default now()
);
insert into public.app_settings default values;

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text not null default '',
  phone text not null default '',
  role public.user_role not null default 'customer',
  created_at timestamptz not null default now()
);

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique default ('OMG-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8))),
  user_id uuid not null references public.profiles (id) on delete cascade,
  service_id text not null,
  service_name text not null,
  date date not null,
  time_slot text not null,
  property_type text not null,
  address text not null,
  phone text not null,
  notes text not null default '',
  status public.booking_status not null default 'requested',
  amount_minor integer not null,
  currency text not null,
  payment_status public.payment_status not null default 'unpaid',
  payment_reference text unique,
  paid_at timestamptz,
  admin_notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index bookings_user_idx on public.bookings (user_id, created_at desc);
create index bookings_date_idx on public.bookings (date);

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  reference text not null default ('MSG-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8))),
  name text not null check (char_length(name) between 1 and 200),
  email text not null check (char_length(email) between 3 and 320),
  subject text not null check (char_length(subject) between 1 and 300),
  message text not null check (char_length(message) between 1 and 5000),
  handled boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.app_waitlist (
  email text primary key check (char_length(email) between 3 and 320),
  created_at timestamptz not null default now()
);

-- Helpers -------------------------------------------------------------------

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

create or replace function public.current_user_role()
returns public.user_role language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, phone, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'phone', ''),
    case when lower(new.email) = (select lower(admin_email) from public.app_settings) then 'admin' else 'customer' end
  );
  return new;
end;
$$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Server-side price, owner, and status rules for bookings.
create or replace function public.bookings_before_write()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    if not public.is_admin() then
      new.user_id := auth.uid();
      new.status := 'requested';
      new.payment_status := 'unpaid';
      new.payment_reference := null;
      new.paid_at := null;
      new.admin_notes := '';
    end if;
    if new.date < current_date then
      raise exception 'Booking date cannot be in the past';
    end if;
    select price_minor, currency into new.amount_minor, new.currency from public.app_settings;
  else
    if not public.is_admin() and auth.role() <> 'service_role' then
      -- Customers may only cancel their own bookings.
      if new.status <> 'cancelled' or old.status in ('completed', 'cancelled')
         or (to_jsonb(new) - 'status' - 'updated_at') <> (to_jsonb(old) - 'status' - 'updated_at') then
        raise exception 'Only cancellation is allowed';
      end if;
    end if;
    new.updated_at := now();
  end if;
  return new;
end;
$$;
create trigger bookings_before_write before insert or update on public.bookings
  for each row execute function public.bookings_before_write();

-- Row level security ----------------------------------------------------------

alter table public.app_settings enable row level security;
alter table public.profiles enable row level security;
alter table public.bookings enable row level security;
alter table public.contact_messages enable row level security;
alter table public.app_waitlist enable row level security;

create policy "settings readable" on public.app_settings for select using (true);
create policy "settings admin update" on public.app_settings for update using (public.is_admin());

create policy "own profile read" on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy "own profile update" on public.profiles for update using (id = auth.uid())
  with check (id = auth.uid() and role = public.current_user_role());

create policy "own bookings read" on public.bookings for select using (user_id = auth.uid() or public.is_admin());
create policy "own bookings insert" on public.bookings for insert with check (auth.uid() is not null and (user_id = auth.uid() or public.is_admin()));
create policy "own bookings update" on public.bookings for update using (user_id = auth.uid() or public.is_admin());

create policy "anyone can send messages" on public.contact_messages for insert with check (true);
create policy "admin reads messages" on public.contact_messages for select using (public.is_admin());
create policy "admin updates messages" on public.contact_messages for update using (public.is_admin());

create policy "anyone can join waitlist" on public.app_waitlist for insert with check (true);
create policy "admin reads waitlist" on public.app_waitlist for select using (public.is_admin());
