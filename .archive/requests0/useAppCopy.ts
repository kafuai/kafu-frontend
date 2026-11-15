export function useAppCopy(isArabic: boolean) {
  const leaveTypeLabels: Record<string, string> = {
    annual: isArabic ? "إجازة سنوية" : "Annual leave",
    sick: isArabic ? "إجازة مرضية" : "Sick leave",
    emergency: isArabic ? "إجازة طارئة" : "Emergency leave",
    unpaid: isArabic ? "إجازة بدون راتب" : "Unpaid leave",
    maternity: isArabic ? "إجازة أمومة" : "Maternity leave",
    other: isArabic ? "إجازة أخرى" : "Other leave",
  };

  const copy = {
    pageEyebrow: isArabic ? "تجربة الموظف" : "EMPLOYEE EXPERIENCE",
    pageTitle: isArabic ? "مركز عمليات الموارد البشرية" : "HR Operations Center",
    pageDescription: isArabic
      ? "راجع طلبات الإجازة الفعلية الواردة من الموظفين عبر Employee Experience Agent."
      : "Review real leave requests submitted by employees through the Employee Experience Agent.",
    live: isArabic ? "النظام يعمل" : "System operational",
    manager: isArabic ? "مدير تجربة الموظف" : "Employee Experience Manager",
    managerDescription: isArabic
      ? "يستقبل طلبات إجازة الموظفين، ينشئها في النظام، ويحوّلها إلى فريق الموارد البشرية للموافقة."
      : "Receives employee leave requests, creates them in the system, and routes them to HR for approval.",
    requests: isArabic ? "طلبات الموظفين" : "Employee Requests",
    requestsDescription: isArabic
      ? "الطلبات التي تحتاج موافقة أو رفض من الموارد البشرية."
      : "Requests requiring HR approval or rejection.",
    searchPlaceholder: isArabic ? "ابحث باسم الموظف أو رقم الطلب..." : "Search employee name or request ID...",
    all: isArabic ? "الكل" : "All",
    pending: isArabic ? "بانتظار المراجعة" : "Pending",
    approved: isArabic ? "تمت الموافقة" : "Approved",
    rejected: isArabic ? "مرفوض" : "Rejected",
    noRequests: isArabic ? "لا توجد طلبات مطابقة." : "No matching requests.",
    selectRequest: isArabic ? "اختر طلبًا لعرض التفاصيل" : "Select a request to view details",
    employee: isArabic ? "الموظف" : "Employee",
    employeeId: isArabic ? "اسم الموظف" : "Employee name",
    request: isArabic ? "الطلب" : "Request",
    requestedPeriod: isArabic ? "الفترة المطلوبة" : "Requested period",
    requestedAction: isArabic ? "الإجراء المطلوب" : "Requested Action",
    requestedActionText: isArabic
      ? "مراجعة طلب الموظف والموافقة عليه أو رفضه."
      : "Review the employee request and approve or reject it.",
    approve: isArabic ? "موافقة" : "Approve",
    reject: isArabic ? "رفض" : "Reject",
    decisionNote: isArabic
      ? "هذه الإجراءات مرتبطة مباشرة بقاعدة البيانات الحقيقية."
      : "These actions are wired directly to the real database.",
    loading: isArabic ? "جارِ تحميل الطلبات..." : "Loading requests...",
    loadErrorTitle: isArabic ? "تعذر تحميل الطلبات" : "Couldn't load requests",
    retry: isArabic ? "إعادة المحاولة" : "Retry",
    createdAt: isArabic ? "تاريخ الإنشاء" : "Created",
    leaveType: isArabic ? "نوع الإجازة" : "Leave type",
    balanceAllowance: isArabic ? "المسموح" : "Allowance",
    balanceUsed: isArabic ? "المستخدم" : "Used",
    balancePending: isArabic ? "معلّق (طلبات أخرى)" : "Other pending",
    balanceRequested: isArabic ? "المطلوب الآن" : "Requested now",
    balanceAfter: isArabic ? "المتبقي بعد الموافقة" : "Remaining if approved",
    attachment: isArabic ? "المرفق" : "Attachment",
    viewAttachment: isArabic ? "تحميل المرفق" : "Download Attachment",
    attachmentError: isArabic ? "تعذر فتح المرفق." : "Unable to open the attachment.",
  };

  return { copy, leaveTypeLabels };
}