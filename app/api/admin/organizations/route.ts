import "server-only";
import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase-auth/server";
import { resolveWorkspaceIdentity } from "@/lib/workspace-identity/tenantResolver";
import { createSupabaseAdminClient } from "@/lib/supabase-auth/admin";

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const identity = await resolveWorkspaceIdentity(supabase);

    if (identity.role !== "admin") {
      return NextResponse.json(
        { error: "Access restricted to platform admin." },
        { status: 403 },
      );
    }

    const body = await request.json();

    const fullName =
      typeof body.fullName === "string" ? body.fullName.trim() : "";
    const companyName =
      typeof body.companyName === "string"
        ? body.companyName.trim()
        : "";
    const email =
      typeof body.email === "string" ? body.email.trim() : "";
    const password =
      typeof body.password === "string" ? body.password : "";

    if (!fullName || !companyName || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 },
      );
    }

    const adminClient = createSupabaseAdminClient();

    const { data, error } =
      await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          full_name: fullName,
          company_name: companyName,
        },
      });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error("User creation returned no user.");
    }

    return NextResponse.json({
      data: {
        userId: data.user.id,
        email: data.user.email,
        message:
          "تم إنشاء المستخدم والمؤسسة والشركة بنجاح.",
      },
    });
  } catch (error) {
    console.error("Admin user provisioning failed:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to create organization and user.",
      },
      { status: 500 },
    );
  }
}