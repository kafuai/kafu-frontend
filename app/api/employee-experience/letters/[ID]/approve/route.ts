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
    const approveIndex = parts.lastIndexOf("approve");
    const id = approveIndex > 0 ? parts[approveIndex - 1] : "";

    if (!id) {
      return NextResponse.json(
        { error: "A request ID is required." },
        { status: 400 },
      );
    }

    const supabase = await createSupabaseServerClient();
    const identity = await resolveWorkspaceIdentity(supabase);

    const employmentLetterManager = new EmploymentLetterManager(
      supabase,
    );

    const letter = await employmentLetterManager.approve(
      id,
      identity.organizationId,
    );

    return NextResponse.json({
      data: {
        type: "employment_letter_approval",
        message: "تمت الموافقة على طلب خطاب التعريف.",
        status: letter.status,
        requestId: letter.id,
      },
    });
  } catch (error) {
    console.error(
      "Employment letter approval failed:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Employment letter approval failed.",
      },
      { status: 500 },
    );
  }
}