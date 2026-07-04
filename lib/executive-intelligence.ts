export type ExecutiveSignalLevel = "positive" | "warning" | "critical" | "neutral";

export type ExecutiveSignal = {
  title: string;
  description: string;
  level: ExecutiveSignalLevel;
};

type ExecutiveCompany = {
  name: string | null;
  industry: string | null;
  employee_count: number | null;
};

export function generateExecutiveSignals(params: {
  companyName?: string | null;
  industry?: string | null;
  employeeCount?: number | null;
  discoveryAnswersCount: number;
  overdueLeads: number;
}) {
  const signals: ExecutiveSignal[] = [];

  if (params.industry) {
    signals.push({
      title: "Industry Context Detected",
      description: `تم تحديد القطاع: ${params.industry}. هذا يسمح بتخصيص توصيات KAFU AI بشكل أفضل.`,
      level: "positive",
    });
  } else {
    signals.push({
      title: "Missing Industry Context",
      description: "لم يتم تحديد القطاع بعد، مما يقلل دقة التحليل التنفيذي.",
      level: "warning",
    });
  }

  if ((params.employeeCount || 0) > 0) {
    signals.push({
      title: "Workforce Size Available",
      description: `عدد الموظفين المسجل هو ${params.employeeCount}. يمكن استخدامه لتقدير أثر الأتمتة.`,
      level: "positive",
    });
  } else {
    signals.push({
      title: "Workforce Size Missing",
      description: "عدد الموظفين غير مكتمل، وهذا يؤثر على حساب العائد المتوقع.",
      level: "warning",
    });
  }

  if (params.discoveryAnswersCount >= 5) {
    signals.push({
      title: "Discovery Data Ready",
      description: "بيانات Discovery كافية لبناء توصيات تنفيذية أولية.",
      level: "positive",
    });
  } else {
    signals.push({
      title: "Discovery Data Needs Completion",
      description: "ينصح بإكمال أسئلة Discovery قبل اعتماد التقرير النهائي.",
      level: "warning",
    });
  }

  if (params.overdueLeads > 0) {
    signals.push({
      title: "Pipeline Attention Required",
      description: `يوجد ${params.overdueLeads} عنصر متأخر يحتاج متابعة تنفيذية.`,
      level: "critical",
    });
  } else {
    signals.push({
      title: "Pipeline On Track",
      description: "لا توجد عناصر متأخرة حالياً في Sales Pipeline.",
      level: "positive",
    });
  }

  return signals;
}

export function buildExecutiveInsights({
  company,
  answersCount,
  overdueLeads,
}: {
  company: ExecutiveCompany | null;
  answersCount: number;
  overdueLeads: number;
}) {
  return [
    `تم تحليل بيانات ${company?.name || "الشركة الحالية"} مباشرة من Supabase.`,
    company?.industry
      ? `القطاع المحدد هو ${company.industry}، وهذا يساعد KAFU AI على تخصيص التوصيات.`
      : "لم يتم تحديد القطاع بعد، وهذا يقلل دقة التوصيات.",
    answersCount >= 5
      ? "إجابات Discovery كافية لبناء قراءة تنفيذية أولية."
      : "يوصى بإكمال Discovery لرفع دقة Executive Intelligence.",
    overdueLeads > 0
      ? `يوجد ${overdueLeads} عنصر في Pipeline يحتاج متابعة تنفيذية.`
      : "لا توجد عناصر متأخرة حالياً في Pipeline.",
  ];
}

export function buildExecutivePriorities() {
  return [
    "تفعيل Employee Experience Manager",
    "ربط Documents & Policies Advisor مع Corporate Brain",
    "إطلاق Executive HR Advisor للملخصات الأسبوعية",
    "تجهيز Command Center للمتابعة اليومية",
  ];
}

export function buildExecutiveRisks({
  company,
  answersCount,
  overdueLeads,
}: {
  company: ExecutiveCompany | null;
  answersCount: number;
  overdueLeads: number;
}) {
  return [
    company?.industry ? "توحيد مصادر المعرفة قبل التوسع." : "عدم تحديد القطاع يقلل دقة التحليل.",
    answersCount > 0
      ? "تحويل إجابات Discovery إلى خطة تنفيذية قابلة للقياس."
      : "عدم وجود Discovery كافٍ يجعل التوصيات عامة.",
    overdueLeads > 0
      ? "وجود Leads متأخرة قد يؤثر على سرعة الإغلاق."
      : "المخاطر التشغيلية الحالية منخفضة في Pipeline.",
  ];
}