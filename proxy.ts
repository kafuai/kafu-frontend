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
  "/employee-experience/employee",
  "/employee-experience/requests",
  "/employee-experience/policies",
  "/admin",
  "/profile",
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
        assessment_completed: boolean | null; // NEW: حالة إكمال Assessment
        onboarding_completed: boolean | null; // Existing: حالة إكمال Onboarding بالكامل
      }
    | {
        id: string;
        company_id: string | null;
        assessment_completed: boolean | null; // NEW: حالة إكمال Assessment
        onboarding_completed: boolean | null; // Existing: حالة إكمال Onboarding بالكامل
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
      assessmentCompleted: false, // NEW: لا يوجد Organization = Assessment غير مكتمل
      onboardingCompleted: false, // Existing logic
      role: null,
    };
  }

  /*
   * A user may theoretically have more than one organization
   * membership. We consider the relevant state completed if
   * any organization is marked as completed.
   */
  let assessmentCompleted = false; // NEW: نحفظ حالة Assessment بشكل مستقل
  let onboardingCompleted = false; // Existing: نحفظ حالة Onboarding الكاملة
  let role: string | null = null;

  typedMemberships.forEach((membership) => {
    const organization =
      Array.isArray(membership.organizations)
        ? membership.organizations[0]
        : membership.organizations;
    if (!role && membership.role){
      role = membership.role;
    }

    if (organization?.assessment_completed === true) {
      assessmentCompleted = true; // NEW: المستخدم أكمل Assessment
    }

    if (organization?.onboarding_completed === true) {
      onboardingCompleted = true; // Existing: المستخدم أكمل Discovery أيضًا
    }
  });

  return {
    assessmentCompleted, // NEW
    onboardingCompleted, // Existing
    role,
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
   * Onboarding state is now a persisted organization-level
   * state. The proxy no longer calculates completion from
   * Assessment or Discovery data.
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
 *
 * The user is only allowed to access /assessment.
 * Discovery and all protected workspace routes
 * must redirect back to Assessment.
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
 * Assessment is completed, but Discovery is NOT completed.
 *
 * The user can access Assessment and Discovery.
 * Any other protected route must redirect to Discovery.
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
 * STEP 4:
 * Assessment + Discovery are completed.
 *
 * Check RBAC permissions for pilot routes.
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
}


export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};