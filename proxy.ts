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

type MembershipRow = {
  organizations:
    | {
        id: string;
        company_id: string | null;
      }
    | {
        id: string;
        company_id: string | null;
      }[]
    | null;
};

type CompanyRow = {
  id: string;
  name: string | null;
  industry: string | null;
  country: string | null;
  employee_count: number | null;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  contact_title: string | null;
};

type DiscoveryAnswerRow = {
  company_id: string;
  question_order: number | null;
};

async function getOnboardingRedirect(
  supabase: ReturnType<typeof createServerClient>,
  userId: string,
  request: NextRequest,
): Promise<NextResponse | null> {
  const {
    data: memberships,
    error: membershipError,
  } = await supabase
    .from("organization_memberships")
    .select(`
      organizations (
        id,
        company_id
      )
    `)
    .eq("user_id", userId);

  if (membershipError) {
    return null;
  }

  const typedMemberships =
    (memberships ?? []) as MembershipRow[];

  const companyIds = typedMemberships
    .flatMap((membership) => {
      const organization = Array.isArray(
        membership.organizations,
      )
        ? membership.organizations[0]
        : membership.organizations;

      return organization?.company_id
        ? [organization.company_id]
        : [];
    });

  if (companyIds.length === 0) {
    const assessmentUrl =
      request.nextUrl.clone();

    assessmentUrl.pathname = "/assessment";
    assessmentUrl.search = "";

    return NextResponse.redirect(
      assessmentUrl,
    );
  }

  const {
    data: companies,
    error: companyError,
  } = await supabase
    .from("companies")
    .select(`
      id,
      name,
      industry,
      country,
      employee_count,
      contact_name,
      contact_email,
      contact_phone,
      contact_title
    `)
    .in("id", companyIds);

  if (companyError) {
    return null;
  }

  const typedCompanies =
    (companies ?? []) as CompanyRow[];

  const assessmentCompleted =
    typedCompanies.some(
      (company) =>
        Boolean(company.name?.trim()) &&
        Boolean(company.industry?.trim()) &&
        Boolean(company.country?.trim()) &&
        company.employee_count !== null &&
        Boolean(company.contact_name?.trim()) &&
        Boolean(company.contact_email?.trim()) &&
        Boolean(company.contact_phone?.trim()) &&
        Boolean(company.contact_title?.trim()),
    );

  if (!assessmentCompleted) {
    const assessmentUrl =
      request.nextUrl.clone();

    assessmentUrl.pathname = "/assessment";
    assessmentUrl.search = "";

    return NextResponse.redirect(
      assessmentUrl,
    );
  }

  const completedCompanyIds =
    typedCompanies
      .filter(
        (company) =>
          Boolean(company.name?.trim()) &&
          Boolean(company.industry?.trim()) &&
          Boolean(company.country?.trim()) &&
          company.employee_count !== null &&
          Boolean(company.contact_name?.trim()) &&
          Boolean(company.contact_email?.trim()) &&
          Boolean(company.contact_phone?.trim()) &&
          Boolean(company.contact_title?.trim()),
      )
      .map(
        (company) =>
          company.id,
      );

  const {
    data: discoveryAnswers,
    error: discoveryError,
  } = await supabase
    .from("discovery_answers")
    .select(
      "company_id, question_order",
    )
    .in(
      "company_id",
      completedCompanyIds,
    );

  if (discoveryError) {
    return null;
  }

  const typedDiscoveryAnswers =
    (discoveryAnswers ?? []) as DiscoveryAnswerRow[];

  const completedQuestionOrders =
    new Set(
      typedDiscoveryAnswers.map(
        (row) =>
          `${row.company_id}:${row.question_order}`,
      ),
    );

  const discoveryCompleted =
    completedCompanyIds.some(
      (companyId: string) =>
        [1, 2, 3, 4, 5].every(
          (questionOrder) =>
            completedQuestionOrders.has(
              `${companyId}:${questionOrder}`,
            ),
        ),
    );

  if (!discoveryCompleted) {
    const discoveryUrl =
      request.nextUrl.clone();

    discoveryUrl.pathname = "/discovery";
    discoveryUrl.search = "";

    return NextResponse.redirect(
      discoveryUrl,
    );
  }

  return null;
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

  if (
    data.user &&
    isGuestRoute
  ) {
    const dashboardUrl =
      request.nextUrl.clone();

    dashboardUrl.pathname =
      "/company-dashboard";

    dashboardUrl.search = "";

    return NextResponse.redirect(
      dashboardUrl,
    );
  }

  const requiresOnboardingCheck =
    isProtectedRoute &&
    !pathname.startsWith("/assessment") &&
    !pathname.startsWith("/discovery");

  // 2. إذا العميل مسجل دخول، والصفحة تحتاج فحص، نفحصه فوراً
  if (
    data.user &&
    requiresOnboardingCheck
  ) {
    const onboardingRedirect =
      await getOnboardingRedirect(
        supabase,
        data.user.id,
        request,
      );

    if (onboardingRedirect) {
      return onboardingRedirect;
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};