import { supabase } from "@/lib/supabase";

import {
  resolveCurrentCompanyId,
} from "@/lib/workspace-identity/tenantResolver";

import type {
  NextActionPriority,
  NextActionStatus,
  NextActionType,
  SalesActivityChannel,
  SalesActivityType,
} from "../salesIntelligenceConstants";

import {
  isNextActionPriority,
  isNextActionStatus,
  isNextActionType,
  isSalesActivityChannel,
  isSalesActivityType,
  requireNonEmptyText,
} from "../salesIntelligenceValidation";

import {
  buildActivityTitle,
  classifySalesActivity,
  resolveActivityDirection,
} from "./unifiedActivityClassifier";

import type {
  UnifiedActivityItem,
  UnifiedActivityQuery,
  UnifiedActivitySnapshot,
  UnifiedActivitySummary,
} from "./unifiedActivityTypes";

type PipelineRecord = {
  id: string;
  company_id: string;
};

type SalesActivityRecord = {
  id?: string;
  sales_pipeline_id?: string;
  pipeline_id?: string;
  activity_type?: string;
  channel?: string | null;
  direction?: string | null;
  title?: string | null;
  description?: string | null;
  owner_id?: string | null;
  owner_name?: string | null;
  performed_by?: string | null;
  performed_by_name?: string | null;
  metadata?: Record<string, unknown> | null;
  occurred_at?: string | null;
  activity_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
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

function asMetadata(
  value: unknown,
): Record<string, unknown> {
  if (
    value &&
    typeof value === "object" &&
    !Array.isArray(value)
  ) {
    return value as Record<string, unknown>;
  }

  return {};
}

function requireActivityType(
  value: string,
): SalesActivityType {
  if (!isSalesActivityType(value)) {
    throw new Error(
      `Unsupported sales activity type: ${value}`,
    );
  }

  return value as SalesActivityType;
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

function requireActionPriority(
  value: string,
): NextActionPriority {
  if (!isNextActionPriority(value)) {
    throw new Error(
      `Unsupported next action priority: ${value}`,
    );
  }

  return value as NextActionPriority;
}

function requireActionStatus(
  value: string,
): NextActionStatus {
  if (!isNextActionStatus(value)) {
    throw new Error(
      `Unsupported next action status: ${value}`,
    );
  }

  return value as NextActionStatus;
}

function resolveChannel(
  value: string | null | undefined,
): SalesActivityChannel | null {
  if (!value) {
    return null;
  }

  if (!isSalesActivityChannel(value)) {
    return null;
  }

  return value as SalesActivityChannel;
}

function resolveTimestamp(
  record: SalesActivityRecord,
): string {
  const value =
    record.occurred_at ??
    record.activity_at ??
    record.created_at ??
    record.updated_at;

  if (!value) {
    return new Date(0).toISOString();
  }

  const timestamp = Date.parse(value);

  if (Number.isNaN(timestamp)) {
    return new Date(0).toISOString();
  }

  return new Date(timestamp).toISOString();
}

function mapSalesActivity(
  record: SalesActivityRecord,
  pipelineId: string,
): UnifiedActivityItem | null {
  if (
    !record.id ||
    !record.activity_type ||
    !isSalesActivityType(
      record.activity_type,
    )
  ) {
    return null;
  }

  const activityType =
    requireActivityType(
      record.activity_type,
    );

  const metadata = asMetadata(
    record.metadata,
  );

  const channel = resolveChannel(
    record.channel,
  );

  return {
    id: `activity:${record.id}`,
    pipelineId:
      record.sales_pipeline_id ??
      record.pipeline_id ??
      pipelineId,
    source: "sales_activity",
    sourceId: record.id,
    category:
      classifySalesActivity(activityType),
    activityType,
    channel,
    direction:
      resolveActivityDirection(
        channel,
        {
          ...metadata,
          direction:
            record.direction ??
            metadata.direction,
        },
      ),
    title:
      record.title?.trim() ||
      buildActivityTitle(activityType),
    description:
      record.description?.trim() ||
      null,
    status: null,
    priority: null,
    ownerId:
      record.owner_id ??
      record.performed_by ??
      null,
    ownerName:
      record.owner_name ??
      record.performed_by_name ??
      null,
    occurredAt:
      resolveTimestamp(record),
    dueAt: null,
    completedAt: null,
    metadata,
  };
}

function mapNextAction(
  record: NextActionRecord,
): UnifiedActivityItem {
  const status = requireActionStatus(
    record.status,
  );

  const occurredAt =
    status === "completed" &&
    record.completed_at
      ? record.completed_at
      : record.created_at;

  return {
    id: `next-action:${record.id}`,
    pipelineId:
      record.sales_pipeline_id,
    source: "next_action",
    sourceId: record.id,
    category: "task",
    activityType:
      requireActionType(
        record.action_type,
      ),
    channel: null,
    direction: "internal",
    title: record.title,
    description: record.description,
    status,
    priority:
      requireActionPriority(
        record.priority,
      ),
    ownerId: record.owner_id,
    ownerName: record.owner_name,
    occurredAt,
    dueAt: record.due_at,
    completedAt:
      record.completed_at,
    metadata: {
      isPrimary: record.is_primary,
      updatedAt: record.updated_at,
    },
  };
}

async function resolveAuthorizedPipeline(
  pipelineIdInput: string,
): Promise<{
  pipelineId: string;
  companyId: string;
}> {
  const pipelineId =
    requireNonEmptyText(
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
    .select("id, company_id")
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

  const pipeline =
    data as PipelineRecord;

  return {
    pipelineId: pipeline.id,
    companyId: pipeline.company_id,
  };
}

async function loadSalesActivities(
  pipelineId: string,
): Promise<UnifiedActivityItem[]> {
  const { data, error } = await supabase
    .from("sales_activities")
    .select("*")
    .eq("sales_pipeline_id", pipelineId)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw new Error(
      `Unable to load sales activities: ${error.message}`,
    );
  }

  return (
    (data ?? []) as SalesActivityRecord[]
  )
    .map((record) =>
      mapSalesActivity(
        record,
        pipelineId,
      ),
    )
    .filter(
      (
        item,
      ): item is UnifiedActivityItem =>
        item !== null,
    );
}

async function loadNextActions(
  pipelineId: string,
  includeCompleted: boolean,
): Promise<UnifiedActivityItem[]> {
  let query = supabase
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
    .eq("sales_pipeline_id", pipelineId);

  if (!includeCompleted) {
    query = query.in("status", [
      "open",
      "in_progress",
    ]);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(
      `Unable to load next actions for activity timeline: ${error.message}`,
    );
  }

  return (
    (data ?? []) as NextActionRecord[]
  ).map(mapNextAction);
}

function buildSummary(
  items: UnifiedActivityItem[],
): UnifiedActivitySummary {
  const now = Date.now();

  const actionItems = items.filter(
    (item) =>
      item.source === "next_action",
  );

  const openActions =
    actionItems.filter(
      (item) =>
        item.status === "open" ||
        item.status === "in_progress",
    );

  const futureActions =
    openActions
      .filter(
        (item) =>
          item.dueAt &&
          new Date(
            item.dueAt,
          ).getTime() >= now,
      )
      .sort(
        (first, second) =>
          new Date(
            first.dueAt as string,
          ).getTime() -
          new Date(
            second.dueAt as string,
          ).getTime(),
      );

  return {
    totalItems: items.length,
    communicationCount:
      items.filter(
        (item) =>
          item.category ===
          "communication",
      ).length,
    lifecycleCount:
      items.filter(
        (item) =>
          item.category ===
          "lifecycle",
      ).length,
    openActionCount:
      openActions.length,
    overdueActionCount:
      openActions.filter(
        (item) =>
          item.dueAt &&
          new Date(
            item.dueAt,
          ).getTime() < now,
      ).length,
    completedActionCount:
      actionItems.filter(
        (item) =>
          item.status === "completed",
      ).length,
    latestActivityAt:
      items[0]?.occurredAt ?? null,
    nextScheduledActionAt:
      futureActions[0]?.dueAt ?? null,
  };
}

export async function loadUnifiedActivitySnapshot(
  input: UnifiedActivityQuery,
): Promise<UnifiedActivitySnapshot> {
  const {
    pipelineId,
    companyId,
  } = await resolveAuthorizedPipeline(
    input.pipelineId,
  );

  const [
    salesActivities,
    nextActions,
  ] = await Promise.all([
    loadSalesActivities(pipelineId),
    loadNextActions(
      pipelineId,
      input.includeCompletedActions ??
        true,
    ),
  ]);

  let items = [
    ...salesActivities,
    ...nextActions,
  ];

  if (
    input.categories &&
    input.categories.length > 0
  ) {
    items = items.filter((item) =>
      input.categories?.includes(
        item.category,
      ),
    );
  }

  if (
    input.sources &&
    input.sources.length > 0
  ) {
    items = items.filter((item) =>
      input.sources?.includes(
        item.source,
      ),
    );
  }

  if (
    input.channels &&
    input.channels.length > 0
  ) {
    items = items.filter(
      (item) =>
        item.channel !== null &&
        input.channels?.includes(
          item.channel,
        ),
    );
  }

  items.sort(
    (first, second) =>
      new Date(
        second.occurredAt,
      ).getTime() -
      new Date(
        first.occurredAt,
      ).getTime(),
  );

  const limit = Math.min(
    Math.max(input.limit ?? 100, 1),
    500,
  );

  items = items.slice(0, limit);

  return {
    pipelineId,
    companyId,
    generatedAt:
      new Date().toISOString(),
    items,
    summary: buildSummary(items),
  };
}
