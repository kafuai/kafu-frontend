"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

import AIRecommendations from "@/components/command-center/AIRecommendations";
import CommandCenterFooter from "@/components/command-center/CommandCenterFooter";
import CommandCenterHero from "@/components/command-center/CommandCenterHero";
import CommandCenterKpis from "@/components/command-center/CommandCenterKpis";
import DigitalWorkforceGrid, {
  type CommandCenterAgent,
} from "@/components/command-center/DigitalWorkforceGrid";
import ExecutiveAlerts, {
  type CommandCenterAlert,
} from "@/components/command-center/ExecutiveAlerts";
import LiveActivity, {
  type CommandCenterActivity,
} from "@/components/command-center/LiveActivity";
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

type DiscoveryAnswer = {
  id: string;
  question: string;
  answer: string;
  question_order: number;
};

export default function CommandCenterPage() {
  const { locale } = useLocalization();

  const [company, setCompany] = useState<Company | null>(null);
  const [answers, setAnswers] = useState<DiscoveryAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadCommandCenter() {
      setLoading(true);
      setMessage("");

      const companyId = getCurrentCompanyId();

      if (!companyId) {
        if (isMounted) {
          setMessage(
            locale === "ar"
              ? "لم يتم العثور على بيانات الشركة. يرجى إكمال التقييم أولًا."
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
            .order("question_order", { ascending: true }),
        ]);

        if (companyError) {
          throw new Error(companyError.message);
        }

        if (answersError) {
          throw new Error(answersError.message);
        }

        if (isMounted) {
          setCompany(companyData);
          setAnswers(answersData ?? []);
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";

        if (isMounted) {
          setMessage(
            locale === "ar"
              ? `تعذر تحميل مركز القيادة: ${errorMessage}`
              : `Failed to load the command center: ${errorMessage}`,
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void loadCommandCenter();

    return () => {
      isMounted = false;
    };
  }, [locale]);

  const companyName =
    company?.name ||
    (locale === "ar" ? "المؤسسة" : "Organization");

  const agents = useMemo<CommandCenterAgent[]>(
    () => [
      {
        id: "employee-experience-manager",
        name: "Employee Experience Manager",
        title:
          locale === "ar"
            ? "مدير تجربة الموظف الذكي"
            : "Employee Experience Manager",
        description:
          locale === "ar"
            ? "يعالج طلبات الموظفين اليومية والاستفسارات والخطابات والإجازات."
            : "Handles daily employee requests, inquiries, letters, and leave workflows.",
        status: locale === "ar" ? "متصل" : "Online",
        load: 74,
        priority: locale === "ar" ? "عالية" : "High",
      },
      {
        id: "documents-policies-advisor",
        name: "Documents & Policies Advisor",
        title:
          locale === "ar"
            ? "مستشار الوثائق والسياسات"
            : "Documents & Policies Advisor",
        description:
          locale === "ar"
            ? "يربط الإجابات بالسياسات والوثائق والنماذج الداخلية المعتمدة."
            : "Connects responses to verified policies, documents, and internal templates.",
        status: locale === "ar" ? "متصل" : "Online",
        load: 82,
        priority: locale === "ar" ? "حرجة" : "Critical",
      },
      {
        id: "executive-hr-advisor",
        name: "Executive HR Advisor",
        title:
          locale === "ar"
            ? "المستشار التنفيذي للموارد البشرية"
            : "Executive HR Advisor",
        description:
          locale === "ar"
            ? "ينتج الملخصات والتوصيات التنفيذية للإدارة."
            : "Produces executive summaries and management recommendations.",
        status: locale === "ar" ? "متصل" : "Online",
        load: 69,
        priority: locale === "ar" ? "عالية" : "High",
      },
      {
        id: "talent-acquisition-advisor",
        name: "Talent Acquisition Advisor",
        title:
          locale === "ar"
            ? "مستشار استقطاب المواهب"
            : "Talent Acquisition Advisor",
        description:
          locale === "ar"
            ? "يدعم فرز المرشحين وتحليل السير الذاتية وإعداد القوائم القصيرة."
            : "Supports candidate screening, resume analysis, and shortlist preparation.",
        status: locale === "ar" ? "استعداد" : "Standby",
        load: 42,
        priority: locale === "ar" ? "متوسطة" : "Medium",
      },
      {
        id: "compliance-intelligence-advisor",
        name: "Compliance Intelligence Advisor",
        title:
          locale === "ar"
            ? "مستشار الامتثال الذكي"
            : "Compliance Intelligence Advisor",
        description:
          locale === "ar"
            ? "يراقب الالتزام بالسياسات والمتطلبات التنظيمية."
            : "Monitors compliance with policies and regulatory requirements.",
        status: locale === "ar" ? "معالجة" : "Processing",
        load: 58,
        priority: locale === "ar" ? "متوسطة" : "Medium",
      },
      {
        id: "localization-intelligence-advisor",
        name: "Localization Intelligence Advisor",
        title:
          locale === "ar"
            ? "مستشار التوطين الذكي"
            : "Localization Intelligence Advisor",
        description:
          locale === "ar"
            ? "يتابع مؤشرات التوطين والتنبيهات والمخاطر المرتبطة بها."
            : "Tracks localization indicators, alerts, and associated risks.",
        status: locale === "ar" ? "مراقبة" : "Monitoring",
        load: company?.country === "Saudi Arabia" ? 62 : 40,
        priority:
          company?.country === "Saudi Arabia"
            ? locale === "ar"
              ? "عالية"
              : "High"
            : locale === "ar"
              ? "متوسطة"
              : "Medium",
      },
    ],
    [company?.country, locale],
  );

  const alerts = useMemo<CommandCenterAlert[]>(
    () => [
      {
        id: "knowledge-sources",
        title:
          locale === "ar"
            ? "مصادر معرفة مطلوبة"
            : "Knowledge sources required",
        description:
          locale === "ar"
            ? "ارفع السياسات والإجراءات الداخلية لزيادة دقة Corporate Brain."
            : "Upload internal policies and procedures to improve Corporate Brain accuracy.",
        level: locale === "ar" ? "عالية" : "High",
      },
      {
        id: "discovery-data",
        title:
          locale === "ar"
            ? "بيانات الاستكشاف متاحة"
            : "Discovery data available",
        description:
          locale === "ar"
            ? "يمكن استخدام إجابات الاستكشاف الحالية في التوصيات التنفيذية."
            : "Current discovery answers can now be used in executive recommendations.",
        level: locale === "ar" ? "متوسطة" : "Medium",
      },
      {
        id: "simulation-mode",
        title:
          locale === "ar"
            ? "تشغيل الوكلاء في وضع العرض"
            : "Agent deployment is simulated",
        description:
          locale === "ar"
            ? "الوكلاء حاليًا في وضع العرض والتوصية، وليس التنفيذ الفعلي."
            : "Agents are currently presented in recommendation and demo mode, not live execution.",
        level: locale === "ar" ? "متوسطة" : "Medium",
      },
    ],
    [locale],
  );

  const activities = useMemo<CommandCenterActivity[]>(
    () => [
      {
        id: "company-loaded",
        title:
          locale === "ar"
            ? "تحميل بيانات المؤسسة"
            : "Company data loaded",
        description:
          locale === "ar"
            ? `تم ربط بيانات ${companyName} بمركز القيادة.`
            : `${companyName} data was connected to the command center.`,
        time: locale === "ar" ? "الآن" : "Now",
      },
      {
        id: "signals-analyzed",
        title:
          locale === "ar"
            ? "تحليل إشارات الاستكشاف"
            : "Discovery signals analyzed",
        description:
          locale === "ar"
            ? `تم تحليل ${answers.length} إجابة واستخراج الأولويات التنفيذية.`
            : `${answers.length} discovery answers were analyzed for executive priorities.`,
        time: locale === "ar" ? "قبل دقيقة" : "1 minute ago",
      },
      {
        id: "workforce-mapped",
        title:
          locale === "ar"
            ? "ربط القوى العاملة الرقمية"
            : "Digital workforce mapped",
        description:
          locale === "ar"
            ? "تم ربط الوكلاء بـ Corporate DNA وCorporate Brain."
            : "Digital agents were connected to Corporate DNA and Corporate Brain.",
        time: locale === "ar" ? "قبل 3 دقائق" : "3 minutes ago",
      },
    ],
    [answers.length, companyName, locale],
  );

  const recommendations = useMemo(
    () => [
      locale === "ar"
        ? "ابدأ بتفعيل مدير تجربة الموظف كأول وكيل تشغيلي."
        : "Activate the Employee Experience Manager as the first operational agent.",
      locale === "ar"
        ? "اربط مستشار السياسات بمصادر المعرفة الداخلية المعتمدة."
        : "Connect the Policies Advisor to verified internal knowledge sources.",
      locale === "ar"
        ? "فعّل ملخصًا تنفيذيًا أسبوعيًا للإدارة العليا."
        : "Enable a weekly executive brief for senior management.",
    ],
    [locale],
  );

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
              ? "جارٍ تشغيل مركز القيادة..."
              : "Initializing AI Command Center..."}
          </p>
        </div>
      </main>
    );
  }

  if (message) {
    return (
      <main className="flex min-h-[calc(100vh-76px)] items-center justify-center bg-[var(--background)] px-6">
        <section
          className="max-w-xl rounded-3xl border border-[var(--border-default)] bg-[var(--surface)] p-10 text-center shadow-[var(--shadow-medium)]"
          role="alert"
        >
          <AlertTriangle
            className="mx-auto text-[var(--warning)]"
            size={32}
          />

          <h1 className="mt-5 text-xl font-black text-[var(--text-primary)]">
            {locale === "ar"
              ? "تعذر فتح مركز القيادة"
              : "Command Center Unavailable"}
          </h1>

          <p className="mt-3 break-words leading-8 text-[var(--text-secondary)]">
            {message}
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
        <CommandCenterHero locale={locale} />

        <CommandCenterKpis
          locale={locale}
          companyName={companyName}
          discoveryAnswersCount={answers.length}
        />

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <DigitalWorkforceGrid
            locale={locale}
            companyName={companyName}
            agents={agents}
          />

          <ExecutiveAlerts locale={locale} alerts={alerts} />
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <LiveActivity locale={locale} activities={activities} />

          <AIRecommendations
            locale={locale}
            recommendations={recommendations}
          />
        </section>

        <CommandCenterFooter locale={locale} />
      </div>
    </main>
  );
}