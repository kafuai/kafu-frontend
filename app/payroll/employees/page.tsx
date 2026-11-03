"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent, Fragment } from "react";
import { useLocalization } from "@/components/localization/LocalizationContext";
import { localizeErrorMessage } from "@/lib/localization/errorMessages";
import {
  X,
  UsersRound,
  RefreshCw,
  LoaderCircle,
  UserRound,
  Pencil,
  ClipboardList,
} from "lucide-react";
import {
  CountrySelect,
  GetCountries,
} from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";

type PayrollEmployee = {
  id: string;
  organization_id: string;
  user_id: string | null;
  employee_number: string;
  full_name: string;
  national_id: string | null;
  status: "active" | "inactive";
  hire_date: string | null;
  nationality: string | null;
  is_saudi: boolean;
  date_of_birth: string | null;
  phone: string | null;
  job_title: string | null;
  department: string | null;
  contract_type: string | null;
  contract_start_date: string | null;
  contract_end_date: string | null;
  basic_salary: number | string | null;
  housing_allowance: number | string | null;
  other_allowances: number | string | null;
  deductions: number | string | null;
  bank_name: string | null;
  iban: string | null;
  created_at: string;
  updated_at: string;
};

type EmployeeRow = {
  key: string;
  user_id: string | null;
  full_name: string;
  email: string | null;
  role: string | null;
  payroll: PayrollEmployee | null;
};

type EmployeeForm = {
  user_id: string;
  employee_number: string;
  full_name: string;
  national_id: string;
  status: "active" | "inactive";
  hire_date: string;
  nationality: string;
  date_of_birth: string;
  phone: string;
  job_title: string;
  department: string;
  contract_type: string;
  contract_start_date: string;
  contract_end_date: string;
  basic_salary: string;
  housing_allowance: string;
  other_allowances: string;
  deductions: string;
  bank_name: string;
  iban: string;
  is_saudi: boolean;
};

const EMPTY_FORM: EmployeeForm = {
  user_id: "",
  employee_number: "",
  full_name: "",
  national_id: "",
  status: "active",
  hire_date: "",
  nationality: "",
  date_of_birth: "",
  phone: "",
  job_title: "",
  department: "",
  contract_type: "",
  contract_start_date: "",
  contract_end_date: "",
  basic_salary: "",
  housing_allowance: "",
  other_allowances: "",
  deductions: "",
  bank_name: "",
  iban: "",
  is_saudi: false,
};

const REQUIRED_TEXT: (keyof EmployeeForm)[] = [
  "employee_number",
  "full_name",
  "national_id",
  "nationality",
  "phone",
  "job_title",
  "department",
  "contract_type",
  "bank_name",
  "iban",
  "hire_date",
  "date_of_birth",
  "contract_start_date",
];

const MONEY_FIELDS: (keyof EmployeeForm)[] = [
  "basic_salary",
  "housing_allowance",
  "other_allowances",
  "deductions",
];

// دالة لفحص ما إذا كان السجل يحتوي على بيانات ناقصة
function isPayrollIncomplete(p: PayrollEmployee | null): boolean {
  if (!p) return true;
  const allRequiredKeys = [
    ...REQUIRED_TEXT,
    ...MONEY_FIELDS,
  ] as (keyof PayrollEmployee)[];

  return allRequiredKeys.some((key) => {
    const val = p[key];
    return val === null || val === undefined || String(val).trim() === "";
  }) || (
    p.contract_type === "fixed_term" &&
    !p.contract_end_date
  );
}

function rowToForm(row: EmployeeRow): EmployeeForm {
  const p = row.payroll;
  return {
    user_id: row.user_id ?? "",
    employee_number: p?.employee_number ?? "",
    full_name: p?.full_name ?? row.full_name ?? "",
    national_id: p?.national_id ?? "",
    status: p?.status ?? "active",
    hire_date: p?.hire_date ?? "",
    nationality: p?.nationality ?? "",
    date_of_birth: p?.date_of_birth ?? "",
    phone: p?.phone ?? "",
    job_title: p?.job_title ?? "",
    department: p?.department ?? "",
    contract_type: p?.contract_type ?? "",
    contract_start_date: p?.contract_start_date ?? "",
    contract_end_date: p?.contract_end_date ?? "",
    basic_salary: p?.basic_salary != null ? String(p.basic_salary) : "",
    housing_allowance: p?.housing_allowance != null ? String(p.housing_allowance) : "",
    other_allowances: p?.other_allowances != null ? String(p.other_allowances) : "",
    deductions: p?.deductions != null ? String(p.deductions) : "",
    bank_name: p?.bank_name ?? "",
    iban: p?.iban ?? "",
    is_saudi: p?.is_saudi ?? false,
  };
}

type StatusFilter = "all" | "active" | "inactive" | "incomplete";
type LeaveUsageType = "annual" | "sick" | "emergency" | "unpaid" | "maternity";
const LEAVE_USAGE_TYPES: LeaveUsageType[] = ["annual", "sick", "emergency", "unpaid", "maternity"];

function currentRiyadhDate(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Riyadh" });
}

export default function EmployeesPage() {
  const { locale } = useLocalization();
  const isArabic = locale === "ar";

  const [rows, setRows] = useState<EmployeeRow[]>([]);
  const [canManage, setCanManage] = useState(false);
  const [loadState, setLoadState] = useState<"loading" | "loaded" | "error" | "forbidden">("loading");
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [editingRow, setEditingRow] = useState<EmployeeRow | null>(null);
  const [form, setForm] = useState<EmployeeForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState("");
  const [departments, setDepartments] = useState<{ id: string; name: string }[]>([]);
  const [deptByUser, setDeptByUser] = useState<Record<string, string>>({});
  const [formDeptId, setFormDeptId] = useState("");
  const [invalidFields, setInvalidFields] = useState<(keyof EmployeeForm)[]>([]);
  const [leaveUsage, setLeaveUsage] = useState<Record<LeaveUsageType, string>>({
    annual: "0", sick: "0", emergency: "0", unpaid: "0", maternity: "0",
  });
  const [leaveUsageThroughDate, setLeaveUsageThroughDate] = useState(currentRiyadhDate);
  const [leaveUsageLoading, setLeaveUsageLoading] = useState(false);
  const [leaveUsageSaving, setLeaveUsageSaving] = useState(false);
  const [leaveUsageError, setLeaveUsageError] = useState("");
  const [leaveUsageNotice, setLeaveUsageNotice] = useState("");
  const invalidInputClass = "!border-2 !border-rose-500 focus:!border-rose-600";

  
 const [countries, setCountries] = useState<
      Awaited<ReturnType<typeof GetCountries>>
    >([]);

    useEffect(() => {
      let active = true;

      GetCountries()
        .then((result) => {
          if (active) setCountries(result);
        })
        .catch((error) => {
          console.error("Failed to load countries:", error);
        });

      return () => {
        active = false;
      };
    }, []);


  const copy = isArabic
    ? {
        badge: "PAYROLL",
        badgeSub: "الموظفون",
        heroText: "جميع أعضاء المنشأة في مكان واحد. أكمل بيانات الرواتب والعقد والبنك لكل موظف قبل إنشاء مسير الرواتب.",
        chips: ["بيانات الرواتب", "العقود والبنوك", "متابعة النواقص"],
        statTotal: "إجمالي الموظفين",
        statTotalNote: "أعضاء المنشأة",
        statActive: "نشطون",
        statActiveNote: "بياناتهم مكتملة وحالتهم نشط",
        statInactive: "غير نشطين",
        statInactiveNote: "لا يدخلون في مسير الرواتب",
        statIncomplete: "بيانات غير مكتملة",
        statIncompleteNote: "تحتاج إلى استكمال",
        loadingTitle: "جارٍ تحميل الموظفين",
        loadingText: "يتم جلب أعضاء المنشأة وبيانات الرواتب.",
        errorTitle: "تعذر تحميل الموظفين",
        forbiddenTitle: "لا تملك صلاحية العرض",
        title: "الموظفون",
        subtitle: "جميع أعضاء المنشأة، أكمل بيانات الرواتب لكل موظف",
        search: "ابحث بالاسم أو البريد أو الرقم الوظيفي أو القسم",
        all: "كل الحالات",
        active: "نشط",
        inactive: "غير نشط",
        incomplete: "بيانات غير مكتملة",
        employee: "الموظف",
        number: "الرقم الوظيفي",
        job: "المسمى الوظيفي",
        department: "القسم",
        phone: "رقم الهاتف",
        salary: "الراتب الأساسي",
        status: "الحالة",
        actions: "الإجراءات",
        noEmployees: "لا يوجد موظفون مطابقون للبحث.",
        loading: "جارٍ تحميل الموظفين...",
        loadError: "تعذر تحميل الموظفين.",
        forbidden: "ليس لديك صلاحية عرض الموظفين.",
        retry: "إعادة المحاولة",
        refresh: "تحديث",
        completeTitle: "إكمال بيانات الموظف",
        editTitle: "تعديل بيانات الموظف",
        formHint: "يمكنك حفظ البيانات المتوفرة لديك الآن وإكمال الباقي لاحقاً.",
        personal: "البيانات الأساسية",
        employment: "البيانات الوظيفية والعقد",
        payroll: "بيانات الرواتب والبنك",
        employeeNumber: "الرقم الوظيفي",
        fullName: "الاسم الكامل",
        nationalId: "رقم الهوية",
        nationality: "الجنسية",
        birthDate: "تاريخ الميلاد",
        hireDate: "تاريخ التوظيف",
        jobTitle: "المسمى الوظيفي",
        contractType: "نوع العقد",
        contractStart: "بداية العقد",
        contractEnd: "نهاية العقد",
        basicSalary: "الراتب الأساسي",
        housing: "بدل السكن",
        other: "بدلات أخرى",
        deductions: "الخصومات",
        bank: "اسم البنك",
        iban: "رقم الأيبان",
        email: "البريد الإلكتروني",
        cancel: "إغلاق والتراجع",
        save: "حفظ التغييرات",
        saving: "جارٍ الحفظ...",
        edit: "تعديل",
        complete: "إكمال البيانات",
        invalidMoney: "أدخل مبالغ صحيحة غير سالبة وبحد أقصى منزلتين عشريتين.",
        invalidDates: "تاريخ نهاية العقد لا يمكن أن يسبق تاريخ بدايته.",
        saved: "تم حفظ بيانات الموظف.",
        created: "تمت إضافة الموظف إلى جدول الرواتب بنجاح.",
        errorSave: "تعذر حفظ بيانات الموظف.",
        count: "عدد الموظفين",
        none: "—",
        currency: "ر.س",
        missing: "بيانات غير مكتملة",
      }
    : {
        badge: "PAYROLL",
        badgeSub: "Employees",
        heroText: "All organization members in one place. Complete payroll, contract and bank details for each employee before creating a payroll run.",
        chips: ["Payroll data", "Contracts & banks", "Track missing data"],
        statTotal: "Total employees",
        statTotalNote: "Organization members",
        statActive: "Active",
        statActiveNote: "Complete data and active status",
        statInactive: "Inactive",
        statInactiveNote: "Not included in payroll runs",
        statIncomplete: "Incomplete data",
        statIncompleteNote: "Need to be completed",
        loadingTitle: "Loading employees",
        loadingText: "Fetching organization members and payroll data.",
        errorTitle: "Unable to load employees",
        forbiddenTitle: "No permission to view",
        title: "Employees",
        subtitle: "All organization members. Complete payroll details for each employee.",
        search: "Search name, email, employee number, or department",
        all: "All statuses",
        active: "Active",
        inactive: "Inactive",
        incomplete: "Incomplete data",
        employee: "Employee",
        number: "Employee number",
        job: "Job title",
        department: "Department",
        phone: "Phone",
        salary: "Basic salary",
        status: "Status",
        actions: "Actions",
        noEmployees: "No employees match your search.",
        loading: "Loading employees...",
        loadError: "Unable to load employees.",
        forbidden: "You do not have permission to view employees.",
        retry: "Retry",
        refresh: "Refresh",
        completeTitle: "Complete employee details",
        editTitle: "Edit employee details",
        formHint: "You can save available data now and complete the rest later.",
        personal: "Personal information",
        employment: "Employment and contract",
        payroll: "Payroll and bank details",
        employeeNumber: "Employee number",
        fullName: "Full name",
        nationalId: "National ID",
        nationality: "Nationality",
        birthDate: "Date of birth",
        hireDate: "Hire date",
        jobTitle: "Job title",
        contractType: "Contract type",
        contractStart: "Contract start",
        contractEnd: "Contract end",
        basicSalary: "Basic salary",
        housing: "Housing allowance",
        other: "Other allowances",
        deductions: "Deductions",
        bank: "Bank name",
        iban: "IBAN",
        email: "Email",
        cancel: "Close & Cancel",
        save: "Save Changes",
        saving: "Saving...",
        edit: "Edit",
        complete: "Complete data",
        invalidMoney: "Enter valid non-negative amounts with up to two decimal places.",
        invalidDates: "Contract end date cannot precede its start date.",
        saved: "Employee details saved.",
        created: "Employee added to payroll successfully.",
        errorSave: "Unable to save employee details.",
        count: "Employees",
        none: "—",
        currency: "SAR",
        missing: "Incomplete data",
      };

function getRoleLabel(role: string | null) {
  const roles: Record<string, { ar: string; en: string }> = {
    owner: { ar: "رئيس", en: "Owner" },
    manager: { ar: "مدير", en: "Manager" },
    member: { ar: "موظف", en: "Member" },
  };

  if (!role) return isArabic ? "غير محدد" : "Not assigned";

  const normalized = role.toLowerCase();

  return roles[normalized]
    ? isArabic
      ? roles[normalized].ar
      : roles[normalized].en
    : role;
}
  
  const loadEmployees = useCallback(async () => {
    setLoadState("loading");
    setLoadError("");
    try {
      const response = await fetch("/api/payroll/employees", {
        method: "GET",
        cache: "no-store",
      });
      const payload = await response.json().catch(() => ({}));

      if (response.status === 403) {
        setLoadState("forbidden");
        return;
      }
      if (!response.ok) throw new Error(localizeErrorMessage(payload.error ?? copy.loadError, locale));

      if (Array.isArray(payload.employees)) {
        setRows(payload.employees as EmployeeRow[]);
      } else if (payload.employee) {
        const p = payload.employee as PayrollEmployee;
        setRows([
          {
            key: p.id,
            user_id: p.user_id,
            full_name: p.full_name,
            email: null,
            role: null,
            payroll: p,
          },
        ]);
      } else {
        throw new Error(copy.loadError);
      }

      setCanManage(payload.canManage === true);
      setLoadState("loaded");
    } catch (error) {
      setLoadError(error instanceof Error ? localizeErrorMessage(error.message, locale) : copy.loadError);
      setLoadState("error");
    }
  }, [copy.loadError, locale]);

  useEffect(() => {
    void loadEmployees();
  }, [loadEmployees]);

    const loadDepartments = useCallback(async () => {
    try {
      const res = await fetch("/api/departments", { cache: "no-store" });
      if (!res.ok) return; // not allowed (not owner): the department select is simply not shown
      const p = await res.json();
      setDepartments((p.data ?? []).map((d: { id: string; name: string }) => ({ id: d.id, name: d.name })));
      setDeptByUser(p.assignments ?? {});
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    void loadDepartments();
  }, [loadDepartments]);


  const filteredRows = useMemo(() => {
    const query = search.trim().toLocaleLowerCase(isArabic ? "ar" : "en");
    return rows.filter((row) => {
      const p = row.payroll;
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "incomplete" && isPayrollIncomplete(p)) ||
        (statusFilter === "active" && p?.status === "active") ||
        (statusFilter === "inactive" && p?.status === "inactive");

      const searchable = [
        row.full_name,
        row.email,
        p?.employee_number,
        p?.job_title,
        p?.department,
        p?.phone,
      ]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase(isArabic ? "ar" : "en");

      return matchesStatus && (!query || searchable.includes(query));
    });
  }, [rows, search, statusFilter, isArabic]);

  // الحسبة الجديدة للموظفين اللي بياناتهم ناقصة
  const incompleteCount = useMemo(() => rows.filter((r) => isPayrollIncomplete(r.payroll)).length, [rows]);

  function toggleRowForm(row: EmployeeRow) {
    if (!canManage) return;
    if (editingRow?.key === row.key) {
      closeForm();
    } else {
      setEditingRow(row);
      setForm(rowToForm(row));
      setFormDeptId(deptByUser[row.user_id ?? ""] ?? "");
      setFormError("");
      if (row.user_id) void loadPreviousLeaveUsage(row.user_id);
    }
  }

  function closeForm() {
    if (saving) return;
    setEditingRow(null);
    setFormError("");
  }

  async function loadPreviousLeaveUsage(employeeUserId: string) {
    setLeaveUsageLoading(true);
    setLeaveUsageError("");
    setLeaveUsageNotice("");
    const leaveYear = Number(currentRiyadhDate().slice(0, 4));
    try {
      const response = await fetch(`/api/payroll/employees/leave-usage?employeeUserId=${encodeURIComponent(employeeUserId)}&leaveYear=${leaveYear}`, {
        cache: "no-store",
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error ?? "Unable to load previous leave usage.");
      const nextUsage: Record<LeaveUsageType, string> = {
        annual: "0", sick: "0", emergency: "0", unpaid: "0", maternity: "0",
      };
      for (const type of LEAVE_USAGE_TYPES) nextUsage[type] = String(payload.usage?.[type] ?? 0);
      setLeaveUsage(nextUsage);
      setLeaveUsageThroughDate(payload.usageThroughDate || currentRiyadhDate());
    } catch (error) {
      setLeaveUsageError(error instanceof Error ? error.message : "Unable to load previous leave usage.");
    } finally {
      setLeaveUsageLoading(false);
    }
  }

  function updateField<K extends keyof EmployeeForm>(
  key: K,
  value: EmployeeForm[K]
) {
  setForm((current) => ({ ...current, [key]: value }));

  if (String(value ?? "").trim() !== "") {
    setInvalidFields((current) =>
      current.filter((field) => field !== key)
    );
  }
}

  function getMaxBirthDate(): string {
    const today = new Date();

    const maxDate = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate()
    );

    const year = maxDate.getFullYear();
    const month = String(maxDate.getMonth() + 1).padStart(2, "0");
    const day = String(maxDate.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  function getTodayDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingRow) return;

    setFormError("");
    setNotice("");

    
    const requiredFields = [
      ...new Set<keyof EmployeeForm>([
        ...REQUIRED_TEXT,
        ...MONEY_FIELDS,
        "status",
      ]),
    ];

    if (form.contract_type === "fixed_term") {
      requiredFields.push("contract_end_date");
    }

    const usesDepartmentSelect =
      departments.length > 0 && Boolean(editingRow.user_id);

    const missingFields = requiredFields.filter((key) => {
      if (key === "department" && usesDepartmentSelect) {
        return !formDeptId.trim();
      }

      return String(form[key] ?? "").trim() === "";
    });

    if (missingFields.length > 0) {
      setInvalidFields(missingFields);

      // حافظ على نمط رسالة الخطأ الحالي، مع إظهار الأحمر لكل الحقول الناقصة.
      setFormError(
        localizeErrorMessage(
          `Invalid or missing ${missingFields[0]}`,
          locale
        )
      );

      return;
    }


    // التحقق المالي فقط إذا كان الحقل معبأً بقيمة
    const invalidMoney = MONEY_FIELDS.some((key) => {
      const val = String(form[key]).trim();
      return val !== "" && !/^\d+(?:\.\d{1,2})?$/.test(val);
    });

    if (invalidMoney) {
      setFormError(copy.invalidMoney);
      return;
    }

   
    if (form.contract_end_date && form.contract_start_date && form.contract_end_date < form.contract_start_date) {
      setFormError(copy.invalidDates);
      return;
    }

    const maxBirthDate = getMaxBirthDate();

    if (
      !form.date_of_birth ||
      form.date_of_birth > maxBirthDate
    ) {
      setFormError(
        isArabic
          ? "يجب ألا يقل عمر الموظف عن 18 سنة."
          : "The employee must be at least 18 years old."
      );
      return;
    }

    const todayDate = getTodayDate();

    if (
      (form.hire_date && form.hire_date > todayDate) ||
      (form.contract_start_date && form.contract_start_date > todayDate)
    ) {
      setFormError(
        isArabic
          ? "تاريخ التوظيف وتاريخ بداية العقد لا يمكن أن يكونا في المستقبل."
          : "Hire date and contract start date cannot be in the future."
      );
      return;
    }

    if (form.hire_date && form.hire_date < form.date_of_birth) {
      setFormError(
        isArabic
        ? "لا يمكن ان يكون تاريخ التوظيف قبل تاريخ الميلاد" :
        "Hire date cannot be before the date of birth"
      );
      return;
    }

    
    if (form.hire_date && form.contract_start_date && form.hire_date > form.contract_start_date) {
      setFormError(
        isArabic
          ? "لا يمكن أن يكون تاريخ التوظيف بعد تاريخ بداية العقد."
          : "Hire date cannot be after the contract start date."
      );
      return;
    }

    const isEdit = Boolean(editingRow.payroll);

    // تجهيز البايلود ووضع null للحقول الفارغة
    const body = {
      user_id: form.user_id.trim() || null,
      employee_number: form.employee_number.trim() || null,
      full_name: form.full_name.trim() || null,
      national_id: form.national_id.trim() || null,
      nationality: form.nationality.trim() || null,
      phone: form.phone.trim() || null,
      job_title: form.job_title.trim() || null,
      department: usesDepartmentSelect
      ? departments.find((d) => d.id === formDeptId)?.name ?? null
      : form.department.trim() || null,
      contract_type: form.contract_type.trim() || null,
      bank_name: form.bank_name.trim() || null,
      iban: form.iban.trim() || null,
      status: form.status,
      hire_date: form.hire_date || null,
      date_of_birth: form.date_of_birth || null,
      contract_start_date: form.contract_start_date || null,
      contract_end_date:
        form.contract_type === "indefinite"
          ? null
          : form.contract_end_date || null,
      basic_salary: form.basic_salary ? Number(form.basic_salary) : null,
      housing_allowance: form.housing_allowance ? Number(form.housing_allowance) : null,
      other_allowances: form.other_allowances ? Number(form.other_allowances) : null,
      deductions: form.deductions ? Number(form.deductions) : null,
    };

    setSaving(true);
    try {
      const response = await fetch(
        isEdit ? `/api/payroll/employees/${editingRow.payroll!.id}` : "/api/payroll/employees",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      const payload = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(payload.error ?? copy.errorSave);

      // department assignment (only when it changed)
      if (editingRow.user_id && formDeptId !== (deptByUser[editingRow.user_id] ?? "")) {
        const deptRes = await fetch("/api/departments/members", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: editingRow.user_id, departmentId: formDeptId || null }),
        });
        if (!deptRes.ok) {
          const deptPayload = await deptRes.json().catch(() => ({}));
          throw new Error(deptPayload.error ?? copy.errorSave);
        }
        await loadDepartments();
      }

      setNotice(isEdit ? copy.saved : copy.created);
      setEditingRow(null);
      await loadEmployees();
    } catch (error) {
      setFormError(error instanceof Error ? localizeErrorMessage(error.message, locale) : copy.errorSave);
    } finally {
      setSaving(false);
    }
  }

  async function savePreviousLeaveUsage() {
    if (!editingRow?.user_id || !canManage) return;
    setLeaveUsageError("");
    setLeaveUsageNotice("");

    const parsedUsage = Object.fromEntries(
      LEAVE_USAGE_TYPES.map((type) => [type, Number(leaveUsage[type])]),
    ) as Record<LeaveUsageType, number>;
    if (LEAVE_USAGE_TYPES.some((type) =>
      !Number.isFinite(parsedUsage[type]) || parsedUsage[type] < 0 || parsedUsage[type] > 366 ||
      Math.round(parsedUsage[type] * 100) !== parsedUsage[type] * 100
    )) {
      setLeaveUsageError(isArabic
        ? "أدخل أياماً صحيحة من 0 إلى 366 وبحد أقصى منزلتين عشريتين."
        : "Enter valid days from 0 to 366 with up to two decimal places.");
      return;
    }

    const leaveYear = Number(currentRiyadhDate().slice(0, 4));
    setLeaveUsageSaving(true);
    try {
      const response = await fetch("/api/payroll/employees/leave-usage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeUserId: editingRow.user_id,
          leaveYear,
          usageThroughDate: leaveUsageThroughDate,
          usage: parsedUsage,
        }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error ?? "Unable to save previous leave usage.");
      setLeaveUsageNotice(isArabic ? "تم حفظ الإجازات المستخدمة سابقاً." : "Previous leave usage saved.");
    } catch (error) {
      setLeaveUsageError(error instanceof Error ? error.message : "Unable to save previous leave usage.");
    } finally {
      setLeaveUsageSaving(false);
    }
  }

  /* ------------------------------ styles ------------------------------ */

  const inputClass =
    "mt-1 block h-11 w-full rounded-xl border border-[var(--border-default)] bg-[var(--background)] px-3 text-sm font-bold text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--brand-primary)] focus:bg-[var(--surface)]";
  const labelClass = "block text-xs font-black text-[var(--text-secondary)]";


  function field(key: keyof EmployeeForm, label: string, type = "text", dir?: "ltr") {
    
    const maxLen = 
      key === "national_id" ? 10 : 
      key === "phone" ? 10 : 
      500;

    
    const maxDate = 
      key === "date_of_birth" ? getMaxBirthDate() :
      key === "hire_date" ? (form.contract_start_date || getTodayDate()) :
      key === "contract_start_date" ? getTodayDate() : 
      undefined;

    
    const minVal = 
      key === "contract_start_date" ? form.hire_date : 
      key === "contract_end_date" ? form.contract_start_date : 
      type === "number" ? "0" : undefined;

    if (key === "contract_type") {
      return (
        <label key={key} className={labelClass}>
          {label} <span className="text-rose-500">*</span>

          <select
            value={form.contract_type}
            onChange={(event) => {
              const value = event.target.value;

              updateField("contract_type", value);

              if (value === "indefinite") {
                updateField("contract_end_date", "");
              }
            }}
            className={inputClass}
          >
            <option value="">
              {isArabic ? "اختر نوع العقد" : "Select contract type"}
            </option>
            <option value="fixed_term">
              {isArabic ? "محدد المدة" : "Fixed-term"}
            </option>
            <option value="indefinite">
              {isArabic ? "غير محدد المدة" : "Indefinite"}
            </option>
          </select>
        </label>
      );
    }

    if (key === "contract_end_date") {
      const isIndefinite = form.contract_type === "indefinite";

      return (
        <label key={key} className={labelClass}>
          {label}

          {!isIndefinite && (
            <span className="text-rose-500"> *</span>
          )}

          <input
            type="date"
            value={form.contract_end_date}
            disabled={isIndefinite}
            onChange={(event) =>
              updateField("contract_end_date", event.target.value)
            }
            min={form.contract_start_date || undefined}
            className={inputClass}
          />
        </label>
      );
    }

    if (key === "iban") {
      return (
        <label key={key} className={labelClass}>
          {label} <span className="text-rose-500">*</span>

          <div
            className={`${inputClass} flex items-center gap-2 ${
              invalidFields.includes(key) ? invalidInputClass : ""
            }`}
            dir="ltr"
          >
            <span className="font-bold text-[var(--text-secondary)]">
              SA
            </span>

            <input
              type="text"
              inputMode="numeric"
              dir="ltr"
              value={String(form.iban || "").replace(/^SA/i, "").replace(/\D/g, "")}
              onChange={(event) => {
                const digits = event.target.value
                  .replace(/\D/g, "")
                  .slice(0, 22);

                updateField("iban", `SA${digits}`);
              }}
              maxLength={22}
              placeholder="0000000000000000000000"
              className="min-w-0 flex-1 bg-transparent font-bold text-[var(--text-primary)] outline-none"
            />
          </div>
        </label>
      );
    }

    return (
      <label key={key} className={labelClass}>
        {label} <span className="text-rose-500">*</span>
        <input
        className={`${inputClass} ${
          invalidFields.includes(key) ? invalidInputClass : ""
        }`}
          type={type}
          dir={dir}
          value={String(form[key])}
          onChange={(event) => updateField(key, event.target.value as never)}
          max={maxDate}
          maxLength={maxLen}
          step={type === "number" ? "0.01" : undefined}
          min={minVal} // تم التعديل هنا
        />
      </label>
    );
  }

  const headings = [
    copy.employee,
    copy.number,
    copy.job,
    copy.department,
    copy.phone,
    copy.salary,
    copy.status,
  ];

  const stats = [
    { code: "ALL", label: copy.statTotal, value: rows.length, note: copy.statTotalNote },
    {
      code: "ACT",
      label: copy.statActive,
      value: rows.filter((r) => !isPayrollIncomplete(r.payroll) && r.payroll?.status === "active").length,
      note: copy.statActiveNote,
    },
    {
      code: "OFF",
      label: copy.statInactive,
      value: rows.filter((r) => r.payroll?.status === "inactive").length,
      note: copy.statInactiveNote,
    },
    { code: "INC", label: copy.statIncomplete, value: incompleteCount, note: copy.statIncompleteNote },
  ];

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      className="min-h-[calc(100vh-64px)] bg-[var(--background)] px-4 py-5 text-[var(--text-primary)] sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-[1540px]">
        {/* ------------------------------ Hero ------------------------------ */}
        <section className="relative overflow-hidden rounded-[28px] border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-small)]">
          <div className="absolute inset-y-0 start-0 w-1 bg-[var(--brand-primary)]" />
          <div className="grid gap-6 px-6 py-7 md:px-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:py-8">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border-default)] bg-[var(--brand-subtle)] px-3 py-1.5 text-[11px] font-black text-[var(--brand-primary)]">
                  <span className="h-2 w-2 rounded-full bg-[var(--brand-primary)]" />
                  {copy.badge}
                </span>
                <span className="rounded-full border border-[var(--border-default)] bg-[var(--surface-muted)] px-3 py-1.5 text-[11px] font-bold text-[var(--text-secondary)]">
                  {copy.badgeSub}
                </span>
              </div>

              <h1 className="mt-4 text-3xl font-black tracking-tight md:text-4xl">{copy.title}</h1>
              <p className="mt-3 max-w-4xl text-sm leading-7 text-[var(--text-secondary)] md:text-base md:leading-8">
                {copy.heroText}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {copy.chips.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-lg bg-[var(--surface-muted)] px-3 py-2 text-xs font-bold text-[var(--text-secondary)]"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => void loadEmployees()}
              disabled={loadState === "loading"}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[var(--brand-primary)] px-5 text-sm font-black text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw size={16} className={loadState === "loading" ? "animate-spin" : ""} />
              {copy.refresh}
            </button>
          </div>
        </section>

        {notice && (
          <div
            role="status"
            className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800"
          >
            {notice}
          </div>
        )}

        {/* ----------------------------- Loading ----------------------------- */}
        {loadState === "loading" && (
          <section className="mt-5 rounded-[28px] border border-[var(--border-default)] bg-[var(--surface)] p-10 text-center shadow-[var(--shadow-small)]">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand-subtle)]">
              <span className="h-5 w-5 animate-pulse rounded-full bg-[var(--brand-primary)]" />
            </div>
            <p className="mt-4 text-base font-black">{copy.loadingTitle}</p>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">{copy.loadingText}</p>
          </section>
        )}

        {/* ------------------------------ Error ------------------------------ */}
        {loadState === "error" && (
          <section
            role="alert"
            className="mt-5 rounded-[28px] border border-amber-300 bg-amber-50 p-8 text-center text-amber-950 shadow-[var(--shadow-small)]"
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-lg font-black text-amber-800">
              !
            </div>
            <h2 className="mt-4 text-xl font-black">{copy.errorTitle}</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7">{loadError || copy.loadError}</p>
            <button
              type="button"
              onClick={() => void loadEmployees()}
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-[var(--text-primary)] px-6 text-sm font-black text-[var(--surface)] transition hover:opacity-90"
            >
              {copy.retry}
            </button>
          </section>
        )}

        {/* ---------------------------- Forbidden ---------------------------- */}
        {loadState === "forbidden" && (
          <section className="mt-5 rounded-[28px] border border-[var(--border-default)] bg-[var(--surface)] p-10 text-center shadow-[var(--shadow-small)]">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--surface-muted)] text-lg font-black text-[var(--text-secondary)]">
              !
            </div>
            <h2 className="mt-4 text-xl font-black">{copy.forbiddenTitle}</h2>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">{copy.forbidden}</p>
          </section>
        )}

        {loadState === "loaded" && (
          <>
            {/* ------------------------------ Stats ------------------------------ */}
            <section className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((card) => (
                <article
                  key={card.code}
                  className="group relative overflow-hidden rounded-2xl border border-[var(--border-default)] bg-[var(--surface)] p-5 shadow-[var(--shadow-small)] transition duration-200 hover:-translate-y-0.5 hover:border-[var(--brand-primary)] hover:shadow-[var(--shadow-medium)]"
                >
                  <div className="absolute inset-x-0 top-0 h-0.5 origin-start scale-x-0 bg-[var(--brand-primary)] transition-transform duration-200 group-hover:scale-x-100" />
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-xs font-black text-[var(--text-muted)]">{card.label}</p>
                      <h2 className="mt-3 text-2xl font-black tracking-tight md:text-3xl">{card.value}</h2>
                    </div>
                    <span className="flex h-9 min-w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--border-default)] bg-[var(--surface-muted)] px-2 text-[10px] font-black text-[var(--brand-primary)]">
                      {card.code}
                    </span>
                  </div>
                  <div className="mt-4 border-t border-[var(--border-default)] pt-3">
                    <p className="text-[11px] font-bold text-[var(--text-secondary)]">{card.note}</p>
                  </div>
                </article>
              ))}
            </section>

            {/* ------------------------------ Table ------------------------------ */}
            <section className="mt-5 overflow-hidden rounded-[24px] border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-small)]">
              <div className="flex flex-col gap-3 border-b border-[var(--border-default)] bg-[var(--surface-muted)] p-4 sm:flex-row sm:items-center">
                <div className="flex shrink-0 items-center gap-2 text-sm font-black text-[var(--text-secondary)]">
                  <UsersRound size={17} className="text-[var(--brand-primary)]" />
                  <span>{copy.count}</span>
                  <span className="rounded-full bg-[var(--brand-subtle)] px-2.5 py-0.5 text-[11px] font-black text-[var(--brand-primary)]">
                    {filteredRows.length}
                  </span>
                </div>
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder={copy.search}
                  className="h-11 min-w-0 flex-1 rounded-xl border border-[var(--border-default)] bg-[var(--background)] px-4 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--brand-primary)] focus:bg-[var(--surface)]"
                />
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
                  className="h-11 rounded-xl border border-[var(--border-default)] bg-[var(--background)] px-3 text-sm font-bold text-[var(--text-secondary)] outline-none focus:border-[var(--brand-primary)]"
                  aria-label={copy.status}
                >
                  <option value="all">{copy.all}</option>
                  <option value="active">{copy.active}</option>
                  <option value="inactive">{copy.inactive}</option>
                  <option value="incomplete">{copy.incomplete}</option>
                </select>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-start text-sm">
                  <thead className="text-[var(--text-secondary)]">
                    <tr>
                      {headings.map((heading) => (
                        <th key={heading} scope="col" className="whitespace-nowrap px-4 py-3 text-start text-xs font-black">
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-default)]">
                    {filteredRows.map((row) => {
                      const p = row.payroll;
                      const isEditingThis = editingRow?.key === row.key;
                      // الاعتماد على الدالة الجديدة لمعرفة ما إذا كانت البيانات غير مكتملة
                      const isCompleting = isPayrollIncomplete(p);

                      return (
                        <Fragment key={row.key}>
                          <tr
                            onClick={() => toggleRowForm(row)}
                            className={`transition ${
                              isEditingThis ? "bg-[var(--brand-subtle)]" : "hover:bg-[var(--surface-muted)]"
                            } ${canManage ? "cursor-pointer" : ""}`}
                          >
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-3">
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-subtle)] text-[var(--brand-primary)]">
                                  <UserRound size={18} />
                                </span>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2 font-black">
                                    {row.full_name || copy.none}
                                    {canManage && !isEditingThis && (
                                      <Pencil size={12} className="text-[var(--text-muted)]" />
                                    )}
                                  </div>
                                 <div className="mt-0.5 truncate text-[11px] font-bold text-[var(--text-secondary)]" dir="ltr">
                                  {row.email ?? p?.national_id ?? copy.none}
                                </div>

                                <span className="mt-1 inline-flex items-center rounded-md border border-[var(--border-default)] bg-[var(--surface-muted)] px-2 py-0.5 text-[10px] font-bold text-[var(--text-secondary)]">
                                  {getRoleLabel(row.role)}
                                </span>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3.5 font-bold text-[var(--text-secondary)]">{p?.employee_number ?? copy.none}</td>
                            <td className="px-4 py-3.5 font-bold text-[var(--text-secondary)]">{p?.job_title || copy.none}</td>
                            <td className="px-4 py-3.5 font-bold text-[var(--text-secondary)]">{p?.department || copy.none}</td>
                            <td className="px-4 py-3.5 font-bold text-[var(--text-secondary)]" dir="ltr">
                              {p?.phone || copy.none}
                            </td>
                            <td className="whitespace-nowrap px-4 py-3.5 font-black">
                              {p?.basic_salary
                                ? `${Number(p.basic_salary).toLocaleString(isArabic ? "ar-SA" : "en-US", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })} ${copy.currency}`
                                : copy.none}
                            </td>
                            <td className="px-4 py-3.5">
                              {isCompleting ? (
                                <span className="inline-flex whitespace-nowrap rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-black text-amber-800">
                                  {copy.missing}
                                </span>
                              ) : (
                                <span
                                  className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-black ${
                                    p?.status === "active"
                                      ? "bg-emerald-100 text-emerald-800"
                                      : "bg-[var(--surface-muted)] text-[var(--text-secondary)]"
                                  }`}
                                >
                                  {p?.status === "active" ? copy.active : copy.inactive}
                                </span>
                              )}
                            </td>
                          </tr>

                          {isEditingThis && (
                            <tr>
                              <td colSpan={headings.length} className="p-0">
                                <div className="border-y border-[var(--brand-primary)]/20 bg-[var(--surface-muted)] px-4 py-6 sm:px-6">
                                  <form noValidate onSubmit={handleSubmit} className="space-y-6">
                                    <div className="flex items-start justify-between gap-3">
                                      <div className="flex items-start gap-3">
                                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-primary)] text-white shadow-sm">
                                          <ClipboardList size={20} />
                                        </span>
                                        <div>
                                          <h2 className="text-lg font-black">
                                            {isCompleting ? copy.completeTitle : copy.editTitle}
                                          </h2>
                                          <p className="mt-1 text-xs font-bold text-[var(--text-secondary)]">{copy.formHint}</p>
                                        </div>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={closeForm}
                                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[var(--text-secondary)] transition hover:bg-[var(--surface)]"
                                      >
                                        <X size={18} />
                                      </button>
                                    </div>

                                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                                      <div className="space-y-4 rounded-2xl border border-[var(--border-default)] bg-[var(--surface)] p-5">
                                        <h3 className="border-b border-[var(--border-default)] pb-3 text-sm font-black">
                                          {copy.personal}
                                        </h3>
                                        {field("employee_number", copy.employeeNumber)}
                                        {field("full_name", copy.fullName)}
                                        {field("national_id", copy.nationalId)}
                                        <label className={labelClass}>
                                          {copy.nationality}

                                          <CountrySelect
                                           key={form.nationality || "no-nationality"}
                                           
                                            defaultValue={
                                            countries.find(
                                              (country) => {
                                                const nationality = (form.nationality ?? "")
                                                  .trim()
                                                  .toLowerCase();

                                                return (
                                                  (typeof country.name === "string" &&
                                                    country.name.toLowerCase() === nationality) ||
                                                  (typeof country.native === "string" &&
                                                    country.native.toLowerCase() === nationality)
                                                );
                                              }
                                            ) as any
                                            }
                                            placeHolder={
                                              isArabic
                                                ? "ابحث عن الجنسية..."
                                                : "Search nationality..."
                                            }
                                            showFlag={false}
                                           containerClassName={`mt-1 !h-11 !w-full !rounded-xl !border !bg-[var(--background)] !text-sm !font-bold !text-[var(--text-primary)] !shadow-none !transition ${
                                            invalidFields.includes("nationality")
                                              ? "!border-rose-500 !ring-1 !ring-rose-500"
                                              : "!border-[var(--border-default)]"
                                          }`}
                                            onChange={(country) => {
                                            if (
                                              !country ||
                                              !("iso2" in country) ||
                                              !("name" in country)
                                            ) {
                                              return;
                                            }

                                            setForm((current) => ({
                                              ...current,
                                              nationality: country.name,
                                              is_saudi: country.iso2.toUpperCase() === "SA",
                                            }));
                                            setInvalidFields((current) =>
                                              current.filter((field) => field !== "nationality")
                                            );
                                          }}
                                         />
                                        </label>
                                        {field("date_of_birth", copy.birthDate, "date")}
                                        {field("phone", copy.phone, "tel", "ltr")}
                                      </div>

                                      <div className="space-y-4 rounded-2xl border border-[var(--border-default)] bg-[var(--surface)] p-5">
                                        <h3 className="border-b border-[var(--border-default)] pb-3 text-sm font-black">
                                          {copy.employment}
                                        </h3>
                                        {field("job_title", copy.jobTitle)}
                                        {departments.length > 0 && editingRow?.user_id ? (
                                        <label className={labelClass}>
                                          {isArabic ? "القسم" : "Department"}
                                          <select
                                            className={inputClass}
                                            value={formDeptId}
                                            onChange={(event) => setFormDeptId(event.target.value)}
                                          >
                                            <option value="">{isArabic ? "— بدون قسم —" : "— No department —"}</option>
                                            {departments.map((d) => (
                                              <option key={d.id} value={d.id}>{d.name}</option>
                                            ))}
                                          </select>
                                        </label>
                                      ) : (
                                        field("department", copy.department)
                                      )}
                                        {field("hire_date", copy.hireDate, "date")}
                                        {field("contract_type", copy.contractType)}
                                        {field("contract_start_date", copy.contractStart, "date")}
                                        {field("contract_end_date", copy.contractEnd, "date")}
                                        <label className={labelClass}>
                                          {copy.status} <span className="text-rose-500">*</span>
                                          <select
                                            value={form.status}
                                            onChange={(event) => updateField("status", event.target.value as EmployeeForm["status"])}
                                            className={inputClass}
                                          >
                                            <option value="active">{copy.active}</option>
                                            <option value="inactive">{copy.inactive}</option>
                                          </select>
                                        </label>
                                      </div>

                                      <div className="space-y-4 rounded-2xl border border-[var(--border-default)] bg-[var(--surface)] p-5">
                                        <h3 className="border-b border-[var(--border-default)] pb-3 text-sm font-black">
                                          {copy.payroll}
                                        </h3>
                                        {field("basic_salary", copy.basicSalary, "number")}
                                        {field("housing_allowance", copy.housing, "number")}
                                        {field("other_allowances", copy.other, "number")}
                                        {field("deductions", copy.deductions, "number")}
                                        {field("bank_name", copy.bank)}
                                        {field("iban", copy.iban, "text", "ltr")}
                                      </div>
                                    </div>

                                    {editingRow.user_id && (
                                      <section className="space-y-4 rounded-2xl border border-[var(--border-default)] bg-[var(--surface)] p-5">
                                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                                          <div>
                                            <h3 className="text-sm font-black">
                                              {isArabic ? "الإجازات المستخدمة سابقاً خلال السنة" : "Leave used earlier this year"}
                                            </h3>
                                            <p className="mt-1 text-xs leading-6 text-[var(--text-secondary)]">
                                              {isArabic
                                                ? "أدخل إجمالي الأيام المعتمدة حتى التاريخ المحدد، بما فيها ما تم اعتماده في KAFU AI قبل ذلك التاريخ. لا تُدخل الطلبات المعلقة."
                                                : "Enter total approved leave days through the selected date, including KAFU AI requests approved by that date. Do not include pending requests."}
                                            </p>
                                          </div>
                                          <span className="text-xs font-bold text-[var(--text-muted)]">
                                            {isArabic ? `السنة ${currentRiyadhDate().slice(0, 4)}` : `Year ${currentRiyadhDate().slice(0, 4)}`}
                                          </span>
                                        </div>

                                        <label className={labelClass}>
                                          {isArabic ? "احتساب الاستهلاك حتى تاريخ" : "Usage recorded through"}
                                          <input
                                            type="date"
                                            value={leaveUsageThroughDate}
                                            max={currentRiyadhDate()}
                                            min={`${currentRiyadhDate().slice(0, 4)}-01-01`}
                                            onChange={(event) => setLeaveUsageThroughDate(event.target.value)}
                                            className={inputClass}
                                            disabled={leaveUsageLoading || leaveUsageSaving}
                                          />
                                        </label>

                                        {leaveUsageLoading ? (
                                          <p className="text-sm text-[var(--text-secondary)]">{isArabic ? "جارٍ تحميل الأرصدة..." : "Loading leave usage..."}</p>
                                        ) : (
                                          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                                            {LEAVE_USAGE_TYPES.map((type) => {
                                              const labels: Record<LeaveUsageType, { ar: string; en: string }> = {
                                                annual: { ar: "سنوية", en: "Annual" },
                                                sick: { ar: "مرضية", en: "Sick" },
                                                emergency: { ar: "طارئة", en: "Emergency" },
                                                unpaid: { ar: "بدون راتب", en: "Unpaid" },
                                                maternity: { ar: "أمومة", en: "Maternity" },
                                              };
                                              return (
                                                <label key={type} className={labelClass}>
                                                  {isArabic ? labels[type].ar : labels[type].en}
                                                  <input
                                                    type="number"
                                                    min="0"
                                                    max="366"
                                                    step="0.01"
                                                    value={leaveUsage[type]}
                                                    onChange={(event) => setLeaveUsage((current) => ({ ...current, [type]: event.target.value }))}
                                                    className={inputClass}
                                                    disabled={leaveUsageSaving}
                                                  />
                                                </label>
                                              );
                                            })}
                                          </div>
                                        )}

                                        {leaveUsageError && <p role="alert" className="text-sm font-bold text-rose-600">{leaveUsageError}</p>}
                                        {leaveUsageNotice && <p role="status" className="text-sm font-bold text-emerald-700">{leaveUsageNotice}</p>}
                                        <div className="flex justify-end">
                                          <button
                                            type="button"
                                            onClick={() => void savePreviousLeaveUsage()}
                                            disabled={leaveUsageLoading || leaveUsageSaving}
                                            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[var(--brand-primary)] px-4 text-sm font-black text-[var(--brand-primary)] transition hover:bg-[var(--brand-subtle)] disabled:cursor-not-allowed disabled:opacity-50"
                                          >
                                            {leaveUsageSaving && <LoaderCircle size={15} className="animate-spin" />}
                                            {leaveUsageSaving
                                              ? (isArabic ? "جارٍ حفظ الاستهلاك..." : "Saving usage...")
                                              : (isArabic ? "حفظ استهلاك الإجازات" : "Save leave usage")}
                                          </button>
                                        </div>
                                      </section>
                                    )}

                                    {formError && (
                                      <div
                                        role="alert"
                                        className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700"
                                      >
                                        {formError}
                                      </div>
                                    )}

                                    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                                      <button
                                        type="button"
                                        onClick={closeForm}
                                        disabled={saving}
                                        className="inline-flex h-11 items-center justify-center rounded-xl border border-[var(--border-default)] bg-[var(--surface)] px-5 text-sm font-black text-[var(--text-secondary)] transition hover:border-[var(--brand-primary)] hover:bg-[var(--brand-subtle)] disabled:cursor-not-allowed disabled:opacity-50"
                                      >
                                        {copy.cancel}
                                      </button>
                                      <button
                                        type="submit"
                                        disabled={saving}
                                        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[var(--brand-primary)] px-6 text-sm font-black text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                                      >
                                        {saving && <LoaderCircle size={16} className="animate-spin" />}
                                        {saving ? copy.saving : copy.save}
                                      </button>
                                    </div>
                                  </form>
                                </div>
                              </td>
                            </tr>
                          )}
                        </Fragment>
                      );
                    })}
                  </tbody>
                </table>

                {filteredRows.length === 0 && (
                  <div className="px-4 py-14 text-center text-sm font-bold text-[var(--text-secondary)]">
                    {copy.noEmployees}
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}