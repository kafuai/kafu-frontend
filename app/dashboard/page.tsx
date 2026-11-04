"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Activity, ArrowLeft, ArrowRight, CalendarClock, CircleUserRound,
  ClipboardList, Clock3, FileText, RefreshCw, UsersRound,
} from "lucide-react";
import { useLocalization } from "@/components/localization/LocalizationContext";

type Metric<T> =
  | { status: "available"; value: T }
  | { status: "unavailable"; reason: string };

type PayrollPeriod = {
  periodStart: string;
  periodEnd: string;
  runCount: number;
  run: { id: string; status: string; periodMatchesCalendar: boolean } | null;
  state: "not_created" | "created" | "multiple_runs";
};

type DashboardData = {
  role: string;
  personal: {
    fullName: string | null;
    email: string | null;
    jobTitle: string | null;
    department: string | null;
    employeeNumber: string | null;
    employmentDataAvailable: boolean;
    profileDataAvailable: boolean;
  };
  owner: null | {
    activeEmployees: Metric<number>;
    lateEmployees: Metric<number>;
    pendingRequests: Metric<number>;
    payrollPeriods: Metric<PayrollPeriod[]>;
  };
};

type AttendanceToday = {
  blockedReason?: string | null;
  current?: {
    shiftName: string;
    workDate: string;
    start: string;
    end: string;
    timezone: string;
    checkIn: string | null;
    checkOut: string | null;
    live?: { status?: string; lateMinutes?: number };
    onLeave?: boolean;
  } | null;
  recent?: {
    checkIn: string | null;
    checkOut: string | null;
    shiftName: string;
    live?: { status?: string; lateMinutes?: number };
  } | null;
  canCheckIn?: boolean;
  canCheckOut?: boolean;
};

function formatDate(value: string, locale: string) {
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-SA" : "en", {
    month: "long",
    year: "numeric",
    calendar: "gregory",
  }).format(new Date(`${value}T12:00:00`));
}

function formatTime(value: string | null | undefined, locale: string) {
  if (!value) return locale === "ar" ? "لم يُسجّل بعد" : "Not recorded";
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-SA" : "en", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Riyadh",
  }).format(new Date(value));
}

function attendanceStatus(attendance: AttendanceToday | null, locale: string) {
  const view = attendance?.current ?? attendance?.recent ?? null;
  if (!view) {
    if (attendance?.blockedReason === "no_assignment") return locale === "ar" ? "لا توجد وردية مسندة" : "No shift assigned";
    if (attendance?.blockedReason === "on_leave") return locale === "ar" ? "إجازة معتمدة" : "Approved leave";
    return locale === "ar" ? "لا توجد وردية حالية" : "No current shift";
  }
  const status = view.live?.status;
  const ar: Record<string, string> = {
    present: "حاضر", late: "متأخر", early_leave: "انصراف مبكر",
    late_early_leave: "تأخير وانصراف مبكر", scheduled: "لم يحن وقت الحضور",
    not_yet: "لم يُسجّل الحضور بعد", incomplete: "سجل غير مكتمل",
    on_leave: "إجازة معتمدة", day_off: "يوم راحة", holiday: "إجازة رسمية",
    possible_absence: "غياب محتمل", absent_confirmed: "غياب معتمد",
    correction_pending: "تصحيح قيد المراجعة",
  };
  const en: Record<string, string> = {
    present: "Present", late: "Late", early_leave: "Early leave",
    late_early_leave: "Late and early leave", scheduled: "Not due yet",
    not_yet: "Not checked in yet", incomplete: "Incomplete record",
    on_leave: "Approved leave", day_off: "Day off", holiday: "Holiday",
    possible_absence: "Possible absence", absent_confirmed: "Confirmed absence",
    correction_pending: "Correction pending",
  };
  return (locale === "ar" ? ar : en)[status ?? ""] ?? (status ?? (locale === "ar" ? "غير متاح" : "Unavailable"));
}

function MetricValue({ metric, locale }: { metric: Metric<number>; locale: string }) {
  if (metric.status === "unavailable") {
    return <p className="mt-3 text-sm font-bold leading-6 text-amber-700">{metric.reason}</p>;
  }
  return (
    <h2 className="mt-3 text-2xl font-black tracking-tight tabular-nums md:text-3xl">
      {metric.value.toLocaleString(locale === "ar" ? "ar-SA" : "en")}
    </h2>
  );
}

const linkCardCls =
  "group flex min-h-full flex-col overflow-hidden rounded-[24px] border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-small)] transition duration-200 hover:-translate-y-0.5 hover:border-[var(--brand-primary)] hover:shadow-[var(--shadow-medium)]";
const statCardCls =
  "group relative overflow-hidden rounded-2xl border border-[var(--border-default)] bg-[var(--surface)] p-5 shadow-[var(--shadow-small)] transition duration-200 hover:-translate-y-0.5 hover:border-[var(--brand-primary)] hover:shadow-[var(--shadow-medium)]";
const labelCls = "text-xs font-black text-[var(--text-muted)]";

export default function DashboardPage() {
  const { locale } = useLocalization();
  const isArabic = locale === "ar";

  const [data, setData] = useState<DashboardData | null>(null);
  const [attendance, setAttendance] = useState<AttendanceToday | null>(null);
  const [loadState, setLoadState] = useState<"loading" | "loaded" | "error">("loading");
  const [attendanceState, setAttendanceState] = useState<"loading" | "loaded" | "error">("loading");

  const copy = isArabic ? {
    badge: "DASHBOARD", badgeSub: "لوحة التحكم",
    title: "لوحة التحكم", welcome: "مرحبًا", subtitle: "ملخصك اليومي ومسارات الوصول إلى وظائف KAFU AI.",
    profile: "الملف الشخصي", job: "المسمى الوظيفي", department: "الإدارة / القسم",
    employeeNumber: "الرقم الوظيفي", unavailable: "غير متوفر", personalTitle: "بياناتك الوظيفية",
    attendanceTitle: "الحضور والانصراف اليوم", shift: "الوردية", checkIn: "وقت الحضور",
    checkOut: "وقت الانصراف", openAttendance: "فتح نظام الحضور", noShift: "لا توجد وردية مسندة حاليًا",
    recentShift: "آخر دوام", checkoutHint: "يمكنك تسجيل الانصراف من صفحة الحضور.",
    linksTitle: "الوصول السريع", employeeExperience: "خدمات الموظف", employeeExperienceDesc: "المساعد والطلبات والخدمات المتاحة لحسابك",
    attendance: "الحضور والانصراف", attendanceDesc: "تسجيل حضورك وانصرافك ومراجعة سجلك",
    profileDesc: "عرض بياناتك الوظيفية وتحديث البيانات المتاحة",
    ownerTitle: "مؤشرات المؤسسة", activeEmployees: "الموظفون النشطون",
    late: "الموظفون المتأخرون اليوم", pending: "الطلبات قيد المراجعة", requests: "الطلبات",
    payrollTitle: "مسيرات الرواتب القادمة", period: "الفترة", runState: "حالة المسير", approval: "الموافقة",
    notCreated: "لم يُنشأ", created: "تم الإنشاء", multiple: "أكثر من مسير للفترة",
    approved: "تمت الموافقة", notApproved: "لم تتم الموافقة", cancelled: "ملغى", draft: "مسودة",
    pending_review: "بانتظار المراجعة", pending_approval: "بانتظار الموافقة", exported: "تم التصدير",
    periodMismatch: "تنبيه: فترة المسير لا تطابق الشهر التقويمي بالكامل.",
    refresh: "إعادة المحاولة", loadingTitle: "جارٍ تحميل لوحة التحكم", loadingText: "يتم جلب ملخصك وبيانات المؤسسة.",
    errorTitle: "تعذر تحميل لوحة التحكم", loadError: "تعذر تحميل بيانات لوحة التحكم.",
    attendanceError: "تعذر تحميل حالة الحضور الحالية.", noProfile: "لم تتوفر بيانات الملف الشخصي.",
  } : {
    badge: "DASHBOARD", badgeSub: "Dashboard",
    title: "Dashboard", welcome: "Welcome", subtitle: "Your daily summary and shortcuts to KAFU AI.",
    profile: "Profile", job: "Job title", department: "Department", employeeNumber: "Employee number",
    unavailable: "Not available", personalTitle: "Your employment details", attendanceTitle: "Today's attendance",
    shift: "Shift", checkIn: "Check-in", checkOut: "Check-out", openAttendance: "Open attendance",
    noShift: "No current shift assigned", recentShift: "Last shift", checkoutHint: "You can check out from the attendance page.",
    linksTitle: "Quick access", employeeExperience: "Employee services",
    employeeExperienceDesc: "Assistant, requests and services available to your account",
    attendance: "Attendance", attendanceDesc: "Check in/out and review your record",
    profileDesc: "View your employment details and update available information",
    ownerTitle: "Organization metrics", activeEmployees: "Active employees",
    late: "Employees late today", pending: "Requests pending review", requests: "Requests",
    payrollTitle: "Upcoming payroll runs", period: "Period", runState: "Run status", approval: "Approval",
    notCreated: "Not created", created: "Created", multiple: "Multiple runs for period",
    approved: "Approved", notApproved: "Not approved", cancelled: "Cancelled", draft: "Draft",
    pending_review: "Pending review", pending_approval: "Pending approval", exported: "Exported",
    periodMismatch: "Note: the run period does not match the full calendar month.",
    refresh: "Retry", loadingTitle: "Loading dashboard", loadingText: "Fetching your summary and organization data.",
    errorTitle: "Unable to load dashboard", loadError: "Unable to load dashboard data.",
    attendanceError: "Unable to load current attendance.", noProfile: "Profile data is unavailable.",
  };

  // الطلبان بالتوازي، وكل واحد بحالته المستقلة (لا نعرض «لا توجد وردية» قبل وصول رد الحضور)
  const load = useCallback(async (silent = false) => {
    if (!silent) {
      setLoadState("loading");
      setAttendanceState("loading");
    }

    const summaryPromise = fetch("/api/dashboard/summary", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("dashboard");
        setData(await response.json());
        setLoadState("loaded");
      })
      .catch(() => setLoadState("error"));

    const attendancePromise = fetch("/api/attendance/today", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("attendance");
        setAttendance(await response.json());
        setAttendanceState("loaded");
      })
      .catch(() => {
        setAttendance(null);
        setAttendanceState("error");
      });

    await Promise.all([summaryPromise, attendancePromise]);
  }, []);

  useEffect(() => {
    void Promise.resolve().then(() => load());
  }, [load]);

  const Arrow = isArabic ? ArrowLeft : ArrowRight;

  /* ----------------------------- loading / error ----------------------------- */

  if (loadState === "loading") {
    return (
      <main
        dir={isArabic ? "rtl" : "ltr"}
        className="min-h-[calc(100vh-64px)] bg-[var(--background)] px-4 py-5 text-[var(--text-primary)] sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-[1540px]">
          <section className="rounded-[28px] border border-[var(--border-default)] bg-[var(--surface)] p-10 text-center shadow-[var(--shadow-small)]">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand-subtle)]">
              <span className="h-5 w-5 animate-pulse rounded-full bg-[var(--brand-primary)]" />
            </div>
            <p className="mt-4 text-base font-black">{copy.loadingTitle}</p>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">{copy.loadingText}</p>
          </section>
        </div>
      </main>
    );
  }

  if (loadState === "error" || !data) {
    return (
      <main
        dir={isArabic ? "rtl" : "ltr"}
        className="min-h-[calc(100vh-64px)] bg-[var(--background)] px-4 py-5 text-[var(--text-primary)] sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-[1540px]">
          <section
            role="alert"
            className="rounded-[28px] border border-amber-300 bg-amber-50 p-8 text-center text-amber-950 shadow-[var(--shadow-small)]"
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-lg font-black text-amber-800">!</div>
            <h2 className="mt-4 text-xl font-black">{copy.errorTitle}</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7">{copy.loadError}</p>
            <button
              type="button"
              onClick={() => void load()}
              className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[var(--text-primary)] px-6 text-sm font-black text-[var(--surface)] transition hover:opacity-90"
            >
              <RefreshCw size={16} /> {copy.refresh}
            </button>
          </section>
        </div>
      </main>
    );
  }

  /* --------------------------------- render --------------------------------- */

  const person = data.personal;
  const shownName = person.fullName?.trim() || copy.profile;
  const roleIsOwner = data.role === "owner";
  const attView = attendance?.current ?? attendance?.recent ?? null;
  const showCheckoutHint = !attendance?.current && Boolean(attendance?.canCheckOut);

  const quickLinks = [
    { code: "EXP", href: "/employee-experience", icon: <ClipboardList size={20} />, title: copy.employeeExperience, desc: copy.employeeExperienceDesc },
    { code: "ATT", href: "/attendance", icon: <CalendarClock size={20} />, title: copy.attendance, desc: copy.attendanceDesc },
    { code: "PRF", href: "/profile", icon: <CircleUserRound size={20} />, title: copy.profile, desc: copy.profileDesc },
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

              <p className="mt-4 text-sm font-black text-[var(--brand-primary)]">
                {copy.welcome}، {shownName}
              </p>
              <h1 className="mt-1 text-3xl font-black tracking-tight md:text-4xl">{copy.title}</h1>
              <p className="mt-3 max-w-4xl text-sm leading-7 text-[var(--text-secondary)] md:text-base md:leading-8">
                {copy.subtitle}
              </p>
            </div>

            <Link
              href="/profile"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[var(--border-default)] bg-[var(--surface)] px-5 text-sm font-black text-[var(--text-secondary)] transition hover:border-[var(--brand-primary)] hover:bg-[var(--brand-subtle)]"
            >
              <CircleUserRound size={18} />
              {copy.profile}
              <Arrow size={16} />
            </Link>
          </div>
        </section>

        {/* ------------------------ Personal + Attendance ------------------------ */}
        <section className="mt-5 grid gap-5 lg:grid-cols-2">
          <article className="overflow-hidden rounded-[24px] border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-small)]">
            <div className="flex items-center justify-between border-b border-[var(--border-default)] bg-[var(--surface-muted)] px-5 py-4">
              <h2 className="text-sm font-black">{copy.personalTitle}</h2>
              <CircleUserRound size={18} className="text-[var(--brand-primary)]" />
            </div>
            <div className="p-5">
              {!person.profileDataAvailable && (
                <p className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-bold text-amber-800">
                  {copy.noProfile}
                </p>
              )}
              <dl className="grid gap-3 sm:grid-cols-2">
                {[
                  { l: copy.profile, v: shownName },
                  { l: copy.job, v: person.employmentDataAvailable ? person.jobTitle || copy.unavailable : copy.unavailable },
                  { l: copy.department, v: person.employmentDataAvailable ? person.department || copy.unavailable : copy.unavailable },
                  { l: copy.employeeNumber, v: person.employmentDataAvailable ? person.employeeNumber || copy.unavailable : copy.unavailable },
                ].map((row) => (
                  <div key={row.l} className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-muted)] p-4">
                    <dt className={labelCls}>{row.l}</dt>
                    <dd className="mt-2 break-words font-black">{row.v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </article>

          <article className="flex flex-col overflow-hidden rounded-[24px] border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-small)]">
            <div className="flex items-center justify-between border-b border-[var(--border-default)] bg-[var(--surface-muted)] px-5 py-4">
              <h2 className="text-sm font-black">{copy.attendanceTitle}</h2>
              <Activity size={18} className="text-[var(--brand-primary)]" />
            </div>

            <div className="flex flex-1 flex-col p-5">
              {attendanceState === "loading" && (
                <div aria-busy="true" className="space-y-4">
                  <div className="h-6 w-48 animate-pulse rounded-lg bg-[var(--surface-muted)]" />
                  <div className="h-4 w-32 animate-pulse rounded-lg bg-[var(--surface-muted)]" />
                  <div className="grid grid-cols-2 gap-3">
                    <div className="h-[72px] animate-pulse rounded-2xl bg-[var(--surface-muted)]" />
                    <div className="h-[72px] animate-pulse rounded-2xl bg-[var(--surface-muted)]" />
                  </div>
                </div>
              )}

              {attendanceState === "error" && (
                <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800">
                  {copy.attendanceError}
                </p>
              )}

              {attendanceState === "loaded" && (
                <>
                  <p className="text-xl font-black">{attendanceStatus(attendance, locale)}</p>

                  {attView ? (
                    <>
                      <p className="mt-1 text-xs font-bold text-[var(--text-secondary)]">
                        {attendance?.current ? copy.shift : copy.recentShift}: {attView.shiftName}
                      </p>
                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-muted)] p-4">
                          <p className={labelCls}>{copy.checkIn}</p>
                          <p className="mt-2 font-black">{formatTime(attView.checkIn, locale)}</p>
                        </div>
                        <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-muted)] p-4">
                          <p className={labelCls}>{copy.checkOut}</p>
                          <p className="mt-2 font-black">{formatTime(attView.checkOut, locale)}</p>
                        </div>
                      </div>
                      {showCheckoutHint && (
                        <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-bold text-amber-900">
                          {copy.checkoutHint}
                        </p>
                      )}
                    </>
                  ) : (
                    attendance?.blockedReason === "no_assignment" && (
                      <p className="mt-2 text-sm font-bold text-[var(--text-secondary)]">{copy.noShift}</p>
                    )
                  )}
                </>
              )}

              <div className="mt-auto pt-5">
                <Link
                  href="/attendance"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[var(--brand-primary)] px-5 text-sm font-black text-white transition hover:opacity-90"
                >
                  {copy.openAttendance}
                  <Arrow size={16} />
                </Link>
              </div>
            </div>
          </article>
        </section>

        {/* ----------------------------- Quick links ----------------------------- */}
        <section className="mt-8">
          <div className="mb-5">
            <p className="text-xs font-black text-[var(--brand-primary)]">QUICK ACCESS</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight md:text-3xl">{copy.linksTitle}</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {quickLinks.map((l) => (
              <Link key={l.code} href={l.href} className={linkCardCls}>
                <div className="flex items-start justify-between gap-4 border-b border-[var(--border-default)] bg-[var(--surface-muted)] px-5 py-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-primary)] text-white shadow-sm">
                    {l.icon}
                  </div>
                  <span className="text-[10px] font-black text-[var(--text-muted)]">{l.code}</span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-lg font-black tracking-tight">{l.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">{l.desc}</p>
                  <Arrow className="mt-4 text-[var(--brand-primary)] transition group-hover:translate-x-0.5" size={17} />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ------------------------------ Owner ------------------------------ */}
        {roleIsOwner && data.owner && (
          <section className="mt-8 border-t border-[var(--border-default)] pt-8">
            <div className="mb-5">
              <p className="text-xs font-black text-[var(--brand-primary)]">ORGANIZATION</p>
              <h2 className="mt-2 text-2xl font-black tracking-tight md:text-3xl">{copy.ownerTitle}</h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <article className={statCardCls}>
                <div className="absolute inset-x-0 top-0 h-0.5 origin-start scale-x-0 bg-[var(--brand-primary)] transition-transform duration-200 group-hover:scale-x-100" />
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className={labelCls}>{copy.activeEmployees}</p>
                    <MetricValue metric={data.owner.activeEmployees} locale={locale} />
                  </div>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--border-default)] bg-[var(--surface-muted)] text-[var(--brand-primary)]">
                    <UsersRound size={17} />
                  </span>
                </div>
                <div className="mt-4 border-t border-[var(--border-default)] pt-3">
                  <Link href="/payroll/employees" className="inline-flex items-center gap-1 text-xs font-black text-[var(--brand-primary)]">
                    {copy.activeEmployees} <Arrow size={14} />
                  </Link>
                </div>
              </article>

              <article className={statCardCls}>
                <div className="absolute inset-x-0 top-0 h-0.5 origin-start scale-x-0 bg-[var(--brand-primary)] transition-transform duration-200 group-hover:scale-x-100" />
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className={labelCls}>{copy.late}</p>
                    <MetricValue metric={data.owner.lateEmployees} locale={locale} />
                  </div>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--border-default)] bg-[var(--surface-muted)] text-[var(--brand-primary)]">
                    <Clock3 size={17} />
                  </span>
                </div>
                <div className="mt-4 border-t border-[var(--border-default)] pt-3">
                  <Link href="/attendance/dashboard" className="inline-flex items-center gap-1 text-xs font-black text-[var(--brand-primary)]">
                    {copy.attendance} <Arrow size={14} />
                  </Link>
                </div>
              </article>

              <article className={statCardCls}>
                <div className="absolute inset-x-0 top-0 h-0.5 origin-start scale-x-0 bg-[var(--brand-primary)] transition-transform duration-200 group-hover:scale-x-100" />
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className={labelCls}>{copy.pending}</p>
                    <MetricValue metric={data.owner.pendingRequests} locale={locale} />
                  </div>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--border-default)] bg-[var(--surface-muted)] text-[var(--brand-primary)]">
                    <FileText size={17} />
                  </span>
                </div>
                <div className="mt-4 border-t border-[var(--border-default)] pt-3">
                  <Link href="/employee-experience/requests" className="inline-flex items-center gap-1 text-xs font-black text-[var(--brand-primary)]">
                    {copy.requests} <Arrow size={14} />
                  </Link>
                </div>
              </article>
            </div>

            <article className="mt-5 overflow-hidden rounded-[24px] border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-small)]">
              <div className="flex items-center justify-between border-b border-[var(--border-default)] bg-[var(--surface-muted)] px-5 py-4">
                <h3 className="text-sm font-black">{copy.payrollTitle}</h3>
              </div>

              <div className="p-5">
                {data.owner.payrollPeriods.status === "unavailable" ? (
                  <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800">
                    {data.owner.payrollPeriods.reason}
                  </p>
                ) : (
                  <div className="grid gap-3 lg:grid-cols-3">
                    {data.owner.payrollPeriods.value.map((period) => {
                      const statusLabel = period.run
                        ? (copy[period.run.status as keyof typeof copy] ?? period.run.status)
                        : "";
                      return (
                        <div
                          key={period.periodStart}
                          className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-muted)] p-4"
                        >
                          <p className="font-black">{formatDate(period.periodStart, locale)}</p>
                          <p className="mt-1 text-[11px] font-bold text-[var(--text-secondary)]" dir="ltr">
                            {copy.period}: {period.periodStart} – {period.periodEnd}
                          </p>
                          <p className="mt-3 text-sm font-black">
                            {copy.runState}:{" "}
                            {period.state === "not_created"
                              ? copy.notCreated
                              : period.state === "multiple_runs"
                                ? copy.multiple
                                : `${copy.created} — ${statusLabel}`}
                          </p>

                          {period.state === "created" && period.run && (
                            <>
                              <p className="mt-1 text-xs font-bold text-[var(--text-secondary)]">
                                {copy.approval}:{" "}
                                {period.run.status === "approved" || period.run.status === "exported"
                                  ? copy.approved
                                  : period.run.status === "cancelled"
                                    ? copy.cancelled
                                    : copy.notApproved}
                              </p>
                              {!period.run.periodMatchesCalendar && (
                                <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-[11px] font-bold text-amber-800">
                                  {copy.periodMismatch}
                                </p>
                              )}
                            </>
                          )}

                          {period.state !== "not_created" && (
                            <Link href="/payroll/runs" className="mt-3 inline-flex items-center gap-1 text-xs font-black text-[var(--brand-primary)]">
                              {copy.payrollTitle} <Arrow size={14} />
                            </Link>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </article>
          </section>
        )}
      </div>
    </main>
  );
}