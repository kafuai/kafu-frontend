import { resolveCurrentCompanyId } from "@/lib/workspace-identity/tenantResolver";
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
  next_followup: string | null;
  next_followup_date: string | null;
  response_deadline: string | null;
  notes: string | null;
  created_at: string | null;
  companies: PipelineCompanyRecord | PipelineCompanyRecord[] | null;
};

type ActivityRecord = {
  id: string;
  sales_pipeline_id: string;
  activity_type: string;
  description: string | null;
  created_by: string | null;
  created_at: string;
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
  const normalized = value.trim().toLowerCase().replaceAll(" ", "_");

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

  return supported.includes(normalized as SalesActivityType)
    ? (normalized as SalesActivityType)
    : "note";
}

function inferChannel(value: string): SalesActivityChannel | null {
  const normalized = value.trim().toLowerCase().replaceAll(" ", "_");

  switch (normalized) {
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
    case "follow_up":
    case "note":
    case "proposal":
      return "platform";
    default:
      return null;
  }
}

function getActivityTitle(value: string): string {
  const normalized = normalizeActivityType(value);

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

  return titles[normalized];
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

  const deadlineTime = new Date(deadline).getTime();

  if (Number.isNaN(deadlineTime)) {
    return "healthy";
  }

  const remainingDays = (deadlineTime - Date.now()) / 86_400_000;

  if (remainingDays < 0) {
    return "critical";
  }

  if (remainingDays <= 3) {
    return "attention";
  }

  return "healthy";
}

function getPipelineDeadline(item: PipelineRecord): string | null {
  return (
    item.next_followup_date ??
    item.response_deadline ??
    item.created_at ??
    null
  );
}

function getNextAction(item: PipelineRecord): string {
  const explicitAction = item.next_followup?.trim();

  if (explicitAction) {
    return explicitAction;
  }

  if (item.response_deadline || item.next_followup_date) {
    return "متابعة استجابة العميل";
  }

  return "تحديد الخطوة التالية";
}

function buildOpportunities(pipeline: PipelineRecord[]): SalesOpportunity[] {
  return pipeline.map((item) => {
    const status = normalizeStatus(item.status);
    const company = normalizeCompany(item.companies);
    const fallbackDate = getPipelineDeadline(item) ?? new Date().toISOString();
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
      health: getOpportunityHealth(status, getPipelineDeadline(item)),
      expectedCloseDate: fallbackDate,
      nextAction: getNextAction(item),
      nextActionDueAt: fallbackDate,
      aiInsight:
        status === "lost"
          ? "الفرصة مغلقة وتحتاج مراجعة أسباب الخسارة."
          : status === "won"
            ? "تم إغلاق الفرصة بنجاح."
            : item.notes?.trim() ||
              "ترتيب الأولوية محسوب من قيمة الفرصة ومرحلتها وموعد المتابعة.",
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
        totalValue > 0
          ? Math.max(2, Math.round((value / totalValue) * 100))
          : 0,
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
        !Number.isNaN(closeDate.getTime()) &&
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
    channel: inferChannel(activity.activity_type),
    title: getActivityTitle(activity.activity_type),
    description:
      activity.description?.trim() ||
      "تم تسجيل نشاط جديد ضمن مسار المبيعات.",
    actorName: "فريق KAFU AI",
    occurredAt: activity.created_at,
  }));
}

export async function getSalesIntelligenceSnapshot(): Promise<SalesIntelligenceSnapshot> {
  const companyId = await resolveCurrentCompanyId();

  if (!companyId) {
    throw new Error(
      "لم يتم العثور على الشركة الحالية. اختر الشركة أو ابدأ من التقييم أولًا.",
    );
  }

  const [pipelineResult, activitiesResult] = await Promise.all([
    supabase
      .from("sales_pipeline")
      .select(`
        id,
        company_id,
        status,
        sales_rep,
        opportunity_value,
        next_followup,
        next_followup_date,
        response_deadline,
        notes,
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
      .from("sales_activities")
      .select(`
        id,
        sales_pipeline_id,
        activity_type,
        description,
        created_by,
        created_at,
        sales_pipeline!inner (
          company_id
        )
      `)
      .eq("sales_pipeline.company_id", companyId)
      .order("created_at", { ascending: false })
      .limit(8),
  ]);

  if (pipelineResult.error) {
    throw new Error(
      `تعذر تحميل فرص المبيعات: ${pipelineResult.error.message}`,
    );
  }

  if (activitiesResult.error) {
    throw new Error(
      `تعذر تحميل أنشطة المبيعات: ${activitiesResult.error.message}`,
    );
  }

  const pipeline = (pipelineResult.data ?? []) as PipelineRecord[];
  const activities = (activitiesResult.data ?? []) as ActivityRecord[];
  const opportunities = buildOpportunities(pipeline);

  return {
    generatedAt: new Date().toISOString(),
    currency: "BHD",
    metrics: buildMetrics(opportunities),
    pipelineStages: buildPipelineStages(opportunities),
    opportunities,
    forecast: buildForecast(opportunities),
    recommendations: buildRecommendations(opportunities),
    activities: buildActivities(activities),
  };
}
