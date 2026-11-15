import type { SupabaseClient } from "@supabase/supabase-js";
import { ApprovalEngine } from "./core/approvalEngine";
import { correctionHandler, leaveHandler } from "./handlers/approvalHandlers";

export * from "./types/approvalTypes";
export * from "./core/approvalRepository";
export * from "./core/approvalViews";
export * as workflowService from "./core/workflowService";
export { ApprovalEngine } from "./core/approvalEngine";

/** `db` must be the server-side admin client; every query inside is scoped by organization_id. */
export function createApprovalEngine(db: SupabaseClient): ApprovalEngine {
  return new ApprovalEngine(db, { leave: leaveHandler, attendance_correction: correctionHandler });
}