
import {
  NextResponse,
  type NextRequest,
} from "next/server";

import {
  createServerClient,
} from "@supabase/ssr";

import {
  getRoutePermission,
  hasPermission,
} from "@/lib/rbac/authorization";

const protectedRoutes = [
  "/assessment",
  "/corporate-brain",
  "/digital-workforce",
  "/discovery",
  "/employee-experience",
  "/admin",
  "/profile",
  "/payroll",
  "/attendance",
  "/dashboard",
  "/approvals",
  "/departments",
  "/hr-dashboard",
];

const guestRoutes = [
  "/login",
  "/register",
  "/forgot-password",
  "/book-demo",
];

const onboardingRoutes = [
  "/assessment",
  "/discovery",
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

type MembershipRow = {
  organization_id: string;
  role: string | null;

  organizations:
    | {
        id: string;
        company_id: string | null;
        assessment_completed: boolean | null;
        onboarding_completed: boolean | null;
      }
    | {
        id: string;
        company_id: string | null;
        assessment_completed: boolean | null;
        onboarding_completed: boolean | null;
      }[]
    | null;
};

async function getOnboardingState(
  supabase: ReturnType<typeof createServerClient>,
  userId: string,
): Promise<{
  assessmentCompleted: boolean;
  onboardingCompleted: boolean;
  role: string | null;
} | null> {
  const {
    data: memberships,
    error,
  } = await supabase
    .from("organization_memberships")
    .select(`
      organization_id,
      role,
      organizations (
        id,
        company_id,
        assessment_completed,
        onboarding_completed
      )
    `)
    .eq("user_id", userId);

  if (error) {
    console.error(
      "Failed to load organization onboarding state:",
      error,
    );

    return null;
  }

  const typedMemberships =
    (memberships ?? []) as MembershipRow[];

  if (typedMemberships.length === 0) {
    return {
      assessmentCompleted: false,
      onboardingCompleted: false,
      role: null,
    };
  }

  let assessmentCompleted = false;
  let onboardingCompleted = false;
  let role: string | null = null;

  typedMemberships.forEach((membership) => {
    const organization =
      Array.isArray(membership.organizations)
        ? membership.organizations[0]
        : membership.organizations;

    if (membership.role?.toLowerCase() === "admin") {
      role = "admin";
    } else if (!role && membership.role) {
      role = membership.role;
    }

    if (
      organization?.assessment_completed === true
    ) {
      assessmentCompleted = true;
    }

    if (
      organization?.onboarding_completed === true
    ) {
      onboardingCompleted = true;
    }
  });

  return {
    assessmentCompleted,
    onboardingCompleted,
    role,
  };
}

/**
 * Organization suspension enforcement.
 *
 * Reads membership and organization status using
 * the authenticated server-side Supabase client.
 *
 * Fails closed if the status cannot be verified.
 */
async function getOrganizationAccessState(
  supabase: ReturnType<typeof createServerClient>,
  userId: string,
): Promise<{
  hasMembership: boolean;
  hasSuspendedOrganization: boolean;
  isPlatformAdmin: boolean;
} | null> {
  const { data, error } = await supabase
    .from("organization_memberships")
    .select("role, organizations(is_active)")
    .eq("user_id", userId);

  if (error) {
    console.error(
      "Failed to verify organization status:",
      error,
    );

    return null;
  }

  const rows = (data ?? []) as Array<{
    role: string | null;
    organizations:
      | { is_active: boolean | null }
      | { is_active: boolean | null }[]
      | null;
  }>;

  const isPlatformAdmin = rows.some(
    (row) => row.role?.toLowerCase() === "admin",
  );

  // Fail closed if any linked organization is suspended.
  // This prevents switching to a suspended tenant
  // through an account with multiple memberships.
  const hasSuspendedOrganization = rows.some((row) => {
    const organization = Array.isArray(row.organizations)
      ? row.organizations[0]
      : row.organizations;

    return organization?.is_active !== true;
  });

  return {
    hasMembership: rows.length > 0,
    hasSuspendedOrganization,
    isPlatformAdmin,
  };
}

function redirectToPath(
  request: NextRequest,
  pathname: string,
): NextResponse {
  const url = request.nextUrl.clone();

  url.pathname = pathname;
  url.search = "";

  return NextResponse.redirect(url);
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
              request.cookies.set(
                name,
                value,
              );
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

  const pathname =
    request.nextUrl.pathname;

  const isProtectedRoute =
    matchesRoute(
      pathname,
      protectedRoutes,
    );

  const isGuestRoute =
    matchesRoute(
      pathname,
      guestRoutes,
    );

  const isOnboardingRoute =
    matchesRoute(
      pathname,
      onboardingRoutes,
    );

  /*
   * Organization suspension enforcement.
   *
   * Covers protected pages and every incoming
   * Next.js API route.
   *
   * Users without memberships continue through
   * the existing onboarding flow.
   */

  if (
    data.user &&
    (
      isProtectedRoute ||
      pathname.startsWith("/api/")
    ) &&
    pathname !== "/organization-suspended"
  ) {
    const organizationAccess =
      await getOrganizationAccessState(
        supabase,
        data.user.id,
      );

    if (organizationAccess === null) {
      return NextResponse.json(
        {
          error:
            "Unable to verify organization access.",
        },
        { status: 503 },
      );
    }

    if (
      organizationAccess.hasMembership &&
      !organizationAccess.isPlatformAdmin &&
      organizationAccess.hasSuspendedOrganization
    ) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json(
          {
            error: "This organization is suspended.",
          },
          { status: 403 },
        );
      }

      return redirectToPath(
        request,
        "/organization-suspended",
      );
    }
  }

  /*
   * Unauthenticated users cannot access protected routes.
   */
  if (
    !data.user &&
    isProtectedRoute
  ) {
    const loginUrl =
      request.nextUrl.clone();

    loginUrl.pathname = "/login";

    loginUrl.searchParams.set(
      "next",
      `${pathname}${request.nextUrl.search}`,
    );

    return NextResponse.redirect(
      loginUrl,
    );
  }

  /*
   * Authenticated users should not access guest routes.
   */
  if (
    data.user &&
    isGuestRoute
  ) {
    return redirectToPath(
      request,
      "/employee-experience",
    );
  }

  /*
   * Existing onboarding state.
   */
  if (
    data.user &&
    isProtectedRoute
  ) {
    const onboardingState =
      await getOnboardingState(
        supabase,
        data.user.id,
      );

    if (onboardingState === null) {
      return response;
    }

    const {
      assessmentCompleted,
      onboardingCompleted,
      role,
    } = onboardingState;

    /*
     * STEP 1:
     * Assessment is NOT completed.
     */

    if (
      !assessmentCompleted &&
      pathname !== "/assessment"
    ) {
      return redirectToPath(
        request,
        "/assessment",
      );
    }

    /*
     * STEP 2:
     * Assessment completed, Discovery incomplete.
     */

    if (
      assessmentCompleted &&
      !onboardingCompleted &&
      !isOnboardingRoute
    ) {
      return redirectToPath(
        request,
        "/discovery",
      );
    }

    /*
     * STEP 3:
     * Existing RBAC authorization.
     */

    const routePermission =
      getRoutePermission(pathname);

    if (
      routePermission &&
      !role
    ) {
      return redirectToPath(
        request,
        "/unauthorized",
      );
    }

    if (
      routePermission &&
      role &&
      !hasPermission(
        role,
        routePermission,
      )
    ) {
      return redirectToPath(
        request,
        "/unauthorized",
      );
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
