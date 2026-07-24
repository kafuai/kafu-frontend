import {
  NextResponse,
  type NextRequest,
} from "next/server";
import {
  createServerClient,
} from "@supabase/ssr";

const protectedRoutes = [
  "/assessment",
  "/command-center",
  "/commercial",
  "/company-dashboard",
  "/company-profile",
  "/company-workspace",
  "/corporate-brain",
  "/corporate-dna",
  "/dashboard",
  "/digital-workforce",
  "/discovery",
  "/executive-summary",
  "/journey",
  "/modules",
  "/sales-intelligence",
  "/workspace",
];

const guestRoutes = [
  "/login",
  "/register",
  "/forgot-password",
];

function matchesRoute(
  pathname: string,
  routes: readonly string[],
): boolean {
  return routes.some(
    (route) =>
      pathname === route ||
      pathname.startsWith(`${route}/`),
  );
}

function getSupabasePublicKey(): string {
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!key) {
    throw new Error(
      "Missing Supabase publishable or anonymous key.",
    );
  }

  return key;
}

export async function proxy(
  request: NextRequest,
) {
  let response = NextResponse.next({
    request,
  });

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!supabaseUrl) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL.",
    );
  }

  const supabase = createServerClient(
    supabaseUrl,
    getSupabasePublicKey(),
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },

        setAll(cookiesToSet) {
          cookiesToSet.forEach(
            ({ name, value }) => {
              request.cookies.set(name, value);
            },
          );

          response = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(
            ({ name, value, options }) => {
              response.cookies.set(
                name,
                value,
                options,
              );
            },
          );
        },
      },
    },
  );

  const {
    data,
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isProtectedRoute =
    matchesRoute(pathname, protectedRoutes);
  const isGuestRoute =
    matchesRoute(pathname, guestRoutes);

  if (!data.user && isProtectedRoute) {
    const loginUrl =
      request.nextUrl.clone();

    loginUrl.pathname = "/login";
    loginUrl.searchParams.set(
      "next",
      `${pathname}${request.nextUrl.search}`,
    );

    return NextResponse.redirect(loginUrl);
  }

  if (data.user && isGuestRoute) {
    const dashboardUrl =
      request.nextUrl.clone();

    dashboardUrl.pathname =
      "/company-dashboard";
    dashboardUrl.search = "";

    return NextResponse.redirect(
      dashboardUrl,
    );
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
