export const KAFU_COMPANY_ID_KEY = "kafu_company_id";
export const KAFU_WORKSPACE_SCOPE_KEY =
  "kafu_workspace_scope";

export type CompanyWorkspaceScopePreference = {
  mode: "company";
  companyId: string;
};

export type PortfolioWorkspaceScopePreference = {
  mode: "portfolio";
  companyIds: string[];
};

export type WorkspaceScopePreference =
  | CompanyWorkspaceScopePreference
  | PortfolioWorkspaceScopePreference;

function normalizeIdentifier(
  value: unknown,
): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalizedValue = value.trim();

  return normalizedValue || null;
}

function normalizeCompanyIds(
  values: unknown,
): string[] {
  if (!Array.isArray(values)) {
    return [];
  }

  return Array.from(
    new Set(
      values
        .map(normalizeIdentifier)
        .filter(
          (value): value is string =>
            value !== null,
        ),
    ),
  );
}

export function saveCurrentCompanyId(
  companyId: string,
): void {
  if (typeof window === "undefined") {
    return;
  }

  const normalizedCompanyId =
    normalizeIdentifier(companyId);

  if (!normalizedCompanyId) {
    localStorage.removeItem(
      KAFU_COMPANY_ID_KEY,
    );

    return;
  }

  localStorage.setItem(
    KAFU_COMPANY_ID_KEY,
    normalizedCompanyId,
  );
}

/**
 * Local preference only.
 *
 * This value is never an authorization source.
 * Supabase memberships and RLS remain authoritative.
 */
export function getCurrentCompanyId():
  | string
  | null {
  if (typeof window === "undefined") {
    return null;
  }

  return normalizeIdentifier(
    localStorage.getItem(
      KAFU_COMPANY_ID_KEY,
    ),
  );
}

export function clearCurrentCompanyId(): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(
    KAFU_COMPANY_ID_KEY,
  );
}

export function saveWorkspaceScopePreference(
  preference: WorkspaceScopePreference,
): void {
  if (typeof window === "undefined") {
    return;
  }

  if (preference.mode === "company") {
    const companyId = normalizeIdentifier(
      preference.companyId,
    );

    if (!companyId) {
      clearWorkspaceScopePreference();

      return;
    }

    const normalizedPreference:
      CompanyWorkspaceScopePreference = {
        mode: "company",
        companyId,
      };

    localStorage.setItem(
      KAFU_WORKSPACE_SCOPE_KEY,
      JSON.stringify(normalizedPreference),
    );

    saveCurrentCompanyId(companyId);

    return;
  }

  const companyIds = normalizeCompanyIds(
    preference.companyIds,
  );

  if (companyIds.length < 2) {
    clearWorkspaceScopePreference();

    return;
  }

  const normalizedPreference:
    PortfolioWorkspaceScopePreference = {
      mode: "portfolio",
      companyIds,
    };

  localStorage.setItem(
    KAFU_WORKSPACE_SCOPE_KEY,
    JSON.stringify(normalizedPreference),
  );
}

export function getWorkspaceScopePreference():
  | WorkspaceScopePreference
  | null {
  if (typeof window === "undefined") {
    return null;
  }

  const serializedPreference =
    localStorage.getItem(
      KAFU_WORKSPACE_SCOPE_KEY,
    );

  if (!serializedPreference) {
    return null;
  }

  try {
    const parsedPreference: unknown =
      JSON.parse(serializedPreference);

    if (
      !parsedPreference ||
      typeof parsedPreference !== "object"
    ) {
      clearWorkspaceScopePreference();

      return null;
    }

    const candidate =
      parsedPreference as Record<
        string,
        unknown
      >;

    if (candidate.mode === "company") {
      const companyId = normalizeIdentifier(
        candidate.companyId,
      );

      if (!companyId) {
        clearWorkspaceScopePreference();

        return null;
      }

      return {
        mode: "company",
        companyId,
      };
    }

    if (candidate.mode === "portfolio") {
      const companyIds = normalizeCompanyIds(
        candidate.companyIds,
      );

      if (companyIds.length < 2) {
        clearWorkspaceScopePreference();

        return null;
      }

      return {
        mode: "portfolio",
        companyIds,
      };
    }
  } catch {
    clearWorkspaceScopePreference();

    return null;
  }

  clearWorkspaceScopePreference();

  return null;
}

export function clearWorkspaceScopePreference():
  void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(
    KAFU_WORKSPACE_SCOPE_KEY,
  );
}

export function clearWorkspaceSession(): void {
  clearCurrentCompanyId();
  clearWorkspaceScopePreference();
}