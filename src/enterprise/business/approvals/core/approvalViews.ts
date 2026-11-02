import type { SupabaseClient } from "@supabase/supabase-js";
import { ApprovalRepository } from "./approvalRepository";
import type { InstanceRow } from "../types/approvalTypes";

export interface ApprovalStepView {
  order: number; name: string | null; approverType: string; isRequired: boolean; skipped: boolean;
  skipReason: string | null;
  /** true while the approver is still to be resolved (manager of the previous approver) */
  pendingResolution: boolean;
  fallbackUsed: boolean; approvers: string[];
  decision: { decision: string; note: string | null; by: string; at: string } | null;
}
export interface ApprovalView {
  instanceId: string;
  status: string;
  currentStep: number | null;
  totalSteps: number;
  effectStatus: string;
  canDecide: boolean;
  steps: ApprovalStepView[];
}

/**
 * Instances the user may see: every instance only for users with explicit organization-wide
 * visibility (canViewAll), otherwise only instances where the user is an approver of at least one
 * step (current, past or already-resolved future step).
 * Key = `${subject_type}:${request_id}`.
 */
export async function loadVisibleApprovals(
  db: SupabaseClient, org: string, userId: string, canViewAll: boolean,
): Promise<{ instances: InstanceRow[]; views: Map<string, ApprovalView> }> {
  const repo = new ApprovalRepository(db);
  const all = await repo.listAll(org);
  const instances = all.filter(
    (i) => canViewAll || i.steps_snapshot.some((s) => s.approverIds.includes(userId)),
  );
  const decisions = await repo.listDecisionsForInstances(org, instances.map((i) => i.id));
  const names = await repo.profileNames([
    ...instances.flatMap((i) => i.steps_snapshot.flatMap((s) => s.approverIds)),
    ...decisions.map((d) => d.approver_user_id),
  ]);
  const nm = (u: string) => names.get(u) ?? u;

  const views = new Map<string, ApprovalView>();
  for (const i of instances) {
    views.set(`${i.subject_type}:${i.request_id}`, {
      instanceId: i.id,
      status: i.status,
      currentStep: i.current_step_order,
      totalSteps: i.steps_snapshot.filter((s) => !s.skipped).length,
      effectStatus: i.effect_status,
      canDecide: i.status === "pending" && i.requester_id !== userId && i.current_approver_ids.includes(userId),
      steps: i.steps_snapshot.map((s) => {
        const d = decisions.find((x) => x.instance_id === i.id && x.step_order === s.order);
        return {
          order: s.order, name: s.name, approverType: s.approverType, isRequired: s.isRequired,
          skipped: s.skipped, skipReason: s.skipReason ?? null,
          pendingResolution: Boolean(s.dynamic) && !s.skipped && s.approverIds.length === 0,
          fallbackUsed: Boolean(s.fallbackUsed), approvers: s.approverIds.map(nm),
          decision: d ? { decision: d.decision, note: d.note, by: nm(d.approver_user_id), at: d.created_at } : null,
        };
      }),
    });
  }
  return { instances, views };
}