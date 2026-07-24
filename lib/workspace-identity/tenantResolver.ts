import type {
  SupabaseClient,
  User,
} from "@supabase/supabase-js";

import {
  clearWorkspaceSession,
  getCurrentCompanyId,
  getWorkspaceScopePreference,
  saveCurrentCompanyId,
  saveWorkspaceScopePreference,
  type WorkspaceScopePreference,
} from "@/lib/companySession";
import { supabase } from "@/lib/supabase";

export type WorkspaceIdentitySource =
  | "app_metadata"
  | "organization_membership";

export type WorkspaceAccess = {
  userId: string;
  organizationId: string;
  companyId: string;
  role: string;
  createdAt: string | null;
  source: WorkspaceIdentitySource;
};

export type WorkspaceIdentity = {
  userId: string;
  organizationId: string;
  companyId: string;
  role: string;
  source: WorkspaceIdentitySource;
};

export type CompanyWorkspaceScope = {
  mode: "company";
  activeCompanyId: string;
  companyIds: string[];
  accesses: WorkspaceAccess[];
};

export type PortfolioWorkspaceScope = {
  mode: "portfolio";
  activeCompanyId: null;
  companyIds: string[];
  accesses: WorkspaceAccess[];
};

export type ResolvedWorkspaceScope =
  | CompanyWorkspaceScope
  | PortfolioWorkspaceScope;

type OrganizationRelation = {
  id: string;
  company_id: string | null;
};

type MembershipRecord = {
  organization_id: string;
  role: string;
  created_at: string;
  organizations:
    | OrganizationRelation
    | OrganizationRelation[]
    | null;
};

const rolePriority: Record<string, number> = {
  owner: 0,
  admin: 1,
  manager: 2,
  member: 3,
  viewer: 4,
};

function normalizeText(
  value: unknown,
): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalizedValue = value.trim();

  return normalizedValue || null;
}

function normalizeRole(
  value: unknown,
): string {
  return normalizeText(value)?.toLowerCase() ??
    "member";
}

function readMetadataValue(
  user: User,
  key: "company_id" | "organization_id",
): string | null {
  return normalizeText(
    user.app_metadata?.[key],
  );
}

function normalizeOrganization(
  value: MembershipRecord["organizations"],
): OrganizationRelation | null {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value;
}

function prioritizeAccesses(
  accesses: WorkspaceAccess[],
): WorkspaceAccess[] {
  return [...accesses].sort(
    (first, second) => {
      const roleDifference =
        (rolePriority[first.role] ?? 99) -
        (rolePriority[second.role] ?? 99);

      if (roleDifference !== 0) {
        return roleDifference;
      }

      return (
        first.createdAt ?? ""
      ).localeCompare(
        second.createdAt ?? "",
      );
    },
  );
}

function deduplicateAccesses(
  accesses: WorkspaceAccess[],
): WorkspaceAccess[] {
  const accessesByCompany =
    new Map<string, WorkspaceAccess>();

  for (const access of accesses) {
    const existingAccess =
      accessesByCompany.get(
        access.companyId,
      );

    if (!existingAccess) {
      accessesByCompany.set(
        access.companyId,
        access,
      );

      continue;
    }

    const existingPriority =
      rolePriority[existingAccess.role] ?? 99;

    const candidatePriority =
      rolePriority[access.role] ?? 99;

    if (candidatePriority < existingPriority) {
      accessesByCompany.set(
        access.companyId,
        access,
      );
    }
  }

  return prioritizeAccesses(
    Array.from(accessesByCompany.values()),
  );
}

async function getAuthenticatedUser(
  client: SupabaseClient,
): Promise<User> {
  const {
    data: { user },
    error,
  } = await client.auth.getUser();

  if (error) {
    clearWorkspaceSession();

    throw new Error(
      `Unable to verify the authenticated user: ${error.message}`,
    );
  }

  if (!user) {
    clearWorkspaceSession();

    throw new Error(
      "An authenticated user is required to resolve the workspace.",
    );
  }

  return user;
}

async function loadMembershipAccesses(
  client: SupabaseClient,
  user: User,
): Promise<WorkspaceAccess[]> {
  const { data, error } = await client
    .from("organization_memberships")
    .select(`
      organization_id,
      role,
      created_at,
      organizations (
        id,
        company_id
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", {
      ascending: true,
    });

  if (error) {
    throw new Error(
      `Unable to resolve workspace memberships: ${error.message}`,
    );
  }

  const memberships =
    (data ?? []) as MembershipRecord[];

  const membershipAccesses =
    memberships.flatMap(
      (membership): WorkspaceAccess[] => {
        const organization =
          normalizeOrganization(
            membership.organizations,
          );

        if (!organization?.company_id) {
          return [];
        }

        return [
          {
            userId: user.id,
            organizationId:
              organization.id,
            companyId:
              organization.company_id,
            role: normalizeRole(
              membership.role,
            ),
            createdAt:
              normalizeText(
                membership.created_at,
              ),
            source:
              "organization_membership",
          },
        ];
      },
    );

  return deduplicateAccesses(
    membershipAccesses,
  );
}

function resolveMetadataAccess(
  user: User,
): WorkspaceAccess | null {
  const companyId = readMetadataValue(
    user,
    "company_id",
  );

  const organizationId =
    readMetadataValue(
      user,
      "organization_id",
    );

  if (!companyId || !organizationId) {
    return null;
  }

  return {
    userId: user.id,
    organizationId,
    companyId,
    role: normalizeRole(
      user.app_metadata?.role,
    ),
    createdAt: null,
    source: "app_metadata",
  };
}

function validateScopePreference(
  preference: WorkspaceScopePreference | null,
  accesses: WorkspaceAccess[],
): ResolvedWorkspaceScope | null {
  if (!preference) {
    return null;
  }

  const accessibleCompanyIds =
    new Set(
      accesses.map(
        (access) => access.companyId,
      ),
    );

  if (preference.mode === "company") {
    if (
      !accessibleCompanyIds.has(
        preference.companyId,
      )
    ) {
      return null;
    }

    return {
      mode: "company",
      activeCompanyId:
        preference.companyId,
      companyIds: [
        preference.companyId,
      ],
      accesses,
    };
  }

  const validatedCompanyIds =
    preference.companyIds.filter(
      (companyId) =>
        accessibleCompanyIds.has(companyId),
    );

  if (
    accesses.length < 2 ||
    validatedCompanyIds.length < 2
  ) {
    return null;
  }

  return {
    mode: "portfolio",
    activeCompanyId: null,
    companyIds:
      validatedCompanyIds,
    accesses,
  };
}

export async function resolveWorkspaceAccesses(
  client: SupabaseClient = supabase,
): Promise<WorkspaceAccess[]> {
  const user =
    await getAuthenticatedUser(client);

  const membershipAccesses =
    await loadMembershipAccesses(
      client,
      user,
    );

  if (membershipAccesses.length > 0) {
    return membershipAccesses;
  }

  const metadataAccess =
    resolveMetadataAccess(user);

  if (metadataAccess) {
    return [metadataAccess];
  }

  throw new Error(
    "The authenticated user does not have a provisioned company workspace.",
  );
}

export async function resolveWorkspaceScope(
  client: SupabaseClient = supabase,
): Promise<ResolvedWorkspaceScope> {
  const accesses =
    await resolveWorkspaceAccesses(client);

  const validatedPreference =
    validateScopePreference(
      getWorkspaceScopePreference(),
      accesses,
    );

  if (validatedPreference) {
    if (
      validatedPreference.mode ===
      "company"
    ) {
      saveCurrentCompanyId(
        validatedPreference.activeCompanyId,
      );
    }

    return validatedPreference;
  }

  const cachedCompanyId =
    getCurrentCompanyId();

  const cachedAccess =
    cachedCompanyId
      ? accesses.find(
          (access) =>
            access.companyId ===
            cachedCompanyId,
        )
      : null;

  const defaultAccess =
    cachedAccess ?? accesses[0];

  saveWorkspaceScopePreference({
    mode: "company",
    companyId: defaultAccess.companyId,
  });

  return {
    mode: "company",
    activeCompanyId:
      defaultAccess.companyId,
    companyIds: [
      defaultAccess.companyId,
    ],
    accesses,
  };
}

export async function resolveWorkspaceIdentity(
  client: SupabaseClient = supabase,
): Promise<WorkspaceIdentity> {
  const scope =
    await resolveWorkspaceScope(client);

  const selectedAccess =
    scope.mode === "company"
      ? scope.accesses.find(
          (access) =>
            access.companyId ===
            scope.activeCompanyId,
        )
      : scope.accesses[0];

  if (!selectedAccess) {
    throw new Error(
      "Unable to resolve an authorized company workspace.",
    );
  }

  return {
    userId: selectedAccess.userId,
    organizationId:
      selectedAccess.organizationId,
    companyId:
      selectedAccess.companyId,
    role: selectedAccess.role,
    source: selectedAccess.source,
  };
}

export async function selectActiveCompany(
  companyId: string,
  client: SupabaseClient = supabase,
): Promise<WorkspaceIdentity> {
  const normalizedCompanyId =
    normalizeText(companyId);

  if (!normalizedCompanyId) {
    throw new Error(
      "A valid company identifier is required.",
    );
  }

  const accesses =
    await resolveWorkspaceAccesses(client);

  const selectedAccess =
    accesses.find(
      (access) =>
        access.companyId ===
        normalizedCompanyId,
    );

  if (!selectedAccess) {
    throw new Error(
      "The authenticated user is not authorized to access this company.",
    );
  }

  saveWorkspaceScopePreference({
    mode: "company",
    companyId:
      selectedAccess.companyId,
  });

  return {
    userId: selectedAccess.userId,
    organizationId:
      selectedAccess.organizationId,
    companyId:
      selectedAccess.companyId,
    role: selectedAccess.role,
    source: selectedAccess.source,
  };
}

export async function selectPortfolioScope(
  companyIds?: string[],
  client: SupabaseClient = supabase,
): Promise<PortfolioWorkspaceScope> {
  const accesses =
    await resolveWorkspaceAccesses(client);

  if (accesses.length < 2) {
    throw new Error(
      "Portfolio view requires access to at least two companies.",
    );
  }

  const accessibleCompanyIds =
    new Set(
      accesses.map(
        (access) => access.companyId,
      ),
    );

  const requestedCompanyIds =
    companyIds?.length
      ? Array.from(
          new Set(
            companyIds
              .map(normalizeText)
              .filter(
                (
                  companyId,
                ): companyId is string =>
                  companyId !== null,
              ),
          ),
        )
      : accesses.map(
          (access) => access.companyId,
        );

  const validatedCompanyIds =
    requestedCompanyIds.filter(
      (companyId) =>
        accessibleCompanyIds.has(companyId),
    );

  if (validatedCompanyIds.length < 2) {
    throw new Error(
      "Portfolio view requires at least two authorized companies.",
    );
  }

  saveWorkspaceScopePreference({
    mode: "portfolio",
    companyIds:
      validatedCompanyIds,
  });

  return {
    mode: "portfolio",
    activeCompanyId: null,
    companyIds:
      validatedCompanyIds,
    accesses,
  };
}

export async function resolveCurrentCompanyId(
  client: SupabaseClient = supabase,
): Promise<string> {
  const identity =
    await resolveWorkspaceIdentity(client);

  return identity.companyId;
}

export async function refreshWorkspaceIdentity(
  client: SupabaseClient = supabase,
): Promise<WorkspaceIdentity> {
  const { data, error } =
    await client.auth.refreshSession();

  if (error) {
    clearWorkspaceSession();

    throw new Error(
      `Unable to refresh the workspace session: ${error.message}`,
    );
  }

  if (!data.session) {
    clearWorkspaceSession();

    throw new Error(
      "The workspace session is no longer active.",
    );
  }

  return resolveWorkspaceIdentity(client);
}