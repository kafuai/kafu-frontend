export const WORKFLOW_REQUEST_TYPES = ["leave", "attendance_correction", "attendance_dispute"] as const;
export type WorkflowRequestType = (typeof WORKFLOW_REQUEST_TYPES)[number];

export const SUBJECT_TYPES = ["leave", "attendance_correction"] as const;
export type SubjectType = (typeof SUBJECT_TYPES)[number];

export const APPROVER_TYPES = [ "direct_manager", "department_manager", "specific_user", "role", "previous_approver_manager",] as const;
export type ApproverType = (typeof APPROVER_TYPES)[number];
export const ASSIGNABLE_ROLES = ["owner", "manager"] as const;

export type WorkflowStatus = "draft" | "active" | "inactive";
export type InstanceStatus = "pending" | "approved" | "rejected" | "cancelled";
export type EffectStatus = "none" | "pending" | "applying" | "applied" | "failed";
export type DecisionKind = "approved" | "rejected";

export interface WorkflowRow {
  id: string; organization_id: string; request_type: WorkflowRequestType; name: string;
  version: number; status: WorkflowStatus; created_by: string | null;
  created_at: string; updated_at: string; activated_at: string | null;
}
export interface WorkflowStepRow {
  id: string; organization_id: string; workflow_id: string; step_order: number; name: string | null;
  approver_type: ApproverType; approver_user_id: string | null; approver_role: string | null; is_required: boolean;
}
export interface WorkflowWithSteps extends WorkflowRow { steps: WorkflowStepRow[] }

export interface StepInput {
  name?: string | null;
  approverType: ApproverType;
  approverUserId?: string | null;
  approverRole?: string | null;
  isRequired: boolean;
}

export interface StepSnapshot {
  order: number; name: string | null; approverType: ApproverType; isRequired: boolean;
  approverIds: string[]; skipped: boolean; skipReason?: string; fallbackUsed?: boolean;
  /** approvers are resolved when the previous step is decided (manager of whoever actually approved) */
  dynamic?: boolean;
}

export interface InstanceRow {
  id: string; organization_id: string; subject_type: SubjectType; workflow_type: WorkflowRequestType;
  request_id: string; workflow_id: string; workflow_version: number; requester_id: string;
  status: InstanceStatus; current_step_order: number | null; current_approver_ids: string[];
  steps_snapshot: StepSnapshot[]; effect_status: EffectStatus; effect_error: string | null;
  version: number; created_at: string; updated_at: string; completed_at: string | null;
}
export interface DecisionRow {
  id: string; organization_id: string; instance_id: string; step_order: number;
  approver_user_id: string; decision: DecisionKind; note: string | null; created_at: string;
}

export class ApprovalError extends Error {
  constructor(public readonly code: string, message: string, public readonly status: number) {
    super(message);
    this.name = "ApprovalError";
  }
}