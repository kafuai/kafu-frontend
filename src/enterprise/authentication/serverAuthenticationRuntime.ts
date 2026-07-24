import {
  createSupabaseServerClient,
} from "../../../lib/supabase-auth/server";

import {
  SupabaseAuthenticationService,
} from "./supabaseAuthenticationService";

export async function createServerAuthenticationService():
  Promise<SupabaseAuthenticationService> {
  const client = await createSupabaseServerClient();

  return new SupabaseAuthenticationService(client);
}
