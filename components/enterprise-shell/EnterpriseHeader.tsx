"use client";

import type { User } from "@supabase/supabase-js";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Banknote,
  CalendarClock,
  CalendarOff,
  Clock,
  FileEdit,
  Inbox,
  Send,
  Users,
  BookOpen,
  Calculator,
  UserCheck,
  Bot,
  BrainCircuit, 
  ChevronDown,
  LayoutDashboard,
  LoaderCircle,
  LogOut,
  ShieldCheck,
  UserRound,
  Building,
  UsersRound
  } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import LanguageSwitcher from "@/components/localization/LanguageSwitcher";
import { useLocalization } from "@/components/localization/LocalizationContext";
import WorkspaceScopeSwitcher from "@/components/enterprise-shell/WorkspaceScopeSwitcher";
import { clearWorkspaceSession } from "@/lib/companySession";
import { supabase } from "@/lib/supabase";
import { resolveWorkspaceIdentity } from "@/lib/workspace-identity/tenantResolver";
import { PERMISSIONS, ROLE_PERMISSIONS, type Permission } from "@/lib/rbac/permissions";


interface SubNavigationItem {
  key: string;
  href: string;
  icon: LucideIcon;
  permission?: Permission;
}

interface NavigationGroup {
  key: string;
  icon: LucideIcon;
  href?: string;
  permission?: Permission;
  children?: SubNavigationItem[];
}

const navigationItems: readonly NavigationGroup[] = [
  {
    key: "workspaceGroup",
    icon: Building,
    children: [
      { key: "corporateBrain", href: "/corporate-brain", icon: BrainCircuit, permission: PERMISSIONS.CORPORATE_BRAIN_VIEW },
      { key: "digitalWorkforce", href: "/digital-workforce", icon: Bot, permission: PERMISSIONS.DIGITAL_WORKFORCE_VIEW },
    ]
  },
  {
    key: "hrGroup",
    icon: UsersRound,
    children: [
      { key: "employees", href: "/payroll/employees", icon: Users, permission: PERMISSIONS.PAYROLL_VIEW },
      { key: "requests", href: "/employee-experience/requests", icon: Inbox, permission: PERMISSIONS.REQUESTS_VIEW },
      { key: "payroll", href: "/payroll/run", icon: Banknote, permission: PERMISSIONS.PAYROLL_VIEW },
      { key: "policies", href: "/employee-experience/policies", icon: BookOpen, permission: PERMISSIONS.POLICIES_VIEW },
    ]
  },
  {
    key: "attendanceManage",
    icon: CalendarClock,
    children: [
      { key: "attendance", href: "/attendance", icon: Clock, permission: PERMISSIONS.ATTENDANCE_USE },
      { key: "dashboard", href: "/attendance/dashboard", icon: LayoutDashboard, permission: PERMISSIONS.ATTENDANCE_MANAGE },
      { key: "setup", href: "/attendance/setup", icon: UserCheck, permission: PERMISSIONS.ATTENDANCE_MANAGE },
      { key: "corrections", href: "/attendance/corrections", icon: FileEdit, permission: PERMISSIONS.ATTENDANCE_MANAGE },
      { key: "deductions", href: "/attendance/deductions", icon: Calculator, permission: PERMISSIONS.ATTENDANCE_MANAGE }
    ]
  },
  {
    key: "leaves",
    icon: CalendarOff,
    children: [
      { key: "submit", href: "/employee-experience/employee", icon: Send, permission: PERMISSIONS.EMPLOYEE_USE },
    ]
  },
  {
    key: "admin",
    href: "/admin",
    icon: ShieldCheck,
    permission: PERMISSIONS.ALL,
  },
] as const;


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
    nav: {
      workspaceGroup: "مساحة العمل",
      hrGroup: "الموارد البشرية",
      corporateBrain: "العقل المؤسسي",
      digitalWorkforce: "القوى العاملة الرقمية",
      admin: "لوحة الإدارة",
      employees: "الموظفون",
      requests: "الطلبات",
      payroll: "مسير الرواتب",
      policies: "السياسات",
      attendanceManage: "إدارة الحضور",
      attendance: "سجل الحضور",
      dashboard: "لوحة القيادة",
      setup: "الورديات",
      corrections: "التصحيحات",
      deductions: "الخصميات",
      leaves: "الإجازات",
      submit: "تقديم طلب",
    }
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
    nav: {
      workspaceGroup: "Workspace",
      hrGroup: "Human Resources",
      corporateBrain: "Corporate Brain",
      digitalWorkforce: "Digital Workforce",
      admin: "Admin",
      employees: "Employees",
      requests: "Requests",
      payroll: "Payroll",
      policies: "Policies",
      attendanceManage: "Attendance Management",
      attendance: "Attendance Record",
      dashboard: "Dashboard",
      setup: "Shifts",
      corrections: "Corrections",
      deductions: "Deductions",
      leaves: "Leaves",
      submit: "Submit Request",
    }
  },
} as const;

function normalizeText(value: unknown): string | null {
  if (typeof value !== "string") return null;
  return value.trim() || null;
}

function resolveUserName(user: User | null, defaultName: string): string {
  if (!user) return defaultName;
  const metadataName = normalizeText(user.user_metadata?.full_name) ??
    normalizeText(user.user_metadata?.name) ??
    normalizeText(user.user_metadata?.display_name);
  if (metadataName) return metadataName;
  return user.email?.split("@")[0]?.trim() || defaultName;
}

function resolveInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "KU";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0]}${words[1][0]}`.toUpperCase();
}

function getPermissionsForRole(role: string | null): readonly Permission[] {
  if (!role) return [];
  return ROLE_PERMISSIONS[role] ?? [];
}

function hasPermission(userPermissions: readonly Permission[], required: Permission): boolean {
  return userPermissions.includes(PERMISSIONS.ALL) || userPermissions.includes(required);
}

export default function EnterpriseHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { t, locale } = useLocalization();
  const isArabic = locale === "ar";
  const localT = isArabic ? HEADER_CONTENT.ar : HEADER_CONTENT.en;

  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const navContainerRef = useRef<HTMLDivElement | null>(null);
  const firstMenuItemRef = useRef<HTMLAnchorElement | null>(null);

  const [user, setUser] = useState<User | null>(null);
  const [companyName, setCompanyName] = useState<string | null>(null);
  const [permissionRole, setPermissionRole] = useState<string | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openNavDropdown, setOpenNavDropdown] = useState<string | null>(null); // حالة الـ Dropdown
  const [isSigningOut, setIsSigningOut] = useState(false);

  const userName = useMemo(() => resolveUserName(user, localT.defaultUser), [user, localT.defaultUser]);
  const userInitials = useMemo(() => resolveInitials(userName), [userName]);
  const userPermissions = useMemo(() => getPermissionsForRole(permissionRole), [permissionRole]);

  // 4. فلترة الملاحة بشكل ديناميكي (للأقسام والروابط الفرعية)
  const visibleNavigationItems = useMemo(() => {
    return navigationItems.map(group => {
      if (group.children) {
        const filteredChildren = group.children.filter(child => 
          !child.permission || hasPermission(userPermissions, child.permission)
        );
        return { ...group, children: filteredChildren };
      }
      return group;
    }).filter(group => {
      if (group.children) return group.children.length > 0; // إخفاء القسم إذا لم يكن لديه صفحات فرعية مسموحة
      return !group.permission || hasPermission(userPermissions, group.permission);
    });
  }, [userPermissions]);

  useEffect(() => {
    let isMounted = true;
    async function loadWorkspaceCompanyAndRole(authenticatedUser: User | null) {
      if (!authenticatedUser) {
        if (isMounted) { setCompanyName(null); setPermissionRole(null); }
        return;
      }
      try {
        const identity = await resolveWorkspaceIdentity(supabase);
        const [{ data: companyData, error: companyError }, { data: membershipData, error: membershipError }] = await Promise.all([
            supabase.from("companies").select("name").eq("id", identity.companyId).maybeSingle(),
            supabase.from("organization_memberships").select("role").eq("user_id", authenticatedUser.id).eq("organization_id", identity.organizationId).maybeSingle(),
          ]);
        if (companyError) throw companyError;
        if (membershipError) throw membershipError;
        if (!isMounted) return;
        setCompanyName(normalizeText(companyData?.name));
        setPermissionRole(normalizeText(membershipData?.role));
      } catch (error) {
        console.error("Unable to load workspace company/role:", error);
        if (isMounted) { setCompanyName(null); setPermissionRole(null); }
      }
    }

    async function loadAuthenticatedUser() {
      const { data, error } = await supabase.auth.getUser();
      if (!isMounted) return;
      const authenticatedUser = error ? null : data.user ?? null;
      setUser(authenticatedUser);
      setIsUserLoading(false);
      await loadWorkspaceCompanyAndRole(authenticatedUser);
    }
    void loadAuthenticatedUser();
    const { data: authenticationListener } = supabase.auth.onAuthStateChange((_event, session) => {
        if (!isMounted) return;
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
    setOpenNavDropdown(null);
  }, [pathname]);

  // إغلاق القوائم عند الضغط خارجها
  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (isMenuOpen && userMenuRef.current && !userMenuRef.current.contains(target)) {
        setIsMenuOpen(false);
      }
      if (openNavDropdown && navContainerRef.current && !navContainerRef.current.contains(target)) {
        setOpenNavDropdown(null);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        setOpenNavDropdown(null);
      }
    }
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen, openNavDropdown]);

  async function handleSignOut() {
    if (isSigningOut) return;
    setIsSigningOut(true);
    try {
      clearWorkspaceSession();
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
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
          <Link href="/" className="kafu-executive-brand" aria-label="KAFU AI">
            <Image src="/brand/kafu-logo-en.png" alt="KAFU AI" width={1774} height={887} priority className="kafu-executive-brand__logo" sizes="112px" />
          </Link>
          <div className="kafu-executive-header__actions">
            <LanguageSwitcher />
            <Link href="/login" className="kafu-public-login">{localT.login}</Link>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="kafu-executive-header" dir={isArabic ? "rtl" : "ltr"}>
      <div className="kafu-executive-header__inner">
        <div className="kafu-executive-header__brand-zone">
          <Link href="/" className="kafu-executive-brand" aria-label="KAFU AI">
            <Image src="/brand/kafu-logo-en.png" alt="KAFU AI" width={1774} height={887} priority className="kafu-executive-brand__logo" sizes="112px" />
          </Link>
          <span className="kafu-executive-header__divider" aria-hidden="true" />
          <WorkspaceScopeSwitcher />
        </div>

        {/* منطقة النفيجيشن */}
        <nav className="kafu-executive-navigation" aria-label="Enterprise navigation" ref={navContainerRef}>
          {visibleNavigationItems.map((group) => {
            const Icon = group.icon;
            // التحقق من تفعيل الرابط
            const isActive = group.href 
              ? (group.href === "/" ? pathname === "/" : pathname.startsWith(group.href))
              : group.children?.some(child => pathname.startsWith(child.href));

            if (group.children) {
              return (
                <div key={group.key} className="kafu-nav-dropdown-wrapper">
                  <button
                    onClick={() => setOpenNavDropdown(openNavDropdown === group.key ? null : group.key)}
                    className="kafu-executive-navigation__link"
                    data-active={isActive || openNavDropdown === group.key}
                  >
                    <Icon size={18} strokeWidth={1.8} />
                    <span className="kafu-executive-navigation__label">
                      {localT.nav[group.key as keyof typeof localT.nav]}
                    </span>
                    <ChevronDown size={14} strokeWidth={2} style={{ transition: 'transform 150ms ease', transform: openNavDropdown === group.key ? 'rotate(180deg)' : 'none' }} />
                  </button>

                  {openNavDropdown === group.key && (
                    <div className="kafu-nav-dropdown-menu">
                     {group.children.map((child) => {
                        const ChildIcon = child.icon;
                        
                        // 1. نتحقق هل هذا الرابط هو "رابط أب" تتفرع منه روابط أخرى في نفس القائمة؟
                        // (مثل /attendance الذي يتفرع منه /attendance/corrections)
                        const isBaseRoute = group.children?.some(
                          (other) => other.href !== child.href && other.href.startsWith(child.href)
                        );

                        // 2. إذا كان رابط أساسي، نطلب تطابقاً تاماً (exact match).
                        // وإذا كان فرعي، نسمح بـ startsWith ليدعم الصفحات الداخلية.
                        const isChildActive = isBaseRoute
                          ? pathname === child.href
                          : pathname === child.href || pathname.startsWith(`${child.href}/`);

                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="kafu-nav-dropdown-item"
                            data-active={isChildActive}
                          >
                            <span className="kafu-nav-dropdown-item__icon"><ChildIcon size={16} strokeWidth={1.8} /></span>
                            <span>{localT.nav[child.key as keyof typeof localT.nav]}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link key={group.key} href={group.href!} className="kafu-executive-navigation__link" data-active={isActive}>
                <Icon size={18} strokeWidth={1.8} />
                <span className="kafu-executive-navigation__label">{localT.nav[group.key as keyof typeof localT.nav]}</span>
              </Link>
            );
          })}
        </nav>

        {/* منطقة الحساب */}
        <div className="kafu-executive-header__actions">
          <LanguageSwitcher />
          <span className="kafu-executive-header__divider" aria-hidden="true" />
          
          <div ref={userMenuRef} className="kafu-executive-user-menu">
            <button type="button" className="kafu-executive-user" aria-expanded={isMenuOpen} data-open={isMenuOpen} onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <span className="kafu-executive-user__avatar">
                {isUserLoading ? <LoaderCircle size={16} strokeWidth={1.9} className="kafu-user-spinner" /> : user ? <span aria-hidden="true">{userInitials}</span> : <UserRound size={17} strokeWidth={1.9} />}
              </span>
              <span className="kafu-executive-user__identity" data-menu-open={isMenuOpen}><strong>{userName}</strong></span>
              <ChevronDown size={13} strokeWidth={2} className="kafu-executive-user__chevron" />
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