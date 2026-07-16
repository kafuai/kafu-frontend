"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Bot,
  BrainCircuit,
  Building2,
  CheckCircle2,
  Gauge,
  Lightbulb,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

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
    async function loadCommandCenter() {
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

    loadCommandCenter();
  }, [locale]);

  const companyName =
    company?.name ||
    (locale === "ar" ? "المؤسسة" : "Organization");

  const kpis = [
    {
      icon: Building2,
      label:
        locale === "ar"
          ? "مساحة العمل"
          : "Active Workspace",
      value: companyName,
      note:
        locale === "ar"
          ? "المؤسسة الحالية"
          : "Current organization",
    },
    {
      icon: Bot,
      label:
        locale === "ar"
          ? "الوكلاء النشطون"
          : "Active Agents",
      value: "6",
      note:
        locale === "ar"
          ? "القوى العاملة الرقمية"
          : "Digital workforce online",
    },
    {
      icon: BrainCircuit,
      label:
        locale === "ar"
          ? "إشارات الاستكشاف"
          : "Discovery Signals",
      value: String(answers.length),
      note:
        locale === "ar"
          ? "مدخلات تنفيذية"
          : "Executive inputs",
    },
    {
      icon: Gauge,
      label:
        locale === "ar"
          ? "صحة المنصة"
          : "Platform Health",
      value: "99%",
      note:
        locale === "ar"
          ? "جميع الأنظمة متصلة"
          : "All systems operational",
    },
  ];

  const agents = [
    {
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
      name: "Documents & Policies Advisor",
      title:
        locale === "ar"
          ? "مستشار الوثائق والسياسات"
          : "Documents & Policies Advisor",
      description:
        locale === "ar"
          ? "يربط الإجابات بالسياسات والوثائق والنماذج الداخلية."
          : "Connects responses to verified policies, documents, and internal templates.",
      status: locale === "ar" ? "متصل" : "Online",
      load: 82,
      priority: locale === "ar" ? "حرجة" : "Critical",
    },
    {
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
  ];

  const alerts = [
    {
      title:
        locale === "ar"
          ? "مصادر معرفة مطلوبة"
          : "Knowledge sources required",
      description:
        locale === "ar"
          ? "يجب رفع السياسات والإجراءات الداخلية لزيادة دقة Corporate Brain."
          : "Internal policies and procedures should be uploaded to improve Corporate Brain accuracy.",
      level: locale === "ar" ? "عالية" : "High",
    },
    {
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
      title:
        locale === "ar"
          ? "تشغيل الوكلاء تجريبي"
          : "Agent deployment is simulated",
      description:
        locale === "ar"
          ? "الوكلاء حاليًا في وضع العرض والتوصية، وليس التنفيذ الفعلي."
          : "Agents are currently presented in recommendation and demo mode, not live execution.",
      level: locale === "ar" ? "متوسطة" : "Medium",
    },
  ];

  const activities = [
    {
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
      title:
        locale === "ar"
          ? "تحليل إشارات الاستكشاف"
          : "Discovery signals analyzed",
      description:
        locale === "ar"
          ? `تم تحليل ${answers.length} إجابة واستخراج الأولويات التنفيذية.`
          : `${answers.length} discovery answers were analyzed for executive priorities.`,
      time:
        locale === "ar"
          ? "قبل دقيقة"
          : "1 minute ago",
    },
    {
      title:
        locale === "ar"
          ? "ربط القوى العاملة الرقمية"
          : "Digital workforce mapped",
      description:
        locale === "ar"
          ? "تم ربط الوكلاء بـCorporate DNA وCorporate Brain."
          : "Digital agents were connected to Corporate DNA and Corporate Brain.",
      time:
        locale === "ar"
          ? "قبل 3 دقائق"
          : "3 minutes ago",
    },
  ];

  const recommendations = [
    locale === "ar"
      ? "ابدأ بتفعيل مدير تجربة الموظف كأول وكيل تشغيلي."
      : "Activate the Employee Experience Manager as the first operational agent.",
    locale === "ar"
      ? "اربط مستشار السياسات بمصادر المعرفة الداخلية."
      : "Connect the Policies Advisor to verified internal knowledge sources.",
    locale === "ar"
      ? "فعّل ملخصًا تنفيذيًا أسبوعيًا للإدارة العليا."
      : "Enable a weekly executive brief for senior management.",
  ];

  if (loading) {
    return (
      <main className="flex min-h-[calc(100vh-76px)] items-center justify-center bg-[var(--background)] px-6">
        <div className="rounded-3xl border border-[var(--border-default)] bg-[var(--surface)] p-10 text-center shadow-[var(--shadow-medium)]">
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
        <section className="max-w-xl rounded-3xl border border-[var(--border-default)] bg-[var(--surface)] p-10 text-center shadow-[var(--shadow-medium)]">
          <AlertTriangle
            className="mx-auto text-[var(--warning)]"
            size={32}
          />

          <p className="mt-5 leading-8 text-[var(--text-secondary)]">
            {message}
          </p>

          <Link
            href="/assessment"
            className="mt-7 inline-flex rounded-xl bg-[var(--text-primary)] px-7 py-4 font-bold text-[var(--surface)]"
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
    <main className="min-h-[calc(100vh-76px)] bg-[var(--background)] px-5 py-7 md:px-8 lg:px-10">
      <div className="mx-auto max-w-[1580px] space-y-6">
        <section className="rounded-[28px] border border-[var(--border-default)] bg-[var(--surface)] p-8 shadow-[var(--shadow-medium)] md:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-subtle)] px-4 py-2 text-xs font-black text-[var(--brand-primary)]">
                <Activity size={15} />
                AI Command Center
              </div>

              <h1 className="mt-5 text-3xl font-black tracking-tight text-[var(--text-primary)] md:text-5xl">
                {locale === "ar"
                  ? "مركز قيادة المؤسسة الذكي"
                  : "Enterprise AI Command Center"}
              </h1>

              <p className="mt-4 max-w-3xl text-base leading-8 text-[var(--text-secondary)]">
                {locale === "ar"
                  ? "راقب الوكلاء الرقميين والتنبيهات والأنشطة والتوصيات التنفيذية من مساحة قيادة موحدة."
                  : "Monitor digital agents, alerts, activity, and executive recommendations from one unified command workspace."}
              </p>
            </div>

            <div className="inline-flex w-fit items-center gap-3 rounded-2xl bg-[var(--success-background)] px-5 py-4 text-[var(--success)]">
              <CheckCircle2 size={19} />

              <div>
                <p className="text-xs font-black">
                  {locale === "ar"
                    ? "جميع الأنظمة تعمل"
                    : "All Systems Operational"}
                </p>

                <p className="mt-1 text-[10px] opacity-80">
                  99% System Health
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {kpis.map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={item.label}
                className="rounded-3xl border border-[var(--border-default)] bg-[var(--surface)] p-6 shadow-[var(--shadow-small)]"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--brand-subtle)] text-[var(--brand-primary)]">
                    <Icon size={20} />
                  </span>

                  <span className="h-2 w-2 rounded-full bg-[var(--success)]" />
                </div>

                <p className="mt-5 text-xs font-bold text-[var(--text-muted)]">
                  {item.label}
                </p>

                <h2 className="mt-2 truncate text-3xl font-black text-[var(--text-primary)]">
                  {item.value}
                </h2>

                <p className="mt-2 text-xs font-bold text-[var(--brand-primary)]">
                  {item.note}
                </p>
              </article>
            );
          })}
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="rounded-[28px] border border-[var(--border-default)] bg-[var(--surface)] p-6 shadow-[var(--shadow-small)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-[var(--text-primary)]">
                  {locale === "ar"
                    ? "حالة القوى العاملة الرقمية"
                    : "Digital Workforce Status"}
                </h2>

                <p className="mt-2 text-xs text-[var(--text-muted)]">
                  {locale === "ar"
                    ? `مراقبة الوكلاء المقترحين لـ${companyName}.`
                    : `Monitoring recommended agents for ${companyName}.`}
                </p>
              </div>

              <span className="rounded-full bg-[var(--success-background)] px-4 py-2 text-xs font-black text-[var(--success)]">
                6 Agents
              </span>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {agents.map((agent) => (
                <article
                  key={agent.name}
                  className="rounded-3xl border border-[var(--border-default)] bg-[var(--surface-muted)] p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--surface)] text-[var(--brand-primary)] shadow-[var(--shadow-small)]">
                      <Bot size={18} />
                    </span>

                    <span className="rounded-full bg-[var(--surface)] px-3 py-2 text-[10px] font-black text-[var(--text-secondary)]">
                      {agent.status}
                    </span>
                  </div>

                  <h3 className="mt-4 text-sm font-black text-[var(--text-primary)]">
                    {agent.title}
                  </h3>

                  <p className="mt-1 text-[10px] font-bold text-[var(--brand-primary)]">
                    {agent.name}
                  </p>

                  <p className="mt-3 text-xs leading-6 text-[var(--text-muted)]">
                    {agent.description}
                  </p>

                  <div className="mt-4 flex items-center justify-between text-xs font-bold text-[var(--text-secondary)]">
                    <span>
                      {locale === "ar"
                        ? "الحمل الحالي"
                        : "Current Load"}
                    </span>

                    <span>{agent.load}%</span>
                  </div>

                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--surface)]">
                    <div
                      className="h-full rounded-full bg-[var(--brand-primary)]"
                      style={{ width: `${agent.load}%` }}
                    />
                  </div>

                  <div className="mt-4 rounded-xl bg-[var(--surface)] px-4 py-3 text-xs font-bold text-[var(--text-secondary)]">
                    {locale === "ar"
                      ? "الأولوية"
                      : "Priority"}
                    : {agent.priority}
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="rounded-[28px] border border-[var(--border-default)] bg-[var(--surface)] p-6 shadow-[var(--shadow-small)]">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--warning-background)] text-[var(--warning)]">
                <AlertTriangle size={20} />
              </span>

              <div>
                <h2 className="text-base font-black text-[var(--text-primary)]">
                  {locale === "ar"
                    ? "التنبيهات التنفيذية"
                    : "Executive Alerts"}
                </h2>

                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  {alerts.length} Active Alerts
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {alerts.map((alert) => (
                <article
                  key={alert.title}
                  className="rounded-2xl bg-[var(--warning-background)] p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-xs font-black text-[var(--text-primary)]">
                      {alert.title}
                    </h3>

                    <span className="rounded-full bg-[var(--surface)] px-2 py-1 text-[9px] font-black text-[var(--warning)]">
                      {alert.level}
                    </span>
                  </div>

                  <p className="mt-2 text-[11px] leading-5 text-[var(--text-secondary)]">
                    {alert.description}
                  </p>
                </article>
              ))}
            </div>
          </aside>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[28px] border border-[var(--border-default)] bg-[var(--surface)] p-6 shadow-[var(--shadow-small)]">
            <div className="flex items-center gap-3">
              <Activity className="text-[var(--brand-primary)]" />
              <h2 className="text-xl font-black text-[var(--text-primary)]">
                {locale === "ar"
                  ? "النشاط المباشر"
                  : "Live Activity"}
              </h2>
            </div>

            <div className="mt-6 space-y-3">
              {activities.map((activity) => (
                <article
                  key={activity.title}
                  className="rounded-2xl bg-[var(--surface-muted)] p-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-xs font-black text-[var(--text-primary)]">
                      {activity.title}
                    </h3>

                    <span className="text-[10px] font-black text-[var(--success)]">
                      {activity.time}
                    </span>
                  </div>

                  <p className="mt-2 text-xs leading-6 text-[var(--text-muted)]">
                    {activity.description}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-[var(--border-default)] bg-[var(--surface)] p-6 shadow-[var(--shadow-small)]">
            <div className="flex items-center gap-3">
              <Lightbulb className="text-[var(--brand-primary)]" />

              <h2 className="text-xl font-black text-[var(--text-primary)]">
                {locale === "ar"
                  ? "توصيات KAFU AI"
                  : "KAFU AI Recommendations"}
              </h2>
            </div>

            <div className="mt-6 space-y-3">
              {recommendations.map((recommendation, index) => (
                <article
                  key={recommendation}
                  className="flex items-start gap-4 rounded-2xl bg-[var(--success-background)] p-4"
                >
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--success)] text-sm font-black text-white">
                    {index + 1}
                  </span>

                  <p className="text-xs font-bold leading-6 text-[var(--text-secondary)]">
                    {recommendation}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="flex flex-col justify-between gap-6 rounded-[28px] border border-[var(--border-default)] bg-[var(--brand-subtle)] p-8 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-[var(--brand-primary)]" />

              <h2 className="text-2xl font-black text-[var(--text-primary)]">
                {locale === "ar"
                  ? "المنصة جاهزة للعرض التنفيذي"
                  : "Platform Ready for Executive Review"}
              </h2>
            </div>

            <p className="mt-3 max-w-3xl leading-7 text-[var(--text-secondary)]">
              {locale === "ar"
                ? "استعرض ملخص الأداء والتوصيات والقرارات من لوحة الإدارة التنفيذية."
                : "Review enterprise performance, recommendations, and decisions from the executive dashboard."}
            </p>
          </div>

          <Link
            href="/dashboard"
            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-[var(--text-primary)] px-6 font-black text-[var(--surface)]"
          >
            {locale === "ar"
              ? "فتح لوحة القيادة"
              : "Open Executive Dashboard"}

            <ArrowUpRight size={17} />
          </Link>
        </section>
      </div>
    </main>
  );
}