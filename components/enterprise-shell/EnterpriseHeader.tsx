"use client";

import type { User } from "@supabase/supabase-js";
import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  usePathname,
  useRouter,
} from "next/navigation";
import {
  Bell,
  Bot,
  BrainCircuit,
  Building2,
  ChevronDown,
  Command,
  Dna,
  Home,
  LayoutDashboard,
  LoaderCircle,
  LogOut,
  Search,
  Settings,
  Sparkles,
  TrendingUp,
  UserRound,
  UsersRound,
} from "lucide-react";

import LanguageSwitcher from "@/components/localization/LanguageSwitcher";
import { useLocalization } from "@/components/localization/LocalizationContext";
import ThemeSwitcher from "@/components/theme/ThemeSwitcher";
import WorkspaceScopeSwitcher from "@/components/enterprise-shell/WorkspaceScopeSwitcher";
import { clearWorkspaceSession } from "@/lib/companySession";
import { supabase } from "@/lib/supabase";
import { resolveWorkspaceIdentity } from "@/lib/workspace-identity/tenantResolver";

const navigationItems = [
  {
    key: "navigation.home",
    href: "/",
    icon: Home,
  },
  {
    key: "navigation.workspace",
    href: "/company-workspace",
    icon: Building2,
  },
  {
    key: "navigation.dashboard",
    href: "/company-dashboard",
    icon: LayoutDashboard,
  },
  {
    key: "navigation.corporateBrain",
    href: "/corporate-brain",
    icon: BrainCircuit,
  },
  {
    key: "navigation.corporateDNA",
    href: "/corporate-dna",
    icon: Dna,
  },
  {
    key: "navigation.digitalWorkforce",
    href: "/digital-workforce",
    icon: UsersRound,
  },
  {
    key: "navigation.commandCenter",
    href: "/command-center",
    icon: Command,
  },
  {
    key: "navigation.salesIntelligence",
    href: "/sales-intelligence",
    icon: TrendingUp,
  },
] as const;

function normalizeText(
  value: unknown,
): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalizedValue = value.trim();

  return normalizedValue || null;
}

function resolveUserName(
  user: User | null,
): string {
  if (!user) {
    return "KAFU User";
  }

  const metadataName =
    normalizeText(user.user_metadata?.full_name) ??
    normalizeText(user.user_metadata?.name) ??
    normalizeText(user.user_metadata?.display_name);

  if (metadataName) {
    return metadataName;
  }

  const emailName =
    user.email?.split("@")[0]?.trim();

  return emailName || "KAFU User";
}

function resolveUserRole(
  user: User | null,
): string {
  if (!user) {
    return "Executive";
  }

  return (
    normalizeText(user.user_metadata?.role) ??
    normalizeText(user.app_metadata?.role) ??
    "Executive"
  );
}

function resolveInitials(
  name: string,
): string {
  const words = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) {
    return "KU";
  }

  if (words.length === 1) {
    return words[0]
      .slice(0, 2)
      .toUpperCase();
  }

  return `${words[0][0]}${words[1][0]}`
    .toUpperCase();
}

export default function EnterpriseHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLocalization();

  const userMenuRef =
    useRef<HTMLDivElement | null>(null);

  const firstMenuItemRef =
    useRef<HTMLAnchorElement | null>(null);

  const [user, setUser] =
    useState<User | null>(null);

  const [companyName, setCompanyName] =
    useState<string | null>(null);

  const [isUserLoading, setIsUserLoading] =
    useState(true);

  const [isMenuOpen, setIsMenuOpen] =
    useState(false);

  const [isSigningOut, setIsSigningOut] =
    useState(false);

  const userName = useMemo(
    () => resolveUserName(user),
    [user],
  );

  const userRole = useMemo(
    () => resolveUserRole(user),
    [user],
  );

  const userInitials = useMemo(
    () => resolveInitials(userName),
    [userName],
  );

  const activeCompanyName =
    companyName ??
    normalizeText(user?.app_metadata?.company_name) ??
    normalizeText(user?.user_metadata?.company_name) ??
    t("workspace.companyName");

  useEffect(() => {
    let isMounted = true;

    async function loadWorkspaceCompany(
      authenticatedUser: User | null,
    ) {
      if (!authenticatedUser) {
        if (isMounted) {
          setCompanyName(null);
        }

        return;
      }

      try {
        const identity =
          await resolveWorkspaceIdentity(supabase);

        const {
          data,
          error,
        } = await supabase
          .from("companies")
          .select("name")
          .eq("id", identity.companyId)
          .maybeSingle();

        if (error) {
          throw error;
        }

        if (!isMounted) {
          return;
        }

        setCompanyName(
          normalizeText(data?.name),
        );
      } catch (error) {
        console.error(
          "Unable to load active company:",
          error,
        );

        if (isMounted) {
          setCompanyName(null);
        }
      }
    }

    async function loadAuthenticatedUser() {
      const {
        data,
        error,
      } = await supabase.auth.getUser();

      if (!isMounted) {
        return;
      }

      const authenticatedUser =
        error ? null : data.user ?? null;

      setUser(authenticatedUser);
      setIsUserLoading(false);

      await loadWorkspaceCompany(
        authenticatedUser,
      );
    }

    void loadAuthenticatedUser();

    const {
      data: authenticationListener,
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!isMounted) {
          return;
        }

        const authenticatedUser =
          session?.user ?? null;

        setUser(authenticatedUser);
        setIsUserLoading(false);

        void loadWorkspaceCompany(
          authenticatedUser,
        );
      },
    );

    return () => {
      isMounted = false;
      authenticationListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    function handlePointerDown(
      event: MouseEvent,
    ) {
      const target = event.target;

      if (
        target instanceof Node &&
        !userMenuRef.current?.contains(target)
      ) {
        setIsMenuOpen(false);
      }
    }

    function handleKeyDown(
      event: KeyboardEvent,
    ) {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
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
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    window.requestAnimationFrame(() => {
      firstMenuItemRef.current?.focus();
    });
  }, [isMenuOpen]);

  function toggleUserMenu() {
    if (isSigningOut) {
      return;
    }

    setIsMenuOpen((currentValue) => {
      return !currentValue;
    });
  }

  async function handleSignOut() {
    if (isSigningOut) {
      return;
    }

    setIsSigningOut(true);

    try {
      clearWorkspaceSession();

      const { error } =
        await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      setUser(null);
      setIsMenuOpen(false);

      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error(
        "Unable to sign out:",
        error,
      );

      setIsSigningOut(false);
    }
  }

  return (
    <header className="kafu-executive-header">
      <div className="kafu-executive-header__inner">
        <div className="kafu-executive-header__brand-zone">
          <Link
            href="/"
            className="kafu-executive-brand"
            aria-label="KAFU AI"
            title="KAFU AI"
          >
            <Image
              src="/brand/kafu-logo-en.png"
              alt="KAFU AI"
              width={1774}
              height={887}
              priority
              className="kafu-executive-brand__logo"
              sizes="112px"
            />
          </Link>

          <span
            className="kafu-executive-header__divider"
            aria-hidden="true"
          />
          <WorkspaceScopeSwitcher />
        </div>

        <nav
          className="kafu-executive-navigation"
          aria-label="Enterprise navigation"
        >
          {navigationItems.map((item) => {
            const Icon = item.icon;

            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(
                    item.href,
                  );

            return (
              <Link
                key={item.href}
                href={item.href}
                className="kafu-executive-navigation__link"
                data-active={isActive}
                aria-current={
                  isActive ? "page" : undefined
                }
                aria-label={t(item.key)}
                title={t(item.key)}
              >
                <Icon
                  size={18}
                  strokeWidth={1.8}
                />

                <span className="kafu-executive-navigation__label">
                  {t(item.key)}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="kafu-executive-header__actions">
          <button
            type="button"
            className="kafu-executive-control"
            aria-label={t("common.search")}
            title={t("common.search")}
          >
            <Search
              size={18}
              strokeWidth={1.8}
            />
          </button>

          <div
            className="kafu-ai-status"
            aria-label={t("common.active")}
            title={t("common.active")}
          >
            <Bot
              size={18}
              strokeWidth={1.8}
            />

            <span className="kafu-ai-status__indicator">
              <Sparkles
                size={9}
                strokeWidth={2.2}
              />
            </span>
          </div>

          <ThemeSwitcher />

          <LanguageSwitcher />

          <button
            type="button"
            className="kafu-executive-control kafu-executive-notification"
            aria-label={t(
              "common.notifications",
            )}
            title={t("common.notifications")}
          >
            <Bell
              size={18}
              strokeWidth={1.8}
            />

            <span className="kafu-executive-notification__badge">
              2
            </span>
          </button>

          <span
            className="kafu-executive-header__divider"
            aria-hidden="true"
          />

          <div
            ref={userMenuRef}
            className="kafu-executive-user-menu"
          >
            <button
              type="button"
              className="kafu-executive-user"
              aria-label="User menu"
              aria-haspopup="menu"
              aria-expanded={isMenuOpen}
              title={`${userName} — ${userRole}`}
              data-open={isMenuOpen}
              onClick={toggleUserMenu}
            >
              <span className="kafu-executive-user__avatar">
                {isUserLoading ? (
                  <LoaderCircle
                    size={16}
                    strokeWidth={1.9}
                    className="kafu-user-spinner"
                  />
                ) : user ? (
                  <span aria-hidden="true">
                    {userInitials}
                  </span>
                ) : (
                  <UserRound
                    size={17}
                    strokeWidth={1.9}
                  />
                )}
              </span>

              <span
                className="kafu-executive-user__identity"
                data-menu-open={isMenuOpen}
              >
                <strong>{userName}</strong>
                <small>{userRole}</small>
              </span>

              <ChevronDown
                size={13}
                strokeWidth={2}
                className="kafu-executive-user__chevron"
              />
            </button>

            {isMenuOpen && (
              <div
                className="kafu-executive-user-dropdown"
                role="menu"
                aria-label="User account"
              >
                <div className="kafu-user-dropdown__profile">
                  <span className="kafu-user-dropdown__avatar">
                    {userInitials}
                  </span>

                  <div className="kafu-user-dropdown__identity">
                    <strong>{userName}</strong>
                    <span>{userRole}</span>

                    {user?.email && (
                      <small>{user.email}</small>
                    )}
                  </div>
                </div>

                <div
                  className="kafu-user-dropdown__divider"
                  aria-hidden="true"
                />

                <div className="kafu-user-dropdown__section">
                  <Link
                    ref={firstMenuItemRef}
                    href="/company-profile"
                    className="kafu-user-dropdown__item"
                    role="menuitem"
                  >
                    <span className="kafu-user-dropdown__item-icon">
                      <UserRound
                        size={17}
                        strokeWidth={1.8}
                      />
                    </span>

                    <span>
                      <strong>
                        الملف التعريفي
                      </strong>
                      <small>
                        بيانات المستخدم والحساب
                      </small>
                    </span>
                  </Link>

                  <Link
                    href="/company-workspace"
                    className="kafu-user-dropdown__item"
                    role="menuitem"
                  >
                    <span className="kafu-user-dropdown__item-icon">
                      <Building2
                        size={17}
                        strokeWidth={1.8}
                      />
                    </span>

                    <span>
                      <strong>
                        مساحة عمل الشركة
                      </strong>
                      <small>
                        إعدادات المؤسسة والهوية
                      </small>
                    </span>
                  </Link>

                  <Link
                    href="/company-profile"
                    className="kafu-user-dropdown__item"
                    role="menuitem"
                  >
                    <span className="kafu-user-dropdown__item-icon">
                      <Settings
                        size={17}
                        strokeWidth={1.8}
                      />
                    </span>

                    <span>
                      <strong>
                        إعدادات الحساب
                      </strong>
                      <small>
                        إدارة التفضيلات الشخصية
                      </small>
                    </span>
                  </Link>
                </div>

                <div
                  className="kafu-user-dropdown__divider"
                  aria-hidden="true"
                />

                <div className="kafu-user-dropdown__section">
                  <button
                    type="button"
                    role="menuitem"
                    className="kafu-user-dropdown__item kafu-user-dropdown__item--danger"
                    disabled={isSigningOut}
                    onClick={() => {
                      void handleSignOut();
                    }}
                  >
                    <span className="kafu-user-dropdown__item-icon">
                      {isSigningOut ? (
                        <LoaderCircle
                          size={17}
                          strokeWidth={1.8}
                          className="kafu-user-spinner"
                        />
                      ) : (
                        <LogOut
                          size={17}
                          strokeWidth={1.8}
                        />
                      )}
                    </span>

                    <span>
                      <strong>
                        {isSigningOut
                          ? "جارٍ تسجيل الخروج"
                          : "تسجيل الخروج"}
                      </strong>

                      <small>
                        إنهاء الجلسة الحالية بأمان
                      </small>
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}




