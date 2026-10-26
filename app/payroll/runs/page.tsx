"use client";

import { useMemo, useState, Fragment } from "react";
import { useLocalization } from "@/components/localization/LocalizationContext";
import {
  CalendarDays,
  LoaderCircle,
  Download,
  Plus,
  ShieldCheck,
  UserMinus,
  UsersRound,
  Wallet,
  Pencil,
  X,
  Save,
  RefreshCw,
} from "lucide-react";

type Run = {
  id: string;
  period_start: string;
  period_end: string;
  status: string;
};

type RunItem = {
  id: string;
  employee_id: string;
  employee_number: string | null;
  full_name: string | null;
  is_saudi: boolean | null;
  basic_salary: number | string;
  housing_allowance: number | string;
  other_allowances: number | string;
  unpaid_leave_days: number | string;
  gosi_deduction: number | string;
  absence_deduction: number | string;
  attendance_deduction: number | string;
  holiday_overtime_hours: number | string;
  holiday_overtime_days: number | string;
  holiday_overtime_amount: number | string;
  other_deductions: number | string;
  net_salary: number | string;
};

type MissingEmployee = {
  id: string;
  employee_number: string;
  full_name: string;
};

type ErrorDetails = {
  message?: string | null;
  code?: string | null;
  hint?: string | null;
  details?: string | null;
};

const num = (value: unknown): number => {
  const n = Number(value ?? 0);
  return Number.isFinite(n) ? n : 0;
};

const round2 = (n: number): number => Math.round((n + Number.EPSILON) * 100) / 100;

function currentMonthKey(): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Riyadh",
    year: "numeric",
    month: "2-digit",
  }).formatToParts(new Date());

  const year = parts.find((p) => p.type === "year")?.value ?? "";
  const month = parts.find((p) => p.type === "month")?.value ?? "";
  return `${year}-${month}`;
}

function monthLabel(key: string, isArabic: boolean): string {
  const [y, m] = key.split("-").map(Number);
  if (!y || !m) return key;
  return new Intl.DateTimeFormat(isArabic ? "ar-SA-u-ca-gregory" : "en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(y, m - 1, 1)));
}

/* ------------------------------ styles ------------------------------ */

const secondaryBtn =
  "inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[var(--border-default)] bg-[var(--surface)] px-4 text-xs font-black text-[var(--brand-primary)] transition hover:border-[var(--brand-primary)] hover:bg-[var(--brand-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";
const editInputCls =
  "mt-1 block h-11 w-full rounded-xl border border-[var(--border-default)] bg-[var(--background)] px-3 text-sm font-bold text-[var(--text-primary)] outline-none transition focus:border-[var(--brand-primary)] focus:bg-[var(--surface)]";

export default function PayrollRunsPage() {
  const { locale } = useLocalization();
  const isArabic = locale === "ar";

  const [month, setMonth] = useState<string>(currentMonthKey());
  const [creating, setCreating] = useState(false);
  const [run, setRun] = useState<Run | null>(null);
  const [items, setItems] = useState<RunItem[]>([]);
  const [error, setError] = useState("");
  const [errorDetails, setErrorDetails] = useState<ErrorDetails | null>(null);
  const [notice, setNotice] = useState("");
  const [missing, setMissing] = useState<MissingEmployee[]>([]);

  // States الخاصة بالتعديل اليدوي
  const [editingItem, setEditingItem] = useState<RunItem | null>(null);
  const [itemForm, setItemForm] = useState({ other_allowances: 0, unpaid_leave_days: 0, other_deductions: 0 });
  const [savingItem, setSavingItem] = useState(false);

  const copy = isArabic
    ? {
        badge: "PAYROLL",
        badgeSub: "مسيرات الرواتب",
        heroText: "أنشئ مسير الرواتب الشهري كمسودة، وراجع حسابات كل موظف وخصومات الحضور والتأمينات قبل الاعتماد النهائي.",
        chips: ["مسودة قابلة للتعديل", "خصومات الحضور المعتمدة", "اعتماد نهائي"],
        kpiEmployeesNote: "موظفون ضمن المسير",
        kpiGrossNote: "قبل الخصومات",
        kpiDeductionsNote: "غياب + تأخير + تأمينات + أخرى",
        kpiNetNote: "بعد جميع الخصومات",
        statusApproved: "معتمد",
        clickToEdit: "انقر للتعديل اليدوي",
        title: "مسيرات الرواتب",
        subtitle: "أنشئ مسير رواتب شهري كمسودة وراجع حسابات الموظفين قبل الاعتماد.",
        monthLabel: "شهر المسير",
        create: "إنشاء مسير رواتب",
        creating: "جارٍ العمل...",
        created: "المسودة جاهزة. يمكنك الآن مراجعة وتعديل الرواتب.",
        existing: "يوجد مسير لهذا الشهر مسبقًا، تم عرضه أدناه.",
        createError: "تعذر إجراء العملية.",
        loadError: "تعذر تحميل المسير.",
        missingTitle: "أكمل بيانات هؤلاء الموظفين ثم أعد المحاولة:",
        technical: "تفاصيل تقنية",
        statusDraft: "مسودة",
        period: "الفترة",
        kpiEmployees: "عدد الموظفين",
        kpiGross: "إجمالي الرواتب",
        kpiDeductions: "إجمالي الخصومات",
        kpiNet: "صافي الرواتب",
        colNumber: "الرقم الوظيفي",
        colName: "الموظف",
        colNationality: "الجنسية",
        saudi: "سعودي",
        nonSaudi: "غير سعودي",
        colBasic: "الأساسي",
        colHousing: "السكن",
        colOther: "بدلات أخرى",
        colGross: "الإجمالي",
        colUnpaid: "أيام الغياب",
        colAbsence: "خصم الغياب",
        colAttendance: "خصم التأخير",
        colHolidayOvertimeHours: "أيام إضافي العطلة",
        colHolidayOvertime: "إضافي العطلة",
        colGosi: "التأمينات",
        colOtherDed: "خصومات أخرى",
        colNet: "الصافي",
        totals: "الإجمالي",
        empty: "اختر الشهر ثم اضغط إنشاء مسير الرواتب.",
        currency: "ر.س",
        hint: "المبالغ محسوبة تلقائيًا. يمكنك التعديل يدوياً بالضغط على صف الموظف (طالما المسير مسودة).",
        approveConfirm: "هل أنت متأكد من اعتماد المسير؟ لن تتمكن من تعديله بعد الاعتماد.",
        approveSuccess: "تم اعتماد مسير الرواتب بنجاح!",
        btnApprove: "اعتماد المسير نهائياً",
        btnDownload: "تحميل Excel",
        editTitle: "تعديل راتب الموظف",
        cancel: "إلغاء",
        saveChanges: "حفظ التعديلات",
        recreateConfirm: "هل أنت متأكد من إعادة إنشاء المسير؟ سيتم مسح أي تعديلات يدوية أجريتها وتحديثه بناءً على أحدث البيانات للموظفين.",
        btnRecreate: "إعادة الإنشاء والتحديث",
        recreateSuccess: "تم إعادة إنشاء المسير بنجاح بناءً على أحدث البيانات.",
      }
    : {
        badge: "PAYROLL",
        badgeSub: "Payroll runs",
        heroText: "Create the monthly payroll as a draft, and review each employee's calculation, attendance deductions and GOSI before the final approval.",
        chips: ["Editable draft", "Approved attendance deductions", "Final approval"],
        kpiEmployeesNote: "Employees in this run",
        kpiGrossNote: "Before deductions",
        kpiDeductionsNote: "Absence + late + GOSI + other",
        kpiNetNote: "After all deductions",
        statusApproved: "Approved",
        clickToEdit: "Click to edit manually",
        title: "Payroll Runs",
        subtitle: "Create a monthly payroll run as a draft and review employee calculations before approval.",
        monthLabel: "Payroll month",
        create: "Create payroll run",
        creating: "Processing...",
        created: "Draft is ready. You can now review and edit the payroll.",
        existing: "A payroll run already exists for this month. It is shown below.",
        createError: "Unable to process request.",
        loadError: "Unable to load the payroll run.",
        missingTitle: "Complete these employees' data, then try again:",
        technical: "Technical details",
        statusDraft: "Draft",
        period: "Period",
        kpiEmployees: "Employees",
        kpiGross: "Gross payroll",
        kpiDeductions: "Total deductions",
        kpiNet: "Net payroll",
        colNumber: "Employee no.",
        colName: "Employee",
        colNationality: "Nationality",
        saudi: "Saudi",
        nonSaudi: "Non-Saudi",
        colBasic: "Basic",
        colHousing: "Housing",
        colOther: "Other allow.",
        colGross: "Gross",
        colUnpaid: "Unpaid days",
        colAbsence: "Absence ded.",
        colAttendance: "Late ded.",
        colHolidayOvertimeHours: "Holiday OT days",
        colHolidayOvertime: "Holiday OT amount",
        colGosi: "GOSI",
        colOtherDed: "Other ded.",
        colNet: "Net",
        totals: "Totals",
        empty: "Pick a month, then press Create payroll run.",
        currency: "SAR",
        hint: "Amounts are calculated automatically. You can edit manually by clicking on an employee's row (while in draft).",
        approveConfirm: "Are you sure you want to approve this run? It cannot be edited afterwards.",
        approveSuccess: "Payroll run approved successfully!",
        btnApprove: "Approve Payroll",
        btnDownload: "Download Excel",
        editTitle: "Edit Employee Payroll",
        cancel: "Cancel",
        saveChanges: "Save Changes",
        recreateConfirm: "Are you sure you want to recreate the run? Any manual edits will be lost and it will be updated based on current employee data.",
        btnRecreate: "Recreate & Update",
        recreateSuccess: "Payroll run recreated successfully based on latest data.",
      };

  const formatMoney = (value: number) =>
    value.toLocaleString(isArabic ? "ar-SA-u-nu-latn" : "en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const statusLabel = (status: string) => (status === "draft" ? copy.statusDraft : status);

  async function readJson(response: Response) {
    return response.json().catch(() => ({}));
  }

  async function loadRun(id: string) {
    const response = await fetch(`/api/payroll/runs/${id}`, { cache: "no-store" });
    const payload = await readJson(response);

    if (!response.ok) throw new Error(payload.error ?? copy.loadError);

    setRun(payload.run as Run);
    setItems((payload.items ?? []) as RunItem[]);
  }

  async function handleCreate() {
    setError("");
    setErrorDetails(null);
    setNotice("");
    setMissing([]);
    setCreating(true);

    try {
      const response = await fetch("/api/payroll/runs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ month }),
      });
      const payload = await readJson(response);

      if (response.status === 409 && payload.runId) {
        await loadRun(payload.runId as string);
        setNotice(copy.existing);
        return;
      }

      if (!response.ok) {
        if (Array.isArray(payload.employees)) setMissing(payload.employees as MissingEmployee[]);
        if (payload.details) setErrorDetails(payload.details as ErrorDetails);
        throw new Error(payload.error ?? copy.createError);
      }

      setRun(payload.run as Run);
      setItems((payload.items ?? []) as RunItem[]);
      setNotice(copy.created);
    } catch (err) {
      setError(err instanceof Error ? err.message : copy.createError);
    } finally {
      setCreating(false);
    }
  }

  async function handleRecreate() {
    if (!run || run.status !== "draft") return;
    if (!window.confirm(copy.recreateConfirm)) return;

    setCreating(true);
    setError("");
    setNotice("");
    setMissing([]);
    setEditingItem(null);

    const runMonth = run.period_start.slice(0, 7);

    try {
      const delRes = await fetch(`/api/payroll/runs/${run.id}`, { method: "DELETE" });
      const delPayload = await readJson(delRes);
      if (!delRes.ok) throw new Error(delPayload.error ?? copy.createError);

      const createRes = await fetch("/api/payroll/runs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ month: runMonth }),
      });
      const createPayload = await readJson(createRes);

      if (!createRes.ok) {
        if (Array.isArray(createPayload.employees)) setMissing(createPayload.employees as MissingEmployee[]);
        if (createPayload.details) setErrorDetails(createPayload.details as ErrorDetails);
        setRun(null);
        setItems([]);
        throw new Error(createPayload.error ?? copy.createError);
      }

      setRun(createPayload.run as Run);
      setItems((createPayload.items ?? []) as RunItem[]);
      setNotice(copy.recreateSuccess);
    } catch (err) {
      setError(err instanceof Error ? err.message : copy.createError);
    } finally {
      setCreating(false);
    }
  }

  async function handleApprove() {
    if (!run || !window.confirm(copy.approveConfirm)) return;

    setCreating(true);
    try {
      const response = await fetch(`/api/payroll/runs/${run.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "approved" }),
      });

      const payload = await readJson(response);
      if (!response.ok) throw new Error(payload.error ?? copy.createError);

      setRun({ ...run, status: "approved" });
      setNotice(copy.approveSuccess);
      setEditingItem(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : copy.createError);
    } finally {
      setCreating(false);
    }
  }

  function downloadCSV() {
    if (!items.length) return;
    const headers = isArabic
      ? ["الرقم الوظيفي", "الموظف", "الراتب الأساسي", "بدل السكن", "بدلات أخرى", "أيام الغياب", "خصم الغياب", "خصم التأخير", "إضافي العطلة", "أيام إضافي العطلة", "التأمينات", "خصومات أخرى", "الصافي"]
      : ["Employee No", "Name", "Basic", "Housing", "Other Allowances", "Unpaid Days", "Absence Ded", "Late Ded", "Holiday Overtime", "Holiday Overtime Days", "GOSI", "Other Ded", "Net Salary"];

    const csvRows = items.map(item => [
      item.employee_number || "—",
      item.full_name || "—",
      num(item.basic_salary),
      num(item.housing_allowance),
      num(item.other_allowances),
      num(item.unpaid_leave_days),
      num(item.absence_deduction),
      num(item.attendance_deduction),
      num(item.holiday_overtime_amount),
      num(item.holiday_overtime_days),
      num(item.gosi_deduction),
      num(item.other_deductions),
      num(item.net_salary)
    ].join(","));

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + headers.join(",") + "\n" + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Payroll_Run_${run?.period_start}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function toggleEditItem(item: RunItem) {
    if (run?.status !== "draft") return;
    if (editingItem?.id === item.id) {
      setEditingItem(null);
    } else {
      setEditingItem(item);
      setItemForm({
        other_allowances: num(item.other_allowances),
        unpaid_leave_days: num(item.unpaid_leave_days),
        other_deductions: num(item.other_deductions),
      });
    }
  }

  async function handleSaveItemDetails(liveAbsence: number, liveNet: number) {
    if (!editingItem || !run) return;
    setSavingItem(true);
    setError("");

    try {
      const response = await fetch(`/api/payroll/runs/${run.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_item",
          itemId: editingItem.id,
          data: {
            other_allowances: itemForm.other_allowances,
            unpaid_leave_days: itemForm.unpaid_leave_days,
            other_deductions: itemForm.other_deductions,
            absence_deduction: liveAbsence,
            net_salary: liveNet,
          }
        }),
      });

      const payload = await readJson(response);
      if (!response.ok) throw new Error(payload.error ?? copy.createError);

      setItems(prevItems => prevItems.map(it => it.id === editingItem.id ? { ...it, ...payload.item } : it));
      setEditingItem(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : copy.createError);
    } finally {
      setSavingItem(false);
    }
  }

  // ✅ تم تحديث الحسابات لتشمل الخصم الجديد
  const totals = useMemo(() => {
    const sum = items.reduce(
      (acc, item) => {
        const gross = num(item.basic_salary) + num(item.housing_allowance) + num(item.other_allowances);
        return {
          basic: acc.basic + num(item.basic_salary),
          housing: acc.housing + num(item.housing_allowance),
          other: acc.other + num(item.other_allowances),
          gross: acc.gross + gross + num(item.holiday_overtime_amount),
          unpaid: acc.unpaid + num(item.unpaid_leave_days),
          absence: acc.absence + num(item.absence_deduction),
          attendance: acc.attendance + num(item.attendance_deduction),
          gosi: acc.gosi + num(item.gosi_deduction),
          otherDed: acc.otherDed + num(item.other_deductions),
          net: acc.net + num(item.net_salary),
        };
      },
      { basic: 0, housing: 0, other: 0, gross: 0, unpaid: 0, absence: 0, attendance: 0, gosi: 0, otherDed: 0, net: 0 },
    );

    return {
      basic: round2(sum.basic),
      housing: round2(sum.housing),
      other: round2(sum.other),
      gross: round2(sum.gross),
      unpaid: sum.unpaid,
      absence: round2(sum.absence),
      attendance: round2(sum.attendance),
      gosi: round2(sum.gosi),
      otherDed: round2(sum.otherDed),
      net: round2(sum.net),
      deductions: round2(sum.absence + sum.attendance + sum.gosi + sum.otherDed),
    };
  }, [items]);

  // ✅ إضافة عنوان "خصم التأخير"
  const headings = [
    copy.colNumber,
    copy.colName,
    copy.colNationality,
    copy.colBasic,
    copy.colHousing,
    copy.colOther,
    copy.colGross,
    copy.colUnpaid,
    copy.colAbsence,
    copy.colAttendance,
    copy.colHolidayOvertimeHours,
    copy.colHolidayOvertime,
    copy.colGosi,
    copy.colOtherDed,
    copy.colNet,
  ];

  const kpis = [
    { code: "EMP", label: copy.kpiEmployees, value: String(items.length), note: copy.kpiEmployeesNote, icon: <UsersRound size={16} /> },
    { code: "GRS", label: copy.kpiGross, value: `${formatMoney(totals.gross)} ${copy.currency}`, note: copy.kpiGrossNote, icon: <Wallet size={16} /> },
    { code: "DED", label: copy.kpiDeductions, value: `${formatMoney(totals.deductions)} ${copy.currency}`, note: copy.kpiDeductionsNote, icon: <UserMinus size={16} /> },
    { code: "NET", label: copy.kpiNet, value: `${formatMoney(totals.net)} ${copy.currency}`, note: copy.kpiNetNote, icon: <ShieldCheck size={16} /> },
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
          <div className="px-6 py-7 md:px-8 lg:py-8">
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
        </section>

        {/* --------------------------- Create panel --------------------------- */}
        <section className="mt-5 overflow-hidden rounded-[24px] border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-small)]">
          <div className="flex flex-col gap-4 bg-[var(--surface-muted)] p-4 sm:flex-row sm:items-end sm:p-5">
            <label className="block text-xs font-black text-[var(--text-secondary)]">
              {copy.monthLabel}
              <input
                type="month"
                value={month}
                onChange={(event) => setMonth(event.target.value)}
                disabled={creating}
                dir="ltr"
                className="mt-1 block h-11 w-full rounded-xl border border-[var(--border-default)] bg-[var(--background)] px-3 text-sm font-bold text-[var(--text-primary)] outline-none transition focus:border-[var(--brand-primary)] focus:bg-[var(--surface)] disabled:opacity-60 sm:w-56"
              />
            </label>
            <button
              onClick={handleCreate}
              disabled={creating}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[var(--brand-primary)] px-5 text-sm font-black text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {creating ? <LoaderCircle size={18} className="animate-spin" /> : <Plus size={18} />}
              {copy.create}
            </button>
          </div>

          {(error || notice || missing.length > 0) && (
            <div className="space-y-3 border-t border-[var(--border-default)] p-4 sm:p-5">
              {error && (
                <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                  <span className="font-black">{error}</span>
                  {errorDetails && (
                    <div className="mt-2 text-xs">
                      <p className="font-black">{copy.technical}:</p>
                      <pre className="mt-1 max-h-32 overflow-auto rounded-lg bg-rose-100/60 p-2 text-left" dir="ltr">
                        {JSON.stringify(errorDetails, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}

              {notice && (
                <div role="status" className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm font-bold text-blue-800">
                  {notice}
                </div>
              )}

              {missing.length > 0 && (
                <div className="rounded-xl border border-amber-300 bg-amber-50 p-4">
                  <h3 className="mb-2 text-sm font-black text-amber-900">{copy.missingTitle}</h3>
                  <ul className="list-inside list-disc text-sm font-bold text-amber-800">
                    {missing.map((emp) => (
                      <li key={emp.id}>
                        <span className="font-mono text-xs">{emp.employee_number}</span> - {emp.full_name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </section>

        {/* ------------------------------ Empty ------------------------------ */}
        {!run && (
          <section className="mt-5 flex min-h-48 flex-col items-center justify-center gap-3 rounded-[28px] border border-dashed border-[var(--border-default)] bg-[var(--surface)] p-8 text-center shadow-[var(--shadow-small)]">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand-subtle)] text-[var(--brand-primary)]">
              <CalendarDays size={22} />
            </span>
            <p className="text-sm font-bold text-[var(--text-secondary)]">{copy.empty}</p>
          </section>
        )}

        {run && (
          <>
            {/* ------------------------------- KPIs ------------------------------- */}
            <section className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {kpis.map((kpi) => (
                <article
                  key={kpi.code}
                  className="group relative overflow-hidden rounded-2xl border border-[var(--border-default)] bg-[var(--surface)] p-5 shadow-[var(--shadow-small)] transition duration-200 hover:-translate-y-0.5 hover:border-[var(--brand-primary)] hover:shadow-[var(--shadow-medium)]"
                >
                  <div className="absolute inset-x-0 top-0 h-0.5 origin-start scale-x-0 bg-[var(--brand-primary)] transition-transform duration-200 group-hover:scale-x-100" />
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-xs font-black text-[var(--text-muted)]">{kpi.label}</p>
                      <h2 className="mt-3 break-words text-xl font-black tracking-tight md:text-2xl">{kpi.value}</h2>
                    </div>
                    <span className="flex h-9 min-w-9 shrink-0 items-center justify-center gap-1 rounded-xl border border-[var(--border-default)] bg-[var(--surface-muted)] px-2 text-[10px] font-black text-[var(--brand-primary)]">
                      {kpi.icon}
                    </span>
                  </div>
                  <div className="mt-4 border-t border-[var(--border-default)] pt-3">
                    <p className="text-[11px] font-bold text-[var(--text-secondary)]">{kpi.note}</p>
                  </div>
                </article>
              ))}
            </section>

            {/* ------------------------------ Table ------------------------------ */}
            <section className="mt-5 overflow-hidden rounded-[24px] border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-small)]">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-default)] bg-[var(--surface-muted)] px-4 py-4 sm:px-5">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-base font-black">
                    {monthLabel(run.period_start.slice(0, 7), isArabic)}
                  </h2>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-black ${
                      run.status === "approved" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {run.status === "approved" ? copy.statusApproved : statusLabel(run.status)}
                  </span>
                  <span className="text-[11px] font-bold text-[var(--text-secondary)]" dir="ltr">
                    {copy.period}: {run.period_start} → {run.period_end}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {run.status === "approved" && (
                    <button
                      onClick={downloadCSV}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-emerald-600 bg-emerald-50 px-4 text-xs font-black text-emerald-700 transition hover:bg-emerald-100"
                    >
                      <Download size={16} /> {copy.btnDownload}
                    </button>
                  )}
                  {run.status === "draft" && (
                    <>
                      <button onClick={() => void handleRecreate()} disabled={creating} className={secondaryBtn}>
                        {creating ? <LoaderCircle size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                        {copy.btnRecreate}
                      </button>
                      <button
                        onClick={() => void handleApprove()}
                        disabled={creating}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[var(--brand-primary)] px-4 text-xs font-black text-white transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {creating ? <LoaderCircle size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
                        {copy.btnApprove}
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[1200px] text-start text-sm">
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
                    {items.map((item) => {
                      const gross = num(item.basic_salary) + num(item.housing_allowance) + num(item.other_allowances);
                      const unpaid = num(item.unpaid_leave_days);
                      const isEditing = editingItem?.id === item.id;

                      const liveGross = num(item.basic_salary) + num(item.housing_allowance) + num(itemForm.other_allowances);
                      const liveAbsence = round2((liveGross / 30) * num(itemForm.unpaid_leave_days));
                      // ✅ تحديث الحسبة التلقائية لكي تأخذ بالاعتبار التأخير
                      const liveNet = round2(liveGross - liveAbsence - num(item.attendance_deduction) - num(item.gosi_deduction) - num(itemForm.other_deductions) + num(item.holiday_overtime_amount));

                      return (
                        <Fragment key={item.id}>
                          <tr
                            onClick={() => toggleEditItem(item)}
                            className={`transition ${
                              run.status === "draft" ? "cursor-pointer hover:bg-[var(--surface-muted)]" : ""
                            } ${isEditing ? "bg-[var(--brand-subtle)]" : ""}`}
                            title={run.status === "draft" ? copy.clickToEdit : ""}
                          >
                            <td className="whitespace-nowrap px-4 py-3.5 font-bold text-[var(--text-secondary)]">
                              {item.employee_number ?? "—"}
                            </td>
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-2 font-black">
                                {item.full_name ?? "—"}
                                {run.status === "draft" && !isEditing && (
                                  <Pencil size={12} className="text-[var(--text-muted)]" />
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3.5">
                              <span className="inline-flex rounded-full bg-[var(--surface-muted)] px-2.5 py-1 text-[11px] font-black text-[var(--text-secondary)]">
                                {item.is_saudi === true ? copy.saudi : item.is_saudi === false ? copy.nonSaudi : "—"}
                              </span>
                            </td>
                            <td className="whitespace-nowrap px-4 py-3.5">{formatMoney(num(item.basic_salary))}</td>
                            <td className="whitespace-nowrap px-4 py-3.5">{formatMoney(num(item.housing_allowance))}</td>
                            <td className={`whitespace-nowrap px-4 py-3.5 ${isEditing ? "font-black text-[var(--brand-primary)]" : ""}`}>
                              {isEditing ? formatMoney(num(itemForm.other_allowances)) : formatMoney(num(item.other_allowances))}
                            </td>
                            <td className="whitespace-nowrap px-4 py-3.5 font-black">
                              {isEditing ? formatMoney(liveGross) : formatMoney(round2(gross))}
                            </td>
                            <td className="px-4 py-3.5">
                              {isEditing ? (
                                <span className="inline-flex rounded-full bg-rose-100 px-2.5 py-1 text-[11px] font-black text-rose-800">
                                  {itemForm.unpaid_leave_days}
                                </span>
                              ) : unpaid > 0 ? (
                                <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-black text-amber-800">
                                  {unpaid}
                                </span>
                              ) : (
                                <span className="font-bold text-[var(--text-muted)]">0</span>
                              )}
                            </td>
                            <td className={`whitespace-nowrap px-4 py-3.5 text-rose-600 ${isEditing ? "font-black" : "font-bold"}`}>
                              {isEditing ? formatMoney(liveAbsence) : formatMoney(num(item.absence_deduction))}
                            </td>

                            {/* ✅ العمود الجديد الخاص بخصم التأخير */}
                            <td className="whitespace-nowrap px-4 py-3.5 font-bold text-rose-600">
                              {formatMoney(num(item.attendance_deduction))}
                            </td>
                            <td className="whitespace-nowrap px-4 py-3.5 font-bold text-emerald-700">
                              {num(item.holiday_overtime_days).toFixed(2)}
                            </td>
                            <td className="whitespace-nowrap px-4 py-3.5 font-black text-emerald-700">
                              {formatMoney(num(item.holiday_overtime_amount))}
                            </td>

                            <td className="whitespace-nowrap px-4 py-3.5 font-bold text-rose-600">
                              {formatMoney(num(item.gosi_deduction))}
                            </td>
                            <td className={`whitespace-nowrap px-4 py-3.5 text-rose-600 ${isEditing ? "font-black" : "font-bold"}`}>
                              {isEditing ? formatMoney(num(itemForm.other_deductions)) : formatMoney(num(item.other_deductions))}
                            </td>
                            <td
                              className={`whitespace-nowrap px-4 py-3.5 font-black ${
                                isEditing ? "text-[var(--brand-primary)]" : "text-emerald-700"
                              }`}
                            >
                              {isEditing ? formatMoney(liveNet) : formatMoney(num(item.net_salary))}
                            </td>
                          </tr>

                          {isEditing && (
                            <tr>
                              <td colSpan={headings.length} className="p-0">
                                <div className="border-y border-[var(--brand-primary)]/20 bg-[var(--surface-muted)] p-4 sm:p-6">
                                  <div className="mb-4 flex items-center justify-between">
                                    <h3 className="text-sm font-black">{copy.editTitle}</h3>
                                    <button
                                      onClick={(e) => { e.stopPropagation(); setEditingItem(null); }}
                                      className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--text-secondary)] transition hover:bg-[var(--surface)]"
                                    >
                                      <X size={18} />
                                    </button>
                                  </div>
                                  <div className="grid gap-4 sm:grid-cols-3">
                                    <label className="block text-xs font-black text-[var(--text-secondary)]">
                                      {copy.colOther}
                                      <input type="number" min="0" step="1" dir="ltr" className={editInputCls} value={itemForm.other_allowances} onChange={(e) => setItemForm({ ...itemForm, other_allowances: Number(e.target.value) })} onClick={(e) => e.stopPropagation()} />
                                    </label>
                                    <label className="block text-xs font-black text-[var(--text-secondary)]">
                                      {copy.colUnpaid}
                                      <input type="number" min="0" step="1" dir="ltr" className={editInputCls} value={itemForm.unpaid_leave_days} onChange={(e) => setItemForm({ ...itemForm, unpaid_leave_days: Number(e.target.value) })} onClick={(e) => e.stopPropagation()} />
                                    </label>
                                    <label className="block text-xs font-black text-[var(--text-secondary)]">
                                      {copy.colOtherDed}
                                      <input type="number" min="0" step="1" dir="ltr" className={editInputCls} value={itemForm.other_deductions} onChange={(e) => setItemForm({ ...itemForm, other_deductions: Number(e.target.value) })} onClick={(e) => e.stopPropagation()} />
                                    </label>
                                  </div>
                                  <div className="mt-5 flex justify-end gap-3">
                                    <button
                                      onClick={(e) => { e.stopPropagation(); setEditingItem(null); }}
                                      className="inline-flex h-11 items-center justify-center rounded-xl border border-[var(--border-default)] bg-[var(--surface)] px-5 text-sm font-black text-[var(--text-secondary)] transition hover:border-[var(--brand-primary)] hover:bg-[var(--brand-subtle)]"
                                    >
                                      {copy.cancel}
                                    </button>
                                    <button
                                      onClick={(e) => { e.stopPropagation(); handleSaveItemDetails(liveAbsence, liveNet); }}
                                      disabled={savingItem}
                                      className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[var(--brand-primary)] px-5 text-sm font-black text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                      {savingItem ? <LoaderCircle size={16} className="animate-spin" /> : <Save size={16} />}
                                      {copy.saveChanges}
                                    </button>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </Fragment>
                      );
                    })}
                  </tbody>

                  <tfoot className="border-t-2 border-[var(--border-default)] bg-[var(--surface-muted)] font-black">
                    <tr>
                      <td colSpan={3} className="px-4 py-3.5">{copy.totals}</td>
                      <td className="whitespace-nowrap px-4 py-3.5">{formatMoney(totals.basic)}</td>
                      <td className="whitespace-nowrap px-4 py-3.5">{formatMoney(totals.housing)}</td>
                      <td className="whitespace-nowrap px-4 py-3.5">{formatMoney(totals.other)}</td>
                      <td className="whitespace-nowrap px-4 py-3.5">{formatMoney(totals.gross)}</td>
                      <td className="px-4 py-3.5">{totals.unpaid}</td>
                      <td className="whitespace-nowrap px-4 py-3.5 text-rose-600">{formatMoney(totals.absence)}</td>
                      <td className="whitespace-nowrap px-4 py-3.5 text-rose-600">{formatMoney(totals.attendance)}</td> {/* ✅ إجمالي التأخير */}
                      <td className="whitespace-nowrap px-4 py-3.5 text-rose-600">{formatMoney(totals.gosi)}</td>
                      <td className="whitespace-nowrap px-4 py-3.5 text-rose-600">{formatMoney(totals.otherDed)}</td>
                      <td className="whitespace-nowrap px-4 py-3.5 text-emerald-700">{formatMoney(totals.net)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <p className="border-t border-[var(--border-default)] px-4 py-3 text-[11px] font-bold text-[var(--text-muted)] sm:px-5">
                {copy.hint}
              </p>
            </section>
          </>
        )}
      </div>
    </main>
  );
}