export type ExecutiveSummaryInput = {
  companyName?: string | null;
  industry?: string | null;
  country?: string | null;
  employeeCount?: number | null;
  discoveryAnswersCount: number;
  readinessScore: number;
  corporateBrainScore: number;
  overdueLeads: number;
};

export function buildExecutiveSummary(input: ExecutiveSummaryInput) {
  const companyName = input.companyName || "الشركة الحالية";
  const industry = input.industry || "قطاع غير محدد";
  const country = input.country || "دولة غير محددة";
  const employeeCount = input.employeeCount || 0;

  const readinessStatus =
    input.readinessScore >= 80
      ? "جاهزية قوية"
      : input.readinessScore >= 60
        ? "جاهزية متوسطة"
        : "جاهزية تحتاج إلى استكمال";

  return `بناءً على بيانات ${companyName} في ${country} ضمن ${industry}، تظهر قراءة KAFU AI أن مستوى الجاهزية التنفيذي هو ${readinessStatus} بنسبة ${input.readinessScore}%. ${
    employeeCount > 0
      ? `عدد الموظفين المسجل هو ${employeeCount}، مما يساعد على تقدير أثر الأتمتة وتحسين تجربة الموظف.`
      : "لم يتم تسجيل عدد الموظفين بعد، وينصح بإكمال هذه البيانات لتحسين دقة التحليل."
  } تم تحليل ${input.discoveryAnswersCount} إجابة من Discovery، ووصلت جاهزية Corporate Brain إلى ${input.corporateBrainScore}%. ${
    input.overdueLeads > 0
      ? `يوجد ${input.overdueLeads} عنصر متأخر في Pipeline يحتاج متابعة تنفيذية.`
      : "لا توجد عناصر متأخرة حالياً في Pipeline."
  }`;
}