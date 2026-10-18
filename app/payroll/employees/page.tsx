"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent, Fragment } from "react";
import { useLocalization } from "@/components/localization/LocalizationContext";
import {
  Search,
  Pencil,
  X,
  UsersRound,
  RefreshCw,
  LoaderCircle,
  UserRound,
  ClipboardList,
} from "lucide-react";

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
  "contract_end_date",
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
  const allRequiredKeys = [...REQUIRED_TEXT, ...MONEY_FIELDS] as (keyof PayrollEmployee)[];
  return allRequiredKeys.some((key) => {
    const val = p[key];
    return val === null || val === undefined || String(val).trim() === "";
  });
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
    basic_salary: p?.basic_salary ? String(p.basic_salary) : "",
    housing_allowance: p?.housing_allowance ? String(p.housing_allowance) : "",
    other_allowances: p?.other_allowances ? String(p.other_allowances) : "",
    deductions: p?.deductions ? String(p.deductions) : "",
    bank_name: p?.bank_name ?? "",
    iban: p?.iban ?? "",
  };
}

type StatusFilter = "all" | "active" | "inactive" | "incomplete";

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

  const copy = isArabic
    ? {
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
        formHint: "يمكنك حفظ البيانات المتوفرة لديك الآن وإكمال الباقي لاحقاً.", // تعديل النص للتوضيح
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
        iban: "رقم IBAN",
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
        missing: "بيانات غير مكتملة", // تعديل التسمية
      }
    : {
        // ... (Same English translation adjustments as above)
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
      if (!response.ok) throw new Error(payload.error ?? copy.loadError);

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
      setLoadError(error instanceof Error ? error.message : copy.loadError);
      setLoadState("error");
    }
  }, [copy.loadError]);

  useEffect(() => {
    void loadEmployees();
  }, [loadEmployees]);

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
      setFormError("");
    }
  }

  function closeForm() {
    if (saving) return;
    setEditingRow(null);
    setFormError("");
  }

  function updateField<K extends keyof EmployeeForm>(key: K, value: EmployeeForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingRow) return;

    setFormError("");
    setNotice("");

    // التحقق المالي فقط إذا كان الحقل معبأً بقيمة
    const invalidMoney = MONEY_FIELDS.some((key) => {
      const val = String(form[key]).trim();
      return val !== "" && !/^\d+(?:\.\d{1,2})?$/.test(val);
    });

    if (invalidMoney) {
      setFormError(copy.invalidMoney);
      return;
    }

    // التحقق من التاريخ فقط إذا كان كلاهما موجوداً
    if (form.contract_end_date && form.contract_start_date && form.contract_end_date < form.contract_start_date) {
      setFormError(copy.invalidDates);
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
      department: form.department.trim() || null,
      contract_type: form.contract_type.trim() || null,
      bank_name: form.bank_name.trim() || null,
      iban: form.iban.trim() || null,
      status: form.status,
      hire_date: form.hire_date || null,
      date_of_birth: form.date_of_birth || null,
      contract_start_date: form.contract_start_date || null,
      contract_end_date: form.contract_end_date || null,
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

      setNotice(isEdit ? copy.saved : copy.created);
      setEditingRow(null);
      await loadEmployees();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : copy.errorSave);
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--primary)]";
  const labelClass = "block text-sm font-medium text-[var(--foreground)]";

  // قمنا بإزالة خاصية required لكي لا يمنع المتصفح الإرسال
  function field(key: keyof EmployeeForm, label: string, type = "text", dir?: "ltr") {
    return (
      <label key={key} className={labelClass}>
        {label} <span className="text-rose-500">*</span>
        <input
          className={inputClass}
          type={type}
          dir={dir}
          value={String(form[key])}
          onChange={(event) => updateField(key, event.target.value as never)}
          maxLength={500}
          step={type === "number" ? "0.01" : undefined}
          min={type === "number" ? "0" : undefined}
        />
      </label>
    );
  }

  return (
    <main dir={isArabic ? "rtl" : "ltr"} className="min-h-[calc(100vh-76px)] bg-[var(--background)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
              <UsersRound size={17} />
              <span>{copy.count}</span>
              <span className="rounded-full bg-[var(--muted)] px-2.5 py-0.5 font-semibold text-[var(--foreground)]">
                {rows.length}
              </span>
              {canManage && incompleteCount > 0 && (
                <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                  {incompleteCount} {copy.incomplete}
                </span>
              )}
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl">
              {copy.title}
            </h1>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">{copy.subtitle}</p>
          </div>

          <button
            type="button"
            onClick={() => void loadEmployees()}
            disabled={loadState === "loading"}
            className="inline-flex items-center bg-[var(--brand-primary)] justify-center gap-2 rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-medium text-[var(--foreground)]  disabled:opacity-50"
          >
            <RefreshCw size={16} />
            {copy.refresh}
          </button>
        </div>

        {notice && (
          <div role="status" className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            {notice}
          </div>
        )}

        <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
          <div className="flex flex-col gap-3 border-b border-[var(--border)] p-4 sm:flex-row sm:items-center">
            <div className="relative min-w-0 flex-1">
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={copy.search}
                className="h-11 w-full rounded-xl border border-[var(--border-default)] bg-[var(--background)] px-4 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--brand-primary)] focus:bg-[var(--surface)]"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
              className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm text-[var(--foreground)] outline-none focus:border-[var(--primary)]"
              aria-label={copy.status}
            >
              <option value="all">{copy.all}</option>
              <option value="active">{copy.active}</option>
              <option value="inactive">{copy.inactive}</option>
              <option value="incomplete">{copy.incomplete}</option>
            </select>
          </div>

          {loadState === "loading" && (
            <div className="flex items-center justify-center gap-3 px-4 py-16 text-sm text-[var(--muted-foreground)]">
              <LoaderCircle size={20} className="animate-spin" />
              {copy.loading}
            </div>
          )}

          {loadState === "error" && (
            <div role="alert" className="px-4 py-16 text-center">
              <p className="text-sm text-rose-600">{loadError || copy.loadError}</p>
              <button
                type="button"
                onClick={() => void loadEmployees()}
                className="mt-4 rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-medium"
              >
                {copy.retry}
              </button>
            </div>
          )}

          {loadState === "loaded" && (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-start text-sm">
                <thead className="bg-[var(--muted)]/50 text-[var(--muted-foreground)]">
                  <tr>
                    {[
                      copy.employee,
                      copy.number,
                      copy.job,
                      copy.department,
                      copy.phone,
                      copy.salary,
                      copy.status,
                      // ...(canManage ? [copy.actions] : []),
                    ].map((heading) => (
                      <th key={heading} scope="col" className="px-4 py-3 text-start font-semibold">
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {filteredRows.map((row) => {
                    const p = row.payroll;
                    const isEditingThis = editingRow?.key === row.key;
                    // الاعتماد على الدالة الجديدة لمعرفة ما إذا كانت البيانات غير مكتملة
                    const isCompleting = isPayrollIncomplete(p);

                    return (
                      <Fragment key={row.key}>
                        <tr
                          onClick={() => toggleRowForm(row)}
                          className={`transition ${isEditingThis ? "bg-[var(--muted)]/50" : "hover:bg-[var(--muted)]/30"} ${canManage ? "cursor-pointer" : ""}`}
                        >
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--muted)] text-[var(--foreground)]">
                                <UserRound size={18} />
                              </span>
                              <div className="min-w-0">
                                <div className="font-semibold text-[var(--foreground)]">{row.full_name || copy.none}</div>
                                <div className="mt-0.5 truncate text-xs text-[var(--muted-foreground)]" dir="ltr">
                                  {row.email ?? p?.national_id ?? copy.none}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-[var(--foreground)]">{p?.employee_number ?? copy.none}</td>
                          <td className="px-4 py-4 text-[var(--foreground)]">{p?.job_title || copy.none}</td>
                          <td className="px-4 py-4 text-[var(--foreground)]">{p?.department || copy.none}</td>
                          <td className="px-4 py-4 text-[var(--foreground)]" dir="ltr">{p?.phone || copy.none}</td>
                          <td className="whitespace-nowrap px-4 py-4 text-[var(--foreground)]">
                            {p?.basic_salary
                              ? `${Number(p.basic_salary).toLocaleString(isArabic ? "ar-SA" : "en-US", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })} ${copy.currency}`
                              : copy.none}
                          </td>
                          <td className="px-4 py-4">
                            {isCompleting ? (
                              <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800">
                                {copy.missing}
                              </span>
                            ) : (
                              <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${p?.status === "active" ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-700"}`}>
                                {p?.status === "active" ? copy.active : copy.inactive}
                              </span>
                            )}
                          </td>
                          {/* {canManage && (
                            <td className="px-4 py-4">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleRowForm(row);
                                }}
                                className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                                  !isCompleting ? "border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted)]" : "bg-[var(--primary)] text-white hover:opacity-90"
                                }`}
                              >
                                {!isCompleting ? <Pencil size={14} /> : <ClipboardList size={14} />}
                                {isEditingThis ? copy.cancel : (isCompleting ? copy.complete : copy.edit)}
                              </button>
                            </td>
                          )} */}
                        </tr>

                        {isEditingThis && (
                          <tr>
                            <td colSpan={canManage ? 8 : 7} className="p-0 border-b border-[var(--border)]">
                              <div className="bg-[var(--muted)]/10 px-4 py-6 sm:px-6 shadow-inner border-t border-[var(--border)]">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <h2 className="text-lg font-semibold text-[var(--foreground)]">
                                        {isCompleting ? copy.completeTitle : copy.editTitle}
                                      </h2>
                                      <p className="mt-1 text-xs text-[var(--muted-foreground)]">{copy.formHint}</p>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={closeForm}
                                      className="rounded-lg p-2 text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                                    >
                                      <X size={18} />
                                    </button>
                                  </div>

                                  <div className="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3">
                                    <div className="space-y-4">
                                      <h3 className="text-sm font-semibold text-[var(--foreground)] border-b border-[var(--border)] pb-2">{copy.personal}</h3>
                                      {field("employee_number", copy.employeeNumber)}
                                      {field("full_name", copy.fullName)}
                                      {field("national_id", copy.nationalId)}
                                      {field("nationality", copy.nationality)}
                                      {field("date_of_birth", copy.birthDate, "date")}
                                      {field("phone", copy.phone, "tel", "ltr")}
                                    </div>

                                    <div className="space-y-4">
                                      <h3 className="text-sm font-semibold text-[var(--foreground)] border-b border-[var(--border)] pb-2">{copy.employment}</h3>
                                      {field("job_title", copy.jobTitle)}
                                      {field("department", copy.department)}
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

                                    <div className="space-y-4">
                                      <h3 className="text-sm font-semibold text-[var(--foreground)] border-b border-[var(--border)] pb-2">{copy.payroll}</h3>
                                      {field("basic_salary", copy.basicSalary, "number")}
                                      {field("housing_allowance", copy.housing, "number")}
                                      {field("other_allowances", copy.other, "number")}
                                      {field("deductions", copy.deductions, "number")}
                                      {field("bank_name", copy.bank)}
                                      {field("iban", copy.iban, "text", "ltr")}
                                    </div>
                                  </div>

                                  {formError && (
                                    <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                                      {formError}
                                    </div>
                                  )}

                                  <div className="flex flex-col-reverse gap-2 pt-4 sm:flex-row sm:justify-end">
                                    <button
                                      type="button"
                                      onClick={closeForm}
                                      disabled={saving}
                                     className="rounded-lg border border-[var(--border-default)] px-4 py-2 text-sm font-bold"
                                    >
                                      {copy.cancel}
                                    </button>
                                    <button
                                      type="submit"
                                      disabled={saving}
                                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--brand-primary)] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50 shadow-sm"
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
                <div className="px-4 py-12 text-center text-sm text-[var(--muted-foreground)]">
                  {copy.noEmployees}
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}