
import "server-only";

import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase-auth/server";
import { createSupabaseAdminClient } from "@/lib/supabase-auth/admin";
import { requirePlatformAdmin } from "@/lib/admin/platformAdmin";

type Context = {
  params: Promise<{ id: string }>;
};

export async function GET(
  _request: Request,
  context: Context,
) {
  const session = await createSupabaseServerClient();

  const access = await requirePlatformAdmin(session);

  if ("response" in access) {
    return access.response;
  }

  const { id } = await context.params;

  const admin = createSupabaseAdminClient();

  const {
    data: organization,
    error,
  } = await admin
    .from("organizations")
    .select(
      "id,name,slug,created_at,company_id,is_active",
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { error: "Unable to load organization." },
      { status: 500 },
    );
  }

  if (!organization) {
    return NextResponse.json(
      { error: "Organization not found." },
      { status: 404 },
    );
  }

  const {
    data: memberships,
    error: membershipError,
  } = await admin
    .from("organization_memberships")
    .select("user_id,role,created_at")
    .eq("organization_id", id)
    .order("created_at", { ascending: true });

  if (membershipError) {
    return NextResponse.json(
      { error: "Unable to load organization users." },
      { status: 500 },
    );
  }

  const userIds = Array.from(
    new Set(
      (memberships ?? []).map(
        (m) => m.user_id,
      ),
    ),
  );

  const {
    data: profiles,
    error: profileError,
  } = userIds.length
    ? await admin
        .from("profiles")
        .select("id,full_name,email")
        .in("id", userIds)
    : { data: [], error: null };

  if (profileError) {
    return NextResponse.json(
      { error: "Unable to load user profiles." },
      { status: 500 },
    );
  }

  const profilesById = new Map(
    (profiles ?? []).map((profile) => [
      profile.id,
      profile,
    ]),
  );

  const users = await Promise.all(
    (memberships ?? []).map(async (membership) => {
      const profile = profilesById.get(
        membership.user_id,
      );

      let email = profile?.email ?? null;

      // Fallback to Auth if profile email is unavailable.
      if (!email) {
        const { data: authUser } =
          await admin.auth.admin.getUserById(
            membership.user_id,
          );

        email = authUser.user?.email ?? null;
      }

      return {
        user_id: membership.user_id,
        role: membership.role,
        joined_at: membership.created_at,
        full_name: profile?.full_name ?? null,
        email,
      };
    }),
  );

  return NextResponse.json({
    data: {
      ...organization,
      users,
    },
  });
}

export async function PATCH(
  request: Request,
  context: Context,
) {
  const session = await createSupabaseServerClient();

  const access = await requirePlatformAdmin(session);

  if ("response" in access) {
    return access.response;
  }

  const { id } = await context.params;

  let body: { is_active?: unknown };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400 },
    );
  }

  if (typeof body.is_active !== "boolean") {
    return NextResponse.json(
      { error: "is_active must be a boolean." },
      { status: 400 },
    );
  }

  const admin = createSupabaseAdminClient();

  // Read current status first.
  const {
    data: before,
    error: findError,
  } = await admin
    .from("organizations")
    .select("id,is_active")
    .eq("id", id)
    .maybeSingle();

  if (findError) {
    return NextResponse.json(
      { error: "Unable to verify organization." },
      { status: 500 },
    );
  }

  if (!before) {
    return NextResponse.json(
      { error: "Organization not found." },
      { status: 404 },
    );
  }

  if (before.is_active === body.is_active) {
    return NextResponse.json({
      data: {
        id,
        is_active: body.is_active,
        unchanged: true,
      },
    });
  }

  // Update organization status.
  const {
    data: updated,
    error: updateError,
  } = await admin
    .from("organizations")
    .update({
      is_active: body.is_active,
    })
    .eq("id", id)
    .select("id,is_active")
    .single();

  if (updateError) {
    console.error(
      "Organization status update failed:",
      updateError,
    );

    return NextResponse.json(
      { error: "Unable to update organization status." },
      { status: 500 },
    );
  }

  // Write audit record.
  const { error: auditError } = await admin
    .from("organization_status_audit_log")
    .insert({
      organization_id: id,
      actor_id: access.user.id,
      action: body.is_active
        ? "activated"
        : "suspended",
      previous_is_active: before.is_active,
      new_is_active: body.is_active,
    });

  if (auditError) {
    // Roll back if the audit record could not be saved.
    await admin
      .from("organizations")
      .update({
        is_active: before.is_active,
      })
      .eq("id", id);

    console.error(
      "Organization status audit failed; status reverted:",
      auditError,
    );

    return NextResponse.json(
      {
        error:
          "Status change could not be audited; the change was reverted.",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    data: updated,
  });
}
