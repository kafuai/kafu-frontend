"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowUpRight,
  Banknote,
  CalendarCheck,
  ClipboardList,
  Clock3,
  LoaderCircle,
  RefreshCw,
  Users,
} from "lucide-react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import { useLocalization } from "@/components/localization/LocalizationContext";

type TrendRow = {
  date: string;
  present: number;
  late: number;
  absent: number;
  submitted: number;
  processed: number;
};

type PendingItem = {
  id: string;
  employee: string;
  type: string;
  title: string;
  createdAt: string;
  status: string;
  href: string;
};

type DashboardData = {
  period: { start: string; end: string };
  metrics: {
    employees: number;
    requests: number;
    averageHours: number | null;
    processedRequests: number;
    pendingRequests: number;
    pendingCorrections: number;
    pendingDeductions: number;
    pendingTotal: number;
  };
  trend: TrendRow[];
  attendanceDistribution: { name: string; value: number }[];
  requestDistribution: { name: string; value: number }[];
  departmentPerformance: {
    department: string;
    present: number;
    late: number;
    absent: number;
  }[];
  pendingItems: PendingItem[];
};

const COLORS = [
  "#2563EB",
  "#3B82F6",
  "#60A5FA",
  "#F59E0B",
  "#DC5252",
  "#64748B",
];

const card =
  "min-w-0 rounded-[24px] border border-[var(--border-default)] bg-[var(--surface)] p-5 shadow-[var(--shadow-small)]";

const tooltipStyle = {
  background: "var(--surface)",
  border: "1px solid var(--border-default)",
  borderRadius: 12,
  fontSize: 12,
  fontWeight: 700,
  color: "var(--text-primary)",
};

const ghostBtn =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[var(--border-default)] bg-[var(--surface)] px-4 text-sm font-black text-[var(--text-secondary)] transition hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] disabled:cursor-not-allowed disabled:opacity-60";

export default function HrDashboardPage() {
  const { locale } = useLocalization();
  const ar = locale === "ar";

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [chartMode, setChartMode] = useState<"attendance" | "requests">(
    "attendance",
  );

  const text = {
    title: ar ? "نظرة عامة على الموارد البشرية" : "HR Dashboard",
    subtitle: ar
      ? "نظرة سريعة على الموظفين والحضور والطلبات في مؤسستك."
      : "A quick overview of employees, attendance, and requests.",
    refresh: ar ? "تحديث" : "Refresh",
    employees: ar ? "إجمالي الموظفين النشطين" : "Active Employees",
    requests: ar ? "طلبات هذا الشهر" : "Requests This Month",
    average: ar ? "متوسط زمن المعالجة" : "Average Processing Time",
    pending: ar ? "إجراءات تحتاج متابعة" : "Actions Needing Attention",
    noData: ar ? "لا توجد بيانات كافية" : "Not enough data",
    hours: ar ? "ساعة" : "hrs",
    minutes: ar ? "دقيقة" : "min",
    trend: ar ? "اتجاه المؤسسة" : "Organization Trend",
    attendance: ar ? "الحضور" : "Attendance",
    requestTrend: ar ? "الطلبات" : "Requests",
    present: ar ? "حاضر" : "Present",
    late: ar ? "متأخر" : "Late",
    absent: ar ? "غياب مؤكد" : "Confirmed Absence",
    submitted: ar ? "طلبات مقدمة" : "Submitted",
    processed: ar ? "طلبات معالجة" : "Processed",
    attendanceDistribution: ar ? "توزيع حالات الحضور" : "Attendance Distribution",
    departmentPerformance: ar ? "الحضور حسب الإدارة" : "Attendance by Department",
    requestDistribution: ar ? "الطلبات حسب النوع" : "Requests by Type",
    recent: ar ? "طلبات تحتاج إجراءً" : "Items Needing Attention",
    employee: ar ? "الموظف" : "Employee",
    type: ar ? "النوع" : "Type",
    date: ar ? "تاريخ التقديم" : "Submitted",
    status: ar ? "الحالة" : "Status",
    open: ar ? "عرض الطلبات" : "View Requests",
    empty: ar ? "لا توجد حالات معلقة." : "No pending items.",
    loadError: ar ? "تعذر تحميل بيانات الداشبورد." : "Could not load dashboard data.",
    retry: ar ? "إعادة المحاولة" : "Retry",
    leave: ar ? "إجازة" : "Leave",
    employment_letter: ar ? "خطاب تعريف" : "Employment Letter",
    inquiry: ar ? "استفسار" : "Inquiry",
    data_update: ar ? "تحديث بيانات" : "Data Update",
    correction: ar ? "تصحيح حضور" : "Attendance Correction",
    deduction: ar ? "مقترح خصم" : "Deduction Proposal",
    pendingLabel: ar ? "بانتظار المراجعة" : "Pending Review",
    openAttendance: ar ? "لوحة الحضور" : "Attendance Dashboard",
    openPayroll: ar ? "مسير الرواتب" : "Payroll",
    period: ar ? "الفترة" : "Period",
  };

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/hr-dashboard/summary", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Dashboard request failed");
      }

      const result = (await response.json()) as DashboardData;
      setData(result);
    } catch {
      setError(text.loadError);
    } finally {
      setLoading(false);
    }
  }, [text.loadError]);

  useEffect(() => {
    void load();
  }, [load]);

  const chartData = useMemo(
    () =>
      (data?.trend ?? []).map((row) => ({
        ...row,
        day: new Date(`${row.date}T12:00:00Z`).toLocaleDateString(
          ar ? "ar-SA" : "en-US",
          { day: "numeric", month: "short", timeZone: "UTC" },
        ),
      })),
    [data, ar],
  );

  const metricCards = data
    ? [
        {
          code: "EM",
          label: text.employees,
          value: data.metrics.employees.toLocaleString(),
          note: ar ? "الموظفون المسجلون بحالة نشطة" : "Currently active employee records",
          icon: Users,
        },
        {
          code: "RQ",
          label: text.requests,
          value: data.metrics.requests.toLocaleString(),
          note: ar ? "طلبات قُدمت خلال الشهر الحالي" : "Submitted during this month",
          icon: ClipboardList,
        },
        {
          code: "AV",
          label: text.average,
          value:
            data.metrics.averageHours === null
              ? text.noData
              : data.metrics.averageHours < 1
                ? `${Math.max(1, Math.round(data.metrics.averageHours * 60))} ${text.minutes}`
                : `${data.metrics.averageHours.toLocaleString(ar ? "ar-SA" : "en-US", { maximumFractionDigits: 1 })} ${text.hours}`,
          note: ar
            ? `${data.metrics.processedRequests} طلبًا تمت معالجته ضمن الحساب`
            : `${data.metrics.processedRequests} processed requests included`,
          icon: Clock3,
        },
        {
          code: "PD",
          label: text.pending,
          value: data.metrics.pendingTotal.toLocaleString(),
          note: ar
            ? `${data.metrics.pendingRequests} طلب · ${data.metrics.pendingCorrections} تصحيح حضور · ${data.metrics.pendingDeductions} خصم`
            : `${data.metrics.pendingRequests} requests · ${data.metrics.pendingCorrections} corrections · ${data.metrics.pendingDeductions} deductions`,
          icon: AlertCircle,
        },
      ]
    : [];

  const legendRow = (items: { name: string; value: number }[]) => (
    <div className="mt-2 space-y-2 rounded-2xl border border-[var(--border-default)] bg-[var(--surface-muted)] p-4">
      {items.map((item, index) => (
        <div
          key={item.name}
          className="flex items-center justify-between gap-3 text-xs"
        >
          <span className="flex items-center gap-2 font-bold text-[var(--text-secondary)]">
            <span
              className="h-2.5 w-2.5 rounded-sm"
              style={{ background: COLORS[index % COLORS.length] }}
            />
            {item.name}
          </span>
          <strong className="font-black text-[var(--text-primary)]">
            {item.value.toLocaleString()}
          </strong>
        </div>
      ))}
    </div>
  );

  return (
    <main
      dir={ar ? "rtl" : "ltr"}
      className="min-h-[calc(100vh-64px)] bg-[var(--background)] px-4 py-5 text-[var(--text-primary)] sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-[1540px]">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-[28px] border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-small)]">
          <div className="absolute inset-y-0 start-0 w-1 bg-[var(--brand-primary)]" />
          <div className="grid gap-6 px-6 py-7 md:px-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:py-8">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border-default)] bg-[var(--brand-subtle)] px-3 py-1.5 text-[11px] font-black text-[var(--brand-primary)]">
                  <span className="h-2 w-2 rounded-full bg-[var(--brand-primary)]" />
                  HUMAN RESOURCES
                </span>
                {data && (
                  <span
                    className="rounded-full border border-[var(--border-default)] bg-[var(--surface-muted)] px-3 py-1.5 text-[11px] font-bold text-[var(--text-secondary)]"
                    dir="ltr"
                  >
                    {text.period}: {data.period.start} — {data.period.end}
                  </span>
                )}
              </div>

              <h1 className="mt-4 text-3xl font-black tracking-tight md:text-4xl">
                {text.title}
              </h1>
              <p className="mt-3 max-w-4xl text-sm leading-7 text-[var(--text-secondary)] md:text-base md:leading-8">
                {text.subtitle}
              </p>
            </div>

            <button
              type="button"
              onClick={() => void load()}
              disabled={loading}
              className={ghostBtn}
            >
              {loading ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              {text.refresh}
            </button>
          </div>
        </section>

        {error && !data ? (
          <section className="mt-5 rounded-[28px] border border-amber-300 bg-amber-50 p-8 text-center text-amber-950 shadow-[var(--shadow-small)] dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-100">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-lg font-black text-amber-800 dark:bg-amber-900/40 dark:text-amber-200">
              !
            </div>
            <p className="mx-auto mt-4 max-w-2xl text-sm font-bold leading-7">
              {error}
            </p>
            <button
              type="button"
              onClick={() => void load()}
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-[var(--text-primary)] px-6 text-sm font-black text-[var(--surface)] transition hover:opacity-90"
            >
              {text.retry}
            </button>
          </section>
        ) : loading && !data ? (
          <section className="mt-5 rounded-[28px] border border-[var(--border-default)] bg-[var(--surface)] p-10 text-center shadow-[var(--shadow-small)]">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand-subtle)]">
              <LoaderCircle className="h-5 w-5 animate-spin text-[var(--brand-primary)]" />
            </div>
            <p className="mt-4 text-base font-black">
              {ar ? "جارٍ تحميل البيانات..." : "Loading dashboard..."}
            </p>
          </section>
        ) : data ? (
          <>
            {/* KPI cards */}
            <section className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {metricCards.map((metric) => {
                const Icon = metric.icon;

                return (
                  <article
                    key={metric.label}
                    className="group relative overflow-hidden rounded-2xl border border-[var(--border-default)] bg-[var(--surface)] p-5 shadow-[var(--shadow-small)] transition duration-200 hover:-translate-y-0.5 hover:border-[var(--brand-primary)] hover:shadow-[var(--shadow-medium)]"
                  >
                    <div className="absolute inset-x-0 top-0 h-0.5 origin-start scale-x-0 bg-[var(--brand-primary)] transition-transform duration-200 group-hover:scale-x-100" />
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-xs font-black text-[var(--text-muted)]">
                          {metric.label}
                        </p>
                        <h2 className="mt-3 break-words text-2xl font-black tracking-tight md:text-3xl">
                          {metric.value}
                        </h2>
                      </div>
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--border-default)] bg-[var(--surface-muted)] text-[var(--brand-primary)]">
                        <Icon className="h-4 w-4" />
                      </span>
                    </div>
                    <div className="mt-4 border-t border-[var(--border-default)] pt-3">
                      <p className="text-[11px] font-bold leading-5 text-[var(--text-secondary)]">
                        {metric.note}
                      </p>
                    </div>
                  </article>
                );
              })}
            </section>

            {/* Trend + attendance donut */}
            <section className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-3">
              <article className={`${card} xl:col-span-2`}>
                <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div>
                    <p className="text-xs font-black text-[var(--brand-primary)]">
                      TREND
                    </p>
                    <h2 className="mt-1 text-lg font-black tracking-tight">
                      {text.trend}
                    </h2>
                    <p className="mt-1 text-xs font-bold text-[var(--text-muted)]" dir="ltr">
                      {text.period}: {data.period.start} — {data.period.end}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    {(
                      [
                        ["attendance", text.attendance],
                        ["requests", text.requestTrend],
                      ] as const
                    ).map(([key, label]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setChartMode(key)}
                        className={`shrink-0 rounded-lg px-3 py-2 text-xs font-extrabold transition ${
                          chartMode === key
                            ? "border-2 border-[var(--text-primary)] bg-[var(--surface-muted)] text-[var(--text-primary)]"
                            : "border-2 border-transparent bg-[var(--surface-muted)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-[310px] w-full" dir="ltr">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={chartData}
                      margin={{ top: 8, right: 12, left: 0, bottom: 4 }}
                    >
                      <CartesianGrid stroke="#E8EDF0" strokeDasharray="3 3" />
                      <XAxis
                        dataKey="day"
                        tick={{ fontSize: 11, fill: "#64748B" }}
                        minTickGap={20}
                      />
                      <YAxis
                        allowDecimals={false}
                        width={38}
                        tick={{ fontSize: 11, fill: "#64748B" }}
                      />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Legend />
                      {chartMode === "attendance" ? (
                        <>
                          <Line
                            type="monotone"
                            dataKey="present"
                            name={text.present}
                            stroke="#2563EB"
                            strokeWidth={2.5}
                            dot={false}
                          />
                          <Line
                            type="monotone"
                            dataKey="late"
                            name={text.late}
                            stroke="#F59E0B"
                            strokeWidth={2}
                            dot={false}
                          />
                          <Line
                            type="monotone"
                            dataKey="absent"
                            name={text.absent}
                            stroke="#DC5252"
                            strokeWidth={2}
                            dot={false}
                          />
                        </>
                      ) : (
                        <>
                          <Line
                            type="monotone"
                            dataKey="submitted"
                            name={text.submitted}
                            stroke="#3B82F6"
                            strokeWidth={2.5}
                            dot={false}
                          />
                          <Line
                            type="monotone"
                            dataKey="processed"
                            name={text.processed}
                            stroke="#2563EB"
                            strokeWidth={2.5}
                            dot={false}
                          />
                        </>
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </article>

              {/* Attendance donut */}
              <article className={card}>
                <p className="text-xs font-black text-[var(--brand-primary)]">
                  ATTENDANCE
                </p>
                <h2 className="mt-1 text-base font-black tracking-tight">
                  {text.attendanceDistribution}
                </h2>
                <p className="mt-1 text-xs font-bold text-[var(--text-muted)]">
                  {ar ? "سجلات الشهر الحالي" : "Current month records"}
                </p>

                <div className="relative mt-3 h-[220px]" dir="ltr">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.attendanceDistribution}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={65}
                        outerRadius={88}
                        paddingAngle={3}
                        stroke="var(--surface)"
                      >
                        {data.attendanceDistribution.map((entry) => {
                          const name = entry.name.toLowerCase();

                          const color =
                            name.includes("present") || name.includes("حاضر")
                              ? "#2563EB"
                              : name.includes("late") || name.includes("متأخر")
                                ? "#F59E0B"
                                : name.includes("absent") || name.includes("غياب")
                                  ? "#DC5252"
                                  : "#64748B";

                          return (
                            <Cell
                              key={entry.name}
                              fill={color}
                            />
                          );
                        })}
                      </Pie>
                      <Tooltip contentStyle={tooltipStyle} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xs font-bold text-[var(--text-muted)]">
                      {ar ? "السجلات" : "Records"}
                    </span>
                    <strong className="text-2xl font-black">
                      {data.attendanceDistribution
                        .reduce((sum, item) => sum + item.value, 0)
                        .toLocaleString()}
                    </strong>
                  </div>
                </div>

                {legendRow(data.attendanceDistribution)}
              </article>
            </section>

            {/* Department bars + request donut */}
            <section className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-2">
              <article className={card}>
                <p className="text-xs font-black text-[var(--brand-primary)]">
                  DEPARTMENTS
                </p>
                <h2 className="mt-1 text-base font-black tracking-tight">
                  {text.departmentPerformance}
                </h2>
                <p className="mt-1 text-xs font-bold text-[var(--text-muted)]">
                  {ar
                    ? "مقارنة سجلات الحضور حسب الإدارة"
                    : "Attendance records grouped by department"}
                </p>

                <div className="mt-4 h-[290px] w-full" dir="ltr">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={data.departmentPerformance}
                      layout="vertical"
                      margin={{ top: 8, right: 12, left: 12, bottom: 8 }}
                    >
                      <CartesianGrid
                        stroke="#E8EDF0"
                        strokeDasharray="3 3"
                        horizontal={false}
                      />
                      <XAxis
                        type="number"
                        allowDecimals={false}
                        tick={{ fontSize: 11, fill: "#64748B" }}
                      />
                      <YAxis
                        type="category"
                        dataKey="department"
                        width={100}
                        tick={{ fontSize: 11, fill: "#64748B" }}
                      />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Legend />
                      <Bar
                        dataKey="present"
                        name={text.present}
                        fill="#2563EB"
                        radius={[0, 4, 4, 0]}
                      />
                      <Bar
                        dataKey="late"
                        name={text.late}
                        fill="#F59E0B"
                        radius={[0, 4, 4, 0]}
                      />
                      <Bar
                        dataKey="absent"
                        name={text.absent}
                        fill="#DC5252"
                        radius={[0, 4, 4, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </article>

              <article className={card}>
                <p className="text-xs font-black text-[var(--brand-primary)]">
                  REQUESTS
                </p>
                <h2 className="mt-1 text-base font-black tracking-tight">
                  {text.requestDistribution}
                </h2>
                <p className="mt-1 text-xs font-bold text-[var(--text-muted)]">
                  {ar ? "حسب نوع الطلب خلال الشهر" : "By request type this month"}
                </p>

                <div className="relative mt-2 h-[250px]" dir="ltr">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.requestDistribution}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={66}
                        outerRadius={96}
                        paddingAngle={3}
                        stroke="var(--surface)"
                      >
                        {data.requestDistribution.map((entry, index) => (
                          <Cell
                            key={`${entry.name}-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={tooltipStyle} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xs font-bold text-[var(--text-muted)]">
                      {text.requests}
                    </span>
                    <strong className="text-2xl font-black">
                      {data.metrics.requests.toLocaleString()}
                    </strong>
                  </div>
                </div>

                {legendRow(data.requestDistribution)}
              </article>
            </section>

            {/* Pending table */}
            <section className="mt-5 overflow-hidden rounded-[24px] border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-small)]">
              <div className="flex flex-col justify-between gap-3 border-b border-[var(--border-default)] bg-[var(--surface-muted)] p-5 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-primary)] text-sm font-black text-white shadow-sm">
                    {data.pendingItems.length}
                  </div>
                  <div>
                    <h2 className="text-lg font-black tracking-tight">
                      {text.recent}
                    </h2>
                    <p className="mt-0.5 text-xs font-bold text-[var(--text-muted)]">
                      {ar
                        ? "الطلبات والتصحيحات ومقترحات الخصم التي تنتظر الإجراء"
                        : "Requests, corrections, and deductions awaiting action"}
                    </p>
                  </div>
                </div>

                <Link
                  href="/employee-experience/requests"
                  className={ghostBtn}
                >
                  {text.open}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>

              {data.pendingItems.length === 0 ? (
                <div className="p-10 text-center text-sm font-bold text-[var(--text-secondary)]">
                  {text.empty}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[700px] text-start text-sm">
                    <thead className="bg-[var(--muted)]/50 text-xs text-[var(--text-muted)]">
                      <tr>
                        <th className="px-5 py-3 text-start font-black">{text.employee}</th>
                        <th className="px-5 py-3 text-start font-black">{text.type}</th>
                        <th className="px-5 py-3 text-start font-black">{text.date}</th>
                        <th className="px-5 py-3 text-start font-black">{text.status}</th>
                        <th className="px-5 py-3 font-black" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-default)]">
                      {data.pendingItems.map((item) => (
                        <tr
                          key={item.id}
                          className="transition hover:bg-[var(--surface-muted)]"
                        >
                          <td className="px-5 py-4 font-black text-[var(--text-primary)]">
                            {item.employee}
                          </td>
                          <td className="px-5 py-4 font-bold text-[var(--text-secondary)]">
                            {item.title ||
                              (text as Record<string, string>)[item.type] ||
                              item.type}
                          </td>
                          <td className="px-5 py-4 text-[var(--text-muted)]">
                            {new Date(item.createdAt).toLocaleDateString(
                              ar ? "ar-SA" : "en-US",
                              { timeZone: "Asia/Riyadh" },
                            )}
                          </td>
                          <td className="px-5 py-4">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--warning-background)] px-2.5 py-1 text-[10px] font-extrabold text-[var(--warning)]">
                              <span className="h-1.5 w-1.5 rounded-full bg-current" />
                              {text.pendingLabel}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <Link
                              href={item.href}
                              aria-label={text.open}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border-default)] text-[var(--text-secondary)] transition hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)]"
                            >
                              <ArrowUpRight className="h-4 w-4" />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            {/* Quick links */}
            <section className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                { href: "/attendance/dashboard", label: text.openAttendance, icon: CalendarCheck },
                { href: "/payroll/runs", label: text.openPayroll, icon: Banknote },
              ].map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="group flex items-center justify-between gap-4 rounded-[24px] border border-[var(--border-default)] bg-[var(--surface)] p-5 shadow-[var(--shadow-small)] transition duration-200 hover:-translate-y-0.5 hover:border-[var(--brand-primary)] hover:shadow-[var(--shadow-medium)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
                >
                  <span className="flex items-center gap-3 text-sm font-black">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--brand-subtle)] text-[var(--brand-primary)] transition-colors group-hover:bg-[var(--brand-primary)] group-hover:text-white">
                      <Icon className="h-5 w-5" />
                    </span>
                    {label}
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-[var(--text-muted)] transition group-hover:text-[var(--brand-primary)]" />
                </Link>
              ))}
            </section>
          </>
        ) : null}
      </div>
    </main>
  );
}