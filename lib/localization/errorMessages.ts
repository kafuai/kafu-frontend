/**
 * Translate API/server errors at the UI boundary, using the same app-wide
 * locale that controls the page language. Keep this in the shared feature
 * helper so attendance and payroll never display raw English API messages in
 * Arabic mode (or database/driver errors to end users).
 */
export function localizeErrorMessage(message: unknown, locale?: "ar" | "en"): string {
  const language = locale ?? (typeof document !== "undefined" && document.documentElement.lang === "en" ? "en" : "ar");
  const raw = typeof message === "string" ? message.trim() : "";
  if (!raw) return language === "ar" ? "حدث خطأ غير متوقع. حاول مجددًا." : "An unexpected error occurred. Please try again.";

  // Preserve messages that are already localized in Arabic.
  if (/[\u0600-\u06FF]/.test(raw)) return raw;

  const value = raw.toLowerCase().replace(/[.!]+$/g, "").trim();
  const rules: Array<[RegExp, string, string]> = [
    [/unauthorized|not authenticated|authentication required|sign in/, "يرجى تسجيل الدخول مرة أخرى.", "Please sign in again."],
    [/forbidden|permission|not allowed|unauthorized|not authorized|access denied/, "ليس لديك صلاحية لتنفيذ هذه العملية.", "You do not have permission to perform this action."],
    [/workspace not found|organization not found|company not found/, "تعذر العثور على مساحة العمل.", "Workspace not found."],
    [/invalid (json )?body|invalid request|bad request|invalid values|nothing to update/, "الطلب غير صحيح. تحقق من البيانات المدخلة.", "Invalid request. Check the entered data."],
    [/not found|does not exist|no longer exists/, "العنصر المطلوب غير موجود أو لم يعد متاحًا.", "The requested item was not found or is no longer available."],
    [/invalid .*id|invalid id/, "المعرّف المحدد غير صحيح.", "The provided ID is invalid."],
    [/invalid shift|shift .*invalid|invalid work days|invalid start time|invalid end time|invalid shift settings/, "بيانات الوردية غير صحيحة. تحقق من الأوقات وأيام العمل والإعدادات.", "Invalid shift details. Check the times, work days, and settings."],
    [/invalid location|location .*invalid|invalid timezone|invalid location settings|geofence|outside.*(range|area|location)|outside the permitted/, "تعذر التحقق من موقع العمل. تحقق من إعدادات الموقع وأنك ضمن النطاق المسموح.", "Unable to verify the work location. Check its settings and ensure you are within the permitted area."],
    [/select at least one employee|no employees|no active employees/, "اختر موظفًا واحدًا على الأقل وتأكد من وجود موظفين نشطين.", "Select at least one employee and ensure active employees are available."],
    [/already have a shift|shift.*already exists|already exists for this period|conflict/, "يوجد تعارض مع سجل أو وردية موجودة مسبقًا.", "This conflicts with an existing record or shift."],
    [/start date cannot be in the past|invalid end date|contract end date cannot precede start date|invalid date range|maximum range/, "نطاق التواريخ غير صحيح. تحقق من تاريخ البداية والنهاية.", "The date range is invalid. Check the start and end dates."],
    [/complete all location data|missing:|incomplete location|location data before saving|location data before enabling/, "بيانات موقع العمل غير مكتملة. أكمل الحقول المطلوبة ثم حاول مجددًا.", "Work location details are incomplete. Complete the required fields and try again."],
    [/already approved|only draft runs|cannot delete an approved run|failed to approve run/, "تعذر تنفيذ العملية على مسير الرواتب بهذه الحالة. تحقق من حالة المسير ثم حاول مجددًا.", "This action cannot be performed on the payroll run in its current state. Check its status and try again."],
    [/net salary cannot be negative|salary.*negative|invalid.*salary|incomplete salary data|salary data/, "بيانات الراتب غير صحيحة أو غير مكتملة. تحقق من مبالغ الراتب والبدلات والاستقطاعات.", "Salary data is invalid or incomplete. Check salary, allowances, and deductions."],
    [/payroll run already exists|already exists for this period/, "يوجد مسير رواتب للفترة المحددة مسبقًا.", "A payroll run already exists for the selected period."],
    [/no nationality|nationality.*not set|is_saudi/, "يرجى استكمال جنسية الموظفين قبل إنشاء مسير الرواتب.", "Complete employee nationality details before creating the payroll run."],
    [/employee number.*already exists|linked account already exists|duplicate key|23505/, "الرقم الوظيفي أو الحساب المرتبط مستخدم مسبقًا.", "The employee number or linked account is already in use."],
    [/contract end date|contract start date/, "تاريخ نهاية العقد يجب ألا يسبق تاريخ بدايته.", "The contract end date cannot precede the start date."],
    [/invalid (employee_number|full_name|status|user_id|field)|unsupported fields|invalid name|invalid phone|invalid iban/, "إحدى بيانات الموظف غير صحيحة. راجع الحقول المدخلة.", "One or more employee fields are invalid. Review the entered values."],
    [/employee.*not a member|not a member of this organization/, "حساب الموظف غير مرتبط بهذه المنشأة.", "The employee account is not a member of this organization."],
    [/only draft|approved run|cannot be edited|cannot be deleted/, "لا يمكن تنفيذ التعديل على مسير الرواتب بحالته الحالية.", "The payroll run cannot be changed in its current state."],
    [/network|failed to fetch|fetch failed|load failed|connection|timed out|timeout/, "تعذر الاتصال بالخادم. تحقق من الاتصال وحاول مجددًا.", "Unable to connect to the server. Check your connection and try again."],
    [/unable to load|failed to load|failed to create|failed to update|failed to delete|internal server error|internal error|unexpected error|request failed|unable to record|unable to confirm/, "تعذر إكمال العملية بسبب خطأ في الخادم. حاول مجددًا، وإذا استمرت المشكلة تواصل مع المسؤول.", "The server could not complete the request. Please try again, and contact your administrator if the issue persists."],
    [/you cannot review your own request|you cannot decide on your own deduction/, "لا يمكنك مراجعة طلبك أو اعتماد خصمك بنفسك. يجب أن يراجعه مالك آخر.", "You cannot review your own request or deduction. Another owner must review it."],
    [/already processed|already decided|already updated|already included in a payroll run|this request was already processed|this proposal was already decided/, "تمت معالجة هذا الطلب أو اتخاذ القرار بشأنه مسبقًا.", "This request has already been processed or decided."],
    [/date must be within the last 31 days/, "يجب أن يكون تاريخ الطلب ضمن آخر 31 يومًا.", "The request date must be within the last 31 days."],
    [/reason is required|adjustment reason is required/, "يرجى إدخال سبب واضح لا يقل عن 3 أحرف.", "Please provide a reason of at least 3 characters."],
    [/no scheduled shift on this date/, "لا توجد وردية مجدولة لك في هذا التاريخ.", "You have no scheduled shift on this date."],
    [/provide the check-in time|check-in time/, "يرجى تحديد وقت الحضور.", "Please provide the check-in time."],
    [/provide the check-out time|check-out time/, "يرجى تحديد وقت الانصراف.", "Please provide the check-out time."],
    [/provide at least one time|invalid proposed time/, "يرجى إدخال وقت صحيح للحضور أو الانصراف.", "Provide a valid check-in or check-out time."],
    [/check-in already exists|check-out already exists/, "يوجد تسجيل لهذا الوقت مسبقًا. استخدم طلب تعديل الوقت بدلًا من ذلك.", "A record already exists for this time. Use a time-change request instead."],
    [/too far from the shift/, "الوقت المقترح بعيد عن وقت الوردية المحدد.", "The proposed time is too far from the scheduled shift."],
    [/check-out must be after check-in/, "يجب أن يكون وقت الانصراف بعد وقت الحضور.", "Check-out must be after check-in."],
    [/pending request of this type/, "لديك طلب من النوع نفسه قيد المراجعة لهذا التاريخ.", "You already have a pending request of this type for this date."],
    [/only a possible absence can be confirmed/, "لا يمكن تأكيد الغياب إلا إذا كانت الحالة غيابًا محتملًا.", "Only a possible absence can be confirmed."],
    [/end date cannot be earlier than the last evaluated day/, "لا يمكن أن يكون تاريخ نهاية الإسناد قبل آخر يوم تم تقييم الحضور فيه.", "The assignment end date cannot be earlier than the last evaluated attendance day."],
    [/timezone cannot be changed/, "لا يمكن تغيير المنطقة الزمنية لموقع لديه سجلات حضور. أنشئ موقعًا جديدًا بدلًا من ذلك.", "The timezone cannot be changed for a location with attendance history. Create a new location instead."],
    [/shift already has attendance history/, "توجد سجلات حضور لهذه الوردية. أنشئ وردية جديدة وعيّنها من تاريخ مستقبلي.", "This shift has attendance history. Create a new shift and assign it from a future date."],
    [/percent cannot exceed 100/, "لا يمكن أن تتجاوز النسبة 100٪.", "The percentage cannot exceed 100%."],
    [/invalid incident type|invalid method|invalid wage basis/, "نوع الخصم أو طريقة الحساب المحددة غير صحيحة.", "The selected deduction type or calculation method is invalid."],
    [/no calculated amount/, "لا يوجد مبلغ محسوب. استخدم خيار التعديل وأدخل المبلغ والسبب.", "No calculated amount is available. Use the adjust action and provide an amount and reason."],
    [/final confirmation is required/, "يرجى تأكيد العملية نهائيًا قبل المتابعة.", "Final confirmation is required before proceeding."],
    [/decision violates deduction rules/, "القرار لا يتوافق مع ضوابط الخصم المعتمدة.", "The decision does not comply with the deduction rules."],
    [/cannot delete an employee with payroll history|employee with payroll history/, "لا يمكن حذف موظف لديه سجل رواتب. يمكنك تعطيل حسابه بدلًا من ذلك.", "An employee with payroll history cannot be deleted. You can deactivate the employee instead."],
    [/employees can only update phone, bank_name, and iban/, "يمكن للموظف تعديل رقم الهاتف واسم البنك ورقم الآيبان فقط.", "Employees can only update their phone, bank name, and IBAN."],
    [/selected user is not a member|not a member of this organization|some users are not members/, "أحد الحسابات المحددة غير مرتبط بهذه المنشأة.", "One or more selected accounts are not members of this organization."],
    [/employee number or linked account already exists/, "الرقم الوظيفي أو الحساب المرتبط مستخدم مسبقًا.", "The employee number or linked account is already in use."],
    [/a payroll run already exists for this period/, "يوجد مسير رواتب للفترة المحددة مسبقًا.", "A payroll run already exists for the selected period."],
    [/there are no active employees/, "لا يوجد موظفون نشطون لإضافتهم إلى مسير الرواتب.", "There are no active employees to include in the payroll run."],
    [/incomplete salary data/, "توجد بيانات رواتب غير مكتملة لدى بعض الموظفين. أكملها قبل إنشاء المسير.", "Some employees have incomplete salary data. Complete it before creating the run."],
    [/no nationality/, "يرجى استكمال جنسية الموظفين قبل إنشاء مسير الرواتب.", "Complete employee nationality details before creating the payroll run."],
    [/invalid month|expected format|expected \"yyyy-mm/, "صيغة الشهر غير صحيحة. استخدم الصيغة سنة-شهر مثل 2026-10.", "The month format is invalid. Use YYYY-MM, for example 2026-10."],
    [/unsupported fields|invalid or missing|invalid employee_number|invalid full_name|invalid status|invalid user_id|invalid field/, "إحدى بيانات الموظف غير صحيحة أو غير مكتملة. راجع الحقول المدخلة.", "One or more employee fields are invalid or missing. Review the entered values."],
    [/item not found or unauthorized/, "عنصر الرواتب غير موجود أو لا تملك صلاحية تعديله.", "The payroll item was not found or you are not allowed to edit it."],
    [/invalid action/, "العملية المطلوبة غير مدعومة.", "The requested action is not supported."],
    [/invalid|must be|cannot be|is required|at least|maximum|minimum|negative/, "بعض البيانات المدخلة غير صحيحة. تحقق منها ثم حاول مجددًا.", "Some entered values are invalid. Check them and try again."],
  ];

  for (const [pattern, ar, en] of rules) {
    if (pattern.test(value)) return language === "ar" ? ar : en;
  }

  // Unknown server/driver messages must not leak technical details or remain
  // in the wrong language. Specific known cases are handled above.
  return language === "ar"
    ? "تعذر إكمال العملية. تحقق من البيانات وحاول مجددًا."
    : raw;
}

