-- KAFU AI
-- Enterprise Workspace Provisioning
-- Unifies Authentication Organizations with the existing Company tenant model.

create extension if not exists pgcrypto;

-- =========================================================
-- 1. Link authentication organizations to application companies
-- =========================================================

alter table public.organizations
  add column if not exists company_id uuid;

create unique index if not exists
  organizations_company_id_unique_idx
on public.organizations(company_id)
where company_id is not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'organizations_company_id_fkey'
  ) then
    alter table public.organizations
      add constraint organizations_company_id_fkey
      foreign key (company_id)
      references public.companies(id)
      on delete restrict;
  end if;
end;
$$;

comment on column public.organizations.company_id is
  'Application tenant identifier used by Discovery, Sales Intelligence, Communication and Executive Workspace.';


-- =========================================================
-- 2. Resolve or create the company tenant for an organization
-- =========================================================

create or replace function public.ensure_organization_company(
  target_organization_id uuid
)
returns uuid
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  organization_record public.organizations%rowtype;
  resolved_company_id uuid;
begin
  select *
  into organization_record
  from public.organizations
  where id = target_organization_id
  for update;

  if organization_record.id is null then
    raise exception 'Organization % was not found.', target_organization_id;
  end if;

  if organization_record.company_id is not null then
    return organization_record.company_id;
  end if;

  insert into public.companies (
    name
  )
  values (
    coalesce(
      nullif(trim(organization_record.name), ''),
      'Untitled Organization'
    )
  )
  returning id into resolved_company_id;

  update public.organizations
  set company_id = resolved_company_id
  where id = organization_record.id;

  return resolved_company_id;
end;
$$;

revoke all on function public.ensure_organization_company(uuid) from public;
grant execute on function public.ensure_organization_company(uuid) to service_role;


-- =========================================================
-- 3. Provision workspace identity for one authenticated user
-- =========================================================

create or replace function public.provision_user_workspace(
  target_user_id uuid
)
returns uuid
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  resolved_organization_id uuid;
  resolved_company_id uuid;
begin
  select membership.organization_id
  into resolved_organization_id
  from public.organization_memberships membership
  where membership.user_id = target_user_id
  order by
    case
      when membership.role = 'owner' then 0
      when membership.role = 'admin' then 1
      else 2
    end,
    membership.organization_id
  limit 1;

  if resolved_organization_id is null then
    raise exception 'No organization membership exists for user %.', target_user_id;
  end if;

  resolved_company_id :=
    public.ensure_organization_company(resolved_organization_id);

  update auth.users
  set raw_app_meta_data =
    coalesce(raw_app_meta_data, '{}'::jsonb)
    || jsonb_build_object(
      'organization_id', resolved_organization_id,
      'company_id', resolved_company_id
    )
  where id = target_user_id;

  return resolved_company_id;
end;
$$;

revoke all on function public.provision_user_workspace(uuid) from public;
grant execute on function public.provision_user_workspace(uuid) to service_role;


-- =========================================================
-- 4. Automatically provision every newly registered user
-- Existing authentication trigger runs first alphabetically.
-- =========================================================

create or replace function public.handle_workspace_provisioning()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  perform public.provision_user_workspace(new.id);
  return new;
end;
$$;

drop trigger if exists z_workspace_provisioning_after_signup
on auth.users;

create trigger z_workspace_provisioning_after_signup
after insert on auth.users
for each row
execute function public.handle_workspace_provisioning();


-- =========================================================
-- 5. Backfill existing authenticated organizations and users
-- =========================================================

do $$
declare
  organization_record record;
  user_record record;
begin
  for organization_record in
    select id
    from public.organizations
    where company_id is null
  loop
    perform public.ensure_organization_company(
      organization_record.id
    );
  end loop;

  for user_record in
    select distinct user_id
    from public.organization_memberships
  loop
    perform public.provision_user_workspace(
      user_record.user_id
    );
  end loop;
end;
$$;


-- =========================================================
-- 6. Secure company tenant access
-- =========================================================

alter table public.companies enable row level security;

drop policy if exists
  "Users can view their company"
on public.companies;

create policy
  "Users can view their company"
on public.companies
for select
to authenticated
using (
  id = nullif(
    auth.jwt() -> 'app_metadata' ->> 'company_id',
    ''
  )::uuid
);

drop policy if exists
  "Users can update their company"
on public.companies;

create policy
  "Users can update their company"
on public.companies
for update
to authenticated
using (
  id = nullif(
    auth.jwt() -> 'app_metadata' ->> 'company_id',
    ''
  )::uuid
)
with check (
  id = nullif(
    auth.jwt() -> 'app_metadata' ->> 'company_id',
    ''
  )::uuid
);

comment on function public.provision_user_workspace(uuid) is
  'Creates or resolves the application company tenant and stores company_id and organization_id in authenticated user app metadata.';
