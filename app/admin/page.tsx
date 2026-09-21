"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  UserPlus, 
  Building2, 
  ArrowRight, 
  ArrowLeft,
  Loader2 
} from "lucide-react";

import { supabase } from "@/lib/supabase";
import { useLocalization } from "@/components/localization/LocalizationContext";

const CONTENT = {
  ar: {
    loading: "جاري التحميل...",
    noAccess: "عفواً، هذه الصفحة مخصصة لمدراء النظام (Admin) فقط.",
    header: {
      title: "لوحة الإدارة",
      subtitle: "مرحباً بك في لوحة تحكم الإدارة. من هنا يمكنك إضافة المؤسسات وإدارة المستخدمين الجدد.",
    },
    cards: [
      {
        id: "add-user",
        title: "إضافة مستخدم",
        href: "/admin/user",
        icon: UserPlus,
      },
      {
        id: "add-org",
        title: "إضافة مؤسسة",
        href: "/admin/organizations",
        icon: Building2,
      },
    ],
  },
  en: {
    loading: "Loading...",
    noAccess: "Sorry, this page is restricted to Administrators only.",
    header: {
      title: "Admin Dashboard",
      subtitle: "Welcome to the Admin control panel. Here you can add organizations and manage new users.",
    },
    cards: [
      {
        id: "add-user",
        title: "Add User",
        href: "/admin/user",
        icon: UserPlus,
      },
      {
        id: "add-org",
        title: "Add Organization",
        href: "/admin/organizations",
        icon: Building2,
      },
    ],
  },
} as const;

export default function AdminDashboardPage() {
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

        // جلب صلاحية المستخدم
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

  // التحقق من أن المستخدم يحمل صلاحية الأدمن
  const isAdmin = userRole === "admin";

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

        {/* Cards Grid أو رسالة منع الوصول */}
        {isAdmin ? (
          <section className="grid gap-6 sm:grid-cols-2 md:max-w-4xl">
            {t.cards.map((card) => {
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
                
                </Link>
              );
            })}
          </section>
        ) : (
          <section className="flex flex-col items-center justify-center rounded-[28px] border border-dashed border-[var(--border-default)] py-24 text-center bg-[var(--surface)]">
            <p className="text-lg font-bold text-[var(--text-primary)]">{t.noAccess}</p>
          </section>
        )}
      </div>
    </main>
  );
}