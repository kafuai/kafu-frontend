"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle, CalendarClock, CheckCircle2, Clock, FilePenLine, LoaderCircle, LogIn, LogOut, MapPin, X,
} from "lucide-react";
import { useLocalization } from "@/components/localization/LocalizationContext";
import {
  localizeErrorMessage, api, fmtDay, fmtMinutes, fmtMoney, fmtTime, shiftDate, StatusBadge, todayKey,
} from "@/components/attendance/shared";

/* ------------------------------ constants ------------------------------ */

const TYPES = ["missed_check_in", "missed_check_out", "time_change", "dispute_late", "dispute_absence", "excuse"] as const;
const OPEN_PROPOSAL = ["needs_review", "in_review", "needs_extra_approval", "apply_failed"];

const labelCls = "block text-xs font-black text-[var(--text-secondary)]";
const inputCls =
  "mt-1 block h-11 w-full rounded-xl border border-[var(--border-default)] bg-[var(--background)] px-3 text-sm font-bold text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--brand-primary)] focus:bg-[var(--surface)]";
const primaryBtn =
  "inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[var(--brand-primary)] px-6 text-sm font-black text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50";
const secondaryBtn =
  "inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-[var(--border-default)] bg-[var(--surface)] px-6 text-sm font-black text-[var(--text-secondary)] transition hover:border-[var(--brand-primary)] hover:bg-[var(--brand-subtle)] disabled:cursor-not-allowed disabled:opacity-50";

function getPosition(): Promise<GeolocationPosition | null> {
  return new Promise((resolve) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) return resolve(null);
    navigator.geolocation.getCurrentPosition((p) => resolve(p), () => resolve(null), {
      enableHighAccuracy: true, timeout: 10_000, maximumAge: 0,
    });
  });
}

const post = (url: string, body: unknown) =>
  api(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });

const EMPTY_FIX = (date: string) => ({
  type: "missed_check_in", workDate: date, inDate: date, inTime: "", outDate: date, outTime: "", reason: "",
});

/* -------------------------------- page -------------------------------- */

export default function AttendancePage() {
  const { locale } = useLocalization();
  const isArabic = locale === "ar";

  const copy = isArabic
    ? {
        badge: "ATTENDANCE", badgeSub: "حضوري",
        heroTitle: "الحضور والانصراف",
        heroText: "سجّل حضورك وانصرافك، وتابع سجل دوامك وخصوماتك، وقدّم طلب تصحيح عند الحاجة.",
        chips: ["تسجيل بوقت الخادم", "سجلّك أنت فقط", "طلبات تصحيح موثّقة"],
        todayTitle: "دوام اليوم", shift: "الوردية", place: "موقع العمل", noPlace: "بدون تقييد جغرافي",
        remote: "العمل عن بُعد مسموح", state: "الحالة", inAt: "وقت الحضور", outAt: "وقت الانصراف",
        worked: "ساعات العمل", lateBy: "تأخير (دقيقة)", nowLabel: "الوقت الآن",
        checkIn: "تسجيل الحضور", checkOut: "تسجيل الانصراف", locating: "جارٍ تحديد موقعك...",
        okIn: "تم تسجيل حضورك بنجاح.", okOut: "تم تسجيل انصرافك بنجاح.",
        nextShift: "الوردية القادمة", recentShift: "آخر دوام",
        blocked: {
          no_assignment: "لم يتم إسناد وردية لك بعد. تواصل مع المالك.",
          no_active_shift: "لا توجد وردية فعالة الآن.",
          on_leave: "لديك إجازة معتمدة اليوم.",
          location_inactive: "موقع العمل المرتبط بورديتك معطّل.",
        } as Record<string, string>,
        earlyTitle: "تأكيد الانصراف المبكر",
        earlyText: (end: string, mins: number) =>
          `ينتهي دوامك الساعة ${end}، وتبقّى ${mins} دقيقة. تسجيل الانصراف الآن سيُحتسب انصرافًا مبكرًا، وقد يُنشأ مقترح خصم حسب سياسة الشركة يراجعه المالك قبل أي أثر على الراتب.`,
        earlyNote: "إذا كان لديك عذر، يمكنك تقديم طلب تصحيح أو عذر بعد الانصراف.",
        earlyConfirm: "تأكيد الانصراف", earlyCancel: "البقاء في الدوام",
        statAttended: "أيام حضرتها", statAttendedNote: "أيام لها وقت حضور في الشهر",
        statLate: "أيام التأخير", statLateNote: "تأخير مسجّل خلال الشهر",
        statLateMin: "دقائق التأخير", statLateMinNote: "إجمالي الشهر",
        statDed: "خصومات مفتوحة", statDedNote: "بانتظار قرار المالك",
        recordsTitle: "سجل حضوري", month: "الشهر", fix: "طلب تصحيح",
        colDate: "التاريخ", colShift: "الوردية", colStatus: "الحالة", colIn: "الحضور", colOut: "الانصراف",
        colLate: "تأخير (د)", colEarly: "مبكر (د)", colWorked: "ساعات العمل", colDed: "الخصم", colAction: "",
        noRecords: "لا توجد سجلات في هذا الشهر.", futureMonth: "لا توجد سجلات لشهر مستقبلي.",
        runningLate: "تأخير جارٍ: لم تسجّل حضورك بعد",
        dedTitle: "خصوماتي", dedEmpty: "لا توجد خصومات في هذا الشهر.", awaiting: "بانتظار تحديد المبلغ",
        incident: { late: "تأخير", early_leave: "انصراف مبكر", absence: "غياب" } as Record<string, string>,
        minShort: "د",
        fixesTitle: "طلبات التصحيح", fixesEmpty: "لم تقدّم أي طلب تصحيح.", cancelReq: "إلغاء الطلب",
        modalTitle: "تقديم طلب تصحيح", modalText: "عبّئ بيانات الطلب. سيصل إلى المالك للمراجعة، ولن يتغير سجلّك الأصلي.",
        fixType: "نوع الطلب", fixDate: "تاريخ الدوام", fixInDate: "تاريخ الحضور", fixIn: "وقت الحضور الصحيح",
        fixOutDate: "تاريخ الانصراف", fixOut: "وقت الانصراف الصحيح", reason: "السبب",
        reasonPh: "اشرح سبب الطلب...", submit: "إرسال الطلب", sending: "جارٍ الإرسال...", close: "إغلاق",
        fixSent: "تم إرسال طلب التصحيح.", cancelled: "تم إلغاء الطلب.",
        typeHint: {
          missed_check_in: "حدّد الوقت الذي وصلت فيه فعليًا.", missed_check_out: "حدّد الوقت الذي انصرفت فيه فعليًا.",
          time_change: "حدّد الوقت/الأوقات الصحيحة (واحد على الأقل).",
          dispute_late: "اشرح سبب اعتراضك على التأخير.", dispute_absence: "اشرح سبب اعتراضك على الغياب.",
          excuse: "اذكر عذرك للتأخير أو الغياب.",
        } as Record<string, string>,
        types: {
          missed_check_in: "نسيت تسجيل الحضور", missed_check_out: "نسيت تسجيل الانصراف", time_change: "تعديل وقت",
          dispute_late: "اعتراض على التأخير", dispute_absence: "اعتراض على الغياب", excuse: "تسجيل عذر",
        } as Record<string, string>,
        loadingTitle: "جارٍ تحميل حضورك", loadingText: "يتم جلب دوام اليوم وسجلّك.",
        errorTitle: "تعذر تحميل البيانات", retry: "إعادة المحاولة",
        lateCheckoutTitle: "انتهى دوامك ولم تسجّل انصرافك",
        lateCheckoutText: (time: string) =>
          `يمكنك تسجيل الانصراف الآن حتى الساعة ${time}. سيُتحقق من موقعك عند التسجيل، وبعد هذا الوقت ستحتاج إلى تقديم طلب تصحيح.`,
      }
    : {
        badge: "ATTENDANCE", badgeSub: "My attendance",
        heroTitle: "Attendance",
        heroText: "Check in and out, follow your attendance record and deductions, and submit a correction request when needed.",
        chips: ["Server-time check-ins", "Your records only", "Documented corrections"],
        todayTitle: "Today's shift", shift: "Shift", place: "Work location", noPlace: "No geographic restriction",
        remote: "Remote work allowed", state: "Status", inAt: "Check-in", outAt: "Check-out",
        worked: "Worked hours", lateBy: "Late (min)", nowLabel: "Current time",
        checkIn: "Check in", checkOut: "Check out", locating: "Getting your location...",
        okIn: "You have checked in successfully.", okOut: "You have checked out successfully.",
        nextShift: "Next shift", recentShift: "Last shift",
        blocked: {
          no_assignment: "No shift has been assigned to you yet. Contact the owner.",
          no_active_shift: "There is no active shift right now.",
          on_leave: "You have an approved leave today.",
          location_inactive: "The work location linked to your shift is disabled.",
        } as Record<string, string>,
        earlyTitle: "Confirm early check-out",
        earlyText: (end: string, mins: number) =>
          `Your shift ends at ${end}, with ${mins} minute(s) remaining. Checking out now will count as an early leave, and a deduction proposal may be created per company policy for the owner to review before any payroll effect.`,
        earlyNote: "If you have an excuse, you can submit a correction or excuse request after checking out.",
        earlyConfirm: "Confirm check-out", earlyCancel: "Stay on shift",
        statAttended: "Days attended", statAttendedNote: "Days with a check-in this month",
        statLate: "Late days", statLateNote: "Recorded lateness this month",
        statLateMin: "Late minutes", statLateMinNote: "Month total",
        statDed: "Open deductions", statDedNote: "Awaiting the owner's decision",
        recordsTitle: "My attendance record", month: "Month", fix: "Request correction",
        colDate: "Date", colShift: "Shift", colStatus: "Status", colIn: "In", colOut: "Out",
        colLate: "Late (min)", colEarly: "Early (min)", colWorked: "Worked", colDed: "Deduction", colAction: "",
        noRecords: "No records this month.", futureMonth: "No records for a future month.",
        runningLate: "Running lateness: you have not checked in yet",
        dedTitle: "My deductions", dedEmpty: "No deductions this month.", awaiting: "Amount pending",
        incident: { late: "Late", early_leave: "Early leave", absence: "Absence" } as Record<string, string>,
        minShort: "min",
        fixesTitle: "Correction requests", fixesEmpty: "You have not submitted any correction request.", cancelReq: "Cancel request",
        modalTitle: "Submit a correction request", modalText: "Fill in the request details. It goes to the owner for review and your original record stays unchanged.",
        fixType: "Request type", fixDate: "Shift date", fixInDate: "Check-in date", fixIn: "Correct check-in time",
        fixOutDate: "Check-out date", fixOut: "Correct check-out time", reason: "Reason",
        reasonPh: "Explain the reason for your request...", submit: "Submit request", sending: "Submitting...", close: "Close",
        fixSent: "Correction request sent.", cancelled: "Request cancelled.",
        typeHint: {
          missed_check_in: "Enter the time you actually arrived.", missed_check_out: "Enter the time you actually left.",
          time_change: "Enter the correct time(s) (at least one).",
          dispute_late: "Explain why you dispute the lateness.", dispute_absence: "Explain why you dispute the absence.",
          excuse: "State your excuse for the lateness or absence.",
        } as Record<string, string>,
        types: {
          missed_check_in: "Forgot to check in", missed_check_out: "Forgot to check out", time_change: "Time change",
          dispute_late: "Dispute lateness", dispute_absence: "Dispute absence", excuse: "Submit an excuse",
        } as Record<string, string>,
        loadingTitle: "Loading your attendance", loadingText: "Fetching today's shift and your record.",
        errorTitle: "Unable to load data", retry: "Retry",
        lateCheckoutTitle: "Your shift ended and you have not checked out",
        lateCheckoutText: (time: string) =>
          `You can still check out until ${time}. Your location will be verified, and after that you will need to submit a correction request.`,
      };

  const [today, setToday] = useState<any>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [proposals, setProposals] = useState<any[]>([]);
  const [fixes, setFixes] = useState<any[]>([]);
  const [month, setMonth] = useState(todayKey().slice(0, 7));
  const [state, setState] = useState<"loading" | "loaded" | "error">("loading");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "error" | "info"; text: string } | null>(null);
  const [confirmOut, setConfirmOut] = useState<{ end: string; mins: number } | null>(null);
  const [nowMs, setNowMs] = useState(() => Date.now());

  const [fixOpen, setFixOpen] = useState(false);
  const [fx, setFx] = useState(EMPTY_FIX(todayKey()));
  const [fxBusy, setFxBusy] = useState(false);
  const [fxError, setFxError] = useState("");

  const keyRef = useRef<string | null>(null);

  // نطاق الشهر المختار
  const range = useMemo(() => {
    const [y, m] = month.split("-").map(Number);
    const from = `${month}-01`;
    const last = new Date(Date.UTC(y, m, 0)).getUTCDate();
    const end = `${month}-${String(last).padStart(2, "0")}`;
    const to = end < todayKey() ? end : todayKey();
    return { from, to, future: to < from };
  }, [month]);

  const load = useCallback(async () => {
    try {
      const t = await api("/api/attendance/today");
      setToday(t);
      const uid = t.userId as string;

      const [rec, props, corr] = await Promise.allSettled([
        range.future ? Promise.resolve({ data: [] }) : api(`/api/attendance/my?from=${range.from}&to=${range.to}`),
        api("/api/attendance/proposals"),
        api("/api/attendance/corrections"),
      ]);

      if (rec.status === "fulfilled") setRecords((rec.value as any).data ?? []);
      else throw rec.reason;
      // حتى لو كان المستخدم owner: نعرض له سجلّه هو فقط
      if (props.status === "fulfilled") setProposals(((props.value as any).data ?? []).filter((p: any) => p.user_id === uid));
      if (corr.status === "fulfilled") setFixes(((corr.value as any).data ?? []).filter((c: any) => c.user_id === uid));

      setState("loaded");
    } catch (e) {
      setError(e instanceof Error ? localizeErrorMessage(e.message) : localizeErrorMessage(""));
      setState("error");
    }
  }, [range.from, range.to, range.future]);

  useEffect(() => {
    void load();
    const i = setInterval(() => void load(), 30_000);
    return () => clearInterval(i);
  }, [load]);

  useEffect(() => {
    const i = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(i);
  }, []);

  // إغلاق النوافذ بـ Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setConfirmOut(null);
      setFixOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* ----------------------------- clock actions ----------------------------- */

  async function clock(eventType: "check_in" | "check_out") {
    setBusy(true);
    setMsg(null);
    try {

      
      // نفس المفتاح عند إعادة المحاولة بعد انقطاع الشبكة، ويُصفَّر عند النجاح
      if (!keyRef.current) keyRef.current = crypto.randomUUID();
      let coords: { latitude?: number; longitude?: number; accuracy?: number } = {};
      const target =
        eventType === "check_out" && today?.checkoutTarget === "recent" ? today?.recent : today?.current;
      if (target?.location?.geofenceRequired) {
        setMsg({ kind: "info", text: copy.locating });
        const pos = await getPosition();
        if (pos) coords = { latitude: pos.coords.latitude, longitude: pos.coords.longitude, accuracy: pos.coords.accuracy };
      }

      await post("/api/attendance/clock", {
        eventType, idempotencyKey: keyRef.current, locale: isArabic ? "ar" : "en", ...coords,
      });
      keyRef.current = null;
      setMsg({ kind: "ok", text: eventType === "check_in" ? copy.okIn : copy.okOut });
      await load();
    } catch (e) {
      const text = e instanceof Error ? localizeErrorMessage(e.message) : localizeErrorMessage("");
      if (!/network|fetch|failed to/i.test(text)) keyRef.current = null;
      setMsg({ kind: "error", text });
    } finally {
      setBusy(false);
    }
  }

    function requestCheckOut() {
    const cur = today?.current;
    // تأكيد الانصراف المبكر يخص الوردية الجارية فقط. بعد نهاية الوردية يُسجَّل الانصراف مباشرة.
    if (today?.checkoutTarget === "current" && cur) {
      const endMs = new Date(cur.end).getTime();
      if (Date.now() < endMs) {
        setConfirmOut({
          end: fmtTime(cur.end, cur.timezone, isArabic),
          mins: Math.max(1, Math.ceil((endMs - Date.now()) / 60_000)),
        });
        return;
      }
    }
    void clock("check_out");
  }

  /* --------------------------- correction actions --------------------------- */

  function openFix(date?: string) {
    setFx(EMPTY_FIX(date ?? todayKey()));
    setFxError("");
    setFixOpen(true);
  }

  const needsIn = fx.type === "missed_check_in" || fx.type === "time_change";
  const needsOut = fx.type === "missed_check_out" || fx.type === "time_change";
  const timeMissing =
    (fx.type === "missed_check_in" && !fx.inTime) ||
    (fx.type === "missed_check_out" && !fx.outTime) ||
    (fx.type === "time_change" && !fx.inTime && !fx.outTime);

  async function submitFix() {
    setFxBusy(true);
    setFxError("");
    try {
      await post("/api/attendance/corrections", {
        workDate: fx.workDate,
        correctionType: fx.type,
        reason: fx.reason,
        ...(needsIn && fx.inTime ? { proposedCheckIn: { date: fx.inDate, time: fx.inTime } } : {}),
        ...(needsOut && fx.outTime ? { proposedCheckOut: { date: fx.outDate, time: fx.outTime } } : {}),
      });
      setFixOpen(false);
      setMsg({ kind: "ok", text: copy.fixSent });
      await load();
    } catch (e) {
      setFxError(e instanceof Error ? localizeErrorMessage(e.message) : localizeErrorMessage(""));
    } finally {
      setFxBusy(false);
    }
  }

  async function cancelFix(id: string) {
    try {
      await api(`/api/attendance/corrections/${id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "cancel" }),
      });
      setMsg({ kind: "ok", text: copy.cancelled });
      await load();
    } catch (e) {
      setMsg({ kind: "error", text: e instanceof Error ? localizeErrorMessage(e.message) : localizeErrorMessage("") });
    }
  }

  /* -------------------------------- derived -------------------------------- */

  const cur = today?.current;
  const view = cur ?? today?.recent;
  const blockedReason = (today?.blockedReason ?? null) as string | null;

  const monthProposals = useMemo(
    () => proposals.filter((p) => String(p.incident_date).startsWith(month)),
    [proposals, month],
  );

  const stats = useMemo(() => {
    const lateRows = records.filter((r) => r.lateMinutes > 0 && !r.lateIsRunning);
    return [
      { code: "IN", label: copy.statAttended, value: records.filter((r) => r.checkIn).length, note: copy.statAttendedNote },
      { code: "LATE", label: copy.statLate, value: lateRows.length, note: copy.statLateNote },
      { code: "MIN", label: copy.statLateMin, value: lateRows.reduce((n, r) => n + r.lateMinutes, 0), note: copy.statLateMinNote },
      {
        code: "DED", label: copy.statDed,
        value: proposals.filter((p) => OPEN_PROPOSAL.includes(p.status)).length, note: copy.statDedNote,
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [records, proposals, isArabic]);

  // const clockTz = view?.timezone ?? "Asia/Riyadh";
  // const nowText = new Intl.DateTimeFormat(isArabic ? "ar-SA-u-nu-latn" : "en-US", {
  //   hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: clockTz,
  // }).format(new Date(nowMs));

  const recordHeadings = [
    copy.colDate, copy.colShift, copy.colStatus, copy.colIn, copy.colOut,
    copy.colLate, copy.colEarly, copy.colWorked, copy.colDed, copy.colAction,
  ];

  const bannerCls = (kind: "ok" | "error" | "info") =>
    kind === "ok"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : kind === "info"
        ? "border-blue-200 bg-blue-50 text-blue-800"
        : "border-rose-200 bg-rose-50 text-rose-700";

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
              <h1 className="mt-4 text-3xl font-black tracking-tight md:text-4xl">{copy.heroTitle}</h1>
              <p className="mt-3 max-w-4xl text-sm leading-7 text-[var(--text-secondary)] md:text-base md:leading-8">
                {copy.heroText}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {copy.chips.map((chip) => (
                  <span key={chip} className="rounded-lg bg-[var(--surface-muted)] px-3 py-2 text-xs font-bold text-[var(--text-secondary)]">
                    {chip}
                  </span>
                ))}
              </div>
            </div>

            {/* <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-muted)] px-6 py-5 text-center">
              <p className="text-[11px] font-black text-[var(--text-muted)]">{copy.nowLabel}</p>
              <p dir="ltr" className="mt-2 text-3xl font-black tracking-tight text-[var(--brand-primary)]">{nowText}</p>
            </div> */}
          </div>
        </section>

        {msg && (
          <div role={msg.kind === "error" ? "alert" : "status"} className={`mt-4 rounded-xl border px-4 py-3 text-sm font-bold ${bannerCls(msg.kind)}`}>
            {msg.text}
          </div>
        )}

        {state === "loading" && (
          <section className="mt-5 rounded-[28px] border border-[var(--border-default)] bg-[var(--surface)] p-10 text-center shadow-[var(--shadow-small)]">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand-subtle)]">
              <span className="h-5 w-5 animate-pulse rounded-full bg-[var(--brand-primary)]" />
            </div>
            <p className="mt-4 text-base font-black">{copy.loadingTitle}</p>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">{copy.loadingText}</p>
          </section>
        )}

        {state === "error" && (
          <section className="mt-5 rounded-[28px] border border-amber-300 bg-amber-50 p-8 text-center text-amber-950 shadow-[var(--shadow-small)]">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-lg font-black text-amber-800">!</div>
            <h2 className="mt-4 text-xl font-black">{copy.errorTitle}</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7">{error}</p>
            <button
              type="button"
              onClick={() => { setState("loading"); void load(); }}
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-[var(--text-primary)] px-6 text-sm font-black text-[var(--surface)] transition hover:opacity-90"
            >
              {copy.retry}
            </button>
          </section>
        )}

        {state === "loaded" && today && (
          <>
            {/* --------------------------- Today / clock --------------------------- */}
            <section className="mt-5 overflow-hidden rounded-[24px] border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-small)]">
              <div className="flex items-center gap-2 border-b border-[var(--border-default)] bg-[var(--surface-muted)] px-5 py-4">
                <Clock size={17} className="text-[var(--brand-primary)]" />
                <h2 className="text-sm font-black">{copy.todayTitle}</h2>
              </div>

              <div className="grid gap-6 p-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
                <div>
                  {view ? (
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-muted)] p-4">
                        <p className="text-xs font-black text-[var(--text-muted)]">{copy.shift}</p>
                        <p className="mt-2 font-black">{view.shiftName}</p>
                        <p dir="ltr" className="mt-1 text-xs font-bold text-[var(--text-secondary)]">
                          {fmtTime(view.start, view.timezone, isArabic)} → {fmtTime(view.end, view.timezone, isArabic)}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-muted)] p-4">
                        <p className="flex items-center gap-1.5 text-xs font-black text-[var(--text-muted)]">
                          <MapPin size={13} /> {copy.place}
                        </p>
                        <p className="mt-2 font-black">{view.location?.name ?? copy.noPlace}</p>
                        {view.location?.remoteAllowed && (
                          <p className="mt-1 text-xs font-bold text-blue-700">{copy.remote}</p>
                        )}
                      </div>
                      <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-muted)] p-4">
                        <p className="text-xs font-black text-[var(--text-muted)]">{copy.state}</p>
                        <div className="mt-2"><StatusBadge status={view.live.status} isArabic={isArabic} /></div>
                        {view.live.lateMinutes > 0 && (
                          <p className="mt-2 text-xs font-black text-amber-700">{copy.lateBy}: {view.live.lateMinutes}</p>
                        )}
                      </div>
                      <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-muted)] p-4">
                        <p className="text-xs font-black text-[var(--text-muted)]">{copy.inAt} / {copy.outAt}</p>
                        <p dir="ltr" className="mt-2 font-black">
                          {fmtTime(view.checkIn, view.timezone, isArabic)} — {fmtTime(view.checkOut, view.timezone, isArabic)}
                        </p>
                        {view.live.workedMinutes !== null && (
                          <p className="mt-1 text-xs font-bold text-[var(--text-secondary)]">
                            {copy.worked}: {fmtMinutes(view.live.workedMinutes, isArabic)}
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-muted)] p-5 text-sm font-bold text-[var(--text-secondary)]">
                      {copy.blocked[blockedReason ?? "no_active_shift"] ?? copy.blocked.no_active_shift}
                    </div>
                  )}

                  {!cur && view && (
                    <p className="mt-3 text-[11px] font-bold text-[var(--text-muted)]">
                      {copy.recentShift}: {fmtDay(view.workDate, isArabic)}
                    </p>
                  )}
                  {today.next && !cur && (
                    <p className="mt-1 text-[11px] font-bold text-[var(--text-muted)]">
                      {copy.nextShift}: {fmtDay(today.next.workDate, isArabic)} · {today.next.shiftName} · {fmtTime(today.next.start, today.next.timezone, isArabic)}
                    </p>
                  )}
                </div>

                <div className="flex flex-col justify-center gap-3">
                  {cur && blockedReason && (
                    <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-bold text-blue-800">
                      {copy.blocked[blockedReason] ?? blockedReason}
                    </div>
                  )}
                  {today.checkoutTarget === "recent" && (
                    <div className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-900">
                      <p className="font-black">{copy.lateCheckoutTitle}</p>
                      <p className="mt-1 text-xs leading-6">
                        {copy.lateCheckoutText(fmtTime(today.checkoutDeadline, today.recent?.timezone, isArabic))}
                      </p>
                    </div>
                  )}
                  <button
                    type="button"
                    className={primaryBtn}
                    disabled={!today.canCheckIn || busy}
                    onClick={() => void clock("check_in")}
                  >
                    {busy && !confirmOut ? <LoaderCircle size={18} className="animate-spin" /> : <LogIn size={18} />}
                    {copy.checkIn}
                  </button>
                  <button
                    type="button"
                    className={secondaryBtn}
                    disabled={!today.canCheckOut || busy}
                    onClick={requestCheckOut}
                  >
                    <LogOut size={18} /> {copy.checkOut}
                  </button>
                </div>
              </div>
            </section>

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

            {/* ------------------------------ Records ------------------------------ */}
            <section className="mt-5 overflow-hidden rounded-[24px] border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-small)]">
              <div className="flex flex-col gap-3 border-b border-[var(--border-default)] bg-[var(--surface-muted)] p-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex flex-wrap items-end gap-3">
                  <h2 className="pb-3 text-sm font-black">{copy.recordsTitle}</h2>
                  <label className={labelCls}>
                    {copy.month}
                    <input
                      type="month"
                      dir="ltr"
                      value={month}
                      max={todayKey().slice(0, 7)}
                      onChange={(e) => e.target.value && setMonth(e.target.value)}
                      className={`${inputCls} sm:w-52`}
                    />
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => openFix()}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[var(--brand-primary)] px-5 text-sm font-black text-white transition hover:opacity-90"
                >
                  <FilePenLine size={16} /> {copy.fix}
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[960px] text-start text-sm">
                  <thead className="text-[var(--text-secondary)]">
                    <tr>
                      {recordHeadings.map((h, i) => (
                        <th key={i} scope="col" className="whitespace-nowrap px-4 py-3 text-start text-xs font-black">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-default)]">
                    {records.map((r) => (
                      <tr key={`${r.date}-${r.shiftName}`} className="transition hover:bg-[var(--surface-muted)]">
                        <td className="whitespace-nowrap px-4 py-3.5 font-black">{fmtDay(r.date, isArabic)}</td>
                        <td className="px-4 py-3.5 font-bold text-[var(--text-secondary)]">{r.shiftName}</td>
                        <td className="px-4 py-3.5"><StatusBadge status={r.status} isArabic={isArabic} /></td>
                        <td className="whitespace-nowrap px-4 py-3.5">{fmtTime(r.checkIn, r.timezone, isArabic)}</td>
                        <td className="whitespace-nowrap px-4 py-3.5">{fmtTime(r.checkOut, r.timezone, isArabic)}</td>
                        <td className="px-4 py-3.5">
                          {r.lateMinutes > 0 ? (
                            <span
                              title={r.lateIsRunning ? copy.runningLate : undefined}
                              className={`font-black text-amber-700 ${r.lateIsRunning ? "italic opacity-80" : ""}`}
                            >
                              {r.lateMinutes}{r.lateIsRunning ? "*" : ""}
                            </span>
                          ) : "—"}
                        </td>
                        <td className="px-4 py-3.5">
                          {r.earlyLeaveMinutes > 0 ? <span className="font-black text-amber-700">{r.earlyLeaveMinutes}</span> : "—"}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3.5">{fmtMinutes(r.workedMinutes, isArabic)}</td>
                        <td className="px-4 py-3.5">
                          {r.proposals.length === 0 ? "—" : (
                            <div className="space-y-1">
                              {r.proposals.map((p: any) => (
                                <div key={p.id} className="flex flex-wrap items-center gap-2">
                                  <StatusBadge status={p.status} isArabic={isArabic} />
                                  <span className="text-xs font-black">
                                    {(p.final_amount ?? p.original_amount) === null ? copy.awaiting : fmtMoney(p.final_amount ?? p.original_amount, isArabic)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3.5">
                          <button
                            type="button"
                            onClick={() => openFix(r.date)}
                            className="rounded-lg border border-[var(--border-default)] bg-[var(--surface)] px-2.5 py-1.5 text-[11px] font-black text-[var(--brand-primary)] transition hover:border-[var(--brand-primary)] hover:bg-[var(--brand-subtle)]"
                          >
                            {copy.fix}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {records.length === 0 && (
                  <div className="px-4 py-14 text-center text-sm font-bold text-[var(--text-secondary)]">
                    {range.future ? copy.futureMonth : copy.noRecords}
                  </div>
                )}
              </div>
            </section>

            {/* --------------------- Deductions + Corrections --------------------- */}
            <section className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
              <div className="overflow-hidden rounded-[24px] border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-small)]">
                <div className="flex items-center justify-between border-b border-[var(--border-default)] bg-[var(--surface-muted)] px-5 py-4">
                  <h2 className="text-sm font-black">{copy.dedTitle}</h2>
                  <span className="rounded-full bg-[var(--brand-subtle)] px-2.5 py-1 text-[11px] font-black text-[var(--brand-primary)]">
                    {monthProposals.length}
                  </span>
                </div>
                <ul className="divide-y divide-[var(--border-default)]">
                  {monthProposals.map((p) => {
                    const amount = p.final_amount ?? p.original_amount;
                    return (
                      <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                        <div>
                          <p className="font-black">{copy.incident[p.incident_type]}</p>
                          <p className="mt-1 text-[11px] font-bold text-[var(--text-secondary)]">
                            {fmtDay(p.incident_date, isArabic)}
                            {p.minutes ? ` · ${p.minutes} ${copy.minShort}` : ""}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <b className="text-sm">{amount === null ? copy.awaiting : fmtMoney(amount, isArabic)}</b>
                          <StatusBadge status={p.status} isArabic={isArabic} />
                        </div>
                      </li>
                    );
                  })}
                </ul>
                {monthProposals.length === 0 && (
                  <div className="px-4 py-12 text-center text-sm font-bold text-[var(--text-secondary)]">{copy.dedEmpty}</div>
                )}
              </div>

              <div className="overflow-hidden rounded-[24px] border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-small)]">
                <div className="flex items-center justify-between border-b border-[var(--border-default)] bg-[var(--surface-muted)] px-5 py-4">
                  <h2 className="text-sm font-black">{copy.fixesTitle}</h2>
                  <span className="rounded-full bg-[var(--brand-subtle)] px-2.5 py-1 text-[11px] font-black text-[var(--brand-primary)]">
                    {fixes.length}
                  </span>
                </div>
                <ul className="divide-y divide-[var(--border-default)]">
                  {fixes.map((c) => (
                    <li key={c.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                      <div className="min-w-0">
                        <p className="font-black">{copy.types[c.correction_type]}</p>
                        <p className="mt-1 text-[11px] font-bold text-[var(--text-secondary)]">{fmtDay(c.work_date, isArabic)}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <StatusBadge status={c.status} isArabic={isArabic} />
                        {c.status === "pending" && (
                          <button
                            type="button"
                            onClick={() => void cancelFix(c.id)}
                            className="rounded-lg border border-[var(--border-default)] bg-[var(--surface)] px-2.5 py-1.5 text-[11px] font-black text-rose-600 transition hover:border-rose-300 hover:bg-rose-50"
                          >
                            {copy.cancelReq}
                          </button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
                {fixes.length === 0 && (
                  <div className="px-4 py-12 text-center text-sm font-bold text-[var(--text-secondary)]">{copy.fixesEmpty}</div>
                )}
              </div>
            </section>
          </>
        )}
      </div>

      {/* ===================== Early check-out confirmation ===================== */}
      {confirmOut && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => !busy && setConfirmOut(null)}
        >
          <div
            dir={isArabic ? "rtl" : "ltr"}
            className="w-full max-w-md overflow-hidden rounded-[28px] border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-medium)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative px-6 pb-2 pt-7 text-center">
              <div className="absolute inset-x-0 top-0 h-1 bg-amber-400" />
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                <AlertTriangle size={26} />
              </div>
              <h2 className="mt-4 text-xl font-black">{copy.earlyTitle}</h2>
              <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                {copy.earlyText(confirmOut.end, confirmOut.mins)}
              </p>
              <p className="mt-3 rounded-xl bg-[var(--surface-muted)] px-4 py-3 text-xs font-bold leading-6 text-[var(--text-muted)]">
                {copy.earlyNote}
              </p>
            </div>
            <div className="flex flex-col gap-2 p-6 sm:flex-row-reverse">
              <button
                type="button"
                disabled={busy}
                onClick={async () => {
                  await clock("check_out");
                  setConfirmOut(null);
                }}
                className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 text-sm font-black text-white transition hover:bg-amber-600 disabled:opacity-50"
              >
                {busy ? <LoaderCircle size={18} className="animate-spin" /> : <LogOut size={18} />}
                {copy.earlyConfirm}
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => setConfirmOut(null)}
                className="inline-flex h-12 flex-1 items-center justify-center rounded-xl border border-[var(--border-default)] bg-[var(--surface)] px-5 text-sm font-black text-[var(--text-secondary)] transition hover:border-[var(--brand-primary)] hover:bg-[var(--brand-subtle)] disabled:opacity-50"
              >
                {copy.earlyCancel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================= Correction request modal ========================= */}
      {fixOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => !fxBusy && setFixOpen(false)}
        >
          <div
            dir={isArabic ? "rtl" : "ltr"}
            className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-[28px] border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-medium)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 border-b border-[var(--border-default)] bg-[var(--surface-muted)] px-6 py-5">
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-primary)] text-white shadow-sm">
                  <CalendarClock size={20} />
                </span>
                <div>
                  <h2 className="text-lg font-black">{copy.modalTitle}</h2>
                  <p className="mt-1 text-xs font-bold leading-6 text-[var(--text-secondary)]">{copy.modalText}</p>
                </div>
              </div>
              <button
                type="button"
                aria-label={copy.close}
                onClick={() => setFixOpen(false)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[var(--text-secondary)] transition hover:bg-[var(--surface)]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className={labelCls}>
                  {copy.fixType}
                  <select className={inputCls} value={fx.type} onChange={(e) => setFx({ ...fx, type: e.target.value })}>
                    {TYPES.map((k) => <option key={k} value={k}>{copy.types[k]}</option>)}
                  </select>
                </label>
                <label className={labelCls}>
                  {copy.fixDate}
                  <input
                    type="date"
                    dir="ltr"
                    className={inputCls}
                    value={fx.workDate}
                    max={todayKey()}
                    min={shiftDate(todayKey(), -31)}
                    onChange={(e) =>
                      e.target.value && setFx({ ...fx, workDate: e.target.value, inDate: e.target.value, outDate: e.target.value })
                    }
                  />
                </label>
              </div>

              <p className="rounded-xl bg-[var(--brand-subtle)] px-4 py-3 text-xs font-bold leading-6 text-[var(--brand-primary)]">
                {copy.typeHint[fx.type]}
              </p>

              {needsIn && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className={labelCls}>
                    {copy.fixInDate}
                    <input type="date" dir="ltr" className={inputCls} value={fx.inDate} onChange={(e) => setFx({ ...fx, inDate: e.target.value })} />
                  </label>
                  <label className={labelCls}>
                    {copy.fixIn}
                    <input type="time" dir="ltr" className={inputCls} value={fx.inTime} onChange={(e) => setFx({ ...fx, inTime: e.target.value })} />
                  </label>
                </div>
              )}

              {needsOut && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className={labelCls}>
                    {copy.fixOutDate}
                    <input type="date" dir="ltr" className={inputCls} value={fx.outDate} onChange={(e) => setFx({ ...fx, outDate: e.target.value })} />
                  </label>
                  <label className={labelCls}>
                    {copy.fixOut}
                    <input type="time" dir="ltr" className={inputCls} value={fx.outTime} onChange={(e) => setFx({ ...fx, outTime: e.target.value })} />
                  </label>
                </div>
              )}

              <label className={labelCls}>
                {copy.reason}
                <textarea
                  rows={4}
                  maxLength={1000}
                  placeholder={copy.reasonPh}
                  className="mt-1 block w-full rounded-xl border border-[var(--border-default)] bg-[var(--background)] px-3 py-2.5 text-sm font-bold text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--brand-primary)] focus:bg-[var(--surface)]"
                  value={fx.reason}
                  onChange={(e) => setFx({ ...fx, reason: e.target.value })}
                />
              </label>

              {fxError && (
                <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
                  {fxError}
                </div>
              )}

              <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  disabled={fxBusy}
                  onClick={() => setFixOpen(false)}
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-[var(--border-default)] bg-[var(--surface)] px-5 text-sm font-black text-[var(--text-secondary)] transition hover:border-[var(--brand-primary)] hover:bg-[var(--brand-subtle)] disabled:opacity-50"
                >
                  {copy.close}
                </button>
                <button
                  type="button"
                  disabled={fxBusy || fx.reason.trim().length < 3 || timeMissing}
                  onClick={() => void submitFix()}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[var(--brand-primary)] px-6 text-sm font-black text-white transition hover:opacity-90 disabled:opacity-50"
                >
                  {fxBusy ? <LoaderCircle size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                  {fxBusy ? copy.sending : copy.submit}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}