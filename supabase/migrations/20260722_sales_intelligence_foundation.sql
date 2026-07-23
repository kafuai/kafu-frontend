-- KAFU AI
-- Enterprise Sales Intelligence Foundation
-- Non-destructive extension of public.sales_pipeline

create extension if not exists pgcrypto;

create table if not exists public.sales_pipeline_activities (
  id uuid primary key default gen_random_uuid(),

  pipeline_id uuid not null
    references public.sales_pipeline(id)
    on delete cascade,

  activity_type text not null
    check (
      activity_type in (
        'lead_created',
        'assignment',
        'status_change',
        'call',
        'email',
        'whatsapp',
        'meeting',
        'demo',
        'proposal',
        'note',
        'task_completed',
        'follow_up'
      )
    ),

  channel text
    check (
      channel is null
      or channel in (
        'system',
        'phone',
        'email',
        'whatsapp',
        'video',
        'in_person',
        'platform'
      )
    ),

  subject text,
  description text,
  outcome text,

  performed_by uuid,
  performed_by_name text,

  occurred_at timestamptz not null default now(),

  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now()
);

create index if not exists
  sales_pipeline_activities_pipeline_id_idx
on public.sales_pipeline_activities(pipeline_id);

create index if not exists
  sales_pipeline_activities_occurred_at_idx
on public.sales_pipeline_activities(occurred_at desc);


create table if not exists public.sales_pipeline_next_actions (
  id uuid primary key default gen_random_uuid(),

  pipeline_id uuid not null
    references public.sales_pipeline(id)
    on delete cascade,

  action_type text not null
    check (
      action_type in (
        'call',
        'email',
        'whatsapp',
        'meeting',
        'demo',
        'proposal',
        'internal_review',
        'follow_up',
        'custom'
      )
    ),

  title text not null,
  description text,

  due_at timestamptz not null,

  owner_id uuid,
  owner_name text,

  priority text not null default 'medium'
    check (priority in ('low', 'medium', 'high', 'critical')),

  status text not null default 'open'
    check (
      status in (
        'open',
        'in_progress',
        'completed',
        'cancelled'
      )
    ),

  is_primary boolean not null default true,

  completed_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists
  sales_pipeline_next_actions_pipeline_id_idx
on public.sales_pipeline_next_actions(pipeline_id);

create index if not exists
  sales_pipeline_next_actions_due_at_idx
on public.sales_pipeline_next_actions(due_at);

create unique index if not exists
  sales_pipeline_one_primary_open_action_idx
on public.sales_pipeline_next_actions(pipeline_id)
where is_primary = true
  and status in ('open', 'in_progress');


create table if not exists public.sales_pipeline_stage_history (
  id uuid primary key default gen_random_uuid(),

  pipeline_id uuid not null
    references public.sales_pipeline(id)
    on delete cascade,

  previous_status text,
  new_status text not null,

  changed_by uuid,
  changed_by_name text,

  reason text,

  changed_at timestamptz not null default now()
);

create index if not exists
  sales_pipeline_stage_history_pipeline_id_idx
on public.sales_pipeline_stage_history(pipeline_id);

create index if not exists
  sales_pipeline_stage_history_changed_at_idx
on public.sales_pipeline_stage_history(changed_at desc);


comment on table public.sales_pipeline_activities is
  'Immutable timeline of sales activities, communications, notes and follow-ups.';

comment on table public.sales_pipeline_next_actions is
  'Scheduled next actions and follow-up responsibilities for sales opportunities.';

comment on table public.sales_pipeline_stage_history is
  'Audit trail for every sales pipeline status transition.';
