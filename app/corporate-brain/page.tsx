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
          locale === "ar"
            ? "لم يتم العثور على بيانات الشركة. يرجى إكمال التقييم أولًا."
            : "Company data was not found. Please complete the assessment first.",
        );

        setLoading(false);
        return;
      }

      const {
        data: companyData,
        error: companyError,
      } = await supabase
        .from("companies")
        .select(
          "id, name, industry, country, employee_count",
        )
        .eq("id", companyId)
        .single();

      if (companyError) {
        setMessage(
          locale === "ar"
            ? `حدث خطأ أثناء تحميل بيانات الشركة: ${companyError.message}`
            : `Failed to load company data: ${companyError.message}`,
        );

        setLoading(false);
        return;
      }

      const {
        data: answersData,
        error: answersError,
      } = await supabase
        .from("discovery_answers")
        .select(
          "id, question, answer, question_order",
        )
        .eq("company_id", companyId)
        .order("question_order", {
          ascending: true,
        });

      if (answersError) {
        setMessage(
          locale === "ar"
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
  }, [locale]);

  if (loading) {
    return (
      <main className="flex min-h-[calc(100vh-76px)] items-center justify-center bg-[var(--background)] px-6">
        <div className="rounded-[24px] border border-[var(--border-default)] bg-[var(--surface)] p-10 text-center shadow-[var(--shadow-medium)]">
          <span className="mx-auto block h-10 w-10 animate-spin rounded-full border-4 border-[var(--border-default)] border-t-[var(--brand-primary)]" />

          <p className="mt-5 text-sm font-black text-[var(--text-primary)]">
            {locale === "ar"
              ? "جارٍ تشغيل العقل المؤسسي..."
              : "Initializing Corporate Brain..."}
          </p>
        </div>
      </main>
    );
  }

  if (message || !company) {
    return (
      <main className="flex min-h-[calc(100vh-76px)] items-center justify-center bg-[var(--background)] px-6">
        <section className="max-w-xl rounded-[28px] border border-[var(--border-default)] bg-[var(--surface)] p-9 text-center shadow-[var(--shadow-medium)]">
          <h1 className="text-2xl font-black text-[var(--text-primary)]">
            Corporate Brain
          </h1>

          <p className="mt-4 leading-8 text-[var(--text-secondary)]">
            {message}
          </p>

          <Link
            href="/assessment"
            className="mt-7 inline-flex min-h-12 items-center justify-center rounded-xl bg-[var(--text-primary)] px-7 text-sm font-black text-[var(--surface)]"
          >
            {locale === "ar"
              ? "العودة إلى التقييم"
              : "Go to Assessment"}
          </Link>
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