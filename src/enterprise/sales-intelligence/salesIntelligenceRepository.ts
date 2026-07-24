import { getCurrentCompanyId } from "@/lib/companySession";
import { supabase } from "@/lib/supabase";

import type {
  SalesActivityFeedItem,
  SalesForecastPeriod,
  SalesIntelligenceRecommendation,
  SalesIntelligenceSnapshot,
  SalesMetric,
  SalesOpportunity,
  SalesPipelineStage,
} from "./salesIntelligenceTypes";

import type {
  NextActionPriority,
  SalesActivityChannel,
  SalesActivityType,
  SalesPipelineStatus,
} from "./salesIntelligenceConstants";

type PipelineCompanyRecord = {
  name: string | null;
  contact_name: string | null;
  contact_phone: string | null;
};

type PipelineRecord = {
  id: string;
  company_id: string | null;
  status: string | null;
  sales_rep: string | null;
  opportunity_value: number | null;
  response_deadline: string | null;
  created_at: string | null;
  companies: PipelineCompanyRecord | PipelineCompanyRecord[] | null;
};

type NextActionRecord = {
  id: string;
  pipeline_id: string;
  action_type: string;
  title: string;
  description: string | null;
  due_at: string;
  owner_name: string | null;
  priority: string;
  status: string;
  is_primary: boolean;
};

type ActivityRecord = {
  id: string;
  pipeline_id: string;
  activity_type: string;
  channel: string | null;
  subject: string | null;
  description: string | null;
  outcome: string | null;
  performed_by_name: string | null;
  occurred_at: string;
};

const ACTIVE_STATUSES = new Set<SalesPipelineStatus>([
  "new",
  "contacted",
  "qualified",
  "demo_scheduled",
  "demo_completed",
  "proposal_sent",
  "negotiation",
]);

const STAGE_LABELS: Record<SalesPipelineStatus, string> = {
  new: "فرصة جديدة",
  contacted: "تم التواصل",
  qualified: "مؤهلة",
  demo_scheduled: "عرض مجدول",
  demo_completed: "تم العرض",
  proposal_sent: "عرض مقدم",
  negotiation: "تفاوض",
  won: "مكتملة",
  lost: "مغلقة",
};

const STATUS_PROBABILITY: Record<SalesPipelineStatus, number> = {
  new: 10,
  contacted: 20,
  qualified: 40,
  demo_scheduled: 55,
  demo_completed: 65,
  proposal_sent: 75,
  negotiation: 85,
  won: 100,
  lost: 0,
};

function normalizeStatus(value: string | null): SalesPipelineStatus {
  const normalized = value?.trim().toLowerCase().replaceAll(" ", "_");

  switch (normalized) {
    case "contacted":
      return "contacted";

    case "qualified":
      return "qualified";

    case "meeting":
    case "demo_scheduled":
      return "demo_scheduled";

    case "demo":
    case "demo_completed":
      return "demo_completed";

    case "proposal":
    case "proposal_sent":
      return "proposal_sent";

    case "negotiation":
      return "negotiation";

    case "won":
      return "won";

    case "lost":
      return "lost";

    default:
      return "new";
  }
}

function normalizeCompany(
  company: PipelineRecord["companies"],
): PipelineCompanyRecord | null {
  if (Array.isArray(company)) {
    return company[0] ?? null;
  }

  return company;
}

function normalizeActivityType(value: string): SalesActivityType {
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

  return supported.includes(value as SalesActivityType)
    ? (value as SalesActivityType)
    : "note";
}

function normalizeChannel(value: string | null): SalesActivityChannel | null {
  if (!value) {
    return null;
  }

  const supported: SalesActivityChannel[] = [
    "system",
    "phone",
    "email",
    "whatsapp",
    "video",
    "in_person",
    "platform",
  ];

  return supported.includes(value as SalesActivityChannel)
    ? (value as SalesActivityChannel)
    : null;
}

function normalizePriority(value: string): NextActionPriority {
  switch (value) {
    case "low":
    case "high":
    case "critical":
      return value;

    default:
      return "medium";
  }
}

function formatMetricCurrency(value: number): string {
  return `${new Intl.NumberFormat("ar-BH", {
    maximumFractionDigits: 0,
  }).format(value)} د.ب`;
}

function getOpportunityHealth(
  status: SalesPipelineStatus,
  deadline: string | null,
): SalesOpportunity["health"] {
  if (status === "lost") {
    return "critical";
  }

  if (!deadline || status === "won") {
    return "healthy";
  }

  const remainingTime = new Date(deadline).getTime() - Date.now();
  const remainingDays = remainingTime / 86_400_000;

  if (remainingDays < 0) {
    return "critical";
  }

  if (remainingDays <= 3) {
    return "attention";
  }

  return "healthy";
}

function buildOpportunities(
  pipeline: PipelineRecord[],
  actions: NextActionRecord[],
): SalesOpportunity[] {
  const actionsByPipeline = new Map<string, NextActionRecord>();

  for (const action of actions) {
    const existing = actionsByPipeline.get(action.pipeline_id);

    if (
      !existing ||
      action.is_primary ||
      new Date(action.due_at).getTime() <
        new Date(existing.due_at).getTime()
    ) {
      actionsByPipeline.set(action.pipeline_id, action);
    }
  }

  return pipeline.map((item) => {
    const status = normalizeStatus(item.status);
    const company = normalizeCompany(item.companies);
    const nextAction = actionsByPipeline.get(item.id);
    const fallbackDate =
      item.response_deadline ??
      item.created_at ??
      new Date().toISOString();

    const companyName = company?.name?.trim() || "عميل غير محدد";

    return {
      id: item.id,
      companyName,
      opportunityName: `فرصة ${companyName}`,
      ownerName: item.sales_rep?.trim() || "غير معين",
      status,
      statusLabel: STAGE_LABELS[status],
      value: item.opportunity_value ?? 0,
      probability: STATUS_PROBABILITY[status],
      health: getOpportunityHealth(status, item.response_deadline),
      expectedCloseDate: fallbackDate,
      nextAction:
        nextAction?.title ||
        (item.response_deadline ? "متابعة استجابة العميل" : "تحديد الخطوة التالية"),
      nextActionDueAt: nextAction?.due_at ?? fallbackDate,
      aiInsight:
        status === "lost"
          ? "الفرصة مغلقة وتحتاج مراجعة أسباب الخسارة."
          : status === "won"
            ? "تم إغلاق الفرصة بنجاح."
            : "ترتيب الأولوية محسوب من قيمة الفرصة ومرحلتها وموعد المتابعة.",
    };
  });
}

function buildPipelineStages(
  opportunities: SalesOpportunity[],
): SalesPipelineStage[] {
  const activeOpportunities = opportunities.filter((opportunity) =>
    ACTIVE_STATUSES.has(opportunity.status),
  );

  const totalValue = activeOpportunities.reduce(
    (sum, opportunity) => sum + opportunity.value,
    0,
  );

  return [
    "new",
    "contacted",
    "qualified",
    "demo_scheduled",
    "demo_completed",
    "proposal_sent",
    "negotiation",
  ].map((statusValue) => {
    const status = statusValue as SalesPipelineStatus;
    const stageOpportunities = activeOpportunities.filter(
      (opportunity) => opportunity.status === status,
    );

    const value = stageOpportunities.reduce(
      (sum, opportunity) => sum + opportunity.value,
      0,
    );

    return {
      status,
      label: STAGE_LABELS[status],
      opportunities: stageOpportunities.length,
      value,
      percentage:
        totalValue > 0 ? Math.max(2, Math.round((value / totalValue) * 100)) : 0,
    };
  });
}

function buildMetrics(opportunities: SalesOpportunity[]): SalesMetric[] {
  const active = opportunities.filter((opportunity) =>
    ACTIVE_STATUSES.has(opportunity.status),
  );

  const won = opportunities.filter(
    (opportunity) => opportunity.status === "won",
  );

  const lost = opportunities.filter(
    (opportunity) => opportunity.status === "lost",
  );

  const pipelineValue = active.reduce(
    (sum, opportunity) => sum + opportunity.value,
    0,
  );

  const weightedForecast = active.reduce(
    (sum, opportunity) =>
      sum + opportunity.value * (opportunity.probability / 100),
    0,
  );

  const closedCount = won.length + lost.length;
  const winRate =
    closedCount > 0 ? Math.round((won.length / closedCount) * 100) : 0;

  const urgentCount = active.filter(
    (opportunity) =>
      opportunity.health === "critical" ||
      opportunity.health === "attention",
  ).length;

  return [
    {
      id: "qualified-pipeline",
      label: "قيمة خط المبيعات",
      value: formatMetricCurrency(pipelineValue),
      detail: `${active.length} فرصة نشطة`,
      trend: "neutral",
      trendValue: "مباشر",
    },
    {
      id: "weighted-forecast",
      label: "التوقع المرجّح",
      value: formatMetricCurrency(weightedForecast),
      detail: "محسوب حسب مرحلة واحتمالية كل فرصة",
      trend: "neutral",
      trendValue: "محسوب",
    },
    {
      id: "win-rate",
      label: "معدل الفوز",
      value: `${winRate}%`,
      detail: `${won.length} فرص ناجحة من ${closedCount} فرص مغلقة`,
      trend: "neutral",
      trendValue: "فعلي",
    },
    {
      id: "urgent-opportunities",
      label: "فرص تحتاج تدخلًا",
      value: String(urgentCount),
      detail: "فرص متأخرة أو قريبة من موعد المتابعة",
      trend: urgentCount > 0 ? "down" : "up",
      trendValue: urgentCount > 0 ? "تحتاج متابعة" : "مستقرة",
    },
  ];
}

function buildForecast(
  opportunities: SalesOpportunity[],
): SalesForecastPeriod[] {
  const formatter = new Intl.DateTimeFormat("ar-BH", {
    month: "long",
    year: "numeric",
  });

  const periods: SalesForecastPeriod[] = [];

  for (let offset = 0; offset < 3; offset += 1) {
    const date = new Date();
    date.setDate(1);
    date.setMonth(date.getMonth() + offset);

    const year = date.getFullYear();
    const month = date.getMonth();

    const periodOpportunities = opportunities.filter((opportunity) => {
      const closeDate = new Date(opportunity.expectedCloseDate);

      return (
        closeDate.getFullYear() === year &&
        closeDate.getMonth() === month
      );
    });

    const committed = periodOpportunities
      .filter((opportunity) => opportunity.status === "won")
      .reduce((sum, opportunity) => sum + opportunity.value, 0);

    const active = periodOpportunities.filter((opportunity) =>
      ACTIVE_STATUSES.has(opportunity.status),
    );

    const probable = active.reduce(
      (sum, opportunity) =>
        sum + opportunity.value * (opportunity.probability / 100),
      0,
    );

    const pipeline = active.reduce(
      (sum, opportunity) => sum + opportunity.value,
      0,
    );

    periods.push({
      id: `${year}-${String(month + 1).padStart(2, "0")}`,
      label: formatter.format(date),
      committed,
      probable,
      pipeline,
      target: Math.max(committed, probable, pipeline, 1),
    });
  }

  return periods;
}

function buildRecommendations(
  opportunities: SalesOpportunity[],
  actions: NextActionRecord[],
): SalesIntelligenceRecommendation[] {
  const recommendations: SalesIntelligenceRecommendation[] = [];

  const urgentOpportunities = [...opportunities]
    .filter((opportunity) => opportunity.health !== "healthy")
    .sort(
      (first, second) =>
        second.value * second.probability -
        first.value * first.probability,
    )
    .slice(0, 3);

  for (const opportunity of urgentOpportunities) {
    recommendations.push({
      id: `opportunity-${opportunity.id}`,
      title: `متابعة ${opportunity.companyName}`,
      description: `${opportunity.nextAction} للفرصة البالغة ${formatMetricCurrency(
        opportunity.value,
      )}.`,
      priority:
        opportunity.health === "critical" ? "critical" : "high",
      impact: `احتمالية الإغلاق ${opportunity.probability}%`,
      opportunityId: opportunity.id,
    });
  }

  const overdueActions = actions
    .filter(
      (action) =>
        action.status !== "completed" &&
        action.status !== "cancelled" &&
        new Date(action.due_at).getTime() < Date.now(),
    )
    .slice(0, 3 - recommendations.length);

  for (const action of overdueActions) {
    recommendations.push({
      id: `action-${action.id}`,
      title: action.title,
      description:
        action.description || "خطوة متابعة متأخرة وتحتاج إلى تنفيذ.",
      priority: normalizePriority(action.priority),
      impact: "تقليل تأخر المتابعة",
      opportunityId: action.pipeline_id,
    });
  }

  if (recommendations.length === 0) {
    recommendations.push({
      id: "pipeline-stable",
      title: "خط المبيعات مستقر",
      description:
        "لا توجد حاليًا فرص متأخرة أو خطوات حرجة تتطلب تدخلًا فوريًا.",
      priority: "low",
      impact: "استمرار المتابعة المنتظمة",
      opportunityId: null,
    });
  }

  return recommendations;
}

function buildActivities(
  activities: ActivityRecord[],
): SalesActivityFeedItem[] {
  return activities.map((activity) => ({
    id: activity.id,
    type: normalizeActivityType(activity.activity_type),
    channel: normalizeChannel(activity.channel),
    title: activity.subject?.trim() || "نشاط مبيعات",
    description:
      activity.description?.trim() ||
      activity.outcome?.trim() ||
      "تم تسجيل نشاط جديد ضمن مسار المبيعات.",
    actorName: activity.performed_by_name?.trim() || "فريق KAFU AI",
    occurredAt: activity.occurred_at,
  }));
}

export async function getSalesIntelligenceSnapshot(): Promise<SalesIntelligenceSnapshot> {
  const companyId = getCurrentCompanyId();

  if (!companyId) {
    throw new Error(
      "لم يتم العثور على الشركة الحالية. اختر الشركة أو ابدأ من التقييم أولًا.",
    );
  }

  const [pipelineResult, actionsResult, activitiesResult] =
    await Promise.all([
      supabase
        .from("sales_pipeline")
        .select(`
          id,
          company_id,
          status,
          sales_rep,
          opportunity_value,
          response_deadline,
          created_at,
          companies (
            name,
            contact_name,
            contact_phone
          )
        `)
        .eq("company_id", companyId)
        .order("created_at", { ascending: false }),

      supabase
        .from("sales_pipeline_next_actions")
        .select(`
          id,
          pipeline_id,
          action_type,
          title,
          description,
          due_at,
          owner_name,
          priority,
          status,
          is_primary
        `)
        .in("status", ["open", "in_progress"])
        .order("due_at", { ascending: true }),

      supabase
        .from("sales_pipeline_activities")
        .select(`
          id,
          pipeline_id,
          activity_type,
          channel,
          subject,
          description,
          outcome,
          performed_by_name,
          occurred_at
        `)
        .order("occurred_at", { ascending: false })
        .limit(8),
    ]);

  if (pipelineResult.error) {
    throw new Error(
      `تعذر تحميل فرص المبيعات: ${pipelineResult.error.message}`,
    );
  }

  if (actionsResult.error) {
    throw new Error(
      `تعذر تحميل خطوات المتابعة: ${actionsResult.error.message}`,
    );
  }

  if (activitiesResult.error) {
    throw new Error(
      `تعذر تحميل أنشطة المبيعات: ${activitiesResult.error.message}`,
    );
  }

  const pipeline = (pipelineResult.data ?? []) as PipelineRecord[];
  const actions = (actionsResult.data ?? []) as NextActionRecord[];
  const activities = (activitiesResult.data ?? []) as ActivityRecord[];

  const opportunities = buildOpportunities(pipeline, actions);

  return {
    generatedAt: new Date().toISOString(),
    currency: "BHD",
    metrics: buildMetrics(opportunities),
    pipelineStages: buildPipelineStages(opportunities),
    opportunities,
    forecast: buildForecast(opportunities),
    recommendations: buildRecommendations(opportunities, actions),
    activities: buildActivities(activities),
  };
}
