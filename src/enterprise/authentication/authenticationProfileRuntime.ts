import {
  createSupabaseBrowserClient,
} from "../../../lib/supabase-auth/browser";

import {
  AuthenticationProfileService,
} from "./authenticationProfileService";

let browserProfileService:
  AuthenticationProfileService | null = null;

export function getBrowserAuthenticationProfileService():
  AuthenticationProfileService {
  if (!browserProfileService) {
    browserProfileService =
      new AuthenticationProfileService(
        createSupabaseBrowserClient(),
      );
  }

  return browserProfileService;
}
