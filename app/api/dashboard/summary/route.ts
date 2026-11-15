import "server-only";

import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-auth/server";
import { resolveWorkspaceIdentity } from "@/lib/workspace-identity/tenantResolver";
import { dateKeyInTz } from "@/src/enterprise/business/attendance/utils/time";
import { DEFAULT_TZ } from "@/src/enterprise/business/attendance/utils/schedule";

type Metric<T> = { status: "available"; value: T } | { status: "unavailable"; reason: string };

function unavailable(reason: string): Metric<never> {
  return { status: "unavailable", reason };
}

function monthStart(offset: number, today: string): string {
  const [year, month] = today.slice(0, 7).split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1 + offset, 1));
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-01`;
}

function monthEnd(start: string): string {
  const [year, month] = start.split("-").map(Number);
  const date = new Date(Date.UTC(year, month, 0));
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
}

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: auth, error: authError } = await supabase.auth.getUser();

    if (authError || !auth.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const identity = await resolveWorkspaceIdentity(supabase);
    if (!identity?.organizationId || identity.userId !== auth.user.id) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 403 });
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("full_name,email")
      .eq("id", auth.user.id)
      .maybeSingle();

    const { data: employee, error: employeeError } = await supabase
      .from("payroll_employees")
      .select("employee_number,job_title,department,status")
      .eq("organization_id", identity.organizationId)
      .eq("user_id", auth.user.id)
      .maybeSingle();

    const personal = {
      fullName: profile?.full_name ?? auth.user.user_metadata?.full_name ?? null,
      email: profile?.email ?? auth.user.email ?? null,
      jobTitle: employee?.job_title ?? null,
      department: employee?.department ?? null,
      employeeNumber: employee?.employee_number ?? null,
      employmentDataAvailable: !employeeError && Boolean(employee),
      profileDataAvailable: !profileError,
    };

    let owner: Record<string, Metric<unknown>> | null = null;
    if (identity.role === "owner") {
      const today = dateKeyInTz(Date.now(), DEFAULT_TZ);
      const currentMonth = monthStart(0, today);
      const thirdMonthEnd = monthEnd(monthStart(2, today));

      const [
        activeEmployees,
        attendanceLate,
        employeeRequests,
        corrections,
        payrollRuns,
      ] = await Promise.all([
        supabase.from("payroll_employees").select("id", { count: "exact", head: true })
          .eq("organization_id", identity.organizationId).eq("status", "active"),
        supabase.from("attendance_days").select("user_id,status")
          .eq("organization_id", identity.organizationId).eq("work_date", today)
          .in("status", ["late", "late_early_leave"]),
        supabase.from("employee_requests").select("id", { count: "exact", head: true })
          .eq("organization_id", identity.organizationId).eq("status", "pending"),
        supabase.from("attendance_corrections").select("id", { count: "exact", head: true })
          .eq("organization_id", identity.organizationId).eq("status", "pending"),
        supabase.from("payroll_runs").select("id,period_start,period_end,status")
          .eq("organization_id", identity.organizationId)
          .lte("period_start", thirdMonthEnd).gte("period_end", currentMonth),
      ]);

      owner = {
        activeEmployees: activeEmployees.error
          ? unavailable("تعذر قراءة بيانات الموظفين النشطين.")
          : { status: "available", value: activeEmployees.count ?? 0 },
        lateEmployees: attendanceLate.error
          ? unavailable("تعذر قراءة تقييمات الحضور لهذا اليوم.")
          : { status: "available", value: new Set((attendanceLate.data ?? []).map((row) => row.user_id)).size },
        pendingRequests: employeeRequests.error || corrections.error
          ? unavailable("تعذر قراءة جميع أنواع الطلبات قيد المراجعة.")
          : { status: "available", value: (employeeRequests.count ?? 0) + (corrections.count ?? 0) },
        // contracts: unavailable("لا يوجد جدول عقود مستقل في المخطط المرفق؛ حقول تواريخ العقد داخل payroll_employees لا تكفي لإثبات سجل عقد مستقل."),
        payrollPeriods: payrollRuns.error
          ? unavailable("تعذر قراءة مسيرات الرواتب للفترات القادمة.")
          : {
              status: "available",
              value: [0, 1, 2].map((offset) => {
                const start = monthStart(offset, today);
                const end = monthEnd(start);
                const matches = (payrollRuns.data ?? []).filter(
                  (run) => run.period_start <= end && run.period_end >= start,
                );
                return {
                  periodStart: start,
                  periodEnd: end,
                  runCount: matches.length,
                  run: matches.length === 1
                    ? { id: matches[0].id, status: matches[0].status, periodMatchesCalendar: matches[0].period_start === start && matches[0].period_end === end }
                    : null,
                  state: matches.length === 0
                    ? "not_created"
                    : matches.length === 1
                      ? "created"
                      : "multiple_runs",
                };
              }),
            },
      };
    }

    if (profileError) console.error("Dashboard profile query failed:", profileError);
    if (employeeError) console.error("Dashboard employee profile query failed:", employeeError);

    return NextResponse.json({
      role: identity.role,
      personal,
      owner,
    });
  } catch (error) {
    console.error("Dashboard summary failed:", error);
    return NextResponse.json({ error: "Unable to load dashboard." }, { status: 500 });
  }
}
