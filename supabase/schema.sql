create extension if not exists "uuid-ossp";

create type app_role as enum ('super_admin', 'admin', 'manager', 'staff');
create type employment_status as enum ('active', 'probation', 'inactive');
create type attendance_status as enum ('present', 'late', 'remote');
create type transaction_type as enum ('income', 'expense');
create type task_status as enum ('backlog', 'progress', 'review', 'done');
create type task_priority as enum ('low', 'medium', 'high');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  avatar_url text,
  role app_role not null default 'staff',
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1), 'OfficeFlow User'),
    new.raw_user_meta_data->>'avatar_url',
    case
      when lower(new.email) = 'fitrahmm09@gmail.com' then 'super_admin'::app_role
      when new.raw_user_meta_data->>'role' in ('super_admin', 'admin', 'manager', 'staff') then (new.raw_user_meta_data->>'role')::app_role
      else 'staff'::app_role
    end
  )
  on conflict (id) do update set
    full_name = excluded.full_name,
    avatar_url = excluded.avatar_url,
    role = excluded.role;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create table public.employees (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid references public.profiles(id) on delete set null,
  name text not null,
  email text not null unique,
  role app_role not null default 'staff',
  division text not null,
  position text not null,
  status employment_status not null default 'active',
  avatar_url text,
  joined_at date not null default current_date,
  created_at timestamptz not null default now()
);

create table public.attendance (
  id uuid primary key default uuid_generate_v4(),
  employee_id uuid not null references public.employees(id) on delete cascade,
  work_date date not null default current_date,
  check_in timestamptz,
  check_out timestamptz,
  status attendance_status not null default 'present',
  created_at timestamptz not null default now()
);

create table public.finance_records (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  type transaction_type not null,
  category text not null,
  amount numeric(14, 2) not null check (amount >= 0),
  record_date date not null default current_date,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.tasks (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  assignee_id uuid references public.employees(id) on delete set null,
  status task_status not null default 'backlog',
  priority task_priority not null default 'medium',
  due_date date,
  created_at timestamptz not null default now()
);

create table public.documents (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  storage_path text not null,
  owner_id uuid references public.profiles(id) on delete set null,
  file_type text not null,
  file_size bigint not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.employees enable row level security;
alter table public.attendance enable row level security;
alter table public.finance_records enable row level security;
alter table public.tasks enable row level security;
alter table public.documents enable row level security;

create policy "authenticated can read profiles" on public.profiles for select to authenticated using (true);
create policy "authenticated can read employees" on public.employees for select to authenticated using (true);
create policy "authenticated can read attendance" on public.attendance for select to authenticated using (true);
create policy "authenticated can read finance" on public.finance_records for select to authenticated using (true);
create policy "authenticated can read tasks" on public.tasks for select to authenticated using (true);
create policy "authenticated can read documents" on public.documents for select to authenticated using (true);

create policy "admins manage employees" on public.employees for all to authenticated
using (exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin', 'admin', 'manager')))
with check (exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin', 'admin', 'manager')));

create policy "admins manage finance" on public.finance_records for all to authenticated
using (exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin', 'admin', 'manager')))
with check (exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin', 'admin', 'manager')));

create policy "users update own profile" on public.profiles for update to authenticated
using (id = auth.uid())
with check (id = auth.uid());

create policy "authenticated manage own tasks" on public.tasks for all to authenticated using (true) with check (true);

create policy "authenticated upload documents" on public.documents for insert to authenticated with check (true);

insert into storage.buckets (id, name, public)
values ('documents', 'documents', true)
on conflict (id) do nothing;
