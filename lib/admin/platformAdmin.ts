import "server-only";

import { NextResponse } from "next/server";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { createSupabaseAdminClient } from "@/lib/supabase-auth/admin";

export async function requirePlatformAdmin(
  sessionClient: SupabaseClient,
): Promise<{ user: User } | { response: NextResponse }> {
  const {
    data: { user },
    error: userError,
  } = await sessionClient.auth.getUser();

  if (userError || !user) {
    return {
      response: NextResponse.json(
        { error: "Authentication required." },
        { status: 401 },
      ),
    };
  }

  const adminClient = createSupabaseAdminClient();

  const { data, error } = await adminClient
    .from("organization_memberships")
    .select("id")
    .eq("user_id", user.id)
    .eq("role", "admin")
    .limit(1);

  if (error) {
    console.error(
      "Platform-admin verification failed:",
      error,
    );

    return {
      response: NextResponse.json(
        { error: "Unable to verify administrator access." },
        { status: 500 },
      ),
    };
  }

  if (!data?.length) {
    return {
      response: NextResponse.json(
        { error: "Platform administrator access required." },
        { status: 403 },
      ),
    };
  }

  return { user };
}
