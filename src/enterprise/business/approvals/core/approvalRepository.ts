import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  DecisionKind, DecisionRow, EffectStatus, InstanceRow, StepInput, SubjectType,
  WorkflowRequestType, WorkflowRow, WorkflowStatus, WorkflowStepRow, WorkflowWithSteps,
} from "../types/approvalTypes";

const WF = "id,organization_id,request_type,name,version,status,created_by,created_at,updated_at,activated_at";
const STEP = "id,organization_id,workflow_id,step_order,name,approver_type,approver_user_id,approver_role,is_required";
export const INSTANCE_COLS =
  "id,organization_id,subject_type,workflow_type,request_id,workflow_id,workflow_version,requester_id,status,current_step_order,current_approver_ids,steps_snapshot,effect_status,effect_error,version,created_at,updated_at,completed_at";
const DEC = "id,organization_id,instance_id,step_order,approver_user_id,decision,note,created_at";

type DbErr = { message: string; code?: string };
function fail(op: string, error: DbErr): never {
  const e = new Error(`${op}: ${error.message}`) as Error & { code?: string };
  e.code = error.code;
  throw e;
}

/** Plain data access. Every query is scoped by organization_id. No business rules here. */
export class ApprovalRepository {
  constructor(private readonly db: SupabaseClient) {}

  /* ------------------------------ workflows ------------------------------ */
  private async attachSteps(org: string, wfs: WorkflowRow[]): Promise<WorkflowWithSteps[]> {
    if (!wfs.length) return [];
    const { data, error } = await this.db.from("approval_workflow_steps").select(STEP)
      .eq("organization_id", org).in("workflow_id", wfs.map((w) => w.id)).order("step_order");
    if (error) fail("load steps", error);
    const by = new Map<string, WorkflowStepRow[]>();
    for (const s of (data ?? []) as unknown as WorkflowStepRow[]) {
      const l = by.get(s.workflow_id) ?? [];
      l.push(s);
      by.set(s.workflow_id, l);
    }
    return wfs.map((w) => ({ ...w, steps: by.get(w.id) ?? [] }));
  }

  async listWorkflows(org: string): Promise<WorkflowWithSteps[]> {
    const { data, error } = await this.db.from("approval_workflows").select(WF)
      .eq("organization_id", org).order("request_type").order("version", { ascending: false });
    if (error) fail("list workflows", error);
    return this.attachSteps(org, (data ?? []) as unknown as WorkflowRow[]);
  }

  async getWorkflow(org: string, id: string): Promise<WorkflowWithSteps | null> {
    const { data, error } = await this.db.from("approval_workflows").select(WF)
      .eq("organization_id", org).eq("id", id).maybeSingle();
    if (error) fail("get workflow", error);
    if (!data) return null;
    return (await this.attachSteps(org, [data as unknown as WorkflowRow]))[0];
  }

  async getActiveWorkflow(org: string, type: WorkflowRequestType): Promise<WorkflowWithSteps | null> {
    const { data, error } = await this.db.from("approval_workflows").select(WF)
      .eq("organization_id", org).eq("request_type", type).eq("status", "active").maybeSingle();
    if (error) fail("get active workflow", error);
    if (!data) return null;
    return (await this.attachSteps(org, [data as unknown as WorkflowRow]))[0];
  }

  async nextVersion(org: string, type: WorkflowRequestType): Promise<number> {
    const { data, error } = await this.db.from("approval_workflows").select("version")
      .eq("organization_id", org).eq("request_type", type).order("version", { ascending: false }).limit(1);
    if (error) fail("next version", error);
    return ((data?.[0]?.version as number | undefined) ?? 0) + 1;
  }

  async insertWorkflow(row: {
    organization_id: string; request_type: WorkflowRequestType; name: string; version: number; created_by: string;
  }): Promise<WorkflowRow> {
    const { data, error } = await this.db.from("approval_workflows").insert({ ...row, status: "draft" })
      .select(WF).single();
    if (error) fail("insert workflow", error);
    return data as unknown as WorkflowRow;
  }

  async updateWorkflow(
    org: string, id: string,
    patch: Partial<{ name: string; status: WorkflowStatus; activated_at: string | null }>,
  ): Promise<void> {
    const { error } = await this.db.from("approval_workflows")
      .update({ ...patch, updated_at: new Date().toISOString() })
      .eq("organization_id", org).eq("id", id);
    if (error) fail("update workflow", error);
  }

  async deleteWorkflow(org: string, id: string): Promise<void> {
    const { error } = await this.db.from("approval_workflows").delete().eq("organization_id", org).eq("id", id);
    if (error) fail("delete workflow", error);
  }

  async replaceSteps(org: string, workflowId: string, steps: StepInput[]): Promise<void> {
    const del = await this.db.from("approval_workflow_steps").delete()
      .eq("organization_id", org).eq("workflow_id", workflowId);
    if (del.error) fail("clear steps", del.error);
    if (!steps.length) return;
    const { error } = await this.db.from("approval_workflow_steps").insert(
      steps.map((s, i) => ({
        organization_id: org, workflow_id: workflowId, step_order: i + 1, name: s.name ?? null,
        approver_type: s.approverType, approver_user_id: s.approverUserId ?? null,
        approver_role: s.approverRole ?? null, is_required: s.isRequired,
      })),
    );
    if (error) fail("insert steps", error);
  }

  /* ------------------------------ instances ------------------------------ */
  async insertInstance(row: Record<string, unknown>): Promise<InstanceRow | "duplicate"> {
    const { data, error } = await this.db.from("approval_instances").insert(row).select(INSTANCE_COLS).single();
    if (error) {
      if (error.code === "23505") return "duplicate";
      fail("insert instance", error);
    }
    return data as unknown as InstanceRow;
  }

  async getInstance(org: string, id: string): Promise<InstanceRow | null> {
    const { data, error } = await this.db.from("approval_instances").select(INSTANCE_COLS)
      .eq("organization_id", org).eq("id", id).maybeSingle();
    if (error) fail("get instance", error);
    return (data as unknown as InstanceRow) ?? null;
  }

  async getInstanceBySubject(org: string, subject: SubjectType, requestId: string): Promise<InstanceRow | null> {
    const { data, error } = await this.db.from("approval_instances").select(INSTANCE_COLS)
      .eq("organization_id", org).eq("subject_type", subject).eq("request_id", requestId).maybeSingle();
    if (error) fail("get instance by subject", error);
    return (data as unknown as InstanceRow) ?? null;
  }

  async listAll(org: string): Promise<InstanceRow[]> {
    const { data, error } = await this.db.from("approval_instances").select(INSTANCE_COLS)
      .eq("organization_id", org).order("created_at", { ascending: false }).limit(500);
    if (error) fail("list instances", error);
    return (data ?? []) as unknown as InstanceRow[];
  }

  /** Optimistic-lock transition: succeeds only if the row is still at `expectedVersion`. */
  async transition(
    org: string, id: string, expectedVersion: number, patch: Record<string, unknown>,
  ): Promise<InstanceRow | null> {
    const { data, error } = await this.db.from("approval_instances")
      .update({ ...patch, version: expectedVersion + 1, updated_at: new Date().toISOString() })
      .eq("organization_id", org).eq("id", id).eq("version", expectedVersion)
      .select(INSTANCE_COLS).maybeSingle();
    if (error) fail("transition instance", error);
    return (data as unknown as InstanceRow) ?? null;
  }

  /** Claim the right to run business effects. A stale 'applying' claim (crash) can be re-taken after 2 minutes. */
  async claimEffects(org: string, id: string): Promise<boolean> {
    const now = new Date().toISOString();
    const first = await this.db.from("approval_instances").update({ effect_status: "applying", updated_at: now })
      .eq("organization_id", org).eq("id", id).in("effect_status", ["pending", "failed"]).select("id").maybeSingle();
    if (first.error) fail("claim effects", first.error);
    if (first.data) return true;
    const cutoff = new Date(Date.now() - 120_000).toISOString();
    const stale = await this.db.from("approval_instances").update({ effect_status: "applying", updated_at: now })
      .eq("organization_id", org).eq("id", id).eq("effect_status", "applying").lt("updated_at", cutoff)
      .select("id").maybeSingle();
    if (stale.error) fail("claim stale effects", stale.error);
    return Boolean(stale.data);
  }

  async finishEffects(org: string, id: string, status: EffectStatus, error?: string): Promise<void> {
    const { error: e } = await this.db.from("approval_instances")
      .update({ effect_status: status, effect_error: error ? error.slice(0, 500) : null, updated_at: new Date().toISOString() })
      .eq("organization_id", org).eq("id", id);
    if (e) fail("finish effects", e);
  }

  /* ------------------------------ decisions / events ------------------------------ */
  async insertDecision(row: {
    organization_id: string; instance_id: string; step_order: number;
    approver_user_id: string; decision: DecisionKind; note: string | null;
  }): Promise<"ok" | "duplicate"> {
    const { error } = await this.db.from("approval_decisions").insert(row);
    if (error) {
      if (error.code === "23505") return "duplicate";
      fail("insert decision", error);
    }
    return "ok";
  }

  async getDecision(instanceId: string, stepOrder: number): Promise<DecisionRow | null> {
    const { data, error } = await this.db.from("approval_decisions").select(DEC)
      .eq("instance_id", instanceId).eq("step_order", stepOrder).maybeSingle();
    if (error) fail("get decision", error);
    return (data as unknown as DecisionRow) ?? null;
  }

  async listDecisions(instanceId: string): Promise<DecisionRow[]> {
    const { data, error } = await this.db.from("approval_decisions").select(DEC)
      .eq("instance_id", instanceId).order("step_order");
    if (error) fail("list decisions", error);
    return (data ?? []) as unknown as DecisionRow[];
  }

  async listDecisionsForInstances(org: string, ids: string[]): Promise<DecisionRow[]> {
    if (!ids.length) return [];
    const { data, error } = await this.db.from("approval_decisions").select(DEC)
      .eq("organization_id", org).in("instance_id", ids);
    if (error) fail("list decisions for instances", error);
    return (data ?? []) as unknown as DecisionRow[];
  }

  async addEvent(row: {
    organization_id: string; instance_id: string; actor_id: string | null; event_type: string;
    step_order?: number | null; note?: string | null; data?: Record<string, unknown>;
  }): Promise<void> {
    const { error } = await this.db.from("approval_events").insert(row); // audit never breaks the flow
    if (error) console.error("approval event insert failed:", error.message);
  }

  /* ------------------------------ people ------------------------------ */
  async membershipRoles(org: string, ids: string[]): Promise<Map<string, string>> {
    const out = new Map<string, string>();
    if (!ids.length) return out;
    const { data, error } = await this.db.from("organization_memberships").select("user_id,role")
      .eq("organization_id", org).in("user_id", ids);
    if (error) fail("membership roles", error);
    for (const m of data ?? []) out.set(m.user_id as string, String(m.role ?? "").toLowerCase());
    return out;
  }

  async memberIdsByRole(org: string, role: string): Promise<string[]> {
    const { data, error } = await this.db.from("organization_memberships").select("user_id,role")
      .eq("organization_id", org);
    if (error) fail("members by role", error);
    return (data ?? []).filter((m) => String(m.role ?? "").toLowerCase() === role).map((m) => m.user_id as string);
  }

  async profileNames(ids: string[]): Promise<Map<string, string>> {
    const out = new Map<string, string>();
    const uniq = [...new Set(ids)].filter(Boolean);
    if (!uniq.length) return out;
    const { data, error } = await this.db.from("profiles").select("id,full_name,email").in("id", uniq);
    if (error) fail("profiles", error);
    for (const p of data ?? []) out.set(p.id as string, (p.full_name as string)?.trim() || (p.email as string) || (p.id as string));
    return out;
  }

  async listMembers(org: string): Promise<{ userId: string; role: string; name: string }[]> {
    const { data, error } = await this.db.from("organization_memberships").select("user_id,role").eq("organization_id", org);
    if (error) fail("list members", error);
    const names = await this.profileNames((data ?? []).map((m) => m.user_id as string));
    return (data ?? []).map((m) => ({
      userId: m.user_id as string, role: String(m.role ?? ""), name: names.get(m.user_id as string) ?? (m.user_id as string),
    }));
  }

  async directManager(org: string, userId: string): Promise<string | null> {
    const { data, error } = await this.db.from("employee_reporting_lines").select("manager_user_id")
      .eq("organization_id", org).eq("user_id", userId).maybeSingle();
    if (error) fail("direct manager", error);
    return (data?.manager_user_id as string) ?? null;
  }

  async departmentManagers(org: string, userId: string): Promise<string[]> {
    const dm = await this.db.from("department_members").select("department_id")
      .eq("organization_id", org).eq("user_id", userId);
    if (dm.error) fail("department members", dm.error);
    const deptIds = (dm.data ?? []).map((r) => r.department_id as string);
    if (!deptIds.length) return [];
    const { data, error } = await this.db.from("department_managers").select("user_id")
      .eq("organization_id", org).in("department_id", deptIds);
    if (error) fail("department managers", error);
    return [...new Set((data ?? []).map((r) => r.user_id as string))];
  }
}