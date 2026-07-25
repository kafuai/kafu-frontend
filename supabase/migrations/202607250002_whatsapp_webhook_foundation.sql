-- KAFU AI
-- Meta WhatsApp Webhook Foundation
-- Adds only the persistence required for secure and idempotent webhook processing.

begin;

-- Track the timestamp of the latest accepted provider delivery event.
alter table public.communication_messages
  add column if not exists last_delivery_event_at timestamptz;

-- Prevent expensive webhook lookups by Meta external message identifier.
create index if not exists
  communication_messages_external_index
on public.communication_messages(external_message_id)
where external_message_id is not null;

-- Persist every provider event once.
create table if not exists public.communication_webhook_events (
  event_key text primary key,

  provider text not null,
  event_type text not null,

  external_message_id text,

  company_id uuid,
  conversation_id uuid,
  message_id uuid,

  provider_timestamp timestamptz,

  processing_status text not null
    default 'received',

  payload jsonb not null
    default '{}'::jsonb,

  error_message text,

  received_at timestamptz not null
    default now(),

  processed_at timestamptz,

  constraint communication_webhook_provider_check
    check (
      provider in (
        'meta_whatsapp'
      )
    ),

  constraint communication_webhook_processing_status_check
    check (
      processing_status in (
        'received',
        'processed',
        'ignored',
        'failed'
      )
    )
);

create index if not exists
  communication_webhook_events_external_message_index
on public.communication_webhook_events(
  external_message_id,
  received_at desc
)
where external_message_id is not null;

create index if not exists
  communication_webhook_events_company_index
on public.communication_webhook_events(
  company_id,
  received_at desc
)
where company_id is not null;

create index if not exists
  communication_webhook_events_status_index
on public.communication_webhook_events(
  processing_status,
  received_at
);

alter table public.communication_webhook_events
  enable row level security;

comment on table public.communication_webhook_events is
  'Server-only idempotency and processing ledger for trusted communication provider webhooks.';

comment on column public.communication_webhook_events.event_key is
  'Deterministic unique key preventing duplicate processing of the same provider event.';

comment on column public.communication_messages.last_delivery_event_at is
  'Timestamp of the latest accepted provider delivery-status event.';

commit;
