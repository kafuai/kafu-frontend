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
  RefreshCw, // تمت إضافة هذه الأيقونة
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
        // نصوص ميزة إعادة الإنشاء
        recreateConfirm: "هل أنت متأكد من إعادة إنشاء المسير؟ سيتم مسح أي تعديلات يدوية أجريتها وتحديثه بناءً على أحدث البيانات للموظفين.",
        btnRecreate: "إعادة الإنشاء والتحديث",
        recreateSuccess: "تم إعادة إنشاء المسير بنجاح بناءً على أحدث البيانات.",
      }
    : {
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
        // Recreate feature texts
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

  // دالة إعادة الإنشاء والتحديث
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
      // 1. حذف المسودة القديمة
      const delRes = await fetch(`/api/payroll/runs/${run.id}`, { method: "DELETE" });
      const delPayload = await readJson(delRes);
      if (!delRes.ok) throw new Error(delPayload.error ?? copy.createError);

      // 2. إنشاء المسودة الجديدة لنفس الشهر
      const createRes = await fetch("/api/payroll/runs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ month: runMonth }),
      });
      const createPayload = await readJson(createRes);

      if (!createRes.ok) {
        if (Array.isArray(createPayload.employees)) setMissing(createPayload.employees as MissingEmployee[]);
        if (createPayload.details) setErrorDetails(createPayload.details as ErrorDetails);
        setRun(null); // مسح العرض لأن المسير القديم انحذف والجديد فشل (مثلاً بسبب بيانات ناقصة لموظف جديد)
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

  // دالة اعتماد المسير
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
      setEditingItem(null); // إغلاق أي تعديل مفتوح
    } catch (err) {
      setError(err instanceof Error ? err.message : copy.createError);
    } finally {
      setCreating(false);
    }
  }

  // دالة تحميل ملف Excel (CSV)
  function downloadCSV() {
    if (!items.length) return;
    const headers = isArabic 
      ? ["الرقم الوظيفي", "الموظف", "الراتب الأساسي", "بدل السكن", "بدلات أخرى", "أيام الغياب", "خصم الغياب", "التأمينات", "خصومات أخرى", "الصافي"]
      : ["Employee No", "Name", "Basic", "Housing", "Other Allowances", "Unpaid Days", "Absence Ded", "GOSI", "Other Ded", "Net Salary"];

    const csvRows = items.map(item => [
      item.employee_number || "—",
      item.full_name || "—",
      num(item.basic_salary),
      num(item.housing_allowance),
      num(item.other_allowances),
      num(item.unpaid_leave_days),
      num(item.absence_deduction),
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

  // فتح وإغلاق نافذة التعديل للموظف
  function toggleEditItem(item: RunItem) {
    if (run?.status !== "draft") return; // لا يسمح بفتح التعديل إذا كان معتمداً
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

  // حفظ التعديلات اليدوية
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

      // تحديث البيانات في الواجهة مباشرة
      setItems(prevItems => prevItems.map(it => it.id === editingItem.id ? { ...it, ...payload.item } : it));
      setEditingItem(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : copy.createError);
    } finally {
      setSavingItem(false);
    }
  }

  const totals = useMemo(() => {
    const sum = items.reduce(
      (acc, item) => {
        const gross = num(item.basic_salary) + num(item.housing_allowance) + num(item.other_allowances);
        return {
          basic: acc.basic + num(item.basic_salary),
          housing: acc.housing + num(item.housing_allowance),
          other: acc.other + num(item.other_allowances),
          gross: acc.gross + gross,
          unpaid: acc.unpaid + num(item.unpaid_leave_days),
          absence: acc.absence + num(item.absence_deduction),
          gosi: acc.gosi + num(item.gosi_deduction),
          otherDed: acc.otherDed + num(item.other_deductions),
          net: acc.net + num(item.net_salary),
        };
      },
      { basic: 0, housing: 0, other: 0, gross: 0, unpaid: 0, absence: 0, gosi: 0, otherDed: 0, net: 0 },
    );

    return {
      basic: round2(sum.basic),
      housing: round2(sum.housing),
      other: round2(sum.other),
      gross: round2(sum.gross),
      unpaid: sum.unpaid,
      absence: round2(sum.absence),
      gosi: round2(sum.gosi),
      otherDed: round2(sum.otherDed),
      net: round2(sum.net),
      deductions: round2(sum.absence + sum.gosi + sum.otherDed),
    };
  }, [items]);

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
    copy.colGosi,
    copy.colOtherDed,
    copy.colNet,
  ];

  const kpis = [
    { label: copy.kpiEmployees, value: String(items.length), icon: <UsersRound size={18} /> },
    { label: copy.kpiGross, value: `${formatMoney(totals.gross)} ${copy.currency}`, icon: <Wallet size={18} /> },
    { label: copy.kpiDeductions, value: `${formatMoney(totals.deductions)} ${copy.currency}`, icon: <UserMinus size={18} /> },
    { label: copy.kpiNet, value: `${formatMoney(totals.net)} ${copy.currency}`, icon: <ShieldCheck size={18} /> },
  ];

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      className="min-h-[calc(100vh-76px)] bg-[var(--background)] px-4 py-6 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl">
            {copy.title}
          </h1>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">{copy.subtitle}</p>
        </header>

        <section className="mb-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <label className="block text-sm font-medium text-[var(--foreground)]">
              {copy.monthLabel}
              <input
                type="month"
                value={month}
                onChange={(event) => setMonth(event.target.value)}
                disabled={creating}
                dir="ltr"
                className="mt-1 block w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--primary)] sm:w-56"
              />
            </label>

            <button
              type="button"
              onClick={() => void handleCreate()}
              disabled={creating || !month}
              className="inline-flex min-h-8 items-center justify-center gap-2 rounded-lg border border-[var(--border-default)] bg-[var(--surface)] px-3 text-[10px] font-extrabold text-[var(--brand-primary)] transition hover:border-[var(--brand-primary)] hover:bg-[var(--brand-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2 -translate-y-1"
            >
              {creating ? <LoaderCircle size={17} className="animate-spin" /> : <Plus size={17} />}
              {creating ? copy.creating : `${copy.create} · ${monthLabel(month, isArabic)}`}
            </button>
          </div>
        </section>

        {notice && (
          <div role="status" className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            {notice}
          </div>
        )}

        {error && (
          <div role="alert" className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            <div className="flex items-start gap-2">
              <div className="min-w-0">
                <p className="font-semibold">{error}</p>
                {missing.length > 0 && (
                  <>
                    <p className="mt-2">{copy.missingTitle}</p>
                    <ul className="mt-1 list-disc space-y-0.5 ps-5">
                      {missing.map((employee) => (
                        <li key={employee.id}>
                          {employee.full_name} {employee.employee_number ? ` (${employee.employee_number})` : ""}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {!run ? (
          <section className="flex min-h-48 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--card)] p-8 text-center text-sm text-[var(--muted-foreground)]">
            <CalendarDays size={24} />
            {copy.empty}
          </section>
        ) : (
          <>
            <section className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {kpis.map((kpi) => (
                <article key={kpi.label} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm">
                  <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
                    {kpi.icon}
                    {kpi.label}
                  </div>
                  <p className="mt-2 text-xl font-semibold text-[var(--foreground)]">{kpi.value}</p>
                </article>
              ))}
            </section>

            <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
              {/* Header with Approve, Recreate and Download Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] px-4 py-4 sm:px-5">
                <div className="flex items-center gap-3">
                  <h2 className="text-base font-semibold text-[var(--foreground)]">
                    {monthLabel(run.period_start.slice(0, 7), isArabic)}
                  </h2>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${run.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                    {run.status === 'approved' ? (isArabic ? 'معتمد' : 'Approved') : statusLabel(run.status)}
                  </span>
                  <span className="text-xs text-[var(--muted-foreground)]" dir="ltr">
                    {copy.period}: {run.period_start} → {run.period_end}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {run.status === "approved" && (
                    <button
                      onClick={downloadCSV}
                      className="inline-flex items-center gap-2 rounded-lg border border-emerald-600 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-100"
                    >
                      <Download size={16} />
                      {copy.btnDownload}
                    </button>
                  )}
                  {run.status === "draft" && (
                    <>
                      {/* الزر الجديد: إعادة الإنشاء */}
                      <button
                        onClick={() => void handleRecreate()}
                        disabled={creating}
                         className="inline-flex min-h-8 items-center justify-center gap-2 rounded-lg border border-[var(--border-default)] bg-[var(--surface)] px-3 text-[10px] font-extrabold text-[var(--brand-primary)] transition hover:border-[var(--brand-primary)] hover:bg-[var(--brand-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2 -translate-y-1"
                      >
                        {creating ? <LoaderCircle size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                        {copy.btnRecreate}
                      </button>

                      <button
                        onClick={() => void handleApprove()}
                        disabled={creating}
                        className="inline-flex min-h-8 items-center justify-center gap-2 rounded-lg border border-[var(--border-default)] bg-[var(--surface)] px-3 text-[10px] font-extrabold text-[var(--brand-primary)] transition hover:border-[var(--brand-primary)] hover:bg-[var(--brand-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2 -translate-y-1"
                      >
                        {creating ? <LoaderCircle size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
                        {copy.btnApprove}
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[1100px] text-start text-sm">
                  <thead className="bg-[var(--muted)]/50 text-[var(--muted-foreground)]">
                    <tr>
                      {headings.map((heading) => (
                        <th key={heading} scope="col" className="whitespace-nowrap px-4 py-3 text-start font-semibold">
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[var(--border)]">
                    {items.map((item) => {
                      const gross = num(item.basic_salary) + num(item.housing_allowance) + num(item.other_allowances);
                      const unpaid = num(item.unpaid_leave_days);
                      const net = num(item.net_salary);
                      const isEditing = editingItem?.id === item.id;

                      // الحسبة الحية (Live Preview) عند التعديل
                      const liveGross = num(item.basic_salary) + num(item.housing_allowance) + num(itemForm.other_allowances);
                      const liveAbsence = round2((liveGross / 30) * num(itemForm.unpaid_leave_days));
                      const liveNet = round2(liveGross - liveAbsence - num(item.gosi_deduction) - num(itemForm.other_deductions));

                      return (
                        <Fragment key={item.id}>
                          {/* صف البيانات الأساسي (قابل للنقر إذا كان مسودة) */}
                          <tr 
                            onClick={() => toggleEditItem(item)} 
                            className={`transition ${run.status === "draft" ? "cursor-pointer hover:bg-[var(--muted)]/40" : ""} ${isEditing ? "bg-[var(--muted)]/20" : ""}`}
                            title={run.status === "draft" ? "انقر للتعديل اليدوي" : ""}
                          >
                            <td className="whitespace-nowrap px-4 py-3 text-[var(--foreground)]">{item.employee_number ?? "—"}</td>
                            <td className="px-4 py-3 font-semibold text-[var(--foreground)] flex items-center gap-2">
                              {item.full_name ?? "—"}
                              {run.status === "draft" && !isEditing && <Pencil size={12} className="text-gray-400" />}
                            </td>
                            <td className="px-4 py-3">
                              <span className="inline-flex rounded-full bg-[var(--muted)] px-2.5 py-1 text-xs font-semibold text-[var(--foreground)]">
                                {item.is_saudi === true ? copy.saudi : item.is_saudi === false ? copy.nonSaudi : "—"}
                              </span>
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 text-[var(--foreground)]">{formatMoney(num(item.basic_salary))}</td>
                            <td className="whitespace-nowrap px-4 py-3 text-[var(--foreground)]">{formatMoney(num(item.housing_allowance))}</td>
                            
                            {/* إبراز الحقول القابلة للتعديل عند الفتح */}
                            <td className={`whitespace-nowrap px-4 py-3 ${isEditing ? "text-[var(--primary)] font-bold" : "text-[var(--foreground)]"}`}>
                              {isEditing ? formatMoney(num(itemForm.other_allowances)) : formatMoney(num(item.other_allowances))}
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 font-medium text-[var(--foreground)]">
                              {isEditing ? formatMoney(liveGross) : formatMoney(round2(gross))}
                            </td>
                            <td className={`px-4 py-3 ${isEditing ? "text-rose-600 font-bold" : ""}`}>
                              {isEditing ? (
                                <span className="inline-flex rounded-full bg-rose-100 px-2.5 py-1 text-xs font-bold text-rose-800">{itemForm.unpaid_leave_days}</span>
                              ) : unpaid > 0 ? (
                                <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800">{unpaid}</span>
                              ) : (
                                <span className="text-[var(--muted-foreground)]">0</span>
                              )}
                            </td>
                            <td className={`whitespace-nowrap px-4 py-3 ${isEditing ? "text-rose-600 font-bold" : "text-rose-600"}`}>
                              {isEditing ? formatMoney(liveAbsence) : formatMoney(num(item.absence_deduction))}
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 text-rose-600">{formatMoney(num(item.gosi_deduction))}</td>
                            <td className={`whitespace-nowrap px-4 py-3 ${isEditing ? "text-rose-600 font-bold" : "text-rose-600"}`}>
                              {isEditing ? formatMoney(num(itemForm.other_deductions)) : formatMoney(num(item.other_deductions))}
                            </td>
                            <td className={`whitespace-nowrap px-4 py-3 font-bold ${isEditing ? "text-[var(--primary)]" : (net < 0 ? "text-rose-600" : "text-emerald-700")}`}>
                              {isEditing ? formatMoney(liveNet) : formatMoney(net)}
                            </td>
                          </tr>

                          {/* القائمة المنسدلة للتعديل اليدوي */}
                          {isEditing && (
                            <tr>
                              <td colSpan={12} className="p-0 border-b border-[var(--border)]">
                                <div className="bg-blue-50/50 dark:bg-blue-900/10 px-4 py-5 shadow-inner border-t border-[var(--border)]">
                                  <div className="flex flex-col lg:flex-row items-end gap-6 justify-between">
                                    <div className="flex items-center gap-6 flex-wrap">
                                      <label className="block text-sm font-medium text-[var(--foreground)]">
                                        {copy.colOther}
                                        <input
                                          type="number"
                                          min="0"
                                          value={itemForm.other_allowances}
                                          onChange={(e) => setItemForm({ ...itemForm, other_allowances: num(e.target.value) })}
                                          className="mt-1 block w-32 rounded-lg border border-[var(--border)] bg-white dark:bg-black px-3 py-2 text-sm outline-none focus:border-[var(--primary)]"
                                        />
                                      </label>
                                      
                                      <label className="block text-sm font-medium text-[var(--foreground)]">
                                        {copy.colUnpaid}
                                        <input
                                          type="number"
                                          min="0"
                                          max="30"
                                          value={itemForm.unpaid_leave_days}
                                          onChange={(e) => setItemForm({ ...itemForm, unpaid_leave_days: num(e.target.value) })}
                                          className="mt-1 block w-32 rounded-lg border border-rose-200 bg-white dark:bg-black px-3 py-2 text-sm outline-none focus:border-rose-500"
                                        />
                                      </label>

                                      <label className="block text-sm font-medium text-[var(--foreground)]">
                                        {copy.colOtherDed}
                                        <input
                                          type="number"
                                          min="0"
                                          value={itemForm.other_deductions}
                                          onChange={(e) => setItemForm({ ...itemForm, other_deductions: num(e.target.value) })}
                                          className="mt-1 block w-32 rounded-lg border border-rose-200 bg-white dark:bg-black px-3 py-2 text-sm outline-none focus:border-rose-500"
                                        />
                                      </label>
                                    </div>

                                    <div className="flex items-center gap-2">
                                      <button
                                        type="button"
                                        onClick={() => setEditingItem(null)}
                                        disabled={savingItem}
                                        className="rounded-lg border border-[var(--border)] bg-white dark:bg-black px-4 py-2 text-sm font-semibold text-[var(--foreground)] hover:bg-[var(--muted)]"
                                      >
                                        {copy.cancel}
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => void handleSaveItemDetails(liveAbsence, liveNet)}
                                        disabled={savingItem}
                                        className="inline-flex items-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
                                      >
                                        {savingItem ? <LoaderCircle size={16} className="animate-spin" /> : <Save size={16} />}
                                        {copy.saveChanges}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </Fragment>
                      );
                    })}
                  </tbody>

                  <tfoot className="border-t-2 border-[var(--border)] bg-[var(--muted)]/40 font-semibold text-[var(--foreground)]">
                    <tr>
                      <td className="px-4 py-3" colSpan={3}>
                        {copy.totals}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">{formatMoney(totals.basic)}</td>
                      <td className="whitespace-nowrap px-4 py-3">{formatMoney(totals.housing)}</td>
                      <td className="whitespace-nowrap px-4 py-3">{formatMoney(totals.other)}</td>
                      <td className="whitespace-nowrap px-4 py-3">{formatMoney(totals.gross)}</td>
                      <td className="px-4 py-3">{totals.unpaid}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-rose-600">{formatMoney(totals.absence)}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-rose-600">{formatMoney(totals.gosi)}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-rose-600">{formatMoney(totals.otherDed)}</td>
                      <td className="whitespace-nowrap px-4 py-3">{formatMoney(totals.net)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <p className="border-t border-[var(--border)] px-4 py-3 text-xs text-[var(--muted-foreground)] sm:px-5">
                {copy.hint}
              </p>
            </section>
          </>
        )}
      </div>
    </main>
  );
}