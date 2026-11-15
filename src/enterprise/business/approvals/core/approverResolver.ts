import type { ApprovalRepository } from "./approvalRepository";
import { ApprovalError, type StepSnapshot, type WorkflowStepRow } from "../types/approvalTypes";

/** Unique, not the requester, and still a member of the organization. */
export async function eligible(repo: ApprovalRepository, org: string, ids: string[], requesterId: string): Promise<string[]> {
  const uniq = [...new Set(ids)].filter((id) => id && id !== requesterId);
  if (!uniq.length) return [];
  const roles = await repo.membershipRoles(org, uniq);
  return uniq.filter((id) => roles.has(id));
}

async function candidates(repo: ApprovalRepository, org: string, step: WorkflowStepRow, requesterId: string) {
  switch (step.approver_type) {
    case "direct_manager": {
      const m = await repo.directManager(org, requesterId);
      return m ? [m] : [];
    }
    case "department_manager":
      return repo.departmentManagers(org, requesterId);
    case "specific_user":
      return step.approver_user_id ? [step.approver_user_id] : [];
    case "role":
      return step.approver_role ? repo.memberIdsByRole(org, step.approver_role) : [];
    default:
      return [];
  }
}

export async function ownerFallback(repo: ApprovalRepository, org: string, requesterId: string): Promise<string[]> {
  return eligible(repo, org, await repo.memberIdsByRole(org, "owner"), requesterId);
}


/**
 * Department heads of the departments the previous approver BELONGS to
 * (e.g. Khaled heads "Sales" but is a member of "Management" -> Management's head).
 */
export async function resolveManagerOfApprover(
  repo: ApprovalRepository, org: string, approverId: string, requesterId: string,
): Promise<string[]> {
  const heads = await repo.departmentManagers(org, approverId);
  return eligible(repo, org, heads, requesterId);
}
/**
 * Resolves WHO may decide each step at request creation (then frozen in the instance).
 *  - the requester never approves their own request;
 *  - required step with nobody eligible -> falls back to the company owners (HR);
 *  - still nobody -> NO_APPROVER (never a silent approval);
 *  - optional step with nobody eligible -> skipped;
 *  - "previous_approver_manager" steps are resolved later, when the previous step is decided.
 */
export async function resolveSnapshot(
  repo: ApprovalRepository, org: string, steps: WorkflowStepRow[], requesterId: string,
): Promise<StepSnapshot[]> {
  const out: StepSnapshot[] = [];
  for (const step of [...steps].sort((a, b) => a.step_order - b.step_order)) {
    const base = { order: step.step_order, name: step.name, approverType: step.approver_type, isRequired: step.is_required };

    if (step.approver_type === "previous_approver_manager") {
      const hasPrevious = out.some((s) => !s.skipped);
      out.push(
        hasPrevious
          ? { ...base, approverIds: [], skipped: false, dynamic: true }
          : { ...base, approverIds: [], skipped: true, skipReason: "no_previous_approver" },
      );
      continue;
    }

    let ids = await eligible(repo, org, await candidates(repo, org, step, requesterId), requesterId);
    let fallbackUsed = false;

    if (!ids.length && step.is_required) {
      ids = await ownerFallback(repo, org, requesterId);
      fallbackUsed = ids.length > 0;
    }

    if (!ids.length) {
      if (step.is_required) {
        throw new ApprovalError("NO_APPROVER", `No eligible approver for required step ${step.step_order}.`, 422);
      }
      out.push({ ...base, approverIds: [], skipped: true, skipReason: "no_eligible_approver" });
      continue;
    }
    out.push({ ...base, approverIds: ids, skipped: false, fallbackUsed });
  }
  return out;
}