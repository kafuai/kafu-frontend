"use client";

import {
  Building2,
  Check,
  ChevronDown,
  Layers3,
  LoaderCircle,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
} from "react";
import {
  usePathname,
  useRouter,
} from "next/navigation";

import { supabase } from "@/lib/supabase";
import {
  resolveWorkspaceScope,
  selectActiveCompany,
  selectPortfolioScope,
  type ResolvedWorkspaceScope,
  type WorkspaceAccess,
} from "@/lib/workspace-identity/tenantResolver";

type CompanyOption = {
  id: string;
  name: string;
  organizationId: string;
  role: string;
};

type CompanyRecord = {
  id: string;
  name: string | null;
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

function buildCompanyOptions(
  accesses: WorkspaceAccess[],
  companies: CompanyRecord[],
): CompanyOption[] {
  const companyNames = new Map(
    companies.map((company) => [
      company.id,
      normalizeText(company.name) ??
        "Unnamed Company",
    ]),
  );

  return accesses.map((access) => ({
    id: access.companyId,
    name:
      companyNames.get(access.companyId) ??
      "Company Workspace",
    organizationId: access.organizationId,
    role: access.role,
  }));
}

export default function WorkspaceScopeSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  const containerRef =
    useRef<HTMLDivElement | null>(null);

  const [scope, setScope] =
    useState<ResolvedWorkspaceScope | null>(
      null,
    );

  const [companies, setCompanies] =
    useState<CompanyOption[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isSwitching, setIsSwitching] =
    useState(false);

  const [isOpen, setIsOpen] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  const activeCompany =
    scope?.mode === "company"
      ? companies.find(
          (company) =>
            company.id ===
            scope.activeCompanyId,
        ) ?? null
      : null;

  const activeLabel =
    scope?.mode === "portfolio"
      ? "جميع الشركات"
      : activeCompany?.name ??
        "مساحة عمل الشركة";

  const canUsePortfolio =
    companies.length > 1;

  useEffect(() => {
    let isMounted = true;

    async function loadScope() {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const resolvedScope =
          await resolveWorkspaceScope(
            supabase,
          );

        const companyIds =
          resolvedScope.accesses.map(
            (access) => access.companyId,
          );

        const {
          data,
          error,
        } = await supabase
          .from("companies")
          .select("id, name")
          .in("id", companyIds);

        if (error) {
          throw error;
        }

        if (!isMounted) {
          return;
        }

        setScope(resolvedScope);

        setCompanies(
          buildCompanyOptions(
            resolvedScope.accesses,
            (data ?? []) as CompanyRecord[],
          ),
        );
      } catch (error) {
        console.error(
          "Unable to load workspace scope:",
          error,
        );

        if (isMounted) {
          setErrorMessage(
            "تعذر تحميل مساحات العمل",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadScope();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(
      event: MouseEvent,
    ) {
      const target = event.target;

      if (
        target instanceof Node &&
        !containerRef.current?.contains(target)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(
      event: KeyboardEvent,
    ) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handlePointerDown,
    );

    document.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handlePointerDown,
      );

      document.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [isOpen]);

  async function handleCompanySelection(
    companyId: string,
  ) {
    if (
      isSwitching ||
      scope?.mode === "company" &&
        scope.activeCompanyId === companyId
    ) {
      setIsOpen(false);

      return;
    }

    try {
      setIsSwitching(true);
      setErrorMessage(null);

      await selectActiveCompany(
        companyId,
        supabase,
      );

      const refreshedScope =
        await resolveWorkspaceScope(
          supabase,
        );

      setScope(refreshedScope);
      setIsOpen(false);

      window.dispatchEvent(
        new CustomEvent(
          "kafu:workspace-scope-changed",
          {
            detail: refreshedScope,
          },
        ),
      );

      router.refresh();
    } catch (error) {
      console.error(
        "Unable to switch company:",
        error,
      );

      setErrorMessage(
        "تعذر الانتقال إلى الشركة",
      );
    } finally {
      setIsSwitching(false);
    }
  }

  async function handlePortfolioSelection() {
    if (
      isSwitching ||
      !canUsePortfolio
    ) {
      return;
    }

    if (scope?.mode === "portfolio") {
      setIsOpen(false);

      return;
    }

    try {
      setIsSwitching(true);
      setErrorMessage(null);

      const portfolioScope =
        await selectPortfolioScope(
          companies.map(
            (company) => company.id,
          ),
          supabase,
        );

      setScope(portfolioScope);
      setIsOpen(false);

      window.dispatchEvent(
        new CustomEvent(
          "kafu:workspace-scope-changed",
          {
            detail: portfolioScope,
          },
        ),
      );

      if (pathname !== "/dashboard") {
        router.push("/dashboard");
      } else {
        router.refresh();
      }
    } catch (error) {
      console.error(
        "Unable to activate portfolio view:",
        error,
      );

      setErrorMessage(
        "تعذر تفعيل عرض جميع الشركات",
      );
    } finally {
      setIsSwitching(false);
    }
  }

  if (isLoading) {
    return (
      <div
        className="kafu-workspace-selector"
        aria-label="جارٍ تحميل مساحة العمل"
      >
        <LoaderCircle
          size={16}
          strokeWidth={1.8}
          className="kafu-workspace-switcher__spinner"
        />

        <span className="kafu-workspace-selector__name">
          جارٍ التحميل
        </span>
      </div>
    );
  }

  if (
    errorMessage &&
    companies.length === 0
  ) {
    return (
      <div
        className="kafu-workspace-selector"
        title={errorMessage}
      >
        <Building2
          size={17}
          strokeWidth={1.8}
        />

        <span className="kafu-workspace-selector__name">
          مساحة العمل
        </span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="kafu-workspace-switcher"
    >
      <button
        type="button"
        className="kafu-workspace-selector"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={`مساحة العمل الحالية: ${activeLabel}`}
        title={activeLabel}
        data-open={isOpen}
        disabled={isSwitching}
        onClick={() => {
          setIsOpen((currentValue) => {
            return !currentValue;
          });
        }}
      >
        {scope?.mode === "portfolio" ? (
          <Layers3
            size={17}
            strokeWidth={1.8}
          />
        ) : (
          <Building2
            size={17}
            strokeWidth={1.8}
          />
        )}

        <span className="kafu-workspace-selector__name">
          {activeLabel}
        </span>

        {isSwitching ? (
          <LoaderCircle
            size={14}
            strokeWidth={1.9}
            className="kafu-workspace-switcher__spinner"
          />
        ) : (
          <ChevronDown
            size={13}
            strokeWidth={2}
            className="kafu-workspace-selector__chevron"
          />
        )}
      </button>

      {isOpen && (
        <div
          className="kafu-workspace-dropdown"
          role="menu"
          aria-label="اختيار مساحة العمل"
        >
          <div className="kafu-workspace-dropdown__header">
            <strong>مساحات العمل</strong>

            <span>
              {companies.length}
              {" "}
              شركات متاحة
            </span>
          </div>

          {canUsePortfolio && (
            <>
              <button
                type="button"
                role="menuitem"
                className="kafu-workspace-dropdown__item"
                data-selected={
                  scope?.mode === "portfolio"
                }
                onClick={() => {
                  void handlePortfolioSelection();
                }}
              >
                <span className="kafu-workspace-dropdown__icon">
                  <Layers3
                    size={17}
                    strokeWidth={1.8}
                  />
                </span>

                <span className="kafu-workspace-dropdown__content">
                  <strong>
                    جميع الشركات
                  </strong>

                  <small>
                    Executive Portfolio View
                  </small>
                </span>

                {scope?.mode === "portfolio" && (
                  <Check
                    size={16}
                    strokeWidth={2.2}
                    className="kafu-workspace-dropdown__check"
                  />
                )}
              </button>

              <div
                className="kafu-workspace-dropdown__divider"
                aria-hidden="true"
              />
            </>
          )}

          <div className="kafu-workspace-dropdown__companies">
            {companies.map((company) => {
              const isSelected =
                scope?.mode === "company" &&
                scope.activeCompanyId ===
                  company.id;

              return (
                <button
                  key={company.id}
                  type="button"
                  role="menuitem"
                  className="kafu-workspace-dropdown__item"
                  data-selected={isSelected}
                  onClick={() => {
                    void handleCompanySelection(
                      company.id,
                    );
                  }}
                >
                  <span className="kafu-workspace-dropdown__icon">
                    <Building2
                      size={17}
                      strokeWidth={1.8}
                    />
                  </span>

                  <span className="kafu-workspace-dropdown__content">
                    <strong>
                      {company.name}
                    </strong>

                    <small>
                      {company.role}
                    </small>
                  </span>

                  {isSelected && (
                    <Check
                      size={16}
                      strokeWidth={2.2}
                      className="kafu-workspace-dropdown__check"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {errorMessage && (
            <p className="kafu-workspace-dropdown__error">
              {errorMessage}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
