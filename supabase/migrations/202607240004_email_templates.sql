create table if not exists public.email_templates (
  id uuid primary key default gen_random_uuid(),
  template_key text not null unique,
  name text not null,
  category text not null
    check (
      category in (
        'authentication',
        'communication',
        'notification',
        'commercial',
        'system'
      )
    ),
  status text not null default 'draft'
    check (
      status in (
        'draft',
        'active',
        'archived'
      )
    ),
  subject text not null,
  html_body text not null,
  text_body text not null,
  variables jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists email_templates_category_idx
  on public.email_templates(category);

create index if not exists email_templates_status_idx
  on public.email_templates(status);

alter table public.email_templates
  enable row level security;

drop policy if exists "Authenticated users can read active email templates"
  on public.email_templates;

create policy "Authenticated users can read active email templates"
  on public.email_templates
  for select
  to authenticated
  using (
    status = 'active'
  );

drop policy if exists "Authenticated users can manage email templates"
  on public.email_templates;

create policy "Authenticated users can manage email templates"
  on public.email_templates
  for all
  to authenticated
  using (true)
  with check (true);
