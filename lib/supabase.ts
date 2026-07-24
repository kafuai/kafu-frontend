import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL;

const supabasePublicKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL.",
  );
}

if (!supabasePublicKey) {
  throw new Error(
    "Missing Supabase publishable or anonymous key.",
  );
}

export const supabase = createBrowserClient(
  supabaseUrl,
  supabasePublicKey,
);
