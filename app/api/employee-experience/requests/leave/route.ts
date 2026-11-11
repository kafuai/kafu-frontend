import "server-only";
import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase-auth/server";
import { resolveWorkspaceIdentity } from "@/lib/workspace-identity/tenantResolver";
import { PolicyManager } from "@/src/enterprise/business/policies/policyManager";
import { EmploymentLetterManager } from "@/src/enterprise/business/employmentLetters/employmentLetterManager";
import { EmployeeExperienceAgent } from "@/src/enterprise/ai/agents/employeeExperience/employeeExperience";
import { createEmployeeExperienceAgentProfile } from "@/src/enterprise/ai/agents/employeeExperience/employeeExperienceAgentProfile";
import {
  LeaveManager,
  LeaveValidationError,
  parseDateKey,
} from "@/src/enterprise/business/leave";

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    // Identity only from the session — never from the form.
    const identity = await resolveWorkspaceIdentity(supabase);

    const form = await request.formData();
    const lang: "ar" | "en" = form.get("locale") === "ar" ? "ar" : "en";

    if (form.get("leaveType") !== "sick") {
      return NextResponse.json({ error: "Unsupported leave type." }, { status: 400 });
    }

    const start = parseDateKey(String(form.get("startDate") ?? ""));
    const end = parseDateKey(String(form.get("endDate") ?? ""));
    if (start === null || end === null) {
      throw new LeaveValidationError([
        lang === "en"
          ? "Please provide valid start and end dates."
          : "الرجاء إدخال تاريخ بداية ونهاية صحيحين.",
      ]);
    }

    const note = form.get("reason");
    const reason =
      typeof note === "string" && note.trim() ? note.trim().slice(0, 500) : "Sick leave";

    const agent = new EmployeeExperienceAgent(
      createEmployeeExperienceAgentProfile(identity.organizationId),
      new LeaveManager(supabase),
      new PolicyManager(supabase),
      new EmploymentLetterManager(supabase),
    );

    const result = await agent.submitSickLeave({
      employeeId: identity.userId,
      organizationId: identity.organizationId,
      companyId: identity.companyId,
      startDate: start,
      endDate: end,
      reason,
      file: form.get("certificate"),
      locale: lang,
    });

    return NextResponse.json({ data: { type: "leave_request", ...result } }, { status: 201 });
  } catch (error) {
    if (error instanceof LeaveValidationError) {
      return NextResponse.json({ error: error.message, errors: error.errors }, { status: 400 });
    }
    console.error("Sick leave submission failed:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Sick leave submission failed." },
      { status: 500 },
    );
  }
}