import type { SupabaseClient } from "@supabase/supabase-js";
import { ApprovalRepository } from "./approvalRepository";
import { ownerFallback, resolveManagerOfApprover, resolveSnapshot } from "./approverResolver";
import {
  ApprovalError,
  type DecisionKind, type DecisionRow, type EffectStatus, type InstanceRow,
  type StepSnapshot, type SubjectType, type WorkflowRequestType,
} from "../types/approvalTypes";

export interface SubjectInfo {
  requesterId: string;
  workflowType: WorkflowRequestType;
  status: string; // status of the business record; only 'pending' can enter a workflow
  summary: Record<string, unknown>;
}
export interface HandlerContext {
  db: SupabaseClient;
  organizationId: string;
  instance: InstanceRow;
  finalApproverId: string | null;
  note: string | null;
}
/** Handlers MUST be idempotent: the engine may call them again after a crash / retry. */
export interface ApprovalHandler {
  describe(db: SupabaseClient, organizationId: string, requestId: string): Promise<SubjectInfo | null>;
  onApproved(ctx: HandlerContext): Promise<void>;
  onRejected(ctx: HandlerContext): Promise<void>;
}
export type ApprovalHandlers = Record<SubjectType, ApprovalHandler>;
export interface DecisionResult { instance: InstanceRow; effectStatus: EffectStatus }

const notFound = () => new ApprovalError("NOT_FOUND", "Approval request not found.", 404);

/**
 * Feature-agnostic approval engine (pure backend logic).
 * Concurrency without DB functions/transactions:
 *  1. UNIQUE(instance_id, step_order) on decisions => one decision per step, ever.
 *  2. Instance moves use a conditional UPDATE on `version`.
 *  3. A crash between (1) and (2) is healed by reconcile().
 *  4. Business effects are claimed with a conditional UPDATE and handlers are idempotent.
 */
export class ApprovalEngine {
  private readonly repo: ApprovalRepository;
  constructor(private readonly db: SupabaseClient, private readonly handlers: ApprovalHandlers) {
    this.repo = new ApprovalRepository(db);
  }
  get repository() { return this.repo; }

  /** Returns null when the company has no ACTIVE workflow for this type (caller keeps the legacy flow). */
  async start(organizationId: string, subjectType: SubjectType, requestId: string): Promise<InstanceRow | null> {
    const existing = await this.repo.getInstanceBySubject(organizationId, subjectType, requestId);
    if (existing) return existing;

    const subject = await this.handlers[subjectType].describe(this.db, organizationId, requestId);
    if (!subject) throw notFound();
    if (subject.status !== "pending") {
      throw new ApprovalError("SUBJECT_NOT_PENDING", "Only a pending request can enter an approval workflow.", 409);
    }

    const wf = await this.repo.getActiveWorkflow(organizationId, subject.workflowType);
    if (!wf) return null;

    const snapshot = await resolveSnapshot(this.repo, organizationId, wf.steps, subject.requesterId);
    const first = snapshot.find((s) => !s.skipped && !s.dynamic);
    if (!first) throw new ApprovalError("NO_APPROVER", "No eligible approver for this request.", 422);

    const created = await this.repo.insertInstance({
      organization_id: organizationId, subject_type: subjectType, workflow_type: subject.workflowType,
      request_id: requestId, workflow_id: wf.id, workflow_version: wf.version,
      requester_id: subject.requesterId, status: "pending",
      current_step_order: first.order, current_approver_ids: first.approverIds,
      steps_snapshot: snapshot, effect_status: "none",
    });
    if (created === "duplicate") {
      const again = await this.repo.getInstanceBySubject(organizationId, subjectType, requestId);
      if (again) return again;
      throw new ApprovalError("CONFLICT", "Please retry.", 409);
    }
    await this.repo.addEvent({
      organization_id: organizationId, instance_id: created.id, actor_id: subject.requesterId,
      event_type: "created", data: { workflowId: wf.id, workflowVersion: wf.version },
    });
    return created;
  }

  async decide(p: {
    organizationId: string; instanceId: string; actorId: string; decision: DecisionKind; note?: string | null;
  }): Promise<DecisionResult> {
    const org = p.organizationId;
    let inst = await this.mustGet(org, p.instanceId);
    inst = await this.reconcile(inst);

    if (inst.status !== "pending" || inst.current_step_order === null) {
      throw new ApprovalError("ALREADY_FINAL", "This request is no longer awaiting approval.", 409);
    }
    const step = inst.steps_snapshot.find((s) => s.order === inst.current_step_order);
    if (!step) throw new ApprovalError("CORRUPT_STATE", "Workflow state is invalid.", 500);

    if (p.actorId === inst.requester_id) {
      throw new ApprovalError("SELF_APPROVAL", "You cannot decide on your own request.", 403);
    }
    if (!inst.current_approver_ids.includes(p.actorId)) {
      throw new ApprovalError("NOT_APPROVER", "You are not an approver for the current step.", 403);
    }
    const roles = await this.repo.membershipRoles(org, [p.actorId]);
    if (!roles.has(p.actorId)) {
      throw new ApprovalError("NOT_APPROVER", "You are not an approver for the current step.", 403);
    }
    // The same person never decides two steps of the same request.
    const prior = await this.repo.listDecisions(inst.id);
    if (prior.some((d) => d.approver_user_id === p.actorId)) {
      throw new ApprovalError("ALREADY_DECIDED_EARLIER", "You already decided an earlier step of this request.", 403);
    }

    const note = (p.note ?? "").trim().slice(0, 1000) || null;
    if (p.decision === "rejected" && (!note || note.length < 3)) {
      throw new ApprovalError("NOTE_REQUIRED", "A reason is required when rejecting.", 400);
    }

    const claim = await this.repo.insertDecision({
      organization_id: org, instance_id: inst.id, step_order: step.order,
      approver_user_id: p.actorId, decision: p.decision, note,
    });
    if (claim === "duplicate") {
      await this.reconcile(await this.mustGet(org, inst.id));
      throw new ApprovalError("ALREADY_DECIDED", "This step was already decided.", 409);
    }

    const advanced = await this.advance(inst, p.decision, p.actorId);
    await this.repo.addEvent({
      organization_id: org, instance_id: inst.id, actor_id: p.actorId,
      event_type: p.decision, step_order: step.order, note,
    });
    return this.finalize(advanced);
  }

  /** Requester withdraws a pending request (called by the feature's own cancel route). */
  async cancelBySubject(org: string, subjectType: SubjectType, requestId: string, actorId: string) {
    const inst = await this.repo.getInstanceBySubject(org, subjectType, requestId);
    if (!inst) return null;
    if (inst.requester_id !== actorId) throw new ApprovalError("FORBIDDEN", "Forbidden", 403);
    if (inst.status !== "pending") throw new ApprovalError("ALREADY_FINAL", "Request already processed.", 409);
    const done = await this.repo.transition(org, inst.id, inst.version, {
      status: "cancelled", current_step_order: null, current_approver_ids: [],
      completed_at: new Date().toISOString(), effect_status: "none",
    });
    if (!done) throw new ApprovalError("CONFLICT", "Request changed. Please retry.", 409);
    await this.repo.addEvent({ organization_id: org, instance_id: inst.id, actor_id: actorId, event_type: "cancelled" });
    return done;
  }

  /** Re-run the business effect of a finished request whose effect failed. */
  async retryEffects(org: string, instanceId: string): Promise<DecisionResult> {
    const inst = await this.mustGet(org, instanceId);
    if ((inst.status !== "approved" && inst.status !== "rejected") || inst.effect_status === "applied" || inst.effect_status === "none") {
      throw new ApprovalError("NOTHING_TO_RETRY", "Nothing to retry for this request.", 409);
    }
    return this.applyEffects(inst);
  }

  /* ----------------------------- internals ----------------------------- */
  private async mustGet(org: string, id: string): Promise<InstanceRow> {
    const inst = await this.repo.getInstance(org, id); // org-scoped: other companies' ids look "not found"
    if (!inst) throw notFound();
    return inst;
  }

  /**
   * Moves the instance after the current step was decided.
   *  - rejected: ends the workflow.
   *  - approved: finds the next step that still has someone who has not decided yet.
   *      * "previous_approver_manager" steps are resolved now (manager of the person who just approved);
   *      * a step whose approvers all decided already is SKIPPED (same person never decides twice).
   */
  private async advance(inst: InstanceRow, decision: DecisionKind, actorId: string): Promise<InstanceRow> {
    const org = inst.organization_id;
    const now = new Date().toISOString();
    let patch: Record<string, unknown>;
    const skippedNow: { order: number; reason: string }[] = [];

    if (decision === "rejected") {
      patch = { status: "rejected", current_step_order: null, current_approver_ids: [], completed_at: now, effect_status: "pending" };
    } else {
      const decided = new Set((await this.repo.listDecisions(inst.id)).map((d) => d.approver_user_id));
      decided.add(actorId);

      const steps: StepSnapshot[] = inst.steps_snapshot.map((s) => ({ ...s }));
      let next: StepSnapshot | null = null;
      let nextIds: string[] = [];

      for (const s of steps) {
        if (s.order <= (inst.current_step_order ?? 0) || s.skipped) continue;

        let ids = s.approverIds;
        if (s.dynamic) {
          ids = await resolveManagerOfApprover(this.repo, org, actorId, inst.requester_id);
          if (!ids.length && s.isRequired) {
            ids = await ownerFallback(this.repo, org, inst.requester_id);
            s.fallbackUsed = ids.length > 0;
          }
        }

        const usable = ids.filter((u) => !decided.has(u));
        if (!usable.length) {
          s.skipped = true;
          s.skipReason = ids.length ? "same_approver_as_previous" : "no_eligible_approver";
          skippedNow.push({ order: s.order, reason: s.skipReason });
          continue;
        }
        if (s.dynamic) s.approverIds = usable; // freeze who was resolved
        next = s;
        nextIds = usable;
        break;
      }

      patch = next
        ? { steps_snapshot: steps, current_step_order: next.order, current_approver_ids: nextIds }
        : {
            steps_snapshot: steps, status: "approved", current_step_order: null,
            current_approver_ids: [], completed_at: now, effect_status: "pending",
          };
    }

    const updated = await this.repo.transition(org, inst.id, inst.version, patch);
    if (updated) {
      for (const sk of skippedNow) {
        await this.repo.addEvent({
          organization_id: org, instance_id: inst.id, actor_id: null,
          event_type: "step_skipped", step_order: sk.order, note: sk.reason,
        });
      }
      return updated;
    }

    const fresh = await this.mustGet(org, inst.id);
    if (fresh.status === "pending" && fresh.current_step_order === inst.current_step_order) {
      throw new ApprovalError("CONFLICT", "Request changed. Please retry.", 409);
    }
    return fresh;
  }

  /** A decision exists for the current step but the instance never moved (crash): finish the move. */
  private async reconcile(inst: InstanceRow): Promise<InstanceRow> {
    if (inst.status !== "pending" || inst.current_step_order === null) return inst;
    const d = await this.repo.getDecision(inst.id, inst.current_step_order);
    if (!d) return inst;
    const moved = await this.advance(inst, d.decision, d.approver_user_id);
    return (await this.finalize(moved)).instance;
  }

  private async finalize(inst: InstanceRow): Promise<DecisionResult> {
    if ((inst.status === "approved" || inst.status === "rejected") &&
        ["pending", "failed", "applying"].includes(inst.effect_status)) {
      return this.applyEffects(inst);
    }
    return { instance: inst, effectStatus: inst.effect_status };
  }

  private async applyEffects(inst: InstanceRow): Promise<DecisionResult> {
    const org = inst.organization_id;
    const claimed = await this.repo.claimEffects(org, inst.id);
    if (!claimed) {
      const cur = await this.mustGet(org, inst.id);
      return { instance: cur, effectStatus: cur.effect_status };
    }
    const decisions = await this.repo.listDecisions(inst.id);
    const last: DecisionRow | undefined = decisions[decisions.length - 1];
    const ctx: HandlerContext = {
      db: this.db, organizationId: org, instance: inst,
      finalApproverId: last?.approver_user_id ?? null, note: last?.note ?? null,
    };
    try {
      const h = this.handlers[inst.subject_type];
      if (inst.status === "approved") await h.onApproved(ctx);
      else await h.onRejected(ctx);
      await this.repo.finishEffects(org, inst.id, "applied");
      await this.repo.addEvent({ organization_id: org, instance_id: inst.id, actor_id: null, event_type: "effects_applied" });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error("Approval effect failed:", inst.id, msg);
      await this.repo.finishEffects(org, inst.id, "failed", msg);
      await this.repo.addEvent({ organization_id: org, instance_id: inst.id, actor_id: null, event_type: "effects_failed", note: msg.slice(0, 300) });
    }
    const cur = await this.mustGet(org, inst.id);
    return { instance: cur, effectStatus: cur.effect_status };
  }
}