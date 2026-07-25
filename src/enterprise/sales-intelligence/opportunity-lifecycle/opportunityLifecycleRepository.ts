import { supabase } from "@/lib/supabase";
import { resolveCurrentCompanyId } from "@/lib/workspace-identity/tenantResolver";

import type {
  SalesActivityChannel,
  SalesActivityType,
  SalesPipelineStatus,
} from "../salesIntelligenceConstants";

import type {
  OpportunityLifecycleActivityEvent,
  OpportunityLifecycleEvent,
  OpportunityLifecycleSnapshot,
  OpportunityLifecycleStageEvent,
} from "./opportunityLifecycleTypes";

type AuthorizedPipelineRecord = {
  id: string;
  company_id: string;
};

type StageHistoryRecord = {
  id: string;
  sales_pipeline_id: string;
  previous_status: string | null;
  new_status: string;
  changed_by: string | null;
  reason: string | null;
  changed_at: string;
};

type ActivityRecord = {
  id: string;
  sales_pipeline_id: string;
  activity_type: string;
  description: string | null;
  created_by: string | null;
  created_at: string;
};

function requirePipelineId(value: string): string {
  const pipelineId = value.trim();

  if (!pipelineId) {
    throw new Error("Sales pipeline ID is required.");
  }

  return pipelineId;
}

function normalizeActivityType(
  value: string,
): SalesActivityType {
  const normalized = value
    .trim()
    .toLowerCase()
    .replaceAll(" ", "_");

  const supported: SalesActivityType[] = [
    "lead_created",
    "assignment",
    "status_change",
    "call",
    "email",
    "whatsapp",
    "meeting",
    "demo",
    "proposal",
    "note",
    "task_completed",
    "follow_up",
  ];

  return supported.includes(
    normalized as SalesActivityType,
  )
    ? (normalized as SalesActivityType)
    : "note";
}

function inferActivityChannel(
  activityType: SalesActivityType,
): SalesActivityChannel | null {
  switch (activityType) {
    case "call":
      return "phone";

    case "email":
      return "email";

    case "whatsapp":
      return "whatsapp";

    case "meeting":
      return "in_person";

    case "demo":
      return "video";

    case "lead_created":
    case "assignment":
    case "status_change":
    case "task_completed":
      return "system";

    case "proposal":
    case "note":
    case "follow_up":
      return "platform";

    default:
      return null;
  }
}

function getActivityTitle(
  activityType: SalesActivityType,
): string {
  const titles: Record<SalesActivityType, string> = {
    lead_created: "إنشاء فرصة مبيعات",
    assignment: "تعيين مسؤول المبيعات",
    status_change: "تحديث مرحلة الفرصة",
    call: "مكالمة مع العميل",
    email: "رسالة بريد إلكتروني",
    whatsapp: "محادثة واتساب",
    meeting: "اجتماع مع العميل",
    demo: "عرض توضيحي",
    proposal: "إرسال عرض",
    note: "ملاحظة مبيعات",
    task_completed: "إكمال مهمة متابعة",
    follow_up: "متابعة العميل",
  };

  return titles[activityType];
}

async function loadAuthorizedPipeline(
  pipelineId: string,
  companyId: string,
): Promise<AuthorizedPipelineRecord> {
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
      `Unable to authorize the sales opportunity: ${error.message}`,
    );
  }

  if (!data) {
    throw new Error(
      "The requested sales opportunity was not found in the active company.",
    );
  }

  return data as AuthorizedPipelineRecord;
}

function mapStageHistory(
  records: StageHistoryRecord[],
): OpportunityLifecycleStageEvent[] {
  return records.map((record) => ({
    id: record.id,
    kind: "stage_change",
    pipelineId: record.sales_pipeline_id,
    previousStatus:
      record.previous_status as
        | SalesPipelineStatus
        | string
        | null,
    newStatus:
      record.new_status as
        | SalesPipelineStatus
        | string,
    reason: record.reason,
    actorId: record.changed_by,
    occurredAt: record.changed_at,
  }));
}

function mapActivities(
  records: ActivityRecord[],
): OpportunityLifecycleActivityEvent[] {
  return records.map((record) => {
    const activityType = normalizeActivityType(
      record.activity_type,
    );

    return {
      id: record.id,
      kind: "activity",
      pipelineId: record.sales_pipeline_id,
      activityType,
      channel: inferActivityChannel(activityType),
      title: getActivityTitle(activityType),
      description: record.description,
      actorId: record.created_by,
      occurredAt: record.created_at,
    };
  });
}

function sortLifecycleEvents(
  events: OpportunityLifecycleEvent[],
): OpportunityLifecycleEvent[] {
  return [...events].sort(
    (first, second) =>
      new Date(second.occurredAt).getTime() -
      new Date(first.occurredAt).getTime(),
  );
}

export async function getOpportunityLifecycleSnapshot(
  pipelineIdInput: string,
): Promise<OpportunityLifecycleSnapshot> {
  const pipelineId = requirePipelineId(
    pipelineIdInput,
  );

  const companyId = await resolveCurrentCompanyId();

  if (!companyId) {
    throw new Error(
      "Unable to resolve the active company for this sales operation.",
    );
  }

  await loadAuthorizedPipeline(
    pipelineId,
    companyId,
  );

  const [historyResult, activitiesResult] =
    await Promise.all([
      supabase
        .from("sales_pipeline_stage_history")
        .select(`
          id,
          sales_pipeline_id,
          previous_status,
          new_status,
          changed_by,
          reason,
          changed_at
        `)
        .eq("sales_pipeline_id", pipelineId)
        .order("changed_at", {
          ascending: false,
        }),

      supabase
        .from("sales_activities")
        .select(`
          id,
          sales_pipeline_id,
          activity_type,
          description,
          created_by,
          created_at
        `)
        .eq("sales_pipeline_id", pipelineId)
        .order("created_at", {
          ascending: false,
        }),
    ]);

  if (historyResult.error) {
    throw new Error(
      `Unable to load opportunity stage history: ${historyResult.error.message}`,
    );
  }

  if (activitiesResult.error) {
    throw new Error(
      `Unable to load opportunity activities: ${activitiesResult.error.message}`,
    );
  }

  const historyRecords =
    (historyResult.data ?? []) as StageHistoryRecord[];

  const activityRecords =
    (activitiesResult.data ?? []) as ActivityRecord[];

  return {
    pipelineId,
    companyId,
    generatedAt: new Date().toISOString(),
    events: sortLifecycleEvents([
      ...mapStageHistory(historyRecords),
      ...mapActivities(activityRecords),
    ]),
  };
}
