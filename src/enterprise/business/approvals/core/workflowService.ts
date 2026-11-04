import type { ApprovalRepository } from "./approvalRepository";
import {
  APPROVER_TYPES, ApprovalError, ASSIGNABLE_ROLES, WORKFLOW_REQUEST_TYPES,
  type StepInput, type WorkflowRequestType, type WorkflowWithSteps,
} from "../types/approvalTypes";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const MAX_STEPS = 10;
// Temporarily disabled: direct-manager steps (reporting lines are not used for now).
// To bring it back, set this to false.
const DIRECT_MANAGER_DISABLED = true;

export function isRequestType(v: unknown): v is WorkflowRequestType {
  return typeof v === "string" && (WORKFLOW_REQUEST_TYPES as readonly string[]).includes(v);
}

export async function validateSteps(repo: ApprovalRepository, org: string, raw: unknown): Promise<StepInput[]> {
  if (!Array.isArray(raw) || raw.length < 1 || raw.length > MAX_STEPS) {
    throw new ApprovalError("INVALID_STEPS", `A workflow needs between 1 and ${MAX_STEPS} steps.`, 400);
  }
  const steps: StepInput[] = [];
  for (const [i, r] of (raw as Record<string, unknown>[]).entries()) {
    const type = r?.approverType;
    if (!(APPROVER_TYPES as readonly unknown[]).includes(type)) {
      throw new ApprovalError("INVALID_STEPS", `Step ${i + 1}: invalid approver type.`, 400);
    }
    if (DIRECT_MANAGER_DISABLED && type === "direct_manager") {
      throw new ApprovalError("INVALID_STEPS", `Step ${i + 1}: "Direct manager" is not available. Use "Department manager".`, 422);
    }
    if (type === "previous_approver_manager" && i === 0) {
      throw new ApprovalError("INVALID_STEPS", "The first step cannot be the manager of the previous approver.", 422);
    }
    const s: StepInput = {
      name: typeof r.name === "string" && r.name.trim() ? r.name.trim().slice(0, 120) : null,
      approverType: type as StepInput["approverType"],
      approverUserId: null, approverRole: null,
      isRequired: r.isRequired !== false,
    };
    if (type === "specific_user") {
      if (typeof r.approverUserId !== "string" || !UUID.test(r.approverUserId)) {
        throw new ApprovalError("INVALID_STEPS", `Step ${i + 1}: choose a user.`, 400);
      }
      s.approverUserId = r.approverUserId;
    }
    if (type === "role") {
      if (!(ASSIGNABLE_ROLES as readonly unknown[]).includes(r.approverRole)) {
        throw new ApprovalError("INVALID_STEPS", `Step ${i + 1}: invalid role.`, 400);
      }
      s.approverRole = r.approverRole as string;
    }
    steps.push(s);
  }
  if (!steps.some((s) => s.isRequired)) {
    throw new ApprovalError("INVALID_STEPS", "At least one step must be required.", 422);
  }
  const userIds = steps.map((s) => s.approverUserId).filter(Boolean) as string[];
  if (userIds.length) {
    const roles = await repo.membershipRoles(org, userIds);
    if (userIds.some((id) => !roles.has(id))) {
      throw new ApprovalError("INVALID_APPROVER", "A selected user is not a member of this company.", 422);
    }
  }
  return steps;
}

function cleanName(v: unknown): string {
  const n = typeof v === "string" ? v.trim() : "";
  if (!n || n.length > 120) throw new ApprovalError("INVALID_NAME", "A workflow name (1–120 chars) is required.", 400);
  return n;
}

export async function createDraft(
  repo: ApprovalRepository, org: string, userId: string,
  input: { requestType: unknown; name: unknown; steps: unknown },
): Promise<WorkflowWithSteps> {
  if (!isRequestType(input.requestType)) throw new ApprovalError("INVALID_TYPE", "Invalid request type.", 400);
  const name = cleanName(input.name);
  const steps = await validateSteps(repo, org, input.steps);
  const version = await repo.nextVersion(org, input.requestType);
  let wf;
  try {
    wf = await repo.insertWorkflow({ organization_id: org, request_type: input.requestType, name, version, created_by: userId });
  } catch (e) {
    if ((e as { code?: string }).code === "23505") throw new ApprovalError("VERSION_CONFLICT", "Please retry.", 409);
    throw e;
  }
  await repo.replaceSteps(org, wf.id, steps);
  return (await repo.getWorkflow(org, wf.id))!;
}

async function mustWorkflow(repo: ApprovalRepository, org: string, id: string) {
  const wf = await repo.getWorkflow(org, id);
  if (!wf) throw new ApprovalError("NOT_FOUND", "Workflow not found.", 404);
  return wf;
}

const toInput = (wf: WorkflowWithSteps) =>
  wf.steps.map((s) => ({
    name: s.name, approverType: s.approver_type, approverUserId: s.approver_user_id,
    approverRole: s.approver_role, isRequired: s.is_required,
  }));

export async function updateDraft(
  repo: ApprovalRepository, org: string, id: string, input: { name?: unknown; steps?: unknown },
): Promise<WorkflowWithSteps> {
  const wf = await mustWorkflow(repo, org, id);
  if (wf.status === "active") throw new ApprovalError("WORKFLOW_ACTIVE", "Active workflows cannot be edited. Deactivate the workflow first.", 409);
  if (input.name !== undefined) await repo.updateWorkflow(org, id, { name: cleanName(input.name) });
  if (input.steps !== undefined) await repo.replaceSteps(org, id, await validateSteps(repo, org, input.steps));
  return (await repo.getWorkflow(org, id))!;
}

export async function deleteDraft(repo: ApprovalRepository, org: string, id: string): Promise<void> {
  const wf = await mustWorkflow(repo, org, id);
  if (wf.status !== "draft") throw new ApprovalError("NOT_DRAFT", "Only a draft can be deleted.", 409);
  await repo.deleteWorkflow(org, id);
}

/** Clone any version into a new draft (the way to "edit" an active workflow). */
export async function cloneAsDraft(repo: ApprovalRepository, org: string, userId: string, id: string) {
  const wf = await mustWorkflow(repo, org, id);
  return createDraft(repo, org, userId, { requestType: wf.request_type, name: wf.name, steps: toInput(wf) });
}

export async function activate(repo: ApprovalRepository, org: string, id: string): Promise<WorkflowWithSteps> {
  const wf = await mustWorkflow(repo, org, id);
  if (wf.status === "active") throw new ApprovalError("ALREADY_ACTIVE", "Workflow is already active.", 409);
  await validateSteps(repo, org, toInput(wf)); // users may have left since the draft was saved

  const prev = await repo.getActiveWorkflow(org, wf.request_type);
  if (prev) await repo.updateWorkflow(org, prev.id, { status: "inactive" });
  try {
    await repo.updateWorkflow(org, wf.id, { status: "active", activated_at: new Date().toISOString() });
  } catch (e) {
    if (prev) await repo.updateWorkflow(org, prev.id, { status: "active" }).catch(() => undefined);
    throw e;
  }
  return (await repo.getWorkflow(org, id))!;
}

export async function deactivate(repo: ApprovalRepository, org: string, id: string): Promise<WorkflowWithSteps> {
  const wf = await mustWorkflow(repo, org, id);
  if (wf.status !== "active") throw new ApprovalError("NOT_ACTIVE", "Workflow is not active.", 409);
  await repo.updateWorkflow(org, id, { status: "inactive" });
  return (await repo.getWorkflow(org, id))!;
}