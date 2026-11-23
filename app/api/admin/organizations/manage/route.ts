import "server-only";

import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase-auth/server";
import { createSupabaseAdminClient } from "@/lib/supabase-auth/admin";
import { requirePlatformAdmin } from "@/lib/admin/platformAdmin";

export async function GET() {
  const session = await createSupabaseServerClient();

  const access = await requirePlatformAdmin(session);

  if ("response" in access) {
    return access.response;
  }

  const admin = createSupabaseAdminClient();

  const {
    data: organizations,
    error,
  } = await admin
    .from("organizations")
    .select(
      "id,name,slug,created_at,company_id,is_active",
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Organization list failed:", error);

    return NextResponse.json(
      { error: "Unable to load organizations." },
      { status: 500 },
    );
  }

  const ids = (organizations ?? []).map(
    (org) => org.id,
  );

  const {
    data: membershipUsers,
    error: usersError,
  } = ids.length
    ? await admin
        .from("organization_memberships")
        .select("organization_id,user_id")
        .in("organization_id", ids)
    : { data: [], error: null };

  if (usersError) {
    console.error(
      "Organization membership counts failed:",
      usersError,
    );

    return NextResponse.json(
      {
        error: "Unable to load organization user counts.",
      },
      { status: 500 },
    );
  }

  const usersByOrganization = new Map<
    string,
    Set<string>
  >();

  for (const orgId of ids) {
    usersByOrganization.set(
      orgId,
      new Set(),
    );
  }

  for (const row of membershipUsers ?? []) {
    usersByOrganization
      .get(row.organization_id)
      ?.add(row.user_id);
  }

  return NextResponse.json({
    data: (organizations ?? []).map((org) => ({
      ...org,
      user_count:
        usersByOrganization.get(org.id)?.size ?? 0,
    })),
  });
}
