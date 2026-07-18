"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { getCurrentCompanyId } from "@/lib/companySession";

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

type WorkforceMember = {
  code: string;
  title: string;
  subtitle: string;
  priority: "Critical" | "High" | "Medium";
  readiness: string;
  description: string;
  tasks: string[];
};

export default function DigitalWorkforcePage() {
  const [company, setCompany] = useState<Company | null>(null);
  const [answers, setAnswers] = useState<DiscoveryAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadDigitalWorkforce() {
      const companyId = getCurrentCompanyId();

      if (!companyId) {
        setMessage(
          "لم يتم العثور على بيانات المؤسسة. يرجى العودة إلى صفحة التقييم وإكمال بيانات المؤسسة.",
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
          `حدث خطأ أثناء تحميل بيانات المؤسسة: ${companyError.message}`,
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
          `حدث خطأ أثناء تحميل إجابات الاستكشاف: ${answersError.message}`,
        );
        setLoading(false);
        return;
      }

      setCompany(companyData);
      setAnswers(answersData || []);
      setLoading(false);
    }

    loadDigitalWorkforce();
  }, []);

  const hasDiscovery = answers.length > 0;
  const isSaudiCompany =
    company?.country === "Saudi Arabia" ||
    company?.country === "المملكة العربية السعودية";

  const impactCards = [
    {
      code: "01",
      label: "المؤسسة الحالية",
      value: company?.name || "غير محددة",
      note: "Current company",
    },
    {
      code: "02",
      label: "الفريق الرقمي المقترح",
      value: "6",
      suffix: "وكلاء",
      note: "Recommended workforce",
    },
    {
      code: "03",
      label: "فرص الأتمتة",
      value: hasDiscovery ? "40+" : "15+",
      note: "Potential workflows",
    },
    {
      code: "04",
      label: "توفير الوقت المتوقع",
      value: hasDiscovery ? "60%" : "35%",
      note: "Administrative effort",
    },
  ];

  const team: WorkforceMember[] = [
    {
      code: "EX",
      title: "مدير تجربة الموظف الذكي",
      subtitle: "Employee Experience Manager",
      priority: "High",
      readiness: "92%",
      description:
        "يعالج الطلبات اليومية والمتكررة للموظفين، ويمنح فريق الموارد البشرية تجربة تشغيلية أسرع وأكثر اتساقًا.",
      tasks: [
        "طلبات الإجازات",
        "خطابات التعريف",
        "استفسارات الموظفين",
        "تحديث البيانات",
      ],
    },
    {
      code: "DP",
      title: "مستشار الوثائق والسياسات",
      subtitle: "Documents & Policies Advisor",
      priority: "Critical",
      readiness: "90%",
      description:
        "يربط الموظفين والإدارة بمصادر المعرفة والسياسات والنماذج الداخلية المعتمدة داخل المؤسسة.",
      tasks: [
        "السياسات الداخلية",
        "النماذج المعتمدة",
        "العقود",
        "الخطابات الرسمية",
      ],
    },
    {
      code: "HR",
      title: "المستشار التنفيذي للموارد البشرية",
      subtitle: "Executive HR Advisor",
      priority: "High",
      readiness: "86%",
      description:
        "يحوّل بيانات الاستكشاف وCorporate DNA إلى ملخصات تنفيذية ومؤشرات وتوصيات قابلة للمراجعة.",
      tasks: [
        "الملخص التنفيذي",
        "مؤشرات الأداء",
        "التوصيات",
        "دعم الاجتماعات",
      ],
    },
    {
      code: "TA",
      title: "مستشار استقطاب المواهب",
      subtitle: "Talent Acquisition Advisor",
      priority:
        company?.employee_count && company.employee_count > 100
          ? "High"
          : "Medium",
      readiness: "82%",
      description:
        "يدعم فرز المرشحين وتحليل السير الذاتية وتجهيز الملخصات عند توسع المؤسسة في عمليات التوظيف.",
      tasks: [
        "فرز المرشحين",
        "تحليل السير الذاتية",
        "ملخصات المقابلات",
        "القوائم القصيرة",
      ],
    },
    {
      code: "CO",
      title: "مستشار الامتثال الذكي",
      subtitle: "Compliance Intelligence Advisor",
      priority: "Medium",
      readiness: "78%",
      description:
        "يتابع الالتزام بالسياسات الداخلية والمتطلبات التنظيمية، ويعرض التنبيهات والمخاطر ذات الأولوية.",
      tasks: [
        "متابعة الامتثال",
        "التنبيهات",
        "مراجعة السياسات",
        "تقارير المخاطر",
      ],
    },
    {
      code: "LO",
      title: "مستشار التوطين الذكي",
      subtitle: "Localization Intelligence Advisor",
      priority: isSaudiCompany ? "High" : "Medium",
      readiness: isSaudiCompany ? "84%" : "70%",
      description:
        "يتابع مؤشرات التوطين والمتطلبات المرتبطة بسوق العمل، ويقدم قراءة تنفيذية للمخاطر والفرص.",
      tasks: [
        "مؤشرات التوطين",
        "التنبيهات التنظيمية",
        "تحليل المخاطر",
        "تقارير الإدارة",
      ],
    },
  ];

  const roadmap = [
    "تفعيل مدير تجربة الموظف لمعالجة الطلبات اليومية المتكررة.",
    "ربط مستشار الوثائق والسياسات مع Corporate Brain.",
    "إطلاق المستشار التنفيذي لتقديم الملخصات والتوصيات للإدارة.",
    "إضافة الامتثال والتوطين بعد اكتمال مصادر المعرفة الأساسية.",
  ];

  const discoverySignals =
    answers.length > 0
      ? answers
          .slice(0, 4)
          .map((item) => item.answer || item.question)
          .filter(Boolean)
      : [
          "لا توجد إجابات استكشاف محفوظة حتى الآن.",
          "يمكن تحسين دقة التوصيات بعد استكمال جلسة الاستكشاف.",
        ];

  return (
    <main
      className="min-h-[calc(100vh-76px)] bg-[var(--background)] px-5 py-6 text-[var(--text-primary)] md:px-8 lg:px-10"
      dir="rtl"
    >
      <div className="mx-auto max-w-[1580px]">
        <section className="overflow-hidden rounded-3xl border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-medium)]">
          <div className="h-1 w-full bg-[var(--brand-primary)]" />

          <div className="flex flex-col gap-6 px-6 py-7 md:px-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0 max-w-4xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-default)] bg-[var(--brand-subtle)] px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.12em] text-[var(--brand-primary)]">
                <span className="h-2 w-2 rounded-full bg-[var(--brand-primary)]" />
                Digital Workforce
              </div>

              <h1 className="mt-4 text-3xl font-black tracking-tight md:text-4xl">
                فريقك الرقمي المقترح
              </h1>

              <p className="mt-3 max-w-3xl text-sm leading-8 text-[var(--text-secondary)] md:text-base">
                بناءً على بيانات المؤسسة ونتائج الاستكشاف وCorporate DNA
                وCorporate Brain، تقترح KAFU AI فريقًا رقميًا مرحليًا يتوافق
                مع الأولويات التشغيلية للمؤسسة.
              </p>
            </div>

            <div className="flex w-full items-center gap-3 rounded-2xl border border-[var(--border-default)] bg-[var(--brand-subtle)] px-4 py-4 lg:w-auto lg:min-w-[250px]">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--surface)] text-xl font-black text-[var(--brand-primary)] shadow-sm">
                6
              </div>

              <div>
                <p className="text-sm font-black">وكلاء رقميون مقترحون</p>
                <p className="mt-1 text-xs font-bold text-[var(--text-secondary)]">
                  جاهزون للتفعيل المرحلي
                </p>
              </div>
            </div>
          </div>
        </section>

        {loading && (
          <section className="mt-6 rounded-3xl border border-[var(--border-default)] bg-[var(--surface)] p-10 text-center shadow-[var(--shadow-small)]">
            <div className="mx-auto h-10 w-10 animate-pulse rounded-xl bg-[var(--brand-subtle)]" />

            <p className="mt-4 text-base font-black">
              جاري بناء توصية الفريق الرقمي...
            </p>

            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              يتم تحليل بيانات المؤسسة ونتائج الاستكشاف.
            </p>
          </section>
        )}

        {!loading && message && (
          <section className="mt-6 rounded-3xl border border-amber-300 bg-amber-50 p-8 text-center text-amber-900 shadow-[var(--shadow-small)]">
            <h2 className="text-xl font-black">تعذر تحميل التوصية</h2>

            <p className="mt-3 text-sm leading-7">{message}</p>

            <Link
              href="/assessment"
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-[var(--text-primary)] px-6 text-sm font-black text-white transition hover:opacity-90"
            >
              العودة إلى التقييم
            </Link>
          </section>
        )}

        {!loading && !message && (
          <>
            <section className="mt-6">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {impactCards.map((card) => (
                  <article
                    key={card.code}
                    className="group relative overflow-hidden rounded-2xl border border-[var(--border-default)] bg-[var(--surface)] px-5 py-5 shadow-[var(--shadow-small)] transition duration-200 hover:-translate-y-0.5 hover:border-[var(--brand-primary)] hover:shadow-[var(--shadow-medium)]"
                  >
                    <div className="absolute inset-x-0 top-0 h-0.5 bg-[var(--brand-primary)] opacity-0 transition group-hover:opacity-100" />

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

                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--brand-subtle)] text-[10px] font-black text-[var(--brand-primary)]">
                        {card.code}
                      </span>
                    </div>

                    <div className="mt-4 border-t border-[var(--border-default)] pt-3">
                      <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                        {card.note}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="mt-6 overflow-hidden rounded-3xl border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-small)]">
              <div className="grid lg:grid-cols-[0.9fr_2.1fr]">
                <div className="border-b border-[var(--border-default)] bg-[var(--brand-subtle)] p-6 lg:border-b-0 lg:border-l lg:p-7">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--brand-primary)] text-sm font-black text-white shadow-sm">
                    AI
                  </div>

                  <p className="mt-5 text-xs font-black uppercase tracking-[0.12em] text-[var(--brand-primary)]">
                    Executive Recommendation
                  </p>

                  <h2 className="mt-3 text-2xl font-black tracking-tight">
                    توصية KAFU AI التنفيذية
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                    تفعيل مرحلي يبدأ بالأعمال الأكثر تكرارًا وتأثيرًا، ثم
                    التوسع بناءً على النتائج الفعلية.
                  </p>
                </div>

                <div className="p-6 lg:p-7">
                  <p className="max-w-5xl text-sm leading-8 text-[var(--text-secondary)] md:text-base">
                    لا نوصي بتفعيل جميع الوكلاء دفعة واحدة. بالنسبة إلى
                    <span className="mx-1 font-black text-[var(--text-primary)]">
                      {company?.name || "هذه المؤسسة"}
                    </span>
                    فإن البداية المثلى هي تشغيل الوكلاء الذين يعالجون الأعمال
                    الأعلى تكرارًا وتأثيرًا، ثم توسيع الفريق بعد بناء المعرفة
                    وقياس النتائج.
                  </p>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {roadmap.map((item, index) => (
                      <article
                        key={item}
                        className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-muted)] p-4"
                      >
                        <div className="flex items-start gap-3">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--surface)] text-xs font-black text-[var(--brand-primary)] shadow-sm">
                            {String(index + 1).padStart(2, "0")}
                          </span>

                          <p className="text-sm font-bold leading-7 text-[var(--text-secondary)]">
                            {item}
                          </p>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="mt-8">
              <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--brand-primary)]">
                    Recommended Agents
                  </p>

                  <h2 className="mt-2 text-2xl font-black tracking-tight md:text-3xl">
                    الوكلاء الرقميون المقترحون
                  </h2>
                </div>

                <p className="max-w-2xl text-sm leading-7 text-[var(--text-secondary)]">
                  فريق مرحلي مصمم لدعم العمليات اليومية، المعرفة المؤسسية،
                  القرارات التنفيذية، والامتثال.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {team.map((member) => (
                  <article
                    key={member.subtitle}
                    className="group flex min-h-full flex-col overflow-hidden rounded-3xl border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-small)] transition duration-200 hover:-translate-y-0.5 hover:border-[var(--brand-primary)] hover:shadow-[var(--shadow-medium)]"
                  >
                    <div className="flex items-start justify-between gap-4 border-b border-[var(--border-default)] px-6 py-5">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-primary)] text-sm font-black text-white shadow-sm">
                        {member.code}
                      </div>

                      <span className="rounded-full bg-[var(--brand-subtle)] px-3 py-1.5 text-xs font-black text-[var(--brand-primary)]">
                        {member.priority}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="text-xl font-black tracking-tight">
                        {member.title}
                      </h3>

                      <p className="mt-2 text-xs font-black text-[var(--brand-primary)]">
                        {member.subtitle}
                      </p>

                      <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
                        {member.description}
                      </p>

                      <div className="mt-5">
                        <div className="mb-2 flex items-center justify-between text-xs font-black">
                          <span className="text-[var(--text-secondary)]">
                            جاهزية التفعيل
                          </span>

                          <span className="text-[var(--brand-primary)]">
                            {member.readiness}
                          </span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-[var(--surface-muted)]">
                          <div
                            className="h-full rounded-full bg-[var(--brand-primary)]"
                            style={{ width: member.readiness }}
                          />
                        </div>
                      </div>

                      <div className="mt-5 grid gap-2 sm:grid-cols-2">
                        {member.tasks.map((task) => (
                          <div
                            key={task}
                            className="rounded-xl border border-[var(--border-default)] bg-[var(--surface-muted)] px-3 py-2.5 text-xs font-bold text-[var(--text-secondary)]"
                          >
                            {task}
                          </div>
                        ))}
                      </div>

                      <div className="mt-5 border-t border-[var(--border-default)] pt-4">
                        <div className="flex items-center gap-2 text-xs font-black text-emerald-700">
                          <span className="h-2 w-2 rounded-full bg-emerald-500" />
                          جاهز للتفعيل المرحلي
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="mt-8 grid gap-5 lg:grid-cols-2">
              <article className="rounded-3xl border border-[var(--border-default)] bg-[var(--surface)] p-6 shadow-[var(--shadow-small)] md:p-7">
                <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--brand-primary)]">
                  Discovery Signals
                </p>

                <h2 className="mt-2 text-2xl font-black tracking-tight">
                  إشارات من جلسة الاستكشاف
                </h2>

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

              <article className="rounded-3xl border border-[var(--border-default)] bg-[var(--surface)] p-6 shadow-[var(--shadow-small)] md:p-7">
                <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--brand-primary)]">
                  Operating Model
                </p>

                <h2 className="mt-2 text-2xl font-black tracking-tight">
                  كيف سيعمل هذا الفريق؟
                </h2>

                <p className="mt-5 text-sm leading-8 text-[var(--text-secondary)] md:text-base">
                  يعمل كل وكيل رقمي فوق Corporate Brain، ويستخدم Corporate DNA
                  لفهم سياق المؤسسة. وبذلك يقدم الفريق توصيات وإجراءات مرتبطة
                  بواقع المؤسسة وسياساتها وأولوياتها، بدلًا من تقديم إجابات
                  عامة غير مخصصة.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {[
                    "معرفة مؤسسية موحدة",
                    "سياق تشغيلي مخصص",
                    "تنفيذ مرحلي قابل للقياس",
                    "حوكمة ومراجعة تنفيذية",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 rounded-2xl border border-[var(--border-default)] bg-[var(--surface-muted)] px-4 py-3"
                    >
                      <span className="h-2 w-2 shrink-0 rounded-full bg-[var(--brand-primary)]" />
                      <p className="text-sm font-bold text-[var(--text-secondary)]">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </article>
            </section>

            <section className="mt-8 rounded-3xl border border-[var(--border-default)] bg-[var(--brand-subtle)] p-6 shadow-[var(--shadow-small)] md:p-8">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-4xl">
                  <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--brand-primary)]">
                    Next Step
                  </p>

                  <h2 className="mt-2 text-2xl font-black tracking-tight md:text-3xl">
                    الخطوة التالية: مركز القيادة
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)] md:text-base">
                    بعد تحديد الفريق الرقمي، انتقل إلى مركز القيادة لمراجعة
                    الوكلاء والمهام والتنبيهات والأنشطة التنفيذية.
                  </p>
                </div>

                <Link
                  href="/command-center"
                  className="inline-flex min-h-11 w-fit shrink-0 items-center justify-center rounded-xl bg-[var(--brand-primary)] px-6 text-sm font-black text-white shadow-sm transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2"
                >
                  فتح مركز القيادة
                </Link>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}