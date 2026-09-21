"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ClipboardCheck,
  Loader2,
  Search,
  UserCircle,
} from "lucide-react";

import { supabase } from "@/lib/supabase";
import { useLocalization } from "@/components/localization/LocalizationContext";
import { KeyRound } from "lucide-react";

type Profile = {
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
};


const CONTENT = {
  ar: {
    loading: {
      title: "جاري تحميل الملف الشخصي",
      subtitle: "يتم الآن جلب بيانات حسابك...",
    },
    error: {
      title: "تعذر تحميل الملف الشخصي",
      noSession: "لم يتم العثور على جلسة مستخدم نشطة. يرجى تسجيل الدخول.",
      unknown: "حدث خطأ غير معروف",
      defaultFallback: "لم يتم العثور على بيانات المستخدم الحالي.",
    },
    profile: {
      badge: "الملف الشخصي",
      defaultName: "مستخدم KAFU",
      defaultEmail: "لا يوجد بريد إلكتروني",
      sectionTitle: "البيانات الشخصية",
      sectionSubtitle: "بيانات حسابك الحالية للعرض فقط.",
      fullNameLabel: "الاسم الكامل",
      emailLabel: "البريد الإلكتروني",
      changePassword: "تغيير كلمة المرور", 
    },
    executive: {
      badge: "أدوات تنفيذية",
      title: "أدوات الإدارة التنفيذية",
      subtitle: "الوصول السريع إلى مراحل إعداد المؤسسة واستكشافها.",
      assessment: {
        title: "التقييم",
        desc: "مراجعة وتحديث بيانات المؤسسة الأساسية ومرحلة التقييم.",
      },
      discovery: {
        title: "الاستكشاف",
        desc: "الانتقال إلى جلسة الاستكشاف ومراجعة إجابات المؤسسة.",
      },
    },
  },
  en: {
    loading: {
      title: "Loading Profile",
      subtitle: "Fetching your account data...",
    },
    error: {
      title: "Failed to load profile",
      noSession: "No active user session found. Please log in.",
      unknown: "An unknown error occurred",
      defaultFallback: "Current user data not found.",
    },
    profile: {
      badge: "Profile",
      defaultName: "KAFU User",
      defaultEmail: "No email provided",
      sectionTitle: "Personal Information",
      sectionSubtitle: "Your current account details (read-only).",
      fullNameLabel: "Full Name",
      emailLabel: "Email Address",
      changePassword: "Change Password",
    },
    executive: {
      badge: "EXECUTIVE TOOLS",
      title: "Executive Management Tools",
      subtitle: "Quick access to enterprise setup and discovery phases.",
      assessment: {
        title: "Assessment",
        desc: "Review and update foundational enterprise data and assessment phase.",
      },
      discovery: {
        title: "Discovery",
        desc: "Proceed to the discovery session and review enterprise inputs.",
      },
    },
  },
} as const;

export default function ProfilePage() {
  const router = useRouter();
  const { locale } = useLocalization();
  const isArabic = locale === "ar";
  const t = isArabic ? CONTENT.ar : CONTENT.en;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      try {
        setLoading(true);
        setErrorMessage("");

        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          throw new Error(sessionError.message);
        }

        if (!session || !session.user) {
          throw new Error(t.error.noSession);
        }

        const user = session.user;

     
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("full_name, email, avatar_url")
          .eq("id", user.id)
          .single();

        if (profileError) {
          throw new Error(profileError.message);
        }

        const { data: membershipData, error: membershipError } = await supabase
          .from("organization_memberships")
          .select("role")
          .eq("user_id", user.id)
          .limit(1)
          .maybeSingle();

        if (membershipError) {
          console.error("Membership Error:", membershipError.message);
        }

        if (isMounted) {
          setProfile(profileData);
          setUserRole(membershipData?.role || null);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : t.error.unknown;
        console.error("Profile Error:", message);
        if (isMounted) {
          setErrorMessage(message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void loadProfile();

    return () => {
      isMounted = false;
    };
  }, [t.error]); 

  if (loading) {
    return (
      <main
        dir={isArabic ? "rtl" : "ltr"}
        className="flex min-h-[calc(100vh-76px)] items-center justify-center bg-[var(--background)] px-5 py-10 md:px-8 text-[var(--text-primary)]"
      >
        <section className="w-full max-w-md rounded-[20px] border border-[var(--border-default)] bg-[var(--surface)] px-8 py-10 text-center shadow-[var(--shadow-small)]">
          <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand-subtle)] text-[var(--brand-primary)]">
            <Loader2 className="animate-spin" size={23} />
          </span>
          <h1 className="mt-5 text-xl font-extrabold tracking-tight text-[var(--text-primary)]">
            {t.loading.title}
          </h1>
          <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
            {t.loading.subtitle}
          </p>
        </section>
      </main>
    );
  }

  if (errorMessage || !profile) {
    return (
      <main
        dir={isArabic ? "rtl" : "ltr"}
        className="flex min-h-[calc(100vh-76px)] items-center justify-center bg-[var(--background)] px-5 py-10 md:px-8 text-[var(--text-primary)]"
      >
        <div className="mx-auto max-w-5xl">
          <section className="rounded-[28px] border border-[var(--border-default)] bg-[var(--surface)] p-8 shadow-[var(--shadow-small)] text-center">
            <h1 className="text-3xl font-black">
              {t.error.title}
            </h1>
            <p className="mt-3 text-[var(--text-secondary)]">
              {errorMessage || t.error.defaultFallback}
            </p>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      className="min-h-screen bg-[var(--background)] px-5 py-10 text-[var(--text-primary)] sm:px-8 lg:px-10 text-start"
    >
      <div className="mx-auto max-w-5xl space-y-6">
        <section className="overflow-hidden rounded-[20px] border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-small)]">
          <div className="relative overflow-hidden border-b border-[var(--border-default)] bg-[var(--surface)] px-6 py-10 sm:px-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.12),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.08),transparent_38%)]" />

            <div className="relative flex flex-col items-center gap-5 sm:flex-row sm:items-center">
              <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-[var(--surface)] bg-[var(--background)] shadow-lg">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name || "User"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UserCircle className="h-20 w-20 text-[var(--text-secondary)]" />
                )}
              </div>

              <div className="text-center sm:text-start">
                <p className="text-sm font-black text-[var(--brand-primary)] uppercase tracking-wider">
                  {t.profile.badge}
                </p>
                <h1 className="mt-2 text-3xl font-black sm:text-4xl">
                  {profile.full_name || t.profile.defaultName}
                </h1>
                <p className="mt-2 text-[var(--text-secondary)]">
                  {profile.email || t.profile.defaultEmail}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-10">
            <div>
              <h2 className="text-2xl font-black">{t.profile.sectionTitle}</h2>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                {t.profile.sectionSubtitle}
              </p>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-bold">{t.profile.fullNameLabel}</label>
                <input
                  type="text"
                  value={profile.full_name || ""}
                  readOnly
                  className="w-full cursor-not-allowed rounded-2xl border border-[var(--border-default)] bg-[var(--background)] px-4 py-4 text-[var(--text-primary)] outline-none opacity-80"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold">{t.profile.emailLabel}</label>
                <input
                  type="email"
                  value={profile.email || ""}
                  readOnly
                  dir="ltr"
                  className={`w-full cursor-not-allowed rounded-2xl border border-[var(--border-default)] bg-[var(--background)] px-4 py-4 text-[var(--text-primary)] outline-none opacity-80 ${isArabic ? "text-right" : "text-left"}`}
                />
              </div>
            </div>
          </div>
          {/* Change Password Section */}
          <div className=" border-t border-[var(--border-default)]">
            <Link
              href="/profile/change-password"
              className="group flex items-center justify-between gap-4 rounded-2xl border border-[var(--border-default)] bg-[var(--background)] px-6 py-5 transition hover:border-[var(--brand-primary)] hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-subtle,rgba(37,99,235,0.08))] text-[var(--brand-primary)]">
                  <KeyRound size={20} strokeWidth={2} />
                </span>

                <div>
                  <p className="font-bold text-[var(--text-primary)]">
                    {t.profile.changePassword}
                  </p>
                  <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
                    {isArabic
                      ? "حدّث كلمة مرورك للحفاظ على أمان حسابك"
                      : "Update your password to keep your account secure"}
                  </p>
                </div>
              </div>

              {isArabic ? (
                <ArrowLeft
                  size={18}
                  className="shrink-0 text-[var(--text-secondary)] transition-transform group-hover:-translate-x-1"
                />
              ) : (
                <ArrowRight
                  size={18}
                  className="shrink-0 text-[var(--text-secondary)] transition-transform group-hover:translate-x-1"
                />
              )}
            </Link>
          </div>
        </section>

        {userRole === "owner" && (
          <section className="mt-8">
            <div className="mb-5">
              <p className="text-sm font-black text-[var(--brand-primary)] uppercase tracking-wider">
                {t.executive.badge}
              </p>
              <h2 className="mt-2 text-3xl font-black">{t.executive.title}</h2>
              <p className="mt-2 text-[var(--text-secondary)]">
                {t.executive.subtitle}
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Link
                href="/assessment"
                className="group block rounded-[28px] border border-[var(--border-default)] bg-[var(--surface)] p-7 text-start shadow-[var(--shadow-small)] transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--background)] text-[var(--brand-primary)]">
                    <ClipboardCheck className="h-7 w-7" />
                  </div>
                  {/* تغيير السهم واتجاه الحركة بناءً على اللغة */}
                  {isArabic ? (
                    <ArrowLeft className="h-5 w-5 text-[var(--text-secondary)] transition-transform group-hover:-translate-x-1" />
                  ) : (
                    <ArrowRight className="h-5 w-5 text-[var(--text-secondary)] transition-transform group-hover:translate-x-1" />
                  )}
                </div>
                <h3 className="mt-6 text-xl font-black">{t.executive.assessment.title}</h3>
                <p className="mt-2 leading-7 text-[var(--text-secondary)]">
                  {t.executive.assessment.desc}
                </p>
              </Link>

              <Link
                href="/discovery"
                className="group block rounded-[28px] border border-[var(--border-default)] bg-[var(--surface)] p-7 text-start shadow-[var(--shadow-small)] transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--background)] text-[var(--brand-primary)]">
                    <Search className="h-7 w-7" />
                  </div>
                  {isArabic ? (
                    <ArrowLeft className="h-5 w-5 text-[var(--text-secondary)] transition-transform group-hover:-translate-x-1" />
                  ) : (
                    <ArrowRight className="h-5 w-5 text-[var(--text-secondary)] transition-transform group-hover:translate-x-1" />
                  )}
                </div>
                <h3 className="mt-6 text-xl font-black">{t.executive.discovery.title}</h3>
                <p className="mt-2 leading-7 text-[var(--text-secondary)]">
                  {t.executive.discovery.desc}
                </p>
              </Link>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}