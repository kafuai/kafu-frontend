"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

import CompanyHero from "@/components/workspace/hero/CompanyHero";
import WorkspaceActions from "@/components/workspace/actions/WorkspaceActions";
import AIHealthWidget from "@/components/workspace/widgets/AIHealthWidget";
import ExecutiveProgress from "@/components/workspace/dashboard/ExecutiveProgress";
import ExecutiveKPIs from "@/components/workspace/dashboard/ExecutiveKPI";
import Notifications from "@/components/workspace/dashboard/Notifications";
import UpcomingTasks from "@/components/workspace/dashboard/UpcomingTasks";
import { useLocalization } from "@/components/localization/LocalizationContext";
import { getCurrentCompanyId } from "@/lib/companySession";
import { supabase } from "@/lib/supabase";

type Company = {
  id: string;
  name: string | null;
  industry: string | null;
  country: string | null;
  employee_count: number | null;
};

const TOTAL_DISCOVERY_QUESTIONS = 44;

export default function CompanyWorkspacePage() {
  const { locale } = useLocalization();

  const [company, setCompany] = useState<Company | null>(null);
  const [completedAnswers, setCompletedAnswers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const readinessScore = Math.min(
    Math.round(
      (completedAnswers / TOTAL_DISCOVERY_QUESTIONS) * 100,
    ),
    100,
  );

  useEffect(() => {
    let isMounted = true;

    async function loadWorkspace() {
      setLoading(true);
      setErrorMessage("");

      const companyId = getCurrentCompanyId();

      if (!companyId) {
        if (isMounted) {
          setErrorMessage(
            locale === "ar"
              ? "لم يتم العثور على مؤسسة نشطة. يرجى إكمال التقييم أولًا."
              : "No active organization was found. Please complete the assessment first.",
          );
          setLoading(false);
        }

        return;
      }

      try {
        const [
          { data: companyData, error: companyError },
          { count, error: answersError },
        ] = await Promise.all([
          supabase
            .from("companies")
            .select(
              "id, name, industry, country, employee_count",
            )
            .eq("id", companyId)
            .single(),
          supabase
            .from("discovery_answers")
            .select("id", {
              count: "exact",
              head: true,
            })
            .eq("company_id", companyId),
        ]);

        if (companyError) {
          throw new Error(companyError.message);
        }

        if (answersError) {
          throw new Error(answersError.message);
        }

        if (isMounted) {
          setCompany(companyData);
          setCompletedAnswers(count ?? 0);
        }
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Unknown error";

        if (isMounted) {
          setErrorMessage(
            locale === "ar"
              ? `تعذر تحميل مساحة عمل المؤسسة: ${message}`
              : `Failed to load the company workspace: ${message}`,
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void loadWorkspace();

    return () => {
      isMounted = false;
    };
  }, [locale]);

  if (loading) {
    return (
      <main className="flex min-h-[calc(100vh-76px)] items-center justify-center bg-[var(--background)] px-6">
        <div
          className="rounded-3xl border border-[var(--border-default)] bg-[var(--surface)] p-10 text-center shadow-[var(--shadow-medium)]"
          role="status"
          aria-live="polite"
        >
          <span className="mx-auto block h-10 w-10 animate-spin rounded-full border-4 border-[var(--border-default)] border-t-[var(--brand-primary)]" />

          <p className="mt-5 font-bold text-[var(--text-primary)]">
            {locale === "ar"
              ? "جارٍ تحميل مساحة عمل المؤسسة..."
              : "Loading company workspace..."}
          </p>
        </div>
      </main>
    );
  }

  if (errorMessage || !company) {
    return (
      <main className="flex min-h-[calc(100vh-76px)] items-center justify-center bg-[var(--background)] px-6">
        <section
          className="max-w-xl rounded-3xl border border-[var(--border-default)] bg-[var(--surface)] p-10 text-center shadow-[var(--shadow-medium)]"
          role="alert"
        >
          <AlertTriangle
            size={32}
            className="mx-auto text-[var(--warning)]"
          />

          <h1 className="mt-5 text-xl font-black text-[var(--text-primary)]">
            {locale === "ar"
              ? "تعذر فتح مساحة العمل"
              : "Workspace Unavailable"}
          </h1>

          <p className="mt-3 break-words leading-8 text-[var(--text-secondary)]">
            {errorMessage ||
              (locale === "ar"
                ? "لم يتم العثور على بيانات المؤسسة."
                : "Company data was not found.")}
          </p>

          <Link
            href="/assessment"
            className="mt-7 inline-flex min-h-12 items-center justify-center rounded-xl bg-[var(--text-primary)] px-7 font-bold text-[var(--surface)] transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
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
    <main
      className="min-h-[calc(100vh-76px)] bg-[var(--background)] px-5 py-7 md:px-8 lg:px-10"
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      <div className="mx-auto max-w-[1580px] space-y-6">
        <CompanyHero
          locale={locale}
          name={
            company.name ||
            (locale === "ar"
              ? "مؤسسة بدون اسم"
              : "Unnamed Company")
          }
          industry={company.industry}
          country={company.country}
          employees={company.employee_count}
        />

        <AIHealthWidget
          locale={locale}
          score={readinessScore}
        />

        <ExecutiveKPIs
          locale={locale}
          readinessScore={readinessScore}
        />

        <section className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
          <ExecutiveProgress
            locale={locale}
            completed={completedAnswers}
            total={TOTAL_DISCOVERY_QUESTIONS}
          />

          <WorkspaceActions locale={locale} />
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <Notifications locale={locale} />
          <UpcomingTasks locale={locale} />
        </section>
      </div>
    </main>
  );
}