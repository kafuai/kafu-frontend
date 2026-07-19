"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  CorporateBrainLayout,
  type CorporateBrainCompany,
  type CorporateBrainDiscoveryAnswer,
} from "@/components/corporate-brain";
import { useLocalization } from "@/components/localization/LocalizationContext";
import { getCurrentCompanyId } from "@/lib/companySession";
import { supabase } from "@/lib/supabase";

export default function CorporateBrainPage() {
  const { locale } = useLocalization();
  const isArabic = locale === "ar";

  const [company, setCompany] =
    useState<CorporateBrainCompany | null>(null);

  const [answers, setAnswers] = useState<
    CorporateBrainDiscoveryAnswer[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadCorporateBrain() {
      const companyId = getCurrentCompanyId();

      if (!companyId) {
        setMessage(
          isArabic
            ? "لم يتم العثور على بيانات المؤسسة. يرجى إكمال التقييم أولًا."
            : "Company data was not found. Please complete the assessment first.",
        );

        setLoading(false);
        return;
      }

      const { data: companyData, error: companyError } = await supabase
        .from("companies")
        .select("id, name, industry, country, employee_count")
        .eq("id", companyId)
        .single();

      if (companyError) {
        setMessage(
          isArabic
            ? `حدث خطأ أثناء تحميل بيانات المؤسسة: ${companyError.message}`
            : `Failed to load company data: ${companyError.message}`,
        );

        setLoading(false);
        return;
      }

      const { data: answersData, error: answersError } = await supabase
        .from("discovery_answers")
        .select("id, question, answer, question_order")
        .eq("company_id", companyId)
        .order("question_order", {
          ascending: true,
        });

      if (answersError) {
        setMessage(
          isArabic
            ? `حدث خطأ أثناء تحميل بيانات الاستكشاف: ${answersError.message}`
            : `Failed to load discovery data: ${answersError.message}`,
        );

        setLoading(false);
        return;
      }

      setCompany(companyData);
      setAnswers(answersData ?? []);
      setLoading(false);
    }

    loadCorporateBrain();
  }, [isArabic]);

  if (loading) {
    return (
      <main
        className="flex min-h-[calc(100vh-76px)] items-center justify-center bg-[var(--background)] px-5 py-8 md:px-8"
        dir={isArabic ? "rtl" : "ltr"}
      >
        <section className="w-full max-w-md overflow-hidden rounded-3xl border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-medium)]">
          <div className="h-1 bg-[var(--brand-primary)]" />

          <div className="p-8 text-center">
            <span className="mx-auto block h-10 w-10 animate-spin rounded-full border-4 border-[var(--border-default)] border-t-[var(--brand-primary)]" />

            <h1 className="mt-5 text-xl font-black text-[var(--text-primary)]">
              {isArabic
                ? "جاري تشغيل العقل المؤسسي"
                : "Initializing Corporate Brain"}
            </h1>

            <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
              {isArabic
                ? "يتم تحميل بيانات المؤسسة ومصادر المعرفة."
                : "Loading company context and knowledge sources."}
            </p>
          </div>
        </section>
      </main>
    );
  }

  if (message || !company) {
    return (
      <main
        className="flex min-h-[calc(100vh-76px)] items-center justify-center bg-[var(--background)] px-5 py-8 md:px-8"
        dir={isArabic ? "rtl" : "ltr"}
      >
        <section className="w-full max-w-xl overflow-hidden rounded-3xl border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-medium)]">
          <div className="h-1 bg-amber-500" />

          <div className="p-8 text-center md:p-10">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-lg font-black text-amber-700">
              !
            </div>

            <p className="mt-5 text-xs font-black uppercase tracking-[0.12em] text-[var(--brand-primary)]">
              Corporate Brain
            </p>

            <h1 className="mt-2 text-2xl font-black text-[var(--text-primary)]">
              {isArabic
                ? "تعذر تشغيل العقل المؤسسي"
                : "Corporate Brain Unavailable"}
            </h1>

            <p className="mt-4 leading-8 text-[var(--text-secondary)]">
              {message}
            </p>

            <Link
              href="/assessment"
              className="mt-7 inline-flex min-h-11 items-center justify-center rounded-xl bg-[var(--brand-primary)] px-6 text-sm font-black text-white shadow-sm transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2"
            >
              {isArabic ? "العودة إلى التقييم" : "Go to Assessment"}
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <CorporateBrainLayout
      company={company}
      answers={answers}
    />
  );
}