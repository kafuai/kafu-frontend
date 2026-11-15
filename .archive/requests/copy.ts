export function getCopy(ar: boolean) {
  return {
    eyebrow: ar ? "تجربة الموظف" : "EMPLOYEE EXPERIENCE",
    title: ar ? "الطلبات" : "Requests",
    description: ar
      ? "جميع طلبات الموظفين في مكان واحد: الإجازات وخطابات التعريف وتصحيح الحضور والاعتراضات والأعذار."
      : "All employee requests in one place: leave, employment letters, attendance corrections, disputes and excuses.",
    statTotal: ar ? "إجمالي الطلبات" : "Total requests",
    statPending: ar ? "معلّقة" : "Pending",
    statApproved: ar ? "مقبولة" : "Approved",
    statRejected: ar ? "مرفوضة" : "Rejected",
    listTitle: ar ? "الطلبات" : "Requests",
    search: ar ? "ابحث باسم الموظف..." : "Search by employee name...",
    allTypes: ar ? "كل الأنواع" : "All types",
    allStatuses: ar ? "كل الحالات" : "All statuses",
    from: ar ? "من تاريخ" : "From",
    to: ar ? "إلى تاريخ" : "To",
    clear: ar ? "مسح الفلاتر" : "Clear filters",
    empty: ar ? "لا توجد طلبات." : "No requests.",
    noMatch: ar ? "لا توجد نتائج مطابقة." : "No matching results.",
    pick: ar ? "اختر طلبًا لعرض تفاصيله." : "Select a request to see its details.",
    loading: ar ? "جارٍ تحميل الطلبات..." : "Loading requests...",
    errorTitle: ar ? "تعذر تحميل الطلبات" : "Couldn't load requests",
    retry: ar ? "إعادة المحاولة" : "Retry",
    loadFailed: ar ? "تعذر تحميل الطلبات." : "Unable to load requests.",
    partialFailed: ar
      ? "تعذر تحميل جزء من الطلبات، والقائمة المعروضة قد تكون ناقصة."
      : "Part of the requests could not be loaded; the list may be incomplete.",
    decisionSaved: ar ? "تم حفظ القرار." : "Decision saved.",
    evalFailed: ar
      ? "تم اعتماد التصحيح لكن تعذر إعادة تقييم اليوم تلقائيًا. افتح لوحة الحضور واضغط تحديث."
      : "The correction was approved but the day could not be re-evaluated automatically. Open the attendance dashboard and press refresh.",
    employee: ar ? "الموظف" : "Employee",
    created: ar ? "تاريخ الإنشاء" : "Created",
    reason: ar ? "سبب الطلب" : "Request reason",
    leaveType: ar ? "نوع الإجازة" : "Leave type",
    period: ar ? "الفترة المطلوبة" : "Requested period",
    workDate: ar ? "تاريخ الدوام" : "Shift date",
    orig: ar ? "الأصلي" : "Original",
    prop: ar ? "المقترح" : "Proposed",
    in: ar ? "حضور" : "In",
    out: ar ? "انصراف" : "Out",
    noTimes: ar
      ? "هذا النوع لا يحمل أوقاتًا مقترحة. الموافقة عليه تُغلق المقترحات المالية المفتوحة المرتبطة، دون إنشاء أحداث حضور."
      : "This type carries no proposed times. Approving it closes the related open financial proposals, without creating attendance events.",
    approveHint: ar
      ? "الموافقة على تصحيح وقت تضيف حدثًا جديدًا بمصدر «تصحيح»، وتعيد تقييم اليوم."
      : "Approving a time correction adds a new event with source “correction” and re-evaluates the day.",
    note: ar ? "ملاحظة القرار (اختياري)" : "Decision note (optional)",
    approve: ar ? "موافقة" : "Approve",
    reject: ar ? "رفض" : "Reject",
    decidedBy: ar ? "قرار بواسطة" : "Decided by",
    balance: ar ? "رصيد الموظف" : "Employee balance",
    balAllowance: ar ? "المسموح" : "Allowance",
    balUsed: ar ? "المستخدم" : "Used",
    balPending: ar ? "معلّق (أخرى)" : "Other pending",
    balRequested: ar ? "المطلوب الآن" : "Requested now",
    balAfter: ar ? "المتبقي بعد الموافقة" : "Remaining if approved",
    groups: {
      leave: ar ? "إجازة" : "Leave",
      letter: ar ? "خطاب تعريف" : "Employment letter",
      attendance: ar ? "حضور" : "Attendance",
    } as Record<string, string>,
    types: {
      leave: ar ? "طلب إجازة" : "Leave request",
      letter: ar ? "طلب خطاب تعريف" : "Employment letter request",
      missed_check_in: ar ? "نسيان تسجيل الحضور" : "Missed check-in",
      missed_check_out: ar ? "نسيان تسجيل الانصراف" : "Missed check-out",
      time_change: ar ? "تعديل وقت" : "Time change",
      dispute_late: ar ? "اعتراض على التأخير" : "Lateness dispute",
      dispute_absence: ar ? "اعتراض على الغياب" : "Absence dispute",
      excuse: ar ? "تسجيل عذر" : "Excuse",
    } as Record<string, string>,
    leaveTypes: {
      annual: ar ? "إجازة سنوية" : "Annual leave",
      sick: ar ? "إجازة مرضية" : "Sick leave",
      emergency: ar ? "إجازة طارئة" : "Emergency leave",
      unpaid: ar ? "إجازة بدون راتب" : "Unpaid leave",
      maternity: ar ? "إجازة أمومة" : "Maternity leave",
      other: ar ? "إجازة أخرى" : "Other leave",
    } as Record<string, string>,
  };
}

export type Copy = ReturnType<typeof getCopy>;