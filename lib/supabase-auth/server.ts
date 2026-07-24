import {
  createServerClient,
} from "@supabase/ssr";
import {
  cookies,
} from "next/headers";

import {
  getSupabasePublicKey,
  getSupabaseUrl,
} from "./environment";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    getSupabaseUrl(),
    getSupabasePublicKey(),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },

        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(
              ({ name, value, options }) => {
                cookieStore.set(
                  name,
                  value,
                  options,
                );
              },
            );
          } catch {
            /*
             * Cookie updates can be unavailable inside
             * Server Components. proxy.ts refreshes sessions.
             */
          }
        },
      },
    },
  );
}
