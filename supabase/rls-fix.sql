insert into storage.buckets (id, name, public)
values ('documents', 'documents', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "authenticated manage attendance" on public.attendance;
create policy "authenticated manage attendance" on public.attendance for all to authenticated
using (
  exists (
    select 1
    from public.employees
    where employees.id = attendance.employee_id
      and lower(employees.email) = lower(auth.jwt() ->> 'email')
  )
  or exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role in ('super_admin', 'admin', 'manager')
  )
)
with check (
  exists (
    select 1
    from public.employees
    where employees.id = attendance.employee_id
      and lower(employees.email) = lower(auth.jwt() ->> 'email')
  )
  or exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role in ('super_admin', 'admin', 'manager')
  )
);

drop policy if exists "authenticated upload documents" on public.documents;
create policy "authenticated upload documents" on public.documents for insert to authenticated
with check (owner_id = auth.uid());

drop policy if exists "authenticated update documents" on public.documents;
create policy "authenticated update documents" on public.documents for update to authenticated
using (
  owner_id = auth.uid()
  or exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role in ('super_admin', 'admin', 'manager')
  )
)
with check (
  owner_id = auth.uid()
  or exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role in ('super_admin', 'admin', 'manager')
  )
);

drop policy if exists "authenticated read document files" on storage.objects;
create policy "authenticated read document files" on storage.objects for select to authenticated
using (bucket_id = 'documents');

drop policy if exists "authenticated upload document files" on storage.objects;
create policy "authenticated upload document files" on storage.objects for insert to authenticated
with check (
  bucket_id = 'documents'
  and auth.uid()::text = (storage.foldername(name))[1]
);
