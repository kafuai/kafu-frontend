import type {
  SalesIntelligenceSnapshot,
  SalesOpportunity,
} from "@/src/enterprise/sales-intelligence/salesIntelligenceTypes";

export const salesIntelligenceSnapshot: SalesIntelligenceSnapshot = {
  generatedAt: "2026-07-22T18:30:00.000Z",
  currency: "BHD",

  metrics: [
    {
      id: "qualified-pipeline",
      label: "قيمة خط المبيعات",
      value: "248,500 د.ب",
      detail: "إجمالي الفرص المؤهلة والنشطة",
      trend: "up",
      trendValue: "+12.8%",
    },
    {
      id: "weighted-forecast",
      label: "التوقع المرجّح",
      value: "126,750 د.ب",
      detail: "قيمة متوقعة بناءً على احتمالية الإغلاق",
      trend: "up",
      trendValue: "+8.4%",
    },
    {
      id: "win-rate",
      label: "معدل الفوز",
      value: "38%",
      detail: "مقارنة بالفرص المغلقة خلال الربع",
      trend: "up",
      trendValue: "+4.2%",
    },
    {
      id: "sales-cycle",
      label: "متوسط دورة البيع",
      value: "41 يومًا",
      detail: "من التأهيل حتى قرار العميل",
      trend: "down",
      trendValue: "-6 أيام",
    },
  ],

  pipelineStages: [
    {
      status: "qualified",
      label: "مؤهلة",
      opportunities: 9,
      value: 68500,
      percentage: 28,
    },
    {
      status: "demo_scheduled",
      label: "عرض مجدول",
      opportunities: 6,
      value: 47250,
      percentage: 19,
    },
    {
      status: "demo_completed",
      label: "عرض مكتمل",
      opportunities: 5,
      value: 41500,
      percentage: 17,
    },
    {
      status: "proposal_sent",
      label: "عرض سعر",
      opportunities: 4,
      value: 52750,
      percentage: 21,
    },
    {
      status: "negotiation",
      label: "تفاوض",
      opportunities: 3,
      value: 38500,
      percentage: 15,
    },
  ],

  opportunities: [
    {
      id: "opp-al-noor",
      companyName: "مجموعة النور القابضة",
      opportunityName: "منصة الذكاء المؤسسي",
      ownerName: "ديم أحمد",
      status: "negotiation",
      statusLabel: "تفاوض",
      value: 42000,
      probability: 78,
      health: "healthy",
      expectedCloseDate: "2026-08-12",
      nextAction: "اعتماد النطاق التجاري النهائي",
      nextActionDueAt: "2026-07-24T08:00:00.000Z",
      aiInsight:
        "تفاعل أصحاب القرار مرتفع، وأكبر عامل مؤثر حاليًا هو وضوح خطة التطبيق.",
    },
    {
      id: "opp-gulf-industries",
      companyName: "الخليج للصناعات",
      opportunityName: "التحول التشغيلي المدعوم بالذكاء الاصطناعي",
      ownerName: "ديم أحمد",
      status: "proposal_sent",
      statusLabel: "عرض سعر",
      value: 31500,
      probability: 64,
      health: "attention",
      expectedCloseDate: "2026-08-28",
      nextAction: "متابعة الملاحظات المالية",
      nextActionDueAt: "2026-07-25T09:30:00.000Z",
      aiInsight:
        "الفرصة قوية تشغيليًا، لكن لم يتم تأكيد حضور المسؤول المالي في المراجعة القادمة.",
    },
    {
      id: "opp-bahrain-logistics",
      companyName: "البحرين للخدمات اللوجستية",
      opportunityName: "Corporate Brain وDigital Workforce",
      ownerName: "جابر محمد",
      status: "demo_completed",
      statusLabel: "عرض مكتمل",
      value: 26750,
      probability: 57,
      health: "healthy",
      expectedCloseDate: "2026-09-03",
      nextAction: "إرسال ملخص تنفيذي مخصص",
      nextActionDueAt: "2026-07-26T07:00:00.000Z",
      aiInsight:
        "العميل أبدى اهتمامًا واضحًا بأتمتة العمليات، ويوصى بربط العرض بحالة استخدام واحدة عالية الأثر.",
    },
    {
      id: "opp-orbit-retail",
      companyName: "أوربت للتجزئة",
      opportunityName: "تقييم الجاهزية المؤسسية",
      ownerName: "ديم أحمد",
      status: "demo_scheduled",
      statusLabel: "عرض مجدول",
      value: 14800,
      probability: 42,
      health: "critical",
      expectedCloseDate: "2026-09-18",
      nextAction: "تأكيد حضور الراعي التنفيذي",
      nextActionDueAt: "2026-07-23T10:00:00.000Z",
      aiInsight:
        "لم يتم تسجيل نشاط من صاحب القرار منذ تسعة أيام، ما يرفع مخاطر تأخر الفرصة.",
    },
  ],

  forecast: [
    {
      id: "jul",
      label: "يوليو",
      committed: 28500,
      probable: 36250,
      pipeline: 19500,
      target: 72000,
    },
    {
      id: "aug",
      label: "أغسطس",
      committed: 42000,
      probable: 54750,
      pipeline: 31000,
      target: 95000,
    },
    {
      id: "sep",
      label: "سبتمبر",
      committed: 21750,
      probable: 35750,
      pipeline: 42500,
      target: 110000,
    },
  ],

  recommendations: [
    {
      id: "rec-1",
      title: "إشراك المسؤول المالي في فرصة الخليج للصناعات",
      description:
        "إضافة المسؤول المالي إلى جلسة المراجعة القادمة قد تقلل دورة الموافقة وتوضح بنود الاستثمار.",
      priority: "high",
      impact: "رفع احتمالية الإغلاق المتوقعة 8–12%",
      opportunityId: "opp-gulf-industries",
    },
    {
      id: "rec-2",
      title: "إعادة تنشيط فرصة أوربت للتجزئة",
      description:
        "يوصى بتواصل تنفيذي مباشر قبل موعد العرض، مع ربط القيمة بأثر قابل للقياس خلال 90 يومًا.",
      priority: "critical",
      impact: "تقليل مخاطر فقدان فرصة بقيمة 14,800 د.ب",
      opportunityId: "opp-orbit-retail",
    },
    {
      id: "rec-3",
      title: "تسريع الإغلاق مع مجموعة النور",
      description:
        "جميع إشارات الشراء إيجابية. الخطوة الأعلى أثرًا هي تثبيت النطاق وخطة التطبيق كتابيًا.",
      priority: "high",
      impact: "إغلاق محتمل بقيمة 42,000 د.ب",
      opportunityId: "opp-al-noor",
    },
  ],

  activities: [
    {
      id: "activity-1",
      type: "meeting",
      channel: "video",
      title: "اجتماع مراجعة الحل",
      description:
        "تمت مراجعة نطاق التنفيذ مع مجموعة النور والاتفاق على تحديث العرض التجاري.",
      actorName: "ديم أحمد",
      occurredAt: "2026-07-22T10:30:00.000Z",
    },
    {
      id: "activity-2",
      type: "email",
      channel: "email",
      title: "إرسال العرض التجاري",
      description:
        "تم إرسال النسخة المحدثة إلى الخليج للصناعات مع تفصيل مراحل التطبيق.",
      actorName: "ديم أحمد",
      occurredAt: "2026-07-22T08:15:00.000Z",
    },
    {
      id: "activity-3",
      type: "follow_up",
      channel: "whatsapp",
      title: "متابعة موعد العرض",
      description:
        "تم طلب تأكيد الحضور التنفيذي من فريق أوربت للتجزئة.",
      actorName: "جابر محمد",
      occurredAt: "2026-07-21T13:45:00.000Z",
    },
    {
      id: "activity-4",
      type: "demo",
      channel: "in_person",
      title: "عرض Corporate Brain",
      description:
        "تم تنفيذ العرض المخصص لفريق البحرين للخدمات اللوجستية.",
      actorName: "فريق KAFU AI",
      occurredAt: "2026-07-20T09:00:00.000Z",
    },
  ],
};

export function getPriorityOpportunities(): SalesOpportunity[] {
  return [...salesIntelligenceSnapshot.opportunities].sort(
    (first, second) =>
      second.probability * second.value -
      first.probability * first.value
  );
}
