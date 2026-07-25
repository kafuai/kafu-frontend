import "server-only";

import {
  createClient,
  type SupabaseClient,
} from "@supabase/supabase-js";

let adminClient: SupabaseClient | null = null;

function requireEnvironmentValue(
  name: string,
  value: string | undefined,
): string {
  const normalized = value?.trim();

  if (!normalized) {
    throw new Error(
      `Missing required server environment variable: ${name}`,
    );
  }

  return normalized;
}

export function createSupabaseAdminClient():
  SupabaseClient {
  if (adminClient) {
    return adminClient;
  }

  const url = requireEnvironmentValue(
    "NEXT_PUBLIC_SUPABASE_URL",
    process.env.NEXT_PUBLIC_SUPABASE_URL,
  );

  const serviceRoleKey = requireEnvironmentValue(
    "SUPABASE_SERVICE_ROLE_KEY",
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  );

  adminClient = createClient(
    url,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        detectSessionInUrl: false,
        persistSession: false,
      },
      global: {
        headers: {
          "X-Client-Info":
            "kafu-ai-meta-whatsapp-webhook",
        },
      },
    },
  );

  return adminClient;
}
