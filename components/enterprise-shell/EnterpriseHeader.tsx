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
  FileText,
  Home,
  LayoutDashboard,
  LoaderCircle,
  MessagesSquare,
  LogOut,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UserRound,
  UsersRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import LanguageSwitcher from "@/components/localization/LanguageSwitcher";
import { useLocalization } from "@/components/localization/LocalizationContext";
import ThemeSwitcher from "@/components/theme/ThemeSwitcher";
import WorkspaceScopeSwitcher from "@/components/enterprise-shell/WorkspaceScopeSwitcher";
import { clearWorkspaceSession } from "@/lib/companySession";
import { supabase } from "@/lib/supabase";
import { resolveWorkspaceIdentity } from "@/lib/workspace-identity/tenantResolver";
import {
  PERMISSIONS,
  ROLE_PERMISSIONS,
  type Permission,
} from "@/lib/rbac/permissions"; // <-- عدّل المسار حسب مكان ملفك

interface NavigationItem {
  key: string;
  href: string;
  icon: LucideIcon;
  /** لو undefined -> ظاهر لأي مستخدم مسجّل دخول بدون شرط صلاحية */
  permission?: Permission;
}

const navigationItems: readonly NavigationItem[] = [
  {
    key: "corporateBrain",
    href: "/corporate-brain",
    icon: BrainCircuit,
    permission: PERMISSIONS.CORPORATE_BRAIN_VIEW,
  },
  {
    key: "digitalWorkforce",
    href: "/digital-workforce",
    icon: UsersRound,
    permission: PERMISSIONS.DIGITAL_WORKFORCE_VIEW,
  },
  {
    key: "employeeExperience",
    href: "/employee-experience",
    icon: MessagesSquare,
    permission: PERMISSIONS.EMPLOYEE_EXPERINCE_USE,
  },
  {
    key: "admin",
    href: "/admin",
    icon: ShieldCheck,
    permission: PERMISSIONS.ALL,
  },
] as const;

// --- قاموس الترجمة للنصوص الثابتة في الترويسة ---
const HEADER_CONTENT = {
  ar: {
    login: "تسجيل الدخول",
    profileTitle: "الملف التعريفي",
    profileDesc: "بيانات المستخدم والحساب",
    companyWorkspaceTitle: "مساحة عمل الشركة",
    companyWorkspaceDesc: "إعدادات المؤسسة والهوية",
    signingOut: "جارٍ تسجيل الخروج",
    signOut: "تسجيل الخروج",
    signOutDesc: "إنهاء الجلسة الحالية بأمان",
    defaultUser: "مستخدم KAFU",
    defaultRole: "تنفيذي",
    userMenuAria: "قائمة المستخدم",
    userAccountAria: "حساب المستخدم",
  },
  en: {
    login: "Log In",
    profileTitle: "Profile",
    profileDesc: "User and account data",
    companyWorkspaceTitle: "Company Workspace",
    companyWorkspaceDesc: "Enterprise settings and identity",
    signingOut: "Signing out...",
    signOut: "Sign Out",
    signOutDesc: "Securely end the current session",
    defaultUser: "KAFU User",
    defaultRole: "Executive",
    userMenuAria: "User menu",
    userAccountAria: "User account",
  },
} as const;

function normalizeText(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalizedValue = value.trim();

  return normalizedValue || null;
}

function resolveUserName(user: User | null, defaultName: string): string {
  if (!user) {
    return defaultName;
  }

  const metadataName =
    normalizeText(user.user_metadata?.full_name) ??
    normalizeText(user.user_metadata?.name) ??
    normalizeText(user.user_metadata?.display_name);

  if (metadataName) {
    return metadataName;
  }

  const emailName = user.email?.split("@")[0]?.trim();
  return emailName || defaultName;
}

function resolveInitials(name: string): string {
  const words = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) {
    return "KU";
  }

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[0][0]}${words[1][0]}`.toUpperCase();
}

function getPermissionsForRole(
  role: string | null,
): readonly Permission[] {
  if (!role) {
    return [];
  }

  return ROLE_PERMISSIONS[role] ?? [];
}

function hasPermission(
  userPermissions: readonly Permission[],
  required: Permission,
): boolean {
  return (
    userPermissions.includes(PERMISSIONS.ALL) ||
    userPermissions.includes(required)
  );
}

export default function EnterpriseHeader() {
  const pathname = usePathname();
  const router = useRouter();

  const { t, locale } = useLocalization();
  const isArabic = locale === "ar";
  const localT = isArabic ? HEADER_CONTENT.ar : HEADER_CONTENT.en;

  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const firstMenuItemRef = useRef<HTMLAnchorElement | null>(null);

  const [user, setUser] = useState<User | null>(null);
  const [companyName, setCompanyName] = useState<string | null>(null);
  const [permissionRole, setPermissionRole] = useState<string | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const userName = useMemo(
    () => resolveUserName(user, localT.defaultUser),
    [user, localT.defaultUser],
  );

  const userInitials = useMemo(() => resolveInitials(userName), [userName]);

  const activeCompanyName =
    companyName ??
    normalizeText(user?.app_metadata?.company_name) ??
    normalizeText(user?.user_metadata?.company_name) ??
    t("workspace.companyName");

  const userPermissions = useMemo(
    () => getPermissionsForRole(permissionRole),
    [permissionRole],
  );

  const visibleNavigationItems = useMemo(
    () =>
      navigationItems.filter((item) => {
        if (!item.permission) {
          return true;
        }

        return hasPermission(userPermissions, item.permission);
      }),
    [userPermissions],
  );

  useEffect(() => {
    let isMounted = true;

    async function loadWorkspaceCompanyAndRole(authenticatedUser: User | null) {
      if (!authenticatedUser) {
        if (isMounted) {
          setCompanyName(null);
          setPermissionRole(null);
        }

        return;
      }

      try {
        const identity = await resolveWorkspaceIdentity(supabase);

        const [{ data: companyData, error: companyError }, { data: membershipData, error: membershipError }] =
          await Promise.all([
            supabase
              .from("companies")
              .select("name")
              .eq("id", identity.companyId)
              .maybeSingle(),

            supabase
              .from("organization_memberships")
              .select("role")
              .eq("user_id", authenticatedUser.id)
              .eq("organization_id", identity.organizationId)
              .maybeSingle(),
          ]);

        if (companyError) {
          throw companyError;
        }

        if (membershipError) {
          throw membershipError;
        }

        if (!isMounted) {
          return;
        }

        setCompanyName(normalizeText(companyData?.name));
        setPermissionRole(normalizeText(membershipData?.role));
      } catch (error) {
        console.error("Unable to load workspace company/role:", error);

        if (isMounted) {
          setCompanyName(null);
          setPermissionRole(null);
        }
      }
    }

    async function loadAuthenticatedUser() {
      const { data, error } = await supabase.auth.getUser();

      if (!isMounted) {
        return;
      }

      const authenticatedUser = error ? null : data.user ?? null;

      setUser(authenticatedUser);
      setIsUserLoading(false);

      await loadWorkspaceCompanyAndRole(authenticatedUser);
    }

    void loadAuthenticatedUser();

    const { data: authenticationListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!isMounted) {
          return;
        }

        const authenticatedUser = session?.user ?? null;

        setUser(authenticatedUser);
        setIsUserLoading(false);

        void loadWorkspaceCompanyAndRole(authenticatedUser);
      }
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

    function handlePointerDown(event: MouseEvent) {
      const target = event.target;

      if (
        target instanceof Node &&
        !userMenuRef.current?.contains(target)
      ) {
        setIsMenuOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
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

      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      setUser(null);
      setIsMenuOpen(false);

      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error("Unable to sign out:", error);
      setIsSigningOut(false);
    }
  }

  if (!user) {
    return (
      <header className="kafu-executive-header" dir={isArabic ? "rtl" : "ltr"}>
        <div className="kafu-executive-header__inner kafu-public-header__inner">
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

          <div className="kafu-executive-header__actions">
            <LanguageSwitcher />

            <Link href="/login" className="kafu-public-login">
              {localT.login}
            </Link>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="kafu-executive-header" dir={isArabic ? "rtl" : "ltr"}>
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
          {visibleNavigationItems.map((item) => {
            const Icon = item.icon;

            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className="kafu-executive-navigation__link"
                data-active={isActive}
                aria-current={isActive ? "page" : undefined}
                aria-label={t(item.key)}
                title={t(item.key)}
              >
                <Icon size={18} strokeWidth={1.8} />

                <span className="kafu-executive-navigation__label">
                  {t(item.key)}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="kafu-executive-header__actions">
      
          <ThemeSwitcher />

          <LanguageSwitcher />

          <span
            className="kafu-executive-header__divider"
            aria-hidden="true"
          />

          <div ref={userMenuRef} className="kafu-executive-user-menu">
            <button
              type="button"
              className="kafu-executive-user"
              aria-label={localT.userMenuAria}
              aria-haspopup="menu"
              aria-expanded={isMenuOpen}
              title={userName}
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
                  <span aria-hidden="true">{userInitials}</span>
                ) : (
                  <UserRound size={17} strokeWidth={1.9} />
                )}
              </span>

              <span
                className="kafu-executive-user__identity"
                data-menu-open={isMenuOpen}
              >
                <strong>{userName}</strong>
              
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
                aria-label={localT.userAccountAria}
              >
                <div className="kafu-user-dropdown__profile text-start">
                  <span className="kafu-user-dropdown__avatar">
                    {userInitials}
                  </span>

                  <div className="kafu-user-dropdown__identity">
                    <strong>{userName}</strong>

                    {user?.email && <small>{user.email}</small>}
                  </div>
                </div>

                <div
                  className="kafu-user-dropdown__divider"
                  aria-hidden="true"
                />

                <div className="kafu-user-dropdown__section">
                  <Link
                    ref={firstMenuItemRef}
                    href="/profile"
                    className="kafu-user-dropdown__item text-start"
                    role="menuitem"
                  >
                    <span className="kafu-user-dropdown__item-icon">
                      <UserRound size={17} strokeWidth={1.8} />
                    </span>

                    <span>
                      <strong>{localT.profileTitle}</strong>
                      <small>{localT.profileDesc}</small>
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
                    className="kafu-user-dropdown__item kafu-user-dropdown__item--danger text-start"
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
                        <LogOut size={17} strokeWidth={1.8} />
                      )}
                    </span>

                    <span>
                      <strong>
                        {isSigningOut ? localT.signingOut : localT.signOut}
                      </strong>

                      <small>{localT.signOutDesc}</small>
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
