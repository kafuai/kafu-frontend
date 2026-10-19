import "server-only";

import { NextResponse } from "next/server";

import {
  createSupabaseServerClient,
} from "@/lib/supabase-auth/server";

import {
  resolveWorkspaceIdentity,
} from "@/lib/workspace-identity/tenantResolver";

import { EmploymentLetterManager } from "@/src/enterprise/business/employmentLetters/employmentLetterManager";

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const parts = url.pathname.split("/").filter(Boolean);
    const rejectIndex = parts.lastIndexOf("reject");
    const id = rejectIndex > 0 ? parts[rejectIndex - 1] : "";

    if (!id) {
      return NextResponse.json(
        { error: "A request ID is required." },
        { status: 400 },
      );
    }

    const body = await request.json().catch(() => ({}));
    const reason =
      typeof body.reason === "string" ? body.reason.trim() : undefined;

    const supabase = await createSupabaseServerClient();
    const identity = await resolveWorkspaceIdentity(supabase);

    const employmentLetterManager = new EmploymentLetterManager(
      supabase,
    );

    const letter = await employmentLetterManager.reject(
      id,
      identity.organizationId,
      reason,
    );

    return NextResponse.json({
      data: {
        type: "employment_letter_rejection",
        message: "تم رفض طلب خطاب التعريف.",
        status: letter.status,
        requestId: letter.id,
      },
    });
  } catch (error) {
    console.error(
      "Employment letter rejection failed:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Employment letter rejection failed.",
      },
      { status: 500 },
    );
  }
}