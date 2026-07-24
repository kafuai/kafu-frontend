create table if not exists public.communication_conversations (
  id uuid primary key,
  company_id uuid not null,
  tenant_id uuid not null,
  organization_id uuid not null,
  subject text,
  channel text not null,
  status text not null default 'active',
  priority text not null default 'normal',
  participants jsonb not null default '[]'::jsonb,
  tags text[] not null default '{}',
  created_by text not null,
  external_reference_id text,
  last_message_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint communication_conversations_status_check
    check (status in ('active', 'paused', 'completed', 'archived', 'failed')),

  constraint communication_conversations_priority_check
    check (priority in ('low', 'normal', 'high', 'critical')),

  constraint communication_conversations_channel_check
    check (
      channel in (
        'web',
        'mobile',
        'desktop',
        'email',
        'slack',
        'teams',
        'whatsapp',
        'api',
        'internal_chat',
        'voice'
      )
    )
);

create table if not exists public.communication_messages (
  id uuid primary key,
  company_id uuid not null,
  conversation_id uuid not null
    references public.communication_conversations(id)
    on delete cascade,
  sender_id text not null,
  channel text not null,
  direction text not null,
  message_type text not null default 'text',
  content text not null default '',
  delivery_status text not null default 'queued',
  reply_to_message_id uuid
    references public.communication_messages(id)
    on delete set null,
  external_message_id text,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint communication_messages_direction_check
    check (direction in ('inbound', 'outbound', 'internal')),

  constraint communication_messages_type_check
    check (
      message_type in (
        'text',
        'voice',
        'image',
        'document',
        'system',
        'event'
      )
    ),

  constraint communication_messages_delivery_check
    check (
      delivery_status in (
        'draft',
        'queued',
        'sending',
        'sent',
        'delivered',
        'read',
        'failed'
      )
    )
);

create table if not exists public.communication_attachments (
  id uuid primary key,
  company_id uuid not null,
  conversation_id uuid not null
    references public.communication_conversations(id)
    on delete cascade,
  message_id uuid not null
    references public.communication_messages(id)
    on delete cascade,
  attachment_type text not null,
  file_name text not null,
  mime_type text not null,
  size_bytes bigint not null default 0,
  storage_path text not null,
  public_url text,
  duration_seconds numeric,
  created_by text not null,
  created_at timestamptz not null default now(),

  constraint communication_attachments_type_check
    check (
      attachment_type in (
        'image',
        'document',
        'audio',
        'video',
        'archive',
        'other'
      )
    ),

  constraint communication_attachments_size_check
    check (size_bytes >= 0)
);

create index if not exists communication_conversations_company_index
  on public.communication_conversations(company_id);

create index if not exists communication_conversations_activity_index
  on public.communication_conversations(company_id, last_message_at desc);

create index if not exists communication_messages_conversation_index
  on public.communication_messages(company_id, conversation_id, created_at);

create index if not exists communication_messages_external_index
  on public.communication_messages(external_message_id)
  where external_message_id is not null;

create index if not exists communication_attachments_message_index
  on public.communication_attachments(company_id, message_id);

alter table public.communication_conversations enable row level security;
alter table public.communication_messages enable row level security;
alter table public.communication_attachments enable row level security;

create table if not exists public.communication_audit_log (
  id text primary key,
  company_id text not null,
  conversation_id text,
  message_id text,
  action text not null,
  channel text,
  delivery_status text,
  actor_id text not null,
  source text not null,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),

  constraint communication_audit_action_check
    check (
      action in (
        'conversation_created',
        'conversation_updated',
        'message_received',
        'message_created',
        'message_dispatched',
        'delivery_updated',
        'attachment_created',
        'webhook_received',
        'webhook_rejected'
      )
    )
);

create index if not exists communication_audit_company_index
  on public.communication_audit_log(
    company_id,
    created_at desc
  );

create index if not exists communication_audit_conversation_index
  on public.communication_audit_log(
    conversation_id,
    created_at desc
  )
  where conversation_id is not null;

create index if not exists communication_audit_message_index
  on public.communication_audit_log(
    message_id,
    created_at desc
  )
  where message_id is not null;

alter table public.communication_audit_log
  enable row level security;
