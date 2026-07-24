import {
  createBrowserClient,
} from "@supabase/ssr";

import {
  getSupabasePublicKey,
  getSupabaseUrl,
} from "./environment";

export function createSupabaseBrowserClient() {
  return createBrowserClient(
    getSupabaseUrl(),
    getSupabasePublicKey(),
  );
}
