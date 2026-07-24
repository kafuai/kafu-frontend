import type {
  User,
} from "@supabase/supabase-js";

import {
  createSupabaseServerClient,
} from "../../../lib/supabase-auth/server";

export async function getAuthenticatedUser():
  Promise<User | null> {
  const supabase =
    await createSupabaseServerClient();

  const {
    data,
    error,
  } = await supabase.auth.getUser();

  if (error || !data.user) {
    return null;
  }

  return data.user;
}

export async function requireAuthenticatedUser():
  Promise<User> {
  const user = await getAuthenticatedUser();

  if (!user) {
    throw new Error(
      "Authentication is required.",
    );
  }

  return user;
}

export async function getAuthenticatedUserId():
  Promise<string | null> {
  const user = await getAuthenticatedUser();

  return user?.id ?? null;
}
