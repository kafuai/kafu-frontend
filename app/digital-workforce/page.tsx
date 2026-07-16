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

export default function DigitalWorkforcePage() {
  const [company, setCompany] = useState<Company | null>(null);
  const [answers, setAnswers] = useState<DiscoveryAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadDigitalWorkforce() {
      const companyId = getCurrentCompanyId();

      if (!companyId) {
        setMessage("لم يتم العثور على بيانات الشركة. يرجى الرجوع إلى صفحة Assessment.");
        setLoading(false);
        return;
      }

      const { data: companyData, error: companyError } = await supabase
        .from("companies")
        .select("id, name, industry, country, employee_count")
        .eq("id", companyId)
        .single();

      if (companyError) {
        setMessage("حدث خطأ أثناء تحميل بيانات الشركة: " + companyError.message);
        setLoading(false);
        return;
      }

      const { data: answersData, error: answersError } = await supabase
        .from("discovery_answers")
        .select("id, question, answer, question_order")
        .eq("company_id", companyId)
        .order("question_order", { ascending: true });

      if (answersError) {
        setMessage("حدث خطأ أثناء تحميل إجابات الاستكشاف: " + answersError.message);
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

  const impactCards = [
    { label: "الشركة", value: company?.name || "-", note: "Current company" },
    { label: "الفريق المقترح", value: "6 Agents", note: "Recommended workforce" },
    { label: "فرص الأتمتة", value: hasDiscovery ? "40+" : "15+", note: "Potential workflows" },
    { label: "توفير وقت متوقع", value: hasDiscovery ? "60%" : "35%", note: "Administrative effort" },
  ];

  const team = [
    {
      icon: "👥",
      title: "مدير تجربة الموظف الذكي",
      subtitle: "Employee Experience Manager",
      priority: "High",
      readiness: "92%",
      desc: "الأولوية الأولى لمعالجة الطلبات اليومية والمتكررة داخل الموارد البشرية.",
      tasks: ["طلبات الإجازات", "خطابات التعريف", "استفسارات الموظفين", "تحديث البيانات"],
    },
    {
      icon: "📄",
      title: "مسؤول الوثائق والسياسات الذكي",
      subtitle: "Documents & Policies Advisor",
      priority: "Critical",
      readiness: "90%",
      desc: "يربط إجابات الموظفين والإدارة بمصادر المعرفة والسياسات الداخلية.",
      tasks: ["السياسات", "النماذج", "العقود", "الخطابات"],
    },
    {
      icon: "📊",
      title: "المستشار التنفيذي للموارد البشرية",
      subtitle: "Executive HR Advisor",
      priority: "High",
      readiness: "86%",
      desc: "يحوّل بيانات Discovery وCorporate DNA إلى ملخصات تنفيذية وتوصيات للإدارة.",
      tasks: ["Executive Brief", "مؤشرات الأداء", "التوصيات", "الاجتماعات"],
    },
    {
      icon: "🎯",
      title: "مستشار المواهب الذكي",
      subtitle: "Talent Acquisition Advisor",
      priority: company?.employee_count && company.employee_count > 100 ? "High" : "Medium",
      readiness: "82%",
      desc: "يدعم التوظيف وفرز المرشحين عندما تبدأ المؤسسة بتوسيع الفريق.",
      tasks: ["فرز المرشحين", "تحليل السير الذاتية", "ملخصات المقابلات", "قوائم قصيرة"],
    },
    {
      icon: "⚖️",
      title: "مسؤول الامتثال الذكي",
      subtitle: "Compliance Intelligence Advisor",
      priority: "Medium",
      readiness: "78%",
      desc: "يتابع الالتزام بالسياسات الداخلية والمتطلبات التنظيمية في السوق المستهدف.",
      tasks: ["متابعة الامتثال", "التنبيهات", "مراجعة السياسات", "تقارير المخاطر"],
    },
    {
      icon: "🇸🇦",
      title: "مسؤول التوطين الذكي",
      subtitle: "Localization Intelligence Advisor",
      priority: company?.country === "Saudi Arabia" ? "High" : "Medium",
      readiness: company?.country === "Saudi Arabia" ? "84%" : "70%",
      desc: "يتابع مؤشرات التوطين والتنبيهات المرتبطة بسوق العمل السعودي.",
      tasks: ["مؤشرات التوطين", "التنبيهات", "تحليل المخاطر", "تقارير الإدارة"],
    },
  ];

  const roadmap = [
    "تفعيل Employee Experience Manager أولاً لمعالجة الطلبات المتكررة.",
    "ربط Documents & Policies Advisor مع Corporate Brain.",
    "إطلاق Executive HR Advisor لتقديم الملخصات التنفيذية للإدارة.",
    "إضافة Compliance وLocalization بعد اكتمال مصادر المعرفة.",
  ];

  const discoverySignals =
    answers.length > 0
      ? answers.slice(0, 4).map((item) => item.answer || item.question)
      : ["لا توجد إجابات Discovery محفوظة بعد."];

  return (
    <main
      className="min-h-screen bg-[var(--background)] px-6 py-12 text-[var(--text-primary)]"
      dir="rtl"
    >
      <section className="mx-auto max-w-7xl">
        <div className="rounded-3xl border border-[var(--border-default)] bg-[var(--surface)] p-10 shadow-[var(--shadow-medium)]">
          <p className="font-bold text-[var(--brand-primary)]">
            Digital Workforce Recommendation
          </p>

          <h1 className="mt-4 text-5xl font-black leading-tight">
            الفريق الرقمي المقترح لمؤسستكم
          </h1>

          <p className="mt-6 max-w-5xl text-xl leading-9 text-[var(--text-secondary)]">
            بناءً على بيانات الشركة وجلسة الاستكشاف وCorporate DNA وCorporate
            Brain، يقترح كفو فريقاً رقمياً مرحلياً يناسب واقع المؤسسة
            وأولوياتها التشغيلية.
          </p>
        </div>

        {loading && (
          <section className="mt-10 rounded-3xl border border-slate-700 bg-white p-10 text-center text-slate-900 shadow-xl">
            <p className="text-xl font-bold">جاري بناء توصية الفريق الرقمي...</p>
          </section>
        )}

        {!loading && message && (
          <section className="mt-10 rounded-3xl border border-amber-300 bg-amber-50 p-10 text-center text-amber-900 shadow-xl">
            <p className="text-xl font-bold">{message}</p>

            <Link
              href="/assessment"
              className="mt-6 inline-block rounded-2xl bg-slate-900 px-8 py-4 font-bold text-white"
            >
              العودة إلى Assessment
            </Link>
          </section>
        )}

        {!loading && !message && (
          <>
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {impactCards.map((card) => (
                <div
                  key={card.label}
                  className="rounded-3xl border border-[var(--border-default)] bg-[var(--surface)] p-6 text-[var(--text-primary)] shadow-[var(--shadow-small)]"
                >
                  <p className="font-semibold text-[var(--text-muted)]">{card.label}</p>

                  <h2 className="mt-3 text-4xl font-black">
                    {card.value}
                  </h2>

                  <p className="mt-3 text-sm font-bold text-[var(--brand-primary)]">
                    {card.note}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10 rounded-3xl border border-slate-700 bg-white p-8 text-slate-900 shadow-xl">
              <h2 className="text-3xl font-bold">
                توصية كفو التنفيذية
              </h2>

              <p className="mt-4 max-w-5xl text-lg leading-9 text-slate-600">
                لا أوصي بتفعيل جميع الوكلاء مرة واحدة. بالنسبة إلى{" "}
                <span className="font-bold text-slate-900">
                  {company?.name || "هذه المؤسسة"}
                </span>
                ، البداية الأفضل هي تشغيل الوكلاء الذين يعالجون أكثر الأعمال
                تكراراً وتأثيراً، ثم توسيع الفريق الرقمي تدريجياً بعد بناء
                المعرفة وقياس النتائج.
              </p>

              <div className="mt-8 grid gap-4 md:grid-cols-4">
                {roadmap.map((item, index) => (
                  <div key={item} className="rounded-2xl bg-slate-100 p-5">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 font-bold text-white">
                      {index + 1}
                    </div>

                    <p className="leading-7 text-slate-700">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {team.map((member) => (
                <div
                  key={member.title}
                  className="rounded-3xl border border-[var(--border-default)] bg-[var(--surface)] p-8 text-[var(--text-primary)] shadow-[var(--shadow-small)] transition hover:-translate-y-1 hover:border-[var(--brand-primary)] hover:shadow-[var(--shadow-medium)]"
                >
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--brand-primary)] text-2xl text-white">
                      {member.icon}
                    </div>

                    <span className="rounded-full bg-[var(--brand-subtle)] px-4 py-2 text-sm font-bold text-[var(--brand-primary)]">
                      {member.priority}
                    </span>
                  </div>

                  <h2 className="text-2xl font-bold">
                    {member.title}
                  </h2>

                  <p className="mt-2 text-sm font-bold text-[var(--brand-primary)]">
                    {member.subtitle}
                  </p>

                  <p className="mt-5 leading-8 text-[var(--text-secondary)]">
                    {member.desc}
                  </p>

                  <div className="mt-6">
                    <div className="mb-2 flex justify-between text-sm font-bold text-slate-600">
                      <span>جاهزية التفعيل</span>
                      <span>{member.readiness}</span>
                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-[var(--surface-muted)]">
                      <div
                        className="h-full rounded-full bg-[var(--brand-primary)]"
                        style={{ width: member.readiness }}
                      />
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    {member.tasks.map((task) => (
                      <div
                        key={task}
                        className="rounded-2xl bg-[var(--surface-muted)] px-4 py-3 text-[var(--text-secondary)]"
                      >
                        ✅ {task}
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 rounded-2xl bg-emerald-50 p-4 text-sm font-bold text-emerald-700">
                    جاهز للتفعيل المرحلي
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl border border-slate-700 bg-white p-8 text-slate-900 shadow-xl">
                <h3 className="text-3xl font-bold">
                  إشارات من Discovery
                </h3>

                <div className="mt-6 space-y-4">
                  {discoverySignals.map((item, index) => (
                    <div
                      key={`${item}-${index}`}
                      className="rounded-2xl bg-slate-100 p-5 leading-8 text-slate-700"
                    >
                      {index + 1}. {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-700 bg-white p-8 text-slate-900 shadow-xl">
                <h3 className="text-3xl font-bold">
                  كيف سيعمل هذا الفريق؟
                </h3>

                <p className="mt-4 text-lg leading-9 text-slate-600">
                  كل وكيل رقمي سيعمل فوق Corporate Brain، ويستخدم Corporate DNA
                  لفهم سياق المؤسسة. هذا يعني أن الوكلاء لن يقدموا إجابات
                  عامة، بل توصيات وإجراءات مرتبطة بواقع الشركة وسياساتها
                  وأولوياتها.
                </p>
              </div>
            </div>

            <section className="mt-12 flex flex-col justify-between gap-6 rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-10 md:flex-row md:items-center">
              <div>
                <h3 className="text-3xl font-bold">
                  الخطوة التالية: Launch Command Center
                </h3>

                <p className="mt-4 max-w-3xl text-lg leading-9 text-slate-300">
                  بعد تحديد الفريق الرقمي، ننتقل إلى مركز القيادة لمراقبة
                  الوكلاء، المهام، التنبيهات، والأنشطة التنفيذية.
                </p>
              </div>

              <Link
                href="/command-center"
                className="rounded-2xl bg-emerald-600 px-8 py-5 text-center font-bold text-white transition hover:bg-emerald-700"
              >
                Launch Command Center
              </Link>
            </section>
          </>
        )}
      </section>
    </main>
  );
}