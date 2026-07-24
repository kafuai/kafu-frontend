create table if not exists public.demo_experiences (
  id uuid primary key default gen_random_uuid(),
  experience_key text not null unique,
  name text not null,
  description text not null,
  status text not null default 'draft'
    check (
      status in (
        'draft',
        'active',
        'completed',
        'archived'
      )
    ),
  steps jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.demo_experience_sessions (
  id uuid primary key default gen_random_uuid(),
  experience_id uuid not null
    references public.demo_experiences(id)
    on delete cascade,
  user_id uuid not null
    references auth.users(id)
    on delete cascade,
  company_id uuid,
  current_step_id text,
  progress jsonb not null default '[]'::jsonb,
  started_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists demo_experiences_status_idx
  on public.demo_experiences(status);

create index if not exists demo_experience_sessions_user_id_idx
  on public.demo_experience_sessions(user_id);

create index if not exists demo_experience_sessions_experience_id_idx
  on public.demo_experience_sessions(experience_id);

alter table public.demo_experiences
  enable row level security;

alter table public.demo_experience_sessions
  enable row level security;

drop policy if exists "Authenticated users can read active demo experiences"
  on public.demo_experiences;

create policy "Authenticated users can read active demo experiences"
  on public.demo_experiences
  for select
  to authenticated
  using (
    status = 'active'
  );

drop policy if exists "Users can read own demo sessions"
  on public.demo_experience_sessions;

create policy "Users can read own demo sessions"
  on public.demo_experience_sessions
  for select
  to authenticated
  using (
    user_id = auth.uid()
  );

drop policy if exists "Users can create own demo sessions"
  on public.demo_experience_sessions;

create policy "Users can create own demo sessions"
  on public.demo_experience_sessions
  for insert
  to authenticated
  with check (
    user_id = auth.uid()
  );

drop policy if exists "Users can update own demo sessions"
  on public.demo_experience_sessions;

create policy "Users can update own demo sessions"
  on public.demo_experience_sessions
  for update
  to authenticated
  using (
    user_id = auth.uid()
  )
  with check (
    user_id = auth.uid()
  );
