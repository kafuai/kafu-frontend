import {
  NextResponse,
  type NextRequest,
} from "next/server";

import {
  createSupabaseServerClient,
} from "../../../lib/supabase-auth/server";

function resolveSafeRedirectPath(
  value: string | null,
): string {
  if (
    !value ||
    !value.startsWith("/") ||
    value.startsWith("//")
  ) {
    return "/company-dashboard";
  }

  return value;
}

export async function GET(
  request: NextRequest,
) {
  const requestUrl = new URL(request.url);
  const code =
    requestUrl.searchParams.get("code");
  const next = resolveSafeRedirectPath(
    requestUrl.searchParams.get("next"),
  );

  if (!code) {
    return NextResponse.redirect(
      new URL(
        "/?auth_error=missing_code",
        requestUrl.origin,
      ),
    );
  }

  const supabase =
    await createSupabaseServerClient();

  const { error } =
    await supabase.auth.exchangeCodeForSession(
      code,
    );

  if (error) {
    return NextResponse.redirect(
      new URL(
        "/?auth_error=callback_failed",
        requestUrl.origin,
      ),
    );
  }

  return NextResponse.redirect(
    new URL(next, requestUrl.origin),
  );
}
