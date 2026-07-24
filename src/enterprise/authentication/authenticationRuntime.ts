import {
  createSupabaseBrowserClient,
} from "../../../lib/supabase-auth/browser";

import {
  SupabaseAuthenticationService,
} from "./supabaseAuthenticationService";

let browserAuthenticationService:
  SupabaseAuthenticationService | null = null;

export function getBrowserAuthenticationService():
  SupabaseAuthenticationService {
  if (!browserAuthenticationService) {
    browserAuthenticationService =
      new SupabaseAuthenticationService(
        createSupabaseBrowserClient(),
      );
  }

  return browserAuthenticationService;
}
