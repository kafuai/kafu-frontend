import { RequestCategory } from "./types";

export function useAppCopy(isArabic: boolean) {
  const categoryLabels: Record<RequestCategory, string> = {
    leave: isArabic ? "طلب إجازة" : "Leave request",
    employment_letter: isArabic ? "خطاب تعريف" : "Employment letter",
    employee_inquiry: isArabic ? "استفسار موظف" : "Employee inquiry",
    data_update: isArabic ? "تحديث بيانات" : "Data update",
    general: isArabic ? "طلب موظف" : "Employee request",
  };

  const copy = {
    welcomeMessage: isArabic
      ? "مرحبًا 👋\nأنا Employee Experience Manager. أقدر أساعدك في استفساراتك اليومية أو أستقبل طلباتك وأوجّهها لفريق الموارد البشرية."
      : "Hello 👋\n I'm the Employee Experience Manager. I can help with your daily inquiries or take your requests and route them to HR.",
    headerTitle: isArabic ? "مدير تجربة الموظف" : "Employee Experience Manager",
    headerReady: isArabic ? "جاهز" : "Ready",
    headerSubtitle: isArabic
      ? "مساعد الموظفين الذكي للطلبات والاستفسارات اليومية"
      : "AI assistant for daily employee requests and inquiries",
    hrSupportTitle: isArabic ? "دعم الموارد البشرية" : "HR Support",
    hrSupportSubtitle: isArabic ? "متاح لمعالجة الطلبات" : "Available to process requests",
    chatHeaderTitle: "Employee Experience AI",
    chatHeaderSubtitle: isArabic
      ? "يفهم طلبك ويوجّه الإجراء المناسب"
      : "Understands your request and routes the right action",
    howItWorks: isArabic ? "كيف يعمل؟" : "How it works?",
    inputPlaceholder: isArabic ? "اكتب استفسارك أو طلبك هنا..." : "Type your inquiry or request here...",
    sendHint: isArabic ? "اضغط Enter للإرسال · Shift + Enter لسطر جديد" : "Press Enter to send · Shift + Enter for a new line",
    poweredByAI: isArabic ? "مدعوم بالذكاء الاصطناعي" : "Powered by AI",
    leaveTypeLabels: {
      annual: isArabic ? "إجازة سنوية" : "Annual leave",
      sick: isArabic ? "إجازة مرضية" : "Sick leave",
      emergency: isArabic ? "إجازة طارئة" : "Emergency leave",
      unpaid: isArabic ? "إجازة بدون راتب" : "Unpaid leave",
      maternity: isArabic ? "إجازة أمومة" : "Maternity leave",
      other: isArabic ? "إجازة أخرى" : "Other leave",
    } as Record<string, string>,
    capabilitiesTitle: isArabic ? "ماذا أستطيع أن أفعل؟" : "What can I do?",
    capabilitiesSubtitle: isArabic ? "الخدمات المتاحة للموظفين" : "Services available to employees",
    myRequestsTitle: isArabic ? "طلباتي" : "My Requests",
    myRequestsSubtitle: isArabic ? "الطلبات المحولة إلى HR" : "Requests routed to HR",
    filterAll: isArabic ? "الكل" : "All",
    filterLeave: isArabic ? "إجازات" : "Leave",
    filterLetters: isArabic ? "خطابات" : "Letters",
    statusPending: isArabic ? "بانتظار HR" : "Pending HR",
    statusApproved: isArabic ? "تمت الموافقة" : "Approved",
    statusRejected: isArabic ? "مرفوض" : "Rejected",
    employeeRequestLabel: isArabic ? "طلب موظف" : "Employee request",
    noRequests: isArabic ? "لا توجد طلبات" : "No requests",
    footerNote: isArabic
      ? "الطلبات التي تحتاج إجراءً بشريًا يتم تحويلها إلى فريق الموارد البشرية"
      : "Requests requiring human action are routed to the HR team",
    genericErrorFallback: isArabic
      ? "حدث خطأ أثناء معالجة الطلب. حاول مرة أخرى."
      : "An error occurred while processing your request. Please try again.",
    processFailedFallback: isArabic ? "تعذر معالجة الطلب." : "Unable to process the request.",
    requestReceivedFallback: isArabic ? "تم استلام طلبك." : "Your request has been received.",
    decisionBy: isArabic ? "تم اتخاذ القرار بواسطة" : "Decision by",
    decisionDate: isArabic ? "تاريخ الإجراء" : "Action date",
    decisionPending: isArabic ? "لم يتم اتخاذ قرار بعد" : "No decision has been taken yet",
    balanceTitle: isArabic ? "رصيد الإجازة السنوية" : "Annual Leave Balance",
    balanceAllowance: isArabic ? "المسموح" : "Allowance",
    balanceUsed: isArabic ? "المستخدم" : "Used",
    balancePending: isArabic ? "معلّق" : "Pending",
    balanceRemaining: isArabic ? "المتبقي" : "Remaining",
    daysUnit: isArabic ? "يوم" : "days",
    capabilities: [
      {
        category: "leave" as const,
        title: isArabic ? "طلبات الإجازات" : "Leave Requests",
        description: isArabic ? "تقديم ومتابعة طلبات الإجازة" : "Submit and track leave requests",
        prompt: isArabic ? "أريد تقديم طلب إجازة" : "I'd like to submit a leave request",
      },
      {
        category: "employment_letter" as const,
        title: isArabic ? "خطابات التعريف" : "Employment Letters",
        description: isArabic ? "طلب خطابات ووثائق الموظف" : "Request employee letters and documents",
        prompt: isArabic ? "أحتاج إلى خطاب تعريف" : "I need an employment letter",
      },
      {
        category: "employee_inquiry" as const,
        title: isArabic ? "استفسارات الموظفين" : "Employee Inquiries",
        description: isArabic ? "الحصول على إجابات فورية" : "Get instant answers",
        prompt: isArabic ? "لدي استفسار للموارد البشرية" : "I have a question for HR",
      },
    ],
  };

  return { copy, categoryLabels };
}