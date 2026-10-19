"use server";

import { revalidatePath } from "next/cache";

import { supabase } from "@/lib/supabase";
import { resolveCurrentCompanyId } from "@/lib/workspace-identity/tenantResolver";

import {
  SALES_PIPELINE_STATUSES,
  type SalesPipelineStatus,
} from "@/src/enterprise/sales-intelligence/salesIntelligenceConstants";

import {
  salesCommunicationOrchestrator,
} from "@/src/enterprise/sales-intelligence/communication/salesCommunicationProductionRuntime";
import {
  getOpportunityLifecycleSnapshot,
} from "@/src/enterprise/sales-intelligence/opportunity-lifecycle/opportunityLifecycleRepository";

import type {
  OpportunityLifecycleSnapshot,
} from "@/src/enterprise/sales-intelligence/opportunity-lifecycle/opportunityLifecycleTypes";

type UpdateLeadStageResult = {
  success: true;
  pipelineId: string;
  previousStage: SalesPipelineStatus;
  newStage: SalesPipelineStatus;
};

export type OpenSalesOpportunityConversationResult = {
  success: true;
  pipelineId: string;
  conversationId: string;
  created: boolean;
};

type SalesPipelineRecord = {
  id: string;
  company_id: string;
  status: string | null;
  companies:
    | {
        name: string | null;
      }
    | {
        name: string | null;
      }[]
    | null;
};

function normalizePipelineStatus(
  value: string,
): SalesPipelineStatus {
  const normalized = value
    .trim()
    .toLowerCase()
    .replaceAll(" ", "_");

  if (
    !SALES_PIPELINE_STATUSES.includes(
      normalized as SalesPipelineStatus,
    )
  ) {
    throw new Error("Invalid sales pipeline stage.");
  }

  return normalized as SalesPipelineStatus;
}

function requirePipelineId(value: string): string {
  const pipelineId = value.trim();

  if (!pipelineId) {
    throw new Error("Sales pipeline ID is required.");
  }

  return pipelineId;
}

function resolveCompanyName(
  companies: SalesPipelineRecord["companies"],
): string {
  const company = Array.isArray(companies)
    ? companies[0]
    : companies;

  return company?.name?.trim() || "Sales Opportunity";
}

async function resolveAuthenticatedUserId(): Promise<string> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw new Error(
      `Unable to verify the authenticated user: ${error.message}`,
    );
  }

  if (!user) {
    throw new Error(
      "An authenticated user is required for this sales operation.",
    );
  }

  return user.id;
}

async function loadAuthorizedPipeline(
  pipelineId: string,
  companyId: string,
): Promise<SalesPipelineRecord> {
  const { data, error } = await supabase
    .from("sales_pipeline")
    .select(`
      id,
      company_id,
      status,
      companies (
        name
      )
    `)
    .eq("id", pipelineId)
    .eq("company_id", companyId)
    .maybeSingle();

  if (error) {
    throw new Error(
      `Unable to load the sales opportunity: ${error.message}`,
    );
  }

  if (!data) {
    throw new Error(
      "The requested sales opportunity was not found in the active company.",
    );
  }

  return data as SalesPipelineRecord;
}


import {
  opportunityNextActionWorkflow,
} from "@/src/enterprise/sales-intelligence/next-actions/opportunityNextActionWorkflow";

import type {
  CompleteOpportunityNextActionInput,
  CreateOpportunityNextActionInput,
  OpportunityNextActionMutationResult,
  OpportunityNextActionQuery,
  OpportunityNextActionSnapshot,
  TransitionOpportunityNextActionInput,
  UpdateOpportunityNextActionInput,
} from "@/src/enterprise/sales-intelligence/next-actions/opportunityNextActionTypes";

import type {
  SalesPipelineNextAction,
} from "@/src/enterprise/sales-intelligence/salesIntelligenceTypes";

import {
  unifiedActivityWorkflow,
} from "@/src/enterprise/sales-intelligence/activity-engine/unifiedActivityWorkflow";

import type {
  UnifiedActivityQuery,
  UnifiedActivitySnapshot,
} from "@/src/enterprise/sales-intelligence/activity-engine/unifiedActivityTypes";
export async function updateLeadStage(
  pipelineIdInput: string,
  newStageInput: string,
): Promise<UpdateLeadStageResult> {
  const pipelineId = requirePipelineId(pipelineIdInput);
  const newStage = normalizePipelineStatus(newStageInput);
  const companyId = await resolveCurrentCompanyId();

  if (!companyId) {
    throw new Error(
      "Unable to resolve the active company for this sales operation.",
    );
  }

  const pipeline = await loadAuthorizedPipeline(
    pipelineId,
    companyId,
  );

  const previousStage = normalizePipelineStatus(
    typeof pipeline.status === "string"
      ? pipeline.status
      : "new",
  );

  if (previousStage === newStage) {
    return {
      success: true,
      pipelineId,
      previousStage,
      newStage,
    };
  }

  const changedAt = new Date().toISOString();

  const { error: updateError } = await supabase
    .from("sales_pipeline")
    .update({
      status: newStage,
    })
    .eq("id", pipelineId)
    .eq("company_id", companyId);

  if (updateError) {
    throw new Error(
      `Unable to update the sales opportunity stage: ${updateError.message}`,
    );
  }

  const { error: historyError } = await supabase
    .from("sales_pipeline_stage_history")
    .insert({
      id: crypto.randomUUID(),
      sales_pipeline_id: pipelineId,
      previous_status: previousStage,
      new_status: newStage,
      reason: "Stage updated from Sales Intelligence.",
      changed_at: changedAt,
    });

  if (historyError) {
    console.error(
      "Sales stage history write failed:",
      historyError.message,
    );
  }

  const { error: activityError } = await supabase
    .from("sales_activities")
    .insert({
      id: crypto.randomUUID(),
      sales_pipeline_id: pipelineId,
      activity_type: "status_change",
      description:
        `Sales pipeline stage changed from ${previousStage} to ${newStage}.`,
      created_at: changedAt,
    });

  if (activityError) {
    console.error(
      "Sales activity write failed:",
      activityError.message,
    );
  }

  revalidatePath("/sales-intelligence");
  revalidatePath("/dashboard");

  return {
    success: true,
    pipelineId,
    previousStage,
    newStage,
  };
}




export async function loadSalesOpportunityActivityTimeline(
  query: UnifiedActivityQuery,
): Promise<UnifiedActivitySnapshot> {
  return unifiedActivityWorkflow.load(
    query,
  );
}
export async function loadOpportunityNextActions(
  query: OpportunityNextActionQuery,
): Promise<OpportunityNextActionSnapshot> {
  return opportunityNextActionWorkflow.list(
    query,
  );
}

export async function createSalesOpportunityNextAction(
  input: CreateOpportunityNextActionInput,
): Promise<OpportunityNextActionMutationResult> {
  return opportunityNextActionWorkflow.create(
    input,
  );
}

export async function updateSalesOpportunityNextAction(
  input: UpdateOpportunityNextActionInput,
): Promise<OpportunityNextActionMutationResult> {
  return opportunityNextActionWorkflow.update(
    input,
  );
}

export async function transitionSalesOpportunityNextAction(
  input: TransitionOpportunityNextActionInput,
): Promise<SalesPipelineNextAction> {
  return opportunityNextActionWorkflow.transition(
    input,
  );
}

export async function completeSalesOpportunityNextAction(
  input: CompleteOpportunityNextActionInput,
): Promise<SalesPipelineNextAction> {
  return opportunityNextActionWorkflow.complete(
    input,
  );
}

export async function cancelSalesOpportunityNextAction(
  input: {
    actionId: string;
    pipelineId: string;
    reason?: string | null;
  },
): Promise<SalesPipelineNextAction> {
  return opportunityNextActionWorkflow.cancel(
    input,
  );
}
export async function loadSalesOpportunityLifecycle(
  pipelineIdInput: string,
): Promise<OpportunityLifecycleSnapshot> {
  return getOpportunityLifecycleSnapshot(
    pipelineIdInput,
  );
}
export async function openSalesOpportunityConversation(
  pipelineIdInput: string,
): Promise<OpenSalesOpportunityConversationResult> {
  const pipelineId = requirePipelineId(pipelineIdInput);
  const companyId = await resolveCurrentCompanyId();

  if (!companyId) {
    throw new Error(
      "Unable to resolve the active company for this communication operation.",
    );
  }

  const actorId = await resolveAuthenticatedUserId();

  const pipeline = await loadAuthorizedPipeline(
    pipelineId,
    companyId,
  );

  const companyName = resolveCompanyName(
    pipeline.companies,
  );

  const externalReferenceId =
    `sales-opportunity:${pipelineId}`;

  const ensured =
    await salesCommunicationOrchestrator.ensureConversation({
      entity: {
        companyId,
        entityType: "opportunity",
        entityId: pipelineId,
        externalReferenceId,
      },
      conversation: {
        id: crypto.randomUUID(),
        companyId,
        tenantId: companyId,
        organizationId: companyId,
        createdBy: actorId,
        channel: "internal_chat",
        subject: `Sales Opportunity · ${companyName}`,
        priority: "normal",
        tags: [
          "sales-intelligence",
          "sales-opportunity",
          `pipeline:${pipelineId}`,
        ],
        externalReferenceId,
      },
      authorization: {
        permissionContext: {
          companyId,
          tenantId: companyId,
          organizationId: companyId,
          subject: {
            participantId: actorId,
            participantType: "user",
            role: "owner",
          },
          resource: {
            channel: "internal_chat",
          },
        },
        isResourceOwner: true,
      },
    });

  if (ensured.created) {
    const createdAt = new Date().toISOString();

    const { error: activityError } = await supabase
      .from("sales_activities")
      .insert({
        id: crypto.randomUUID(),
        sales_pipeline_id: pipelineId,
        activity_type: "note",
        description:
          `Communication conversation opened for ${companyName}.`,
        created_by: actorId,
        created_at: createdAt,
      });

    if (activityError) {
      console.error(
        "Sales communication activity write failed:",
        activityError.message,
      );
    }
  }

  revalidatePath("/sales-intelligence");
  revalidatePath("/dashboard");

  return {
    success: true,
    pipelineId,
    conversationId: ensured.conversation.id,
    created: ensured.created,
  };
}



