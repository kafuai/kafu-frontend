
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Loader2 } from "lucide-react";

import { supabase } from "@/lib/supabase";
import { useLocalization } from "@/components/localization/LocalizationContext";
import { clearWorkspaceSession } from "@/lib/companySession";

export default function OrganizationSuspendedPage() {
  const [isSigningOut, setIsSigningOut] = useState(false);

  const router = useRouter();
  const { locale } = useLocalization();

  const ar = locale === "ar";

  async function handleSignOut() {
    if (isSigningOut) return;

    setIsSigningOut(true);

    try {
      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      clearWorkspaceSession();

      router.replace("/");
      router.refresh();

    } catch (error) {
      console.error("Unable to sign out:", error);
      setIsSigningOut(false);
    }
  }

  return (
    <main
      dir={ar ? "rtl" : "ltr"}
      className="flex min-h-screen items-center justify-center bg-[var(--background)] px-5 py-12 text-center"
    >
      <section className="w-full max-w-lg rounded-3xl border border-[var(--border-default)] bg-[var(--surface)] p-8 shadow-sm">

        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600">
          <span className="text-2xl font-black">!</span>
        </div>

        <h1 className="mt-5 text-2xl font-black text-[var(--text-primary)]">
          {ar ? "المؤسسة معلّقة" : "Organization suspended"}
        </h1>

        <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
          {ar
            ? "تم تعليق المؤسسة المرتبط بها حسابك. لا يمكنك الوصول إلى المنصة حالياً. يرجى التواصل مع مسؤول المنصة."
            : "Your organization is currently suspended. You cannot access the platform. Please contact the platform administrator."}
        </p>

        <button
          type="button"
          disabled={isSigningOut}
          onClick={() => void handleSignOut()}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSigningOut ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <LogOut size={18} />
          )}

          <span>
            {isSigningOut
              ? ar ? "جارٍ تسجيل الخروج..." : "Signing out..."
              : ar ? "تسجيل الخروج" : "Sign out"}
          </span>
        </button>

      </section>
    </main>
  );
}
