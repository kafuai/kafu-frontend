import "server-only";

import { NextResponse } from "next/server";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { getAttendanceContext } from "@/src/enterprise/business/attendance/core/attendanceContext";

const OPEN_DEDUCTION_STATUSES = [
  "needs_review",
  "in_review",
  "needs_extra_approval",
  "apply_failed",
];

const REQUEST_TYPES = [
  "leave",
  "employment_letter",
  "inquiry",
  "data_update",
];

function dateKeyInSaudiArabia(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Riyadh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const part = (type: string) =>
    parts.find((item) => item.type === type)?.value ?? "";

  return `${part("year")}-${part("month")}-${part("day")}`;
}

function getMonthStart(today: string): string {
  return `${today.slice(0, 7)}-01`;
}

function getNextMonthStart(today: string): string {
  const [year, month] = today.slice(0, 7).split("-").map(Number);
  const next = new Date(Date.UTC(year, month, 1));

  return [
    next.getUTCFullYear(),
    String(next.getUTCMonth() + 1).padStart(2, "0"),
    "01",
  ].join("-");
}

function getDates(start: string, end: string): string[] {
  const result: string[] = [];
  const current = new Date(`${start}T12:00:00Z`);
  const last = new Date(`${end}T12:00:00Z`);

  while (current <= last) {
    result.push(current.toISOString().slice(0, 10));
    current.setUTCDate(current.getUTCDate() + 1);
  }

  return result;
}

function monthTimestamp(date: string, nextMonth: string) {
  return {
    from: new Date(`${date}T00:00:00+03:00`).toISOString(),
    to: new Date(`${nextMonth}T00:00:00+03:00`).toISOString(),
  };
}

export async function GET() {
  try {
    const context = await getAttendanceContext(
      PERMISSIONS.HR_DASHBOARD_VIEW,
    );

    if ("error" in context) {
      return context.error;
    }

    const { supabase, organizationId } = context;

    const today = dateKeyInSaudiArabia(new Date());
    const start = getMonthStart(today);
    const nextMonth = getNextMonthStart(today);
    const timestamps = monthTimestamp(start, nextMonth);
    const dates = getDates(start, today);

    const [
      employeesResult,
      requestsResult,
      correctionsThisMonthResult,
      pendingRequestsResult,
      processedResult,
      processedCorrectionsResult,
      attendanceResult,
      correctionsResult,
      deductionsResult,
    ] = await Promise.all([
      supabase
        .from("payroll_employees")
        .select("id", { count: "exact", head: true })
        .eq("organization_id", organizationId)
        .eq("status", "active"),

      supabase
        .from("employee_requests")
        .select(
          "id,user_id,request_type,status,title,created_at,reviewed_at",
        )
        .eq("organization_id", organizationId)
        .gte("created_at", timestamps.from)
        .lt("created_at", timestamps.to)
        .order("created_at", { ascending: false })
        .limit(10000),

      // All attendance correction requests created this month
      supabase
        .from("attendance_corrections")
        .select(
          "id,user_id,correction_type,status,created_at,reviewed_at",
          { count: "exact" },
        )
        .eq("organization_id", organizationId)
        .gte("created_at", timestamps.from)
        .lt("created_at", timestamps.to)
        .order("created_at", { ascending: false })
        .limit(10000),

      supabase
        .from("employee_requests")
        .select("id", { count: "exact", head: true })
        .eq("organization_id", organizationId)
        .eq("status", "pending"),

      supabase
        .from("employee_requests")
        .select("id,created_at,reviewed_at,status")
        .eq("organization_id", organizationId)
        .gte("reviewed_at", timestamps.from)
        .lt("reviewed_at", timestamps.to)
        .not("reviewed_at", "is", null)
        .in("status", ["approved", "rejected", "completed"])
        .limit(10000),

      // Attendance corrections reviewed this month
      supabase
        .from("attendance_corrections")
        .select("id,created_at,reviewed_at,status")
        .eq("organization_id", organizationId)
        .gte("reviewed_at", timestamps.from)
        .lt("reviewed_at", timestamps.to)
        .not("reviewed_at", "is", null)
        .in("status", ["approved", "rejected"])
        .limit(10000),

      supabase
        .from("attendance_days")
        .select("user_id,work_date,status")
        .eq("organization_id", organizationId)
        .gte("work_date", start)
        .lte("work_date", today)
        .limit(10000),

      supabase
        .from("attendance_corrections")
        .select("id,user_id,created_at,correction_type")
        .eq("organization_id", organizationId)
        .eq("status", "pending")
        .order("created_at", { ascending: false })
        .limit(100),

      supabase
        .from("attendance_deduction_proposals")
        .select("id,user_id,created_at,incident_type,status")
        .eq("organization_id", organizationId)
        .in("status", OPEN_DEDUCTION_STATUSES)
        .order("created_at", { ascending: false })
        .limit(100),
    ]);

    const results = [
      employeesResult,
      requestsResult,
      correctionsThisMonthResult,
      pendingRequestsResult,
      processedResult,
      processedCorrectionsResult,
      attendanceResult,
      correctionsResult,
      deductionsResult,
    ];
    const failed = results.find((result) => result.error);

    if (failed?.error) {
      console.error("HR dashboard query failed:", failed.error.message);

      return NextResponse.json(
        { error: "Unable to load HR dashboard." },
        { status: 500 },
      );
    }

    const requests = requestsResult.data ?? [];
    const correctionsThisMonth = correctionsThisMonthResult.data ?? [];
    const processed = processedResult.data ?? [];
    const processedRequests = processedResult.data ?? [];
    const processedCorrections = processedCorrectionsResult.data ?? [];
    const attendance = attendanceResult.data ?? [];
    const corrections = correctionsResult.data ?? [];
    const deductions = deductionsResult.data ?? [];
    const totalRequests = (requestsResult.count ?? 0) + (correctionsThisMonthResult.count ?? 0);
    const resolvedItems = [
      ...processedRequests,
      ...processedCorrections,
    ].filter((item) => item.created_at && item.reviewed_at);

    const durations = resolvedItems
      .map(
        (item) =>
          new Date(item.reviewed_at!).getTime() -
          new Date(item.created_at).getTime(),
      )
      .filter((duration) => duration >= 0);

    const averageHours =
      durations.length > 0
        ? durations.reduce((sum, duration) => sum + duration, 0) /
          durations.length /
          3_600_000
        : null;
    // اتجاه الحضور والطلبات لكل يوم.
    const trendMap = new Map(
      dates.map((date) => [
        date,
        {
          date,
          present: 0,
          late: 0,
          absent: 0,
          submitted: 0,
          processed: 0,
        },
      ]),
    );

    for (const row of attendance) {
      const point = trendMap.get(row.work_date);
      if (!point) continue;

      if (
        ["present", "late", "early_leave", "late_early_leave"].includes(
          row.status,
        )
      ) {
        point.present += 1;
      }

      if (["late", "late_early_leave"].includes(row.status)) {
        point.late += 1;
      }

      if (row.status === "absent_confirmed") {
        point.absent += 1;
      }
    }

    for (const request of requests) {
      const date = dateKeyInSaudiArabia(new Date(request.created_at));
      const point = trendMap.get(date);
      if (point) point.submitted += 1;
    }

    for (const request of correctionsThisMonth) {
      const date = dateKeyInSaudiArabia(new Date(request.created_at));
      const point = trendMap.get(date);

      if (point) point.submitted += 1;
    }

    for (const request of [...processed, ...processedCorrections]) {
      if (!request.reviewed_at) continue;

      const date = dateKeyInSaudiArabia(new Date(request.reviewed_at));
      const point = trendMap.get(date);

      if (point) point.processed += 1;
    }

    // توزيع الحضور بحسب الحالة الفعلية المسجلة.
    const attendanceCounts = new Map<string, number>();

    for (const row of attendance) {
      attendanceCounts.set(
        row.status,
        (attendanceCounts.get(row.status) ?? 0) + 1,
      );
    }

    const attendanceLabels: Record<string, string> = {
      present: "حاضر",
      late: "متأخر",
      early_leave: "انصراف مبكر",
      late_early_leave: "تأخير وانصراف مبكر",
      possible_absence: "غياب محتمل",
      absent_confirmed: "غياب مؤكد",
      incomplete: "سجل غير مكتمل",
      correction_pending: "تصحيح معلق",
      on_leave: "إجازة",
      scheduled: "مجدول",
      day_off: "يوم راحة",
      holiday: "عطلة",
    };

    const attendanceDistribution = [...attendanceCounts.entries()].map(
      ([status, value]) => ({
        name: attendanceLabels[status] ?? status,
        value,
      }),
    );

    const requestCounts = new Map<string, number>();

    for (const request of requests) {
      const type = request.request_type || "other";
      requestCounts.set(type, (requestCounts.get(type) ?? 0) + 1);
    }

    for (const correction of correctionsThisMonth) {
      const type = "attendance_correction";
      requestCounts.set(type, (requestCounts.get(type) ?? 0) + 1);
    }

    const requestTypeLabels: Record<string, string> = {
      leave: "إجازة",
      employment_letter: "خطاب تعريف",
      inquiry: "استفسار",
      data_update: "تحديث بيانات",
      attendance_correction: "تصحيح الحضور",
      other: "أخرى",
    };

    const requestDistribution = Array.from(requestCounts, ([name, value]) => ({
      name: requestTypeLabels[name] ?? name,
      value,
    }));

    // توزيع سجلات الحضور حسب الإدارة المسجلة للموظف.
    const userIds = [
      ...new Set([
        ...attendance.map((row) => row.user_id),
        ...requests.map((row) => row.user_id),
        ...corrections.map((row) => row.user_id),
        ...deductions.map((row) => row.user_id),
      ]),
    ];

    const employeeResult = await supabase
      .from("payroll_employees")
      .select("user_id,full_name,department")
      .eq("organization_id", organizationId)
      .limit(10000);

    if (employeeResult.error) {
      console.error(
        "HR dashboard employee lookup failed:",
        employeeResult.error.message,
      );

      return NextResponse.json(
        { error: "Unable to load employee details." },
        { status: 500 },
      );
    }

    const employeeByUser = new Map(
      (employeeResult.data ?? [])
        .filter((employee) => employee.user_id)
        .map((employee) => [employee.user_id!, employee]),
    );

    const departmentMap = new Map<
      string,
      { department: string; present: number; late: number; absent: number }
    >();

    for (const row of attendance) {
      const employee = employeeByUser.get(row.user_id);
      const department = employee?.department?.trim() || "غير محدد";

      if (!departmentMap.has(department)) {
        departmentMap.set(department, {
          department,
          present: 0,
          late: 0,
          absent: 0,
        });
      }

      const item = departmentMap.get(department)!;

      if (
        ["present", "late", "early_leave", "late_early_leave"].includes(
          row.status,
        )
      ) {
        item.present += 1;
      }

      if (["late", "late_early_leave"].includes(row.status)) {
        item.late += 1;
      }

      if (row.status === "absent_confirmed") {
        item.absent += 1;
      }
    }

    const employeeName = (userId: string) =>
      employeeByUser.get(userId)?.full_name?.trim() ||
      (userIds.includes(userId) ? "موظف" : "غير معروف");

    // دمج أحدث الطلبات والتصحيحات والخصومات المعلقة في جدول واحد.
    const pendingItems = [
      ...requests
        .filter((request) => request.status === "pending")
        .map((request) => ({
          id: `request-${request.id}`,
          employee: employeeName(request.user_id),
          type: request.request_type,
          title: request.title ?? "",
          createdAt: request.created_at,
          status: "pending",
          href: "/employee-experience/requests",
        })),

      ...corrections.map((correction) => ({
        id: `correction-${correction.id}`,
        employee: employeeName(correction.user_id),
        type: "correction",
        title: correction.correction_type,
        createdAt: correction.created_at,
        status: "pending",
        href: "/attendance/dashboard",
      })),

      ...deductions.map((deduction) => ({
        id: `deduction-${deduction.id}`,
        employee: employeeName(deduction.user_id),
        type: "deduction",
        title: deduction.incident_type,
        createdAt: deduction.created_at,
        status: deduction.status,
        href: "/attendance/deductions",
      })),
    ]
      .sort(
        (first, second) =>
          new Date(second.createdAt).getTime() -
          new Date(first.createdAt).getTime(),
      )
      .slice(0, 10);

    return NextResponse.json({
      period: { start, end: today },

      metrics: {
        employees: employeesResult.count ?? 0,
        requests: totalRequests,
        averageHours,
        processedRequests: durations.length,
        pendingRequests: pendingRequestsResult.count ?? 0,
        pendingCorrections: corrections.length,
        pendingDeductions: deductions.length,
        pendingTotal:
          (pendingRequestsResult.count ?? 0) +
          corrections.length +
          deductions.length,
      },

      trend: [...trendMap.values()],
      attendanceDistribution,
      requestDistribution,
      departmentPerformance: [...departmentMap.values()]
        .sort((a, b) => b.present - a.present)
        .slice(0, 8),
      pendingItems,
    });
  } catch (error) {
    console.error("HR dashboard summary failed:", error);

    return NextResponse.json(
      { error: "Unable to load HR dashboard." },
      { status: 500 },
    );
  }
}