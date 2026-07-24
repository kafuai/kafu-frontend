-- ============================================================
-- KAFU AI Enterprise
-- Sales Intelligence Tenant Isolation
-- ============================================================

create or replace function public.current_company_id()
returns uuid
language sql
stable
security invoker
set search_path = public
as $$
  select nullif(
    coalesce(
      auth.jwt() ->> 'company_id',
      auth.jwt() -> 'app_metadata' ->> 'company_id'
    ),
    ''
  )::uuid;
$$;

revoke all on function public.current_company_id() from public;
grant execute on function public.current_company_id() to authenticated;

-- ============================================================
-- SALES PIPELINE
-- ============================================================

alter table public.sales_pipeline
  enable row level security;

drop policy if exists sales_pipeline_tenant_select
  on public.sales_pipeline;

create policy sales_pipeline_tenant_select
on public.sales_pipeline
for select
to authenticated
using (
  company_id = public.current_company_id()
);

drop policy if exists sales_pipeline_tenant_insert
  on public.sales_pipeline;

create policy sales_pipeline_tenant_insert
on public.sales_pipeline
for insert
to authenticated
with check (
  company_id = public.current_company_id()
);

drop policy if exists sales_pipeline_tenant_update
  on public.sales_pipeline;

create policy sales_pipeline_tenant_update
on public.sales_pipeline
for update
to authenticated
using (
  company_id = public.current_company_id()
)
with check (
  company_id = public.current_company_id()
);

drop policy if exists sales_pipeline_tenant_delete
  on public.sales_pipeline;

create policy sales_pipeline_tenant_delete
on public.sales_pipeline
for delete
to authenticated
using (
  company_id = public.current_company_id()
);

-- ============================================================
-- SALES ACTIVITIES
-- Tenant access inherited through sales_pipeline_id.
-- ============================================================

alter table public.sales_activities
  enable row level security;

drop policy if exists sales_activities_tenant_select
  on public.sales_activities;

create policy sales_activities_tenant_select
on public.sales_activities
for select
to authenticated
using (
  exists (
    select 1
    from public.sales_pipeline pipeline
    where pipeline.id = sales_activities.sales_pipeline_id
      and pipeline.company_id = public.current_company_id()
  )
);

drop policy if exists sales_activities_tenant_insert
  on public.sales_activities;

create policy sales_activities_tenant_insert
on public.sales_activities
for insert
to authenticated
with check (
  exists (
    select 1
    from public.sales_pipeline pipeline
    where pipeline.id = sales_activities.sales_pipeline_id
      and pipeline.company_id = public.current_company_id()
  )
);

drop policy if exists sales_activities_tenant_update
  on public.sales_activities;

create policy sales_activities_tenant_update
on public.sales_activities
for update
to authenticated
using (
  exists (
    select 1
    from public.sales_pipeline pipeline
    where pipeline.id = sales_activities.sales_pipeline_id
      and pipeline.company_id = public.current_company_id()
  )
)
with check (
  exists (
    select 1
    from public.sales_pipeline pipeline
    where pipeline.id = sales_activities.sales_pipeline_id
      and pipeline.company_id = public.current_company_id()
  )
);

drop policy if exists sales_activities_tenant_delete
  on public.sales_activities;

create policy sales_activities_tenant_delete
on public.sales_activities
for delete
to authenticated
using (
  exists (
    select 1
    from public.sales_pipeline pipeline
    where pipeline.id = sales_activities.sales_pipeline_id
      and pipeline.company_id = public.current_company_id()
  )
);
