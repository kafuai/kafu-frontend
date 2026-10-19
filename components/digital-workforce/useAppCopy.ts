// useAppCopy.ts
import { Company, DiscoveryAnswer, WorkforceMember } from "./types";

export function useAppCopy(isArabic: boolean, company: Company | null, answers: DiscoveryAnswer[]) {
  const hasDiscovery = answers.length > 0;

  const copy = {
    errNoCompany: isArabic
      ? "لم يتم العثور على بيانات المؤسسة. يرجى العودة إلى صفحة التقييم وإكمال بيانات المؤسسة."
      : "No company data was found. Please return to the Assessment page and complete the company information.",
    errCompanyLoad: isArabic ? "حدث خطأ أثناء تحميل بيانات المؤسسة:" : "An error occurred while loading company data:",
    errAnswersLoad: isArabic ? "حدث خطأ أثناء تحميل إجابات الاستكشاف:" : "An error occurred while loading Discovery answers:",
  };

  const impactCards = [
    {
      code: "01",
      label: isArabic ? "المؤسسة الحالية" : "Current Company",
      value: company?.name || (isArabic ? "غير محددة" : "Not specified"),
      note: isArabic ? "ملف المؤسسة" : "Company Profile",
    },
    {
      code: "02",
      label: isArabic ? "الفريق الرقمي" : "Digital Team",
      value: "3",
      suffix: isArabic ? "وكلاء" : "Agents",
      note: isArabic ? "القوة العاملة الرقمية" : "Digital Workforce",
    },
    {
      code: "03",
      label: isArabic ? "فرص الأتمتة" : "Automation Opportunities",
      value: hasDiscovery ? "40+" : "15+",
      note: isArabic ? "مسارات عمل محتملة" : "Potential Workflows",
    },
    {
      code: "04",
      label: isArabic ? "توفير الوقت المتوقع" : "Expected Time Savings",
      value: hasDiscovery ? "60%" : "35%",
      note: isArabic ? "من الجهد الإداري" : "of Administrative Effort",
    },
  ];

  const team: WorkforceMember[] = [
    {
      code: "EX",
      title: isArabic ? "مدير تجربة الموظف الذكي" : "Intelligent Employee Experience Manager",
      subtitle: "Employee Experience Manager",
      readiness: "95%",
      description: isArabic
        ? "يعالج الطلبات اليومية والمتكررة للموظفين، ويمنح فريق الموارد البشرية تجربة تشغيلية أسرع وأكثر اتساقًا."
        : "Handles recurring employee requests and enables HR teams to deliver a faster and more consistent operational experience.",
      tasks: isArabic
        ? ["طلبات الإجازات", "خطابات التعريف", "استفسارات الموظفين"]
        : ["Leave requests", "Employment letters", "Employee inquiries", "Data updates"],
      href: "employee-experience",
    },
    {
      code: "DP",
      title: isArabic ? "مستشار الوثائق والسياسات" : "Documents & Policies Advisor",
      subtitle: "Documents & Policies Advisor",
      readiness: "30%",
      description: isArabic
        ? "يربط الموظفين والإدارة بمصادر المعرفة والسياسات والنماذج الداخلية المعتمدة داخل المؤسسة."
        : "Connects employees and management with approved internal knowledge sources, policies, and forms.",
      tasks: isArabic
        ? ["السياسات الداخلية", "النماذج المعتمدة", "العقود", "الخطابات الرسمية"]
        : ["Internal policies", "Approved forms", "Contracts", "Official letters"],
      href: "",
    },
    {
      code: "HR",
      title: isArabic ? "المستشار التنفيذي للموارد البشرية" : "Executive HR Advisor",
      subtitle: "Executive HR Advisor",
      readiness: "10%",
      description: isArabic
        ? "يحوّل بيانات الاستكشاف إلى ملخصات تنفيذية ومؤشرات وتوصيات قابلة للمراجعة."
        : "Transforms Discovery data into executive summaries, indicators, and reviewable recommendations.",
      tasks: isArabic
        ? ["الملخص التنفيذي", "مؤشرات الأداء", "التوصيات", "دعم الاجتماعات"]
        : ["Executive summary", "Performance indicators", "Recommendations", "Meeting support"],
      href: "",
    },
  ];

  const roadmap = isArabic
    ? [
        { title: "تجربة الموظف", description: "تفعيل مدير تجربة الموظف لمعالجة الطلبات اليومية المتكررة." },
        { title: "المعرفة المؤسسية", description: "ربط مستشار الوثائق والسياسات مع Corporate Brain." },
        { title: "الدعم التنفيذي", description: "إطلاق المستشار التنفيذي لتقديم الملخصات والتوصيات للإدارة." },
        { title: "التوسع المنضبط", description: "إضافة الامتثال والتوطين بعد اكتمال مصادر المعرفة الأساسية." },
      ]
    : [
        { title: "Employee Experience", description: "Activate the Employee Experience Manager to handle recurring daily requests." },
        { title: "Enterprise Knowledge", description: "Connect the Documents & Policies Advisor with Corporate Brain." },
        { title: "Executive Support", description: "Launch the Executive Advisor to provide management with summaries and recommendations." },
        { title: "Controlled Expansion", description: "Add compliance and localization capabilities after core knowledge sources are complete." },
      ];

  const discoverySignals =
    answers.length > 0
      ? answers.slice(0, 4).map((item) => item.answer || item.question).filter(Boolean)
      : isArabic
      ? ["لا توجد إجابات استكشاف محفوظة حتى الآن.", "يمكن تعزيز أداء فريقك بعد استكمال جلسة الاستكشاف."]
      : ["No saved Discovery answers are available yet.", "Agent performance can improve after completing the Discovery session."];

  return { copy, impactCards, team, roadmap, discoverySignals };
}