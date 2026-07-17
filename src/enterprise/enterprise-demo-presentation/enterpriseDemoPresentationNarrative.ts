import {
  EnterpriseDemoPresentationAudience,
  EnterpriseDemoPresentationSectionType,
} from "./enterpriseDemoPresentationTypes";

export interface EnterpriseDemoPresentationNarrativeInput {
  companyName: string;
  audience: EnterpriseDemoPresentationAudience;
  sectionType: EnterpriseDemoPresentationSectionType;
  businessContext?: string | null;
  challenge?: string | null;
  capability?: string | null;
  outcome?: string | null;
}

const audienceLabels: Record<
  EnterpriseDemoPresentationAudience,
  string
> = {
  executive: "القيادة التنفيذية",
  "department-leader": "قيادات الإدارات",
  operations: "فرق العمليات",
  technology: "فرق التقنية والتحول الرقمي",
  client: "العميل",
};

export function composeEnterpriseDemoPresentationNarrative(
  input: EnterpriseDemoPresentationNarrativeInput,
): string {
  const companyName = input.companyName.trim();
  const audienceLabel = audienceLabels[input.audience];

  switch (input.sectionType) {
    case "opening":
      return `نستعرض اليوم كيف تساعد KAFU AI شركة ${companyName} على تحويل الأولويات المؤسسية إلى قرارات وتنفيذ ونتائج قابلة للقياس أمام ${audienceLabel}.`;

    case "business-context":
      return (
        input.businessContext?.trim() ||
        `تعمل شركة ${companyName} في بيئة تتطلب سرعة أعلى في اتخاذ القرار وربط البيانات بالأولويات التنفيذية.`
      );

    case "problem":
      return (
        input.challenge?.trim() ||
        `التحدي الرئيسي هو تشتت المعلومات وتأخر القرارات وصعوبة متابعة التنفيذ والنتائج بين الإدارات.`
      );

    case "capability":
      return (
        input.capability?.trim() ||
        `تجمع KAFU AI المعرفة المؤسسية والتحليل والقرارات والتنفيذ داخل تجربة موحدة تدعم ${audienceLabel}.`
      );

    case "workflow":
      return `تبدأ الرحلة من فهم واقع ${companyName}، ثم تحليل الأولويات، ثم إصدار التوصيات وتحويلها إلى مسارات تنفيذ واضحة.`;

    case "intelligence":
      return `يحلل محرك الذكاء المؤسسي البيانات والسياق والمخاطر ليقدم توصيات قابلة للتفسير ومدعومة بدرجة ثقة.`;

    case "execution":
      return `يتم تحويل القرارات المعتمدة إلى مهام ومسؤوليات ومؤشرات متابعة لضمان الانتقال من التوصية إلى التنفيذ الفعلي.`;

    case "outcome":
      return (
        input.outcome?.trim() ||
        `النتيجة المتوقعة هي قرارات أسرع، وضوح أكبر، تنفيذ أكثر انضباطًا، وقياس مباشر للأثر المؤسسي.`
      );

    case "closing":
      return `تمثل KAFU AI طبقة تشغيل وذكاء مؤسسي تساعد شركة ${companyName} على الانتقال من البيانات المتفرقة إلى قرارات وتنفيذ ونتائج مستدامة.`;

    default:
      return "";
  }
}
