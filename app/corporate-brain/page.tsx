"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  BrainCircuit,
  Building2,
  RefreshCw,
} from "lucide-react";

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
    let isMounted = true;

    async function loadCorporateBrain() {
      if (isMounted) {
        setLoading(true);
        setMessage("");
      }

      const companyId = getCurrentCompanyId();

      if (!companyId) {
        if (isMounted) {
          setMessage(
            isArabic
              ? "لم يتم العثور على بيانات المؤسسة. يرجى إكمال التقييم أولًا."
              : "Company data was not found. Please complete the assessment first.",
          );

          setLoading(false);
        }

        return;
      }

      try {
        const [
          { data: companyData, error: companyError },
          { data: answersData, error: answersError },
        ] = await Promise.all([
          supabase
            .from("companies")
            .select("id, name, industry, country, employee_count")
            .eq("id", companyId)
            .single(),

          supabase
            .from("discovery_answers")
            .select("id, question, answer, question_order")
            .eq("company_id", companyId)
            .order("question_order", {
              ascending: true,
            }),
        ]);

        if (companyError) {
          throw new Error(
            isArabic
              ? `تعذر تحميل بيانات المؤسسة: ${companyError.message}`
              : `Failed to load company data: ${companyError.message}`,
          );
        }

        if (answersError) {
          throw new Error(
            isArabic
              ? `تعذر تحميل بيانات الاستكشاف: ${answersError.message}`
              : `Failed to load discovery data: ${answersError.message}`,
          );
        }

        if (isMounted) {
          setCompany(companyData);
          setAnswers(answersData ?? []);
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : isArabic
              ? "حدث خطأ غير متوقع أثناء تشغيل العقل المؤسسي."
              : "An unexpected error occurred while initializing Corporate Brain.";

        if (isMounted) {
          setMessage(errorMessage);
          setCompany(null);
          setAnswers([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void loadCorporateBrain();

    return () => {
      isMounted = false;
    };
  }, [isArabic]);

  if (loading) {
    return (
      <main
        className="flex min-h-[calc(100vh-76px)] items-center justify-center bg-[var(--background)] px-5 py-10 md:px-8"
        dir={isArabic ? "rtl" : "ltr"}
      >
        <section
          className="relative w-full max-w-md overflow-hidden rounded-[22px] border border-[var(--border-default)] bg-[var(--surface)] px-8 py-10 text-center shadow-[var(--shadow-medium)]"
          role="status"
          aria-live="polite"
        >
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-1 bg-[var(--brand-primary)]"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -start-20 -top-20 h-52 w-52 rounded-full bg-[color-mix(in_srgb,var(--brand-primary)_6%,transparent)]"
          />

          <div className="relative">
            <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-[color-mix(in_srgb,var(--brand-primary)_16%,var(--border-default))] bg-[var(--brand-subtle)] text-[var(--brand-primary)] shadow-[var(--shadow-small)]">
              <RefreshCw className="animate-spin" size={25} />
            </span>

            <p className="mt-5 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[var(--brand-primary)]">
              Corporate Brain
            </p>

            <h1 className="mt-2 text-2xl font-extrabold tracking-[-0.03em] text-[var(--text-primary)]">
              {isArabic
                ? "جارٍ تشغيل العقل المؤسسي"
                : "Initializing Corporate Brain"}
            </h1>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-[var(--text-secondary)]">
              {isArabic
                ? "يتم تحميل بيانات المؤسسة ومصادر المعرفة وإشارات الاستكشاف."
                : "Loading company context, enterprise knowledge, and discovery signals."}
            </p>

            <div className="mt-7 flex items-center justify-center gap-2 text-xs font-bold text-[var(--text-muted)]">
              <BrainCircuit size={15} />

              <span>
                {isArabic
                  ? "تجهيز طبقة الذكاء التنفيذي"
                  : "Preparing executive intelligence layer"}
              </span>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (message || !company) {
    return (
      <main
        className="flex min-h-[calc(100vh-76px)] items-center justify-center bg-[var(--background)] px-5 py-10 md:px-8"
        dir={isArabic ? "rtl" : "ltr"}
      >
        <section
          className="relative w-full max-w-xl overflow-hidden rounded-[22px] border border-[var(--border-default)] bg-[var(--surface)] px-8 py-10 text-center shadow-[var(--shadow-medium)] md:px-10"
          role="alert"
        >
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-1 bg-[var(--warning)]"
          />

          <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--warning-background)] text-[var(--warning)]">
            <AlertTriangle size={26} />
          </span>

          <p className="mt-5 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[var(--brand-primary)]">
            Corporate Brain
          </p>

          <h1 className="mt-2 text-2xl font-extrabold tracking-[-0.03em] text-[var(--text-primary)]">
            {isArabic
              ? "تعذر تشغيل العقل المؤسسي"
              : "Corporate Brain unavailable"}
          </h1>

          <p className="mx-auto mt-4 max-w-lg break-words text-sm leading-7 text-[var(--text-secondary)]">
            {message ||
              (isArabic
                ? "لم يتم العثور على بيانات المؤسسة المطلوبة."
                : "Required company data was not found.")}
          </p>

          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/assessment"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[var(--brand-primary)] px-6 text-sm font-extrabold text-white shadow-[var(--shadow-small)] transition hover:-translate-y-0.5 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2"
            >
              <Building2 size={17} />

              {isArabic
                ? "العودة إلى التقييم"
                : "Go to assessment"}
            </Link>

            <Link
              href="/company-workspace"
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[var(--border-default)] bg-[var(--surface)] px-6 text-sm font-extrabold text-[var(--text-secondary)] transition hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
            >
              {isArabic
                ? "فتح مساحة العمل"
                : "Open company workspace"}
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