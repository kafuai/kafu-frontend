-- KAFU AI
-- Enterprise Communication Layer Foundation
-- Multi-tenant conversations, messages, participants and attachments

create extension if not exists pgcrypto;

create table if not exists public.communication_conversations (
  id uuid primary key default gen_random_uuid(),

  company_id uuid not null,

  conversation_type text not null default 'corporate_brain'
    check (
      conversation_type in (
        'corporate_brain',
        'employee',
        'team',
        'customer',
        'sales',
        'support',
        'system'
      )
    ),

  channel text not null default 'platform'
    check (
      channel in (
        'platform',
        'email',
        'whatsapp',
        'voice',
        'api',
        'system'
      )
    ),

  title text,
  status text not null default 'active'
    check (
      status in (
        'active',
        'resolved',
        'archived'
      )
    ),

  created_by uuid,
  created_by_name text,

  last_message_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index if not exists
  communication_conversations_company_id_idx
on public.communication_conversations(company_id);

create index if not exists
  communication_conversations_last_message_at_idx
on public.communication_conversations(last_message_at desc);

create index if not exists
  communication_conversations_active_idx
on public.communication_conversations(company_id, status)
where deleted_at is null;


create table if not exists public.communication_participants (
  id uuid primary key default gen_random_uuid(),

  company_id uuid not null,

  conversation_id uuid not null
    references public.communication_conversations(id)
    on delete cascade,

  participant_type text not null
    check (
      participant_type in (
        'user',
        'employee',
        'customer',
        'ai_agent',
        'corporate_brain',
        'system'
      )
    ),

  participant_id uuid,
  display_name text,
  email text,

  role text not null default 'member'
    check (
      role in (
        'owner',
        'member',
        'observer',
        'assistant'
      )
    ),

  joined_at timestamptz not null default now(),
  left_at timestamptz,

  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now()
);

create index if not exists
  communication_participants_conversation_id_idx
on public.communication_participants(conversation_id);

create index if not exists
  communication_participants_company_id_idx
on public.communication_participants(company_id);

create unique index if not exists
  communication_participants_unique_identity_idx
on public.communication_participants(
  conversation_id,
  participant_type,
  participant_id
)
where participant_id is not null
  and left_at is null;


create table if not exists public.communication_messages (
  id uuid primary key default gen_random_uuid(),

  company_id uuid not null,

  conversation_id uuid not null
    references public.communication_conversations(id)
    on delete cascade,

  parent_message_id uuid
    references public.communication_messages(id)
    on delete set null,

  sender_type text not null
    check (
      sender_type in (
        'user',
        'employee',
        'customer',
        'ai_agent',
        'corporate_brain',
        'system'
      )
    ),

  sender_id uuid,
  sender_name text,

  message_type text not null default 'text'
    check (
      message_type in (
        'text',
        'voice',
        'file',
        'image',
        'system',
        'event'
      )
    ),

  content text,

  delivery_status text not null default 'sent'
    check (
      delivery_status in (
        'pending',
        'sent',
        'delivered',
        'read',
        'failed'
      )
    ),

  external_message_id text,
  reply_to_external_id text,

  metadata jsonb not null default '{}'::jsonb,

  sent_at timestamptz not null default now(),
  edited_at timestamptz,
  deleted_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  check (
    content is not null
    or message_type in ('voice', 'file', 'image', 'system', 'event')
  )
);

create index if not exists
  communication_messages_conversation_id_idx
on public.communication_messages(conversation_id);

create index if not exists
  communication_messages_company_id_idx
on public.communication_messages(company_id);

create index if not exists
  communication_messages_sent_at_idx
on public.communication_messages(conversation_id, sent_at);

create index if not exists
  communication_messages_parent_message_id_idx
on public.communication_messages(parent_message_id);


create table if not exists public.communication_attachments (
  id uuid primary key default gen_random_uuid(),

  company_id uuid not null,

  conversation_id uuid not null
    references public.communication_conversations(id)
    on delete cascade,

  message_id uuid
    references public.communication_messages(id)
    on delete cascade,

  attachment_type text not null
    check (
      attachment_type in (
        'document',
        'image',
        'audio',
        'video',
        'archive',
        'other'
      )
    ),

  storage_bucket text not null,
  storage_path text not null,

  original_file_name text not null,
  mime_type text not null,
  file_size_bytes bigint not null
    check (file_size_bytes >= 0),

  duration_seconds numeric,
  transcription text,

  processing_status text not null default 'ready'
    check (
      processing_status in (
        'uploading',
        'processing',
        'ready',
        'failed'
      )
    ),

  uploaded_by uuid,
  uploaded_by_name text,

  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index if not exists
  communication_attachments_message_id_idx
on public.communication_attachments(message_id);

create index if not exists
  communication_attachments_conversation_id_idx
on public.communication_attachments(conversation_id);

create index if not exists
  communication_attachments_company_id_idx
on public.communication_attachments(company_id);

create unique index if not exists
  communication_attachments_storage_path_idx
on public.communication_attachments(storage_bucket, storage_path);


create or replace function public.touch_communication_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists
  communication_conversations_touch_updated_at
on public.communication_conversations;

create trigger communication_conversations_touch_updated_at
before update on public.communication_conversations
for each row
execute function public.touch_communication_updated_at();


drop trigger if exists
  communication_messages_touch_updated_at
on public.communication_messages;

create trigger communication_messages_touch_updated_at
before update on public.communication_messages
for each row
execute function public.touch_communication_updated_at();


create or replace function public.sync_communication_conversation_activity()
returns trigger
language plpgsql
as $$
begin
  update public.communication_conversations
  set
    last_message_at = new.sent_at,
    updated_at = now()
  where id = new.conversation_id
    and company_id = new.company_id;

  return new;
end;
$$;

drop trigger if exists
  communication_messages_sync_activity
on public.communication_messages;

create trigger communication_messages_sync_activity
after insert on public.communication_messages
for each row
execute function public.sync_communication_conversation_activity();


alter table public.communication_conversations enable row level security;
alter table public.communication_participants enable row level security;
alter table public.communication_messages enable row level security;
alter table public.communication_attachments enable row level security;


drop policy if exists
  communication_conversations_tenant_access
on public.communication_conversations;

create policy communication_conversations_tenant_access
on public.communication_conversations
for all
to authenticated
using (
  company_id::text = coalesce(
    auth.jwt() ->> 'company_id',
    auth.jwt() -> 'app_metadata' ->> 'company_id'
  )
)
with check (
  company_id::text = coalesce(
    auth.jwt() ->> 'company_id',
    auth.jwt() -> 'app_metadata' ->> 'company_id'
  )
);


drop policy if exists
  communication_participants_tenant_access
on public.communication_participants;

create policy communication_participants_tenant_access
on public.communication_participants
for all
to authenticated
using (
  company_id::text = coalesce(
    auth.jwt() ->> 'company_id',
    auth.jwt() -> 'app_metadata' ->> 'company_id'
  )
)
with check (
  company_id::text = coalesce(
    auth.jwt() ->> 'company_id',
    auth.jwt() -> 'app_metadata' ->> 'company_id'
  )
);


drop policy if exists
  communication_messages_tenant_access
on public.communication_messages;

create policy communication_messages_tenant_access
on public.communication_messages
for all
to authenticated
using (
  company_id::text = coalesce(
    auth.jwt() ->> 'company_id',
    auth.jwt() -> 'app_metadata' ->> 'company_id'
  )
)
with check (
  company_id::text = coalesce(
    auth.jwt() ->> 'company_id',
    auth.jwt() -> 'app_metadata' ->> 'company_id'
  )
);


drop policy if exists
  communication_attachments_tenant_access
on public.communication_attachments;

create policy communication_attachments_tenant_access
on public.communication_attachments
for all
to authenticated
using (
  company_id::text = coalesce(
    auth.jwt() ->> 'company_id',
    auth.jwt() -> 'app_metadata' ->> 'company_id'
  )
)
with check (
  company_id::text = coalesce(
    auth.jwt() ->> 'company_id',
    auth.jwt() -> 'app_metadata' ->> 'company_id'
  )
);


comment on table public.communication_conversations is
  'Tenant-isolated conversations shared across KAFU AI communication channels.';

comment on table public.communication_participants is
  'Human, customer, AI agent and system participants in each conversation.';

comment on table public.communication_messages is
  'Persistent text, voice, file, system and event messages.';

comment on table public.communication_attachments is
  'File and voice attachments associated with communication messages.';
