"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  FileText, 
  Send, 
  Users, 
  ArrowRight, 
  ArrowLeft,
  Loader2 
} from "lucide-react";

import { supabase } from "@/lib/supabase";
import { useLocalization } from "@/components/localization/LocalizationContext";

const CARDS_ROLES = {
  policies: ["admin", "owner", "manager"],
  requests: ["admin", "owner", "manager"],
  employee: ["admin", "member"],
};

const CONTENT = {
  ar: {
    loading: "جاري التحميل...",
    noAccess: "لا تملك صلاحيات لعرض هذه الصفحة.",
    header: {
      title: "تجربة الموظف",
      subtitle: "مرحباً بك في وكيل تجربة الموظف.",
    },
    cards: [
      {
        id: "policies",
        title: "السياسات",
        href: "/employee-experience/policies",
        icon: FileText,
        allowedRoles: CARDS_ROLES.policies,
      },
      {
        id: "requests",
        title: "الطلبات",
        href: "/employee-experience/requests",
        icon: Send,
        allowedRoles: CARDS_ROLES.requests,
      },
      {
        id: "employee",
        title: "الموظفين",
        href: "/employee-experience/employee",
        icon: Users,
        allowedRoles: CARDS_ROLES.employee,
      },
    ],
  },
  en: {
    loading: "Loading...",
    noAccess: "You do not have permission to view this page.",
    header: {
      title: "Employee Experience",
      subtitle: "Welcome to the Employee Experience Agent.",
    },
    cards: [
      {
        id: "policies",
        title: "Policies",
        href: "/employee-experience/policies",
        icon: FileText,
        allowedRoles: CARDS_ROLES.policies,
      },
      {
        id: "requests",
        title: "Requests",
        href: "/employee-experience/requests",
        icon: Send,
        allowedRoles: CARDS_ROLES.requests,
      },
      {
        id: "employee",
        title: "Employee",
        href: "/employee-experience/employee",
        icon: Users,
        allowedRoles: CARDS_ROLES.employee,
      },
    ],
  },
} as const;

export default function EmployeeExperiencePage() {
  const { locale } = useLocalization();
  const isArabic = locale === "ar";
  const t = isArabic ? CONTENT.ar : CONTENT.en;

  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchUserRole() {
      try {
        setLoading(true);
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session?.user) {
          throw new Error("No valid session");
        }

        const { data: membershipData, error: membershipError } = await supabase
          .from("organization_memberships")
          .select("role")
          .eq("user_id", session.user.id)
          .limit(1)
          .maybeSingle();

        if (membershipError) throw membershipError;

        if (isMounted && membershipData) {
          setUserRole(membershipData.role);
        }
      } catch (error) {
        console.error("Error fetching role:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    void fetchUserRole();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-[calc(100vh-76px)] items-center justify-center bg-[var(--background)]">
        <div className="flex flex-col items-center gap-4 text-[var(--brand-primary)]">
          <Loader2 className="h-10 w-10 animate-spin" />
          <p className="text-sm font-medium text-[var(--text-secondary)]">{t.loading}</p>
        </div>
      </main>
    );
  }

  // فلترة البطاقات بناءً على دور المستخدم الحالي
  const visibleCards = t.cards.filter(card => userRole && card.allowedRoles.includes(userRole));

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      className="min-h-[calc(100vh-76px)] bg-[var(--background)] px-5 py-12 text-[var(--text-primary)] sm:px-8 lg:px-10"
    >
      <div className="mx-auto max-w-6xl space-y-10">
        {/* Header Section */}
        <section className="text-center sm:text-start">
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
            {t.header.title}
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-[var(--text-secondary)]">
            {t.header.subtitle}
          </p>
        </section>

        {/* Cards Grid */}
        {visibleCards.length > 0 ? (
          <section className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {visibleCards.map((card) => {
              const Icon = card.icon;
              
              return (
                <Link
                  key={card.id}
                  href={card.href}
                  className="group flex flex-col rounded-[28px] border border-[var(--border-default)] bg-[var(--surface)] p-8 shadow-[var(--shadow-small)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--brand-subtle)] text-[var(--brand-primary)] transition-colors group-hover:bg-[var(--brand-primary)] group-hover:text-white">
                      <Icon className="h-8 w-8" />
                    </div>
                    
                    {isArabic ? (
                      <ArrowLeft className="h-6 w-6 text-[var(--text-secondary)] transition-transform duration-300 group-hover:-translate-x-1" />
                    ) : (
                      <ArrowRight className="h-6 w-6 text-[var(--text-secondary)] transition-transform duration-300 group-hover:translate-x-1" />
                    )}
                  </div>
                  
                  <h2 className="mt-8 text-xl font-black">
                    {card.title}
                  </h2>
                  
                  {/* <p className="mt-3 flex-grow text-sm leading-relaxed text-[var(--text-secondary)]">
                    {card.description}
                  </p> */}
                </Link>
              );
            })}
          </section>
        ) : (
          <section className="flex flex-col items-center justify-center rounded-[28px] border border-dashed border-[var(--border-default)] py-20 text-center">
            <p className="text-lg font-medium text-[var(--text-secondary)]">{t.noAccess}</p>
          </section>
        )}
      </div>
    </main>
  );
}