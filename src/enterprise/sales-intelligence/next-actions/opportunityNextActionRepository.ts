import { supabase } from "@/lib/supabase";
import {
  resolveCurrentCompanyId,
} from "@/lib/workspace-identity/tenantResolver";

import type {
  NextActionPriority,
  NextActionStatus,
  NextActionType,
} from "../salesIntelligenceConstants";

import type {
  SalesPipelineNextAction,
} from "../salesIntelligenceTypes";

import {
  isNextActionPriority,
  isNextActionStatus,
  isNextActionType,
  requireNonEmptyText,
  requireValidDate,
} from "../salesIntelligenceValidation";

import {
  evaluateNextActionPriority,
} from "./opportunityNextActionPriorityEngine";

import type {
  CompleteOpportunityNextActionInput,
  CreateOpportunityNextActionInput,
  OpportunityNextActionMutationResult,
  OpportunityNextActionQuery,
  OpportunityNextActionSnapshot,
  TransitionOpportunityNextActionInput,
  UpdateOpportunityNextActionInput,
} from "./opportunityNextActionTypes";

type PipelineRecord = {
  id: string;
  company_id: string;
};

type NextActionRecord = {
  id: string;
  sales_pipeline_id: string;
  action_type: string;
  title: string;
  description: string | null;
  due_at: string;
  owner_id: string | null;
  owner_name: string | null;
  priority: string;
  status: string;
  is_primary: boolean;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
};

function requireIdentifier(
  value: string,
  fieldName: string,
): string {
  return requireNonEmptyText(
    value,
    fieldName,
  );
}

function requireActionType(
  value: string,
): NextActionType {
  if (!isNextActionType(value)) {
    throw new Error(
      `Unsupported next action type: ${value}`,
    );
  }

  return value as NextActionType;
}

function requirePriority(
  value: string,
): NextActionPriority {
  if (!isNextActionPriority(value)) {
    throw new Error(
      `Unsupported next action priority: ${value}`,
    );
  }

  return value as NextActionPriority;
}

function requireStatus(
  value: string,
): NextActionStatus {
  if (!isNextActionStatus(value)) {
    throw new Error(
      `Unsupported next action status: ${value}`,
    );
  }

  return value as NextActionStatus;
}

function mapNextAction(
  record: NextActionRecord,
): SalesPipelineNextAction {
  return {
    id: record.id,
    pipelineId: record.sales_pipeline_id,
    actionType: requireActionType(
      record.action_type,
    ),
    title: record.title,
    description: record.description,
    dueAt: record.due_at,
    ownerId: record.owner_id,
    ownerName: record.owner_name,
    priority: requirePriority(
      record.priority,
    ),
    status: requireStatus(
      record.status,
    ),
    isPrimary: record.is_primary,
    completedAt: record.completed_at,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
  };
}

async function resolveAuthorizedPipeline(
  pipelineIdInput: string,
): Promise<{
  pipelineId: string;
  companyId: string;
}> {
  const pipelineId = requireIdentifier(
    pipelineIdInput,
    "Sales pipeline ID",
  );

  const companyId =
    await resolveCurrentCompanyId();

  if (!companyId) {
    throw new Error(
      "Unable to resolve the active company.",
    );
  }

  const { data, error } = await supabase
    .from("sales_pipeline")
    .select(`
      id,
      company_id
    `)
    .eq("id", pipelineId)
    .eq("company_id", companyId)
    .maybeSingle();

  if (error) {
    throw new Error(
      `Unable to authorize sales opportunity: ${error.message}`,
    );
  }

  if (!data) {
    throw new Error(
      "The requested opportunity does not belong to the active company.",
    );
  }

  const pipeline = data as PipelineRecord;

  return {
    pipelineId: pipeline.id,
    companyId: pipeline.company_id,
  };
}

async function loadActionRecord(
  actionIdInput: string,
  pipelineId: string,
): Promise<NextActionRecord> {
  const actionId = requireIdentifier(
    actionIdInput,
    "Next action ID",
  );

  const { data, error } = await supabase
    .from("sales_pipeline_next_actions")
    .select(`
      id,
      sales_pipeline_id,
      action_type,
      title,
      description,
      due_at,
      owner_id,
      owner_name,
      priority,
      status,
      is_primary,
      completed_at,
      created_at,
      updated_at
    `)
    .eq("id", actionId)
    .eq("sales_pipeline_id", pipelineId)
    .maybeSingle();

  if (error) {
    throw new Error(
      `Unable to load next action: ${error.message}`,
    );
  }

  if (!data) {
    throw new Error(
      "The requested next action was not found.",
    );
  }

  return data as NextActionRecord;
}

async function clearPrimaryActions(
  pipelineId: string,
  excludedActionId?: string,
): Promise<string | null> {
  let query = supabase
    .from("sales_pipeline_next_actions")
    .select("id")
    .eq("sales_pipeline_id", pipelineId)
    .eq("is_primary", true);

  if (excludedActionId) {
    query = query.neq(
      "id",
      excludedActionId,
    );
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(
      `Unable to inspect primary next action: ${error.message}`,
    );
  }

  const previousPrimaryActionId =
    (data?.[0]?.id as string | undefined) ??
    null;

  if (!data || data.length === 0) {
    return null;
  }

  const ids = data.map(
    (item) => item.id as string,
  );

  const updateResult = await supabase
    .from("sales_pipeline_next_actions")
    .update({
      is_primary: false,
      updated_at: new Date().toISOString(),
    })
    .in("id", ids);

  if (updateResult.error) {
    throw new Error(
      `Unable to clear existing primary action: ${updateResult.error.message}`,
    );
  }

  return previousPrimaryActionId;
}

async function writeNextActionActivity(input: {
  pipelineId: string;
  activityType:
    | "follow_up"
    | "task_completed"
    | "note";
  description: string;
  metadata: Record<string, unknown>;
}): Promise<void> {
  const { error } = await supabase
    .from("sales_activities")
    .insert({
      sales_pipeline_id: input.pipelineId,
      activity_type: input.activityType,
      description: input.description,
      created_at: new Date().toISOString(),
      metadata: input.metadata,
    });

  if (error) {
    throw new Error(
      `Unable to write next action activity: ${error.message}`,
    );
  }
}

export async function listOpportunityNextActions(
  query: OpportunityNextActionQuery,
): Promise<OpportunityNextActionSnapshot> {
  const {
    pipelineId,
    companyId,
  } = await resolveAuthorizedPipeline(
    query.pipelineId,
  );

  let request = supabase
    .from("sales_pipeline_next_actions")
    .select(`
      id,
      sales_pipeline_id,
      action_type,
      title,
      description,
      due_at,
      owner_id,
      owner_name,
      priority,
      status,
      is_primary,
      completed_at,
      created_at,
      updated_at
    `)
    .eq("sales_pipeline_id", pipelineId)
    .order("is_primary", {
      ascending: false,
    })
    .order("due_at", {
      ascending: true,
    });

  if (
    query.statuses &&
    query.statuses.length > 0
  ) {
    request = request.in(
      "status",
      query.statuses,
    );
  } else if (!query.includeCompleted) {
    request = request.in("status", [
      "open",
      "in_progress",
    ]);
  }

  if (
    query.actionTypes &&
    query.actionTypes.length > 0
  ) {
    request = request.in(
      "action_type",
      query.actionTypes,
    );
  }

  const { data, error } = await request;

  if (error) {
    throw new Error(
      `Unable to load opportunity next actions: ${error.message}`,
    );
  }

  const actions = (
    (data ?? []) as NextActionRecord[]
  ).map(mapNextAction);

  const now = Date.now();

  return {
    pipelineId,
    companyId,
    generatedAt: new Date().toISOString(),
    primaryAction:
      actions.find(
        (action) =>
          action.isPrimary &&
          action.status !== "completed" &&
          action.status !== "cancelled",
      ) ?? null,
    actions,
    openCount: actions.filter(
      (action) =>
        action.status === "open" ||
        action.status === "in_progress",
    ).length,
    overdueCount: actions.filter(
      (action) =>
        (action.status === "open" ||
          action.status === "in_progress") &&
        new Date(action.dueAt).getTime() <
          now,
    ).length,
  };
}

export async function createOpportunityNextAction(
  input: CreateOpportunityNextActionInput,
): Promise<OpportunityNextActionMutationResult> {
  const {
    pipelineId,
  } = await resolveAuthorizedPipeline(
    input.pipelineId,
  );

  const actionType = requireActionType(
    input.actionType,
  );

  const title = requireNonEmptyText(
    input.title,
    "Next action title",
  );

  const dueAt = requireValidDate(
    input.dueAt,
    "Next action due date",
  );

  const evaluatedPriority =
    evaluateNextActionPriority(
      dueAt,
      input.priority,
    ).priority;

  const isPrimary =
    input.isPrimary ?? true;

  const previousPrimaryActionId =
    isPrimary
      ? await clearPrimaryActions(
          pipelineId,
        )
      : null;

  const timestamp =
    new Date().toISOString();

  const { data, error } = await supabase
    .from("sales_pipeline_next_actions")
    .insert({
      sales_pipeline_id: pipelineId,
      action_type: actionType,
      title,
      description:
        input.description?.trim() || null,
      due_at: dueAt,
      owner_id:
        input.ownerId?.trim() || null,
      owner_name:
        input.ownerName?.trim() || null,
      priority: evaluatedPriority,
      status: "open",
      is_primary: isPrimary,
      completed_at: null,
      created_at: timestamp,
      updated_at: timestamp,
    })
    .select(`
      id,
      sales_pipeline_id,
      action_type,
      title,
      description,
      due_at,
      owner_id,
      owner_name,
      priority,
      status,
      is_primary,
      completed_at,
      created_at,
      updated_at
    `)
    .single();

  if (error) {
    throw new Error(
      `Unable to create opportunity next action: ${error.message}`,
    );
  }

  const action = mapNextAction(
    data as NextActionRecord,
  );

  await writeNextActionActivity({
    pipelineId,
    activityType: "follow_up",
    description:
      `Next action created: ${action.title}`,
    metadata: {
      nextActionId: action.id,
      actionType: action.actionType,
      dueAt: action.dueAt,
      priority: action.priority,
      isPrimary: action.isPrimary,
    },
  });

  return {
    action,
    previousPrimaryActionId,
  };
}

export async function updateOpportunityNextAction(
  input: UpdateOpportunityNextActionInput,
): Promise<OpportunityNextActionMutationResult> {
  const {
    pipelineId,
  } = await resolveAuthorizedPipeline(
    input.pipelineId,
  );

  const existing = await loadActionRecord(
    input.actionId,
    pipelineId,
  );

  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (input.title !== undefined) {
    updates.title = requireNonEmptyText(
      input.title,
      "Next action title",
    );
  }

  if (input.description !== undefined) {
    updates.description =
      input.description?.trim() || null;
  }

  if (input.dueAt !== undefined) {
    const dueAt = requireValidDate(
      input.dueAt,
      "Next action due date",
    );

    updates.due_at = dueAt;

    if (input.priority === undefined) {
      updates.priority =
        evaluateNextActionPriority(
          dueAt,
          requirePriority(
            existing.priority,
          ),
        ).priority;
    }
  }

  if (input.ownerId !== undefined) {
    updates.owner_id =
      input.ownerId?.trim() || null;
  }

  if (input.ownerName !== undefined) {
    updates.owner_name =
      input.ownerName?.trim() || null;
  }

  if (input.priority !== undefined) {
    updates.priority = requirePriority(
      input.priority,
    );
  }

  if (input.status !== undefined) {
    updates.status = requireStatus(
      input.status,
    );

    updates.completed_at =
      input.status === "completed"
        ? new Date().toISOString()
        : null;
  }

  let previousPrimaryActionId:
    | string
    | null = null;

  if (input.isPrimary !== undefined) {
    updates.is_primary =
      input.isPrimary;

    if (input.isPrimary) {
      previousPrimaryActionId =
        await clearPrimaryActions(
          pipelineId,
          input.actionId,
        );
    }
  }

  const { data, error } = await supabase
    .from("sales_pipeline_next_actions")
    .update(updates)
    .eq("id", input.actionId)
    .eq("sales_pipeline_id", pipelineId)
    .select(`
      id,
      sales_pipeline_id,
      action_type,
      title,
      description,
      due_at,
      owner_id,
      owner_name,
      priority,
      status,
      is_primary,
      completed_at,
      created_at,
      updated_at
    `)
    .single();

  if (error) {
    throw new Error(
      `Unable to update opportunity next action: ${error.message}`,
    );
  }

  const action = mapNextAction(
    data as NextActionRecord,
  );

  await writeNextActionActivity({
    pipelineId,
    activityType: "note",
    description:
      `Next action updated: ${action.title}`,
    metadata: {
      nextActionId: action.id,
      status: action.status,
      priority: action.priority,
      isPrimary: action.isPrimary,
    },
  });

  return {
    action,
    previousPrimaryActionId,
  };
}

export async function transitionOpportunityNextAction(
  input: TransitionOpportunityNextActionInput,
): Promise<SalesPipelineNextAction> {
  const status = requireStatus(
    input.status,
  );

  const result =
    await updateOpportunityNextAction({
      actionId: input.actionId,
      pipelineId: input.pipelineId,
      status,
    });

  return result.action;
}

export async function completeOpportunityNextAction(
  input: CompleteOpportunityNextActionInput,
): Promise<SalesPipelineNextAction> {
  const {
    pipelineId,
  } = await resolveAuthorizedPipeline(
    input.pipelineId,
  );

  const existing = await loadActionRecord(
    input.actionId,
    pipelineId,
  );

  const completedAt =
    new Date().toISOString();

  const { data, error } = await supabase
    .from("sales_pipeline_next_actions")
    .update({
      status: "completed",
      is_primary: false,
      completed_at: completedAt,
      updated_at: completedAt,
    })
    .eq("id", input.actionId)
    .eq("sales_pipeline_id", pipelineId)
    .select(`
      id,
      sales_pipeline_id,
      action_type,
      title,
      description,
      due_at,
      owner_id,
      owner_name,
      priority,
      status,
      is_primary,
      completed_at,
      created_at,
      updated_at
    `)
    .single();

  if (error) {
    throw new Error(
      `Unable to complete opportunity next action: ${error.message}`,
    );
  }

  const action = mapNextAction(
    data as NextActionRecord,
  );

  await writeNextActionActivity({
    pipelineId,
    activityType: "task_completed",
    description:
      input.outcome?.trim() ||
      `Next action completed: ${existing.title}`,
    metadata: {
      nextActionId: action.id,
      actionType: action.actionType,
      completedAt,
      outcome:
        input.outcome?.trim() || null,
    },
  });

  return action;
}

export async function cancelOpportunityNextAction(
  input: {
    actionId: string;
    pipelineId: string;
    reason?: string | null;
  },
): Promise<SalesPipelineNextAction> {
  const result =
    await updateOpportunityNextAction({
      actionId: input.actionId,
      pipelineId: input.pipelineId,
      status: "cancelled",
      isPrimary: false,
    });

  await writeNextActionActivity({
    pipelineId: input.pipelineId,
    activityType: "note",
    description:
      input.reason?.trim() ||
      `Next action cancelled: ${result.action.title}`,
    metadata: {
      nextActionId: result.action.id,
      reason: input.reason?.trim() || null,
    },
  });

  return result.action;
}
