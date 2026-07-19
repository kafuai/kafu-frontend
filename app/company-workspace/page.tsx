"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, Building2, RefreshCw } from "lucide-react";

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
    Math.round((completedAnswers / TOTAL_DISCOVERY_QUESTIONS) * 100),
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
            .select("id, name, industry, country, employee_count")
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
          error instanceof Error ? error.message : "Unknown error";

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
      <main
        className="company-workspace-page flex min-h-[calc(100vh-76px)] items-center justify-center bg-[var(--background)] px-5 py-10 md:px-8"
        dir={locale === "ar" ? "rtl" : "ltr"}
      >
        <section
          className="w-full max-w-md rounded-[20px] border border-[var(--border-default)] bg-[var(--surface)] px-8 py-10 text-center shadow-[var(--shadow-small)]"
          role="status"
          aria-live="polite"
        >
          <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand-subtle)] text-[var(--brand-primary)]">
            <RefreshCw className="animate-spin" size={23} />
          </span>

          <h1 className="mt-5 text-xl font-extrabold tracking-tight text-[var(--text-primary)]">
            {locale === "ar"
              ? "جارٍ تجهيز مساحة العمل"
              : "Preparing workspace"}
          </h1>

          <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
            {locale === "ar"
              ? "يتم تحميل بيانات المؤسسة ومؤشرات الجاهزية التنفيذية."
              : "Loading organization data and executive readiness indicators."}
          </p>
        </section>
      </main>
    );
  }

  if (errorMessage || !company) {
    return (
      <main
        className="company-workspace-page flex min-h-[calc(100vh-76px)] items-center justify-center bg-[var(--background)] px-5 py-10 md:px-8"
        dir={locale === "ar" ? "rtl" : "ltr"}
      >
        <section
          className="w-full max-w-xl rounded-[20px] border border-[var(--border-default)] bg-[var(--surface)] px-8 py-10 text-center shadow-[var(--shadow-small)] md:px-10"
          role="alert"
        >
          <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--warning-background)] text-[var(--warning)]">
            <AlertTriangle size={26} />
          </span>

          <h1 className="mt-5 text-2xl font-extrabold tracking-tight text-[var(--text-primary)]">
            {locale === "ar"
              ? "تعذر فتح مساحة العمل"
              : "Workspace unavailable"}
          </h1>

          <p className="mx-auto mt-3 max-w-md break-words text-sm leading-7 text-[var(--text-secondary)]">
            {errorMessage ||
              (locale === "ar"
                ? "لم يتم العثور على بيانات المؤسسة."
                : "Company data was not found.")}
          </p>

          <Link
            href="/assessment"
            className="mt-7 inline-flex min-h-11 items-center justify-center rounded-xl bg-[var(--brand-primary)] px-6 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2"
          >
            {locale === "ar"
              ? "العودة إلى التقييم"
              : "Go to assessment"}
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main
      className="company-workspace-page min-h-screen bg-[var(--background)] px-5 py-8 md:px-8 lg:px-10 xl:px-12"
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      <div className="mx-auto max-w-[1640px] space-y-6 md:space-y-7">
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

        <section
          className="space-y-5 md:space-y-6"
          aria-label={
            locale === "ar"
              ? "مؤشرات صحة المؤسسة"
              : "Organization health indicators"
          }
        >
          <AIHealthWidget
            locale={locale}
            score={readinessScore}
          />

          <ExecutiveKPIs
            locale={locale}
            readinessScore={readinessScore}
          />
        </section>

        <section
          className="grid items-stretch gap-5 md:gap-6 xl:grid-cols-[minmax(290px,350px)_minmax(0,1fr)]"
          aria-label={
            locale === "ar"
              ? "التقدم والإجراءات التنفيذية"
              : "Progress and executive actions"
          }
        >
          <ExecutiveProgress
            locale={locale}
            completed={completedAnswers}
            total={TOTAL_DISCOVERY_QUESTIONS}
          />

          <WorkspaceActions locale={locale} />
        </section>

        <section
          className="grid items-stretch gap-5 md:gap-6 xl:grid-cols-2"
          aria-label={
            locale === "ar"
              ? "التنبيهات والمهام القادمة"
              : "Notifications and upcoming tasks"
          }
        >
          <Notifications locale={locale} />
          <UpcomingTasks locale={locale} />
        </section>

        <footer className="flex flex-col gap-2 border-t border-[var(--border-default)] px-1 pt-5 text-xs text-[var(--text-muted)] sm:flex-row sm:items-center sm:justify-between">
          <span>
            {locale === "ar"
              ? "مساحة العمل التنفيذية للمؤسسة"
              : "Enterprise executive workspace"}
          </span>

          <span className="inline-flex items-center gap-2">
            <Building2 size={13} />
            KAFU AI
          </span>
        </footer>
      </div>
    </main>
  );
}

