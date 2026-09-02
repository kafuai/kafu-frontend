"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { getCurrentCompanyId } from "@/lib/companySession";
import { useLocalization } from "@/components/localization/LocalizationContext";

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

type WorkforcePriority = "Critical" | "High" | "Medium";

type WorkforceMember = {
  code: string;
  title: string;
  subtitle: string;
  priority: WorkforcePriority;
  readiness: string;
  description: string;
  tasks: string[];
};

export default function DigitalWorkforcePage() {
  const { locale } = useLocalization();

  const isArabic = locale === "ar";

  const [company, setCompany] = useState<Company | null>(null);
  const [answers, setAnswers] = useState<DiscoveryAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const priorityLabels: Record<WorkforcePriority, string> = {
    Critical: isArabic ? "أولوية حرجة" : "Critical Priority",
    High: isArabic ? "أولوية عالية" : "High Priority",
    Medium: isArabic ? "أولوية متوسطة" : "Medium Priority",
  };

  const priorityClasses: Record<WorkforcePriority, string> = {
    Critical:
      "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300",
    High:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300",
    Medium:
      "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900/50 dark:bg-sky-950/30 dark:text-sky-300",
  };

  useEffect(() => {
    async function loadDigitalWorkforce() {
      const companyId = getCurrentCompanyId();

      if (!companyId) {
        setMessage(
          isArabic
            ? "لم يتم العثور على بيانات المؤسسة. يرجى العودة إلى صفحة التقييم وإكمال بيانات المؤسسة."
            : "No company data was found. Please return to the Assessment page and complete the company information.",
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
            : `An error occurred while loading company data: ${companyError.message}`,
        );
        setLoading(false);
        return;
      }

      const { data: answersData, error: answersError } = await supabase
        .from("discovery_answers")
        .select("id, question, answer, question_order")
        .eq("company_id", companyId)
        .order("question_order", { ascending: true });

      if (answersError) {
        setMessage(
          isArabic
            ? `حدث خطأ أثناء تحميل إجابات الاستكشاف: ${answersError.message}`
            : `An error occurred while loading Discovery answers: ${answersError.message}`,
        );
        setLoading(false);
        return;
      }

      setCompany(companyData);
      setAnswers(answersData || []);
      setLoading(false);
    }

    loadDigitalWorkforce();
  }, [isArabic, locale]);

  const hasDiscovery = answers.length > 0;

  const isSaudiCompany =
    company?.country === "Saudi Arabia" ||
    company?.country === "المملكة العربية السعودية";

  const impactCards = [
    {
      code: "01",
      label: isArabic ? "المؤسسة الحالية" : "Current Company",
      value: company?.name || (isArabic ? "غير محددة" : "Not specified"),
      note: isArabic ? "ملف المؤسسة" : "Company Profile",
    },
    {
      code: "02",
      label: isArabic ? "الفريق الرقمي المقترح" : "Recommended Digital Team",
      value: "6",
      suffix: isArabic ? "وكلاء" : "Agents",
      note: isArabic
        ? "القوة العاملة الموصى بها"
        : "Recommended Workforce",
    },
    {
      code: "03",
      label: isArabic ? "فرص الأتمتة" : "Automation Opportunities",
      value: hasDiscovery ? "40+" : "15+",
      note: isArabic ? "مسارات عمل محتملة" : "Potential Workflows",
    },
    {
      code: "04",
      label: isArabic ? "توفير الوقت المتوقع" : "Expected Time Savings",
      value: hasDiscovery ? "60%" : "35%",
      note: isArabic ? "من الجهد الإداري" : "of Administrative Effort",
    },
  ];

  const team: WorkforceMember[] = [
    {
      code: "EX",
      title: isArabic
        ? "مدير تجربة الموظف الذكي"
        : "Intelligent Employee Experience Manager",
      subtitle: "Employee Experience Manager",
      priority: "High",
      readiness: "92%",
      description: isArabic
        ? "يعالج الطلبات اليومية والمتكررة للموظفين، ويمنح فريق الموارد البشرية تجربة تشغيلية أسرع وأكثر اتساقًا."
        : "Handles recurring employee requests and enables HR teams to deliver a faster and more consistent operational experience.",
      tasks: isArabic
        ? [
            "طلبات الإجازات",
            "خطابات التعريف",
            "استفسارات الموظفين",
            "تحديث البيانات",
          ]
        : [
            "Leave requests",
            "Employment letters",
            "Employee inquiries",
            "Data updates",
          ],
    },
    {
      code: "DP",
      title: isArabic
        ? "مستشار الوثائق والسياسات"
        : "Documents & Policies Advisor",
      subtitle: "Documents & Policies Advisor",
      priority: "Critical",
      readiness: "90%",
      description: isArabic
        ? "يربط الموظفين والإدارة بمصادر المعرفة والسياسات والنماذج الداخلية المعتمدة داخل المؤسسة."
        : "Connects employees and management with approved internal knowledge sources, policies, and forms.",
      tasks: isArabic
        ? [
            "السياسات الداخلية",
            "النماذج المعتمدة",
            "العقود",
            "الخطابات الرسمية",
          ]
        : [
            "Internal policies",
            "Approved forms",
            "Contracts",
            "Official letters",
          ],
    },
    {
      code: "HR",
      title: isArabic
        ? "المستشار التنفيذي للموارد البشرية"
        : "Executive HR Advisor",
      subtitle: "Executive HR Advisor",
      priority: "High",
      readiness: "86%",
      description: isArabic
        ? "يحوّل بيانات الاستكشاف وCorporate DNA إلى ملخصات تنفيذية ومؤشرات وتوصيات قابلة للمراجعة."
        : "Transforms Discovery data and Corporate DNA into executive summaries, indicators, and reviewable recommendations.",
      tasks: isArabic
        ? [
            "الملخص التنفيذي",
            "مؤشرات الأداء",
            "التوصيات",
            "دعم الاجتماعات",
          ]
        : [
            "Executive summary",
            "Performance indicators",
            "Recommendations",
            "Meeting support",
          ],
    },
    {
      code: "TA",
      title: isArabic
        ? "مستشار استقطاب المواهب"
        : "Talent Acquisition Advisor",
      subtitle: "Talent Acquisition Advisor",
      priority:
        company?.employee_count && company.employee_count > 100
          ? "High"
          : "Medium",
      readiness: "82%",
      description: isArabic
        ? "يدعم فرز المرشحين وتحليل السير الذاتية وتجهيز الملخصات عند توسع المؤسسة في عمليات التوظيف."
        : "Supports candidate screening, resume analysis, and summary preparation as the organization expands its hiring operations.",
      tasks: isArabic
        ? [
            "فرز المرشحين",
            "تحليل السير الذاتية",
            "ملخصات المقابلات",
            "القوائم القصيرة",
          ]
        : [
            "Candidate screening",
            "Resume analysis",
            "Interview summaries",
            "Shortlists",
          ],
    },
    {
      code: "CO",
      title: isArabic
        ? "مستشار الامتثال الذكي"
        : "Compliance Intelligence Advisor",
      subtitle: "Compliance Intelligence Advisor",
      priority: "Medium",
      readiness: "78%",
      description: isArabic
        ? "يتابع الالتزام بالسياسات الداخلية والمتطلبات التنظيمية، ويعرض التنبيهات والمخاطر ذات الأولوية."
        : "Monitors compliance with internal policies and regulatory requirements while highlighting priority alerts and risks.",
      tasks: isArabic
        ? [
            "متابعة الامتثال",
            "التنبيهات",
            "مراجعة السياسات",
            "تقارير المخاطر",
          ]
        : [
            "Compliance monitoring",
            "Alerts",
            "Policy reviews",
            "Risk reports",
          ],
    },
    {
      code: "LO",
      title: isArabic
        ? "مستشار التوطين الذكي"
        : "Localization Intelligence Advisor",
      subtitle: "Localization Intelligence Advisor",
      priority: isSaudiCompany ? "High" : "Medium",
      readiness: isSaudiCompany ? "84%" : "70%",
      description: isArabic
        ? "يتابع مؤشرات التوطين والمتطلبات المرتبطة بسوق العمل، ويقدم قراءة تنفيذية للمخاطر والفرص."
        : "Monitors localization indicators and labor-market requirements while providing an executive view of related risks and opportunities.",
      tasks: isArabic
        ? [
            "مؤشرات التوطين",
            "التنبيهات التنظيمية",
            "تحليل المخاطر",
            "تقارير الإدارة",
          ]
        : [
            "Localization indicators",
            "Regulatory alerts",
            "Risk analysis",
            "Management reports",
          ],
    },
  ];

  const roadmap = isArabic
    ? [
        {
          title: "تجربة الموظف",
          description:
            "تفعيل مدير تجربة الموظف لمعالجة الطلبات اليومية المتكررة.",
        },
        {
          title: "المعرفة المؤسسية",
          description:
            "ربط مستشار الوثائق والسياسات مع Corporate Brain.",
        },
        {
          title: "الدعم التنفيذي",
          description:
            "إطلاق المستشار التنفيذي لتقديم الملخصات والتوصيات للإدارة.",
        },
        {
          title: "التوسع المنضبط",
          description:
            "إضافة الامتثال والتوطين بعد اكتمال مصادر المعرفة الأساسية.",
        },
      ]
    : [
        {
          title: "Employee Experience",
          description:
            "Activate the Employee Experience Manager to handle recurring daily requests.",
        },
        {
          title: "Enterprise Knowledge",
          description:
            "Connect the Documents & Policies Advisor with Corporate Brain.",
        },
        {
          title: "Executive Support",
          description:
            "Launch the Executive Advisor to provide management with summaries and recommendations.",
        },
        {
          title: "Controlled Expansion",
          description:
            "Add compliance and localization capabilities after core knowledge sources are complete.",
        },
      ];

  const discoverySignals =
    answers.length > 0
      ? answers
          .slice(0, 4)
          .map((item) => item.answer || item.question)
          .filter(Boolean)
      : isArabic
        ? [
            "لا توجد إجابات استكشاف محفوظة حتى الآن.",
            "يمكن تحسين دقة التوصيات بعد استكمال جلسة الاستكشاف.",
          ]
        : [
            "No saved Discovery answers are available yet.",
            "Recommendation accuracy can improve after completing the Discovery session.",
          ];

  return (
    <main
      className="min-h-[calc(100vh-64px)] bg-[var(--background)] px-4 py-5 text-[var(--text-primary)] sm:px-6 lg:px-8"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div className="mx-auto max-w-[1540px]">
        <section className="relative overflow-hidden rounded-[28px] border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-small)]">
          <div className="absolute inset-y-0 start-0 w-1 bg-[var(--brand-primary)]" />

          <div className="grid gap-6 px-6 py-7 md:px-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:py-8">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border-default)] bg-[var(--brand-subtle)] px-3 py-1.5 text-[11px] font-black text-[var(--brand-primary)]">
                  <span className="h-2 w-2 rounded-full bg-[var(--brand-primary)]" />
                  DIGITAL WORKFORCE
                </span>

                <span className="rounded-full border border-[var(--border-default)] bg-[var(--surface-muted)] px-3 py-1.5 text-[11px] font-bold text-[var(--text-secondary)]">
                  {isArabic
                    ? "توصية مخصصة للمؤسسة"
                    : "Customized Company Recommendation"}
                </span>
              </div>

              <h1 className="mt-4 text-3xl font-black tracking-tight md:text-4xl">
                {isArabic
                  ? "فريقك الرقمي المقترح"
                  : "Your Recommended Digital Workforce"}
              </h1>

              <p className="mt-3 max-w-4xl text-sm leading-7 text-[var(--text-secondary)] md:text-base md:leading-8">
                {isArabic
                  ? "بناءً على بيانات المؤسسة ونتائج الاستكشاف وCorporate DNA وCorporate Brain، تقترح KAFU AI فريقًا رقميًا مرحليًا يتوافق مع الأولويات التشغيلية للمؤسسة."
                  : "Based on your company data, Discovery results, Corporate DNA, and Corporate Brain, KAFU AI recommends a phased digital workforce aligned with your organization's operational priorities."}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-lg bg-[var(--surface-muted)] px-3 py-2 text-xs font-bold text-[var(--text-secondary)]">
                  {isArabic ? "تشغيل مرحلي" : "Phased Operation"}
                </span>

                <span className="rounded-lg bg-[var(--surface-muted)] px-3 py-2 text-xs font-bold text-[var(--text-secondary)]">
                  {isArabic ? "حوكمة ومراجعة" : "Governance & Review"}
                </span>

                <span className="rounded-lg bg-[var(--surface-muted)] px-3 py-2 text-xs font-bold text-[var(--text-secondary)]">
                  {isArabic ? "قياس الأثر" : "Impact Measurement"}
                </span>
              </div>
            </div>

            <div className="grid min-w-[260px] grid-cols-[64px_1fr] items-center gap-4 rounded-2xl border border-[var(--border-default)] bg-[var(--brand-subtle)] p-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--surface)] text-2xl font-black text-[var(--brand-primary)] shadow-sm">
                6
              </div>

              <div>
                <p className="text-sm font-black">
                  {isArabic
                    ? "وكلاء رقميون مقترحون"
                    : "Recommended Digital Agents"}
                </p>

                <p className="mt-1 text-xs font-bold leading-6 text-[var(--text-secondary)]">
                  {isArabic
                    ? "جاهزون للتفعيل المرحلي وفق الأولوية"
                    : "Ready for phased activation by priority"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {loading && (
          <section className="mt-5 rounded-[28px] border border-[var(--border-default)] bg-[var(--surface)] p-10 text-center shadow-[var(--shadow-small)]">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand-subtle)]">
              <span className="h-5 w-5 animate-pulse rounded-full bg-[var(--brand-primary)]" />
            </div>

            <p className="mt-4 text-base font-black">
              {isArabic
                ? "جارٍ بناء توصية الفريق الرقمي"
                : "Building your digital workforce recommendation"}
            </p>

            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              {isArabic
                ? "يتم تحليل بيانات المؤسسة ونتائج الاستكشاف."
                : "Analyzing company data and Discovery results."}
            </p>
          </section>
        )}

        {!loading && message && (
          <section className="mt-5 rounded-[28px] border border-amber-300 bg-amber-50 p-8 text-center text-amber-950 shadow-[var(--shadow-small)] dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-100">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-lg font-black text-amber-800 dark:bg-amber-900/40 dark:text-amber-200">
              !
            </div>

            <h2 className="mt-4 text-xl font-black">
              {isArabic
                ? "تعذر تحميل توصية الفريق"
                : "Unable to load workforce recommendation"}
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7">
              {message}
            </p>

            <Link
              href="/assessment"
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-[var(--text-primary)] px-6 text-sm font-black text-[var(--surface)] transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--text-primary)] focus-visible:ring-offset-2"
            >
              {isArabic ? "العودة إلى التقييم" : "Back to Assessment"}
            </Link>
          </section>
        )}

        {!loading && !message && (
          <>
            <section className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {impactCards.map((card) => (
                <article
                  key={card.code}
                  className="group relative overflow-hidden rounded-2xl border border-[var(--border-default)] bg-[var(--surface)] p-5 shadow-[var(--shadow-small)] transition duration-200 hover:-translate-y-0.5 hover:border-[var(--brand-primary)] hover:shadow-[var(--shadow-medium)]"
                >
                  <div className="absolute inset-x-0 top-0 h-0.5 origin-start scale-x-0 bg-[var(--brand-primary)] transition-transform duration-200 group-hover:scale-x-100" />

                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-xs font-black text-[var(--text-muted)]">
                        {card.label}
                      </p>

                      <div className="mt-3 flex flex-wrap items-end gap-2">
                        <h2 className="break-words text-2xl font-black tracking-tight md:text-3xl">
                          {card.value}
                        </h2>

                        {card.suffix && (
                          <span className="pb-1 text-xs font-black text-[var(--brand-primary)]">
                            {card.suffix}
                          </span>
                        )}
                      </div>
                    </div>

                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--border-default)] bg-[var(--surface-muted)] text-[10px] font-black text-[var(--brand-primary)]">
                      {card.code}
                    </span>
                  </div>

                  <div className="mt-4 border-t border-[var(--border-default)] pt-3">
                    <p className="text-[11px] font-bold text-[var(--text-secondary)]">
                      {card.note}
                    </p>
                  </div>
                </article>
              ))}
            </section>

            <section className="mt-5 overflow-hidden rounded-[28px] border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-small)]">
              <div className="grid lg:grid-cols-[340px_minmax(0,1fr)]">
                <div className="border-b border-[var(--border-default)] bg-[var(--brand-subtle)] p-6 lg:border-b-0 lg:border-e lg:p-7">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--brand-primary)] text-sm font-black text-white shadow-sm">
                    AI
                  </div>

                  <p className="mt-5 text-xs font-black text-[var(--brand-primary)]">
                    EXECUTIVE RECOMMENDATION
                  </p>

                  <h2 className="mt-3 text-2xl font-black tracking-tight">
                    {isArabic
                      ? "توصية KAFU AI التنفيذية"
                      : "KAFU AI Executive Recommendation"}
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                    {isArabic
                      ? "تفعيل مرحلي يبدأ بالأعمال الأكثر تكرارًا وتأثيرًا، ثم التوسع بناءً على النتائج الفعلية."
                      : "Start with the highest-frequency and highest-impact work, then expand based on actual results."}
                  </p>
                </div>

                <div className="p-6 lg:p-7">
                  <p className="max-w-5xl text-sm leading-8 text-[var(--text-secondary)] md:text-base">
                    {isArabic ? (
                      <>
                        لا نوصي بتفعيل جميع الوكلاء دفعة واحدة. بالنسبة إلى{" "}
                        <span className="font-black text-[var(--text-primary)]">
                          {company?.name || "هذه المؤسسة"}
                        </span>
                        ، فإن البداية المثلى هي تشغيل الوكلاء الذين يعالجون
                        الأعمال الأعلى تكرارًا وتأثيرًا، ثم توسيع الفريق بعد
                        بناء المعرفة وقياس النتائج.
                      </>
                    ) : (
                      <>
                        We do not recommend activating all agents at once. For{" "}
                        <span className="font-black text-[var(--text-primary)]">
                          {company?.name || "this company"}
                        </span>
                        , the optimal starting point is to activate agents
                        that handle the most frequent and impactful work, then
                        expand the team after building knowledge and measuring
                        results.
                      </>
                    )}
                  </p>

                  <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                    {roadmap.map((item, index) => (
                      <article
                        key={item.title}
                        className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-muted)] p-4"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--surface)] text-xs font-black text-[var(--brand-primary)] shadow-sm">
                            {String(index + 1).padStart(2, "0")}
                          </span>

                          <span className="text-[10px] font-black text-[var(--text-muted)]">
                            {isArabic
                              ? `المرحلة ${index + 1}`
                              : `Phase ${index + 1}`}
                          </span>
                        </div>

                        <h3 className="mt-4 text-sm font-black">
                          {item.title}
                        </h3>

                        <p className="mt-2 text-xs font-medium leading-6 text-[var(--text-secondary)]">
                          {item.description}
                        </p>
                      </article>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="mt-8">
              <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-xs font-black text-[var(--brand-primary)]">
                    RECOMMENDED AGENTS
                  </p>

                  <h2 className="mt-2 text-2xl font-black tracking-tight md:text-3xl">
                    {isArabic
                      ? "الوكلاء الرقميون المقترحون"
                      : "Recommended Digital Agents"}
                  </h2>
                </div>

                <p className="max-w-2xl text-sm leading-7 text-[var(--text-secondary)]">
                  {isArabic
                    ? "فريق مرحلي مصمم لدعم العمليات اليومية والمعرفة المؤسسية والقرارات التنفيذية والامتثال."
                    : "A phased team designed to support daily operations, enterprise knowledge, executive decisions, and compliance."}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {team.map((member) => (
                  <article
                    key={member.subtitle}
                    className="group flex min-h-full flex-col overflow-hidden rounded-[24px] border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-small)] transition duration-200 hover:-translate-y-0.5 hover:border-[var(--brand-primary)] hover:shadow-[var(--shadow-medium)]"
                  >
                    <div className="flex items-start justify-between gap-4 border-b border-[var(--border-default)] bg-[var(--surface-muted)] px-5 py-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-primary)] text-sm font-black text-white shadow-sm">
                        {member.code}
                      </div>

                      <span
                        className={`rounded-full border px-3 py-1.5 text-[11px] font-black ${priorityClasses[member.priority]}`}
                      >
                        {priorityLabels[member.priority]}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="text-lg font-black tracking-tight">
                        {member.title}
                      </h3>

                      <p className="mt-1.5 text-[11px] font-black text-[var(--brand-primary)]">
                        {member.subtitle}
                      </p>

                      <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
                        {member.description}
                      </p>

                      <div className="mt-5 rounded-2xl border border-[var(--border-default)] bg-[var(--surface-muted)] p-4">
                        <div className="mb-2.5 flex items-center justify-between text-xs font-black">
                          <span className="text-[var(--text-secondary)]">
                            {isArabic
                              ? "جاهزية التفعيل"
                              : "Activation Readiness"}
                          </span>

                          <span className="text-[var(--brand-primary)]">
                            {member.readiness}
                          </span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-[var(--surface)]">
                          <div
                            className="h-full rounded-full bg-[var(--brand-primary)]"
                            style={{ width: member.readiness }}
                          />
                        </div>
                      </div>

                      <div className="mt-4 grid gap-2 sm:grid-cols-2">
                        {member.tasks.map((task) => (
                          <div
                            key={task}
                            className="flex min-h-10 items-center rounded-xl border border-[var(--border-default)] bg-[var(--surface-muted)] px-3 py-2 text-xs font-bold text-[var(--text-secondary)]"
                          >
                            <span className="me-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--brand-primary)]" />
                            {task}
                          </div>
                        ))}
                      </div>

                      <div className="mt-auto pt-5">
                        <div className="border-t border-[var(--border-default)] pt-4">
                          <div className="flex items-center gap-2 text-xs font-black text-emerald-700 dark:text-emerald-400">
                            <span className="h-2 w-2 rounded-full bg-emerald-500" />

                            {isArabic
                              ? "جاهز للتفعيل المرحلي"
                              : "Ready for phased activation"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="mt-8 grid gap-4 lg:grid-cols-2">
              <article className="rounded-[24px] border border-[var(--border-default)] bg-[var(--surface)] p-6 shadow-[var(--shadow-small)]">
                <p className="text-xs font-black text-[var(--brand-primary)]">
                  DISCOVERY SIGNALS
                </p>

                <h2 className="mt-2 text-2xl font-black tracking-tight">
                  {isArabic
                    ? "إشارات من جلسة الاستكشاف"
                    : "Discovery Session Signals"}
                </h2>

                <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
                  {isArabic
                    ? "أهم المدخلات المستخدمة لتخصيص توصية الفريق الرقمي."
                    : "Key inputs used to customize the digital workforce recommendation."}
                </p>

                <div className="mt-5 space-y-3">
                  {discoverySignals.map((item, index) => (
                    <div
                      key={`${item}-${index}`}
                      className="flex items-start gap-3 rounded-2xl border border-[var(--border-default)] bg-[var(--surface-muted)] p-4"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--surface)] text-xs font-black text-[var(--brand-primary)] shadow-sm">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <p className="text-sm leading-7 text-[var(--text-secondary)]">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </article>

              <article className="rounded-[24px] border border-[var(--border-default)] bg-[var(--surface)] p-6 shadow-[var(--shadow-small)]">
                <p className="text-xs font-black text-[var(--brand-primary)]">
                  OPERATING MODEL
                </p>

                <h2 className="mt-2 text-2xl font-black tracking-tight">
                  {isArabic
                    ? "كيف سيعمل هذا الفريق؟"
                    : "How Will This Team Operate?"}
                </h2>

                <p className="mt-4 text-sm leading-8 text-[var(--text-secondary)] md:text-base">
                  {isArabic
                    ? "يعمل كل وكيل رقمي فوق Corporate Brain، ويستخدم Corporate DNA لفهم سياق المؤسسة. وبذلك يقدم الفريق توصيات وإجراءات مرتبطة بواقع المؤسسة وسياساتها وأولوياتها، بدلًا من تقديم إجابات عامة غير مخصصة."
                    : "Each digital agent operates on top of Corporate Brain and uses Corporate DNA to understand the organization's context. This enables the team to provide recommendations and actions tied to the company's actual policies, priorities, and operating environment instead of generic responses."}
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {(isArabic
                    ? [
                        "معرفة مؤسسية موحدة",
                        "سياق تشغيلي مخصص",
                        "تنفيذ مرحلي قابل للقياس",
                        "حوكمة ومراجعة تنفيذية",
                      ]
                    : [
                        "Unified enterprise knowledge",
                        "Customized operational context",
                        "Measurable phased execution",
                        "Executive governance and review",
                      ]
                  ).map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 rounded-2xl border border-[var(--border-default)] bg-[var(--surface-muted)] px-4 py-3.5"
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[var(--brand-subtle)]">
                        <span className="h-2 w-2 rounded-full bg-[var(--brand-primary)]" />
                      </span>

                      <p className="text-sm font-bold text-[var(--text-secondary)]">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </article>
            </section>

            <section className="mt-8 overflow-hidden rounded-[28px] border border-[var(--border-default)] bg-[var(--brand-subtle)] shadow-[var(--shadow-small)]">
              <div className="flex flex-col gap-6 p-6 md:p-8 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-4xl">
                  <p className="text-xs font-black text-[var(--brand-primary)]">
                    NEXT STEP
                  </p>

                  <h2 className="mt-2 text-2xl font-black tracking-tight md:text-3xl">
                    {isArabic
                      ? "الخطوة التالية: مركز القيادة"
                      : "Next Step: Command Center"}
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)] md:text-base">
                    {isArabic
                      ? "بعد تحديد الفريق الرقمي، انتقل إلى مركز القيادة لمراجعة الوكلاء والمهام والتنبيهات والأنشطة التنفيذية."
                      : "After defining the digital workforce, move to the Command Center to review agents, tasks, alerts, and executive activities."}
                  </p>
                </div>

                <Link
                  href="/command-center"
                  className="inline-flex min-h-11 w-fit shrink-0 items-center justify-center rounded-xl bg-[var(--brand-primary)] px-6 text-sm font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2"
                >
                  {isArabic
                    ? "فتح مركز القيادة"
                    : "Open Command Center"}

                  <span className="ms-2" aria-hidden="true">
                    {isArabic ? "←" : "→"}
                  </span>
                </Link>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}