insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values
  (
    'communication-images',
    'communication-images',
    false,
    26214400,
    array[
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'image/svg+xml'
    ]
  ),
  (
    'communication-documents',
    'communication-documents',
    false,
    26214400,
    array[
      'application/pdf',
      'text/plain',
      'text/csv',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ]
  ),
  (
    'communication-audio',
    'communication-audio',
    false,
    26214400,
    array[
      'audio/webm',
      'audio/ogg',
      'audio/mpeg',
      'audio/mp4',
      'audio/wav',
      'audio/x-wav'
    ]
  ),
  (
    'communication-video',
    'communication-video',
    false,
    26214400,
    array[
      'video/mp4',
      'video/webm',
      'video/quicktime'
    ]
  ),
  (
    'communication-files',
    'communication-files',
    false,
    26214400,
    null
  )
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "communication_storage_select"
on storage.objects
for select
to authenticated
using (
  bucket_id in (
    'communication-images',
    'communication-documents',
    'communication-audio',
    'communication-video',
    'communication-files'
  )
);

create policy "communication_storage_insert"
on storage.objects
for insert
to authenticated
with check (
  bucket_id in (
    'communication-images',
    'communication-documents',
    'communication-audio',
    'communication-video',
    'communication-files'
  )
);

create policy "communication_storage_update"
on storage.objects
for update
to authenticated
using (
  bucket_id in (
    'communication-images',
    'communication-documents',
    'communication-audio',
    'communication-video',
    'communication-files'
  )
)
with check (
  bucket_id in (
    'communication-images',
    'communication-documents',
    'communication-audio',
    'communication-video',
    'communication-files'
  )
);

create policy "communication_storage_delete"
on storage.objects
for delete
to authenticated
using (
  bucket_id in (
    'communication-images',
    'communication-documents',
    'communication-audio',
    'communication-video',
    'communication-files'
  )
);
