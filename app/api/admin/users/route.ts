import "server-only";
import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase-auth/server";
import { resolveWorkspaceIdentity } from "@/lib/workspace-identity/tenantResolver";
import { createSupabaseAdminClient } from "@/lib/supabase-auth/admin";

const ALLOWED_ROLES = ["owner", "manager", "member", "viewer"];

// دالة GET الجديدة لجلب المؤسسات
export async function GET(request: Request) {
  const adminClient = createSupabaseAdminClient();

  try {
    const supabase = await createSupabaseServerClient();
    const identity = await resolveWorkspaceIdentity(supabase);

    if (identity.role !== "admin") {
      return NextResponse.json(
        { error: "Access restricted to platform admin." },
        { status: 403 },
      );
    }

    const { data, error } = await adminClient
      .from("organizations")
      .select("id, name, company_id")
      .order("name");

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ data: data });
  } catch (error) {
    console.error("Failed to fetch organizations:", error);
    return NextResponse.json(
      { error: "Unable to load organizations." },
      { status: 500 },
    );
  }
}

// دالة POST الحالية كما هي بدون تغييرات في المنطق
export async function POST(request: Request) {
  const adminClient = createSupabaseAdminClient();

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
    const email =
      typeof body.email === "string" ? body.email.trim() : "";
    const password =
      typeof body.password === "string" ? body.password : "";
    const organizationId =
      typeof body.organizationId === "string"
        ? body.organizationId
        : "";
    const companyId =
      typeof body.companyId === "string" ? body.companyId : "";
    const role =
      typeof body.role === "string" ? body.role : "";

    if (
      !fullName || !email || !password ||
      !organizationId || !companyId || !role
    ) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 },
      );
    }

    if (!ALLOWED_ROLES.includes(role)) {
      return NextResponse.json(
        { error: "Invalid role selected." },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 },
      );
    }

    const { data: orgCheck, error: orgCheckError } = await adminClient
      .from("organizations")
      .select("id, company_id")
      .eq("id", organizationId)
      .maybeSingle();

    if (orgCheckError) {
      throw new Error(orgCheckError.message);
    }

    if (!orgCheck) {
      return NextResponse.json(
        { error: "Selected organization does not exist." },
        { status: 400 },
      );
    }

    if (orgCheck.company_id !== companyId) {
      return NextResponse.json(
        { error: "Company ID does not match the selected organization." },
        { status: 400 },
      );
    }

    const { data: createResult, error: createError } =
      await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          full_name: fullName,
          skip_auto_provisioning: true,
        },
        app_metadata: {
          organization_id: organizationId,
          company_id: companyId,
        },
      });

    if (createError) {
      throw new Error(createError.message);
    }

    if (!createResult.user) {
      throw new Error("User creation returned no user.");
    }

    const createdUserId = createResult.user.id;

    const { error: membershipError } = await adminClient
      .from("organization_memberships")
      .insert({
        organization_id: organizationId,
        user_id: createdUserId,
        role,
      });

    if (membershipError) {
      await adminClient.auth.admin
        .deleteUser(createdUserId)
        .catch((cleanupError) =>
          console.error("Cleanup failed:", cleanupError),
        );

      throw new Error(membershipError.message);
    }

    return NextResponse.json({
      data: {
        userId: createdUserId,
        email: createResult.user.email,
        message: "تم إنشاء المستخدم وربطه بالمؤسسة بنجاح.",
      },
    });
  } catch (error) {
    console.error("Admin user creation failed:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to create user.",
      },
      { status: 500 },
    );
  }
}