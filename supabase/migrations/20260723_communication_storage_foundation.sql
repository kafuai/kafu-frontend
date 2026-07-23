-- KAFU AI
-- Enterprise Communication Storage Foundation
-- Private tenant-isolated storage for files and voice messages

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'communication-attachments',
  'communication-attachments',
  false,
  26214400,
  array[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'text/csv',
    'image/jpeg',
    'image/png',
    'image/webp',
    'audio/webm',
    'audio/ogg',
    'audio/mpeg',
    'audio/mp4',
    'video/mp4',
    'application/zip'
  ]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;


drop policy if exists
  communication_storage_select
on storage.objects;

create policy communication_storage_select
on storage.objects
for select
to authenticated
using (
  bucket_id = 'communication-attachments'
  and (storage.foldername(name))[1] = coalesce(
    auth.jwt() ->> 'company_id',
    auth.jwt() -> 'app_metadata' ->> 'company_id'
  )
);


drop policy if exists
  communication_storage_insert
on storage.objects;

create policy communication_storage_insert
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'communication-attachments'
  and (storage.foldername(name))[1] = coalesce(
    auth.jwt() ->> 'company_id',
    auth.jwt() -> 'app_metadata' ->> 'company_id'
  )
);


drop policy if exists
  communication_storage_update
on storage.objects;

create policy communication_storage_update
on storage.objects
for update
to authenticated
using (
  bucket_id = 'communication-attachments'
  and (storage.foldername(name))[1] = coalesce(
    auth.jwt() ->> 'company_id',
    auth.jwt() -> 'app_metadata' ->> 'company_id'
  )
)
with check (
  bucket_id = 'communication-attachments'
  and (storage.foldername(name))[1] = coalesce(
    auth.jwt() ->> 'company_id',
    auth.jwt() -> 'app_metadata' ->> 'company_id'
  )
);


drop policy if exists
  communication_storage_delete
on storage.objects;

create policy communication_storage_delete
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'communication-attachments'
  and (storage.foldername(name))[1] = coalesce(
    auth.jwt() ->> 'company_id',
    auth.jwt() -> 'app_metadata' ->> 'company_id'
  )
);
