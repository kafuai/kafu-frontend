"use client";

import { Suspense } from "react";
import AuthenticationShell from "../../components/authentication/AuthenticationShell";
import LoginForm from "../../components/authentication/LoginForm";
import { useLocalization } from "@/components/localization/LocalizationContext";

const CONTENT = {
  ar: {
    eyebrow: "دخول آمن",
    title: "بوابتك الآمنة إلى منظومة KAFU AI",
    description:
      "ادخل إلى مساحة العمل الموحدة لإدارة المعرفة المؤسسية والقرارات والاتصالات وفرق العمل الرقمية",
    fallback: "جارٍ تجهيز تسجيل الدخول...",
  },
  en: {
    eyebrow: "SECURE ACCESS",
    title: "Your secure gateway to the KAFU AI ecosystem",
    description:
      "Access your unified workspace to manage enterprise knowledge, decisions, communications, and digital teams",
    fallback: "Preparing login...",
  },
} as const;

export default function LoginPage() {
  const { locale } = useLocalization();
  const isArabic = locale === "ar";
  const t = isArabic ? CONTENT.ar : CONTENT.en;

  return (
    <AuthenticationShell
      eyebrow={t.eyebrow}
      title={t.title}
      description={t.description}
    >
      <Suspense
        fallback={
          <div className="py-16 text-center text-sm text-slate-500">
            {t.fallback}
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </AuthenticationShell>
  );
}