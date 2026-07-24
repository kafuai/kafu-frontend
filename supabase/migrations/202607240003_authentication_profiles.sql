create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.organization_memberships (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member'
    check (
      role in (
        'owner',
        'admin',
        'manager',
        'member',
        'viewer'
      )
    ),
  created_at timestamptz not null default now(),
  unique (organization_id, user_id)
);

create index if not exists organization_memberships_user_id_idx
  on public.organization_memberships(user_id);

alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.organization_memberships enable row level security;

drop policy if exists "Users can read own profile"
  on public.profiles;

create policy "Users can read own profile"
  on public.profiles
  for select
  using (auth.uid() = id);

drop policy if exists "Users can update own profile"
  on public.profiles;

create policy "Users can update own profile"
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "Members can read organizations"
  on public.organizations;

create policy "Members can read organizations"
  on public.organizations
  for select
  using (
    exists (
      select 1
      from public.organization_memberships membership
      where membership.organization_id = organizations.id
        and membership.user_id = auth.uid()
    )
  );

drop policy if exists "Users can read own memberships"
  on public.organization_memberships;

create policy "Users can read own memberships"
  on public.organization_memberships
  for select
  using (user_id = auth.uid());

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  generated_organization_id uuid;
  organization_name text;
  organization_slug text;
begin
  insert into public.profiles (
    id,
    full_name,
    email
  )
  values (
    new.id,
    nullif(new.raw_user_meta_data ->> 'full_name', ''),
    new.email
  )
  on conflict (id) do nothing;

  organization_name :=
    coalesce(
      nullif(new.raw_user_meta_data ->> 'company_name', ''),
      'KAFU AI Workspace'
    );

  organization_slug :=
    lower(
      regexp_replace(
        organization_name,
        '[^a-zA-Z0-9]+',
        '-',
        'g'
      )
    );

  organization_slug :=
    trim(both '-' from organization_slug);

  if organization_slug = '' then
    organization_slug := 'workspace';
  end if;

  organization_slug :=
    organization_slug || '-' || substring(new.id::text from 1 for 8);

  insert into public.organizations (
    name,
    slug
  )
  values (
    organization_name,
    organization_slug
  )
  returning id into generated_organization_id;

  insert into public.organization_memberships (
    organization_id,
    user_id,
    role
  )
  values (
    generated_organization_id,
    new.id,
    'owner'
  );

  return new;
end;
$$;

drop trigger if exists on_auth_user_created
  on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
