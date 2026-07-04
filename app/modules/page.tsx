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

export default function ModulesPage() {
  const [company, setCompany] = useState<Company | null>(null);
  const [answers, setAnswers] = useState<DiscoveryAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadModules() {
      const companyId = getCurrentCompanyId();

      if (!companyId) {
        setMessage("لم يتم العثور على بيانات الشركة. يرجى البدء من Assessment.");
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
        setMessage("حدث خطأ أثناء تحميل إجابات Discovery: " + answersError.message);
        setLoading(false);
        return;
      }

      setCompany(companyData);
      setAnswers(answersData || []);
      setLoading(false);
    }

    loadModules();
  }, []);

  const modules = [
    {
      icon: "👥",
      name: "Human Resources",
      arabic: "الموارد البشرية",
      status: answers.length > 0 ? "LIVE" : "READY",
      color: "bg-emerald-100 text-emerald-700",
      desc: `النواة الأولى لـ KAFU AI مفعّلة لـ ${company?.name || "الشركة"} وتشمل Discovery وCorporate Brain وDigital Workforce وخدمات الموظفين.`,
    },
    {
      icon: "🏛️",
      name: "Executive Office",
      arabic: "المكتب التنفيذي",
      status: "NEXT",
      color: "bg-blue-100 text-blue-700",
      desc: "دعم الإدارة العليا، الاجتماعات، اتخاذ القرار، وإدارة المبادرات.",
    },
    {
      icon: "💰",
      name: "Finance",
      arabic: "الإدارة المالية",
      status: "ROADMAP",
      color: "bg-purple-100 text-purple-700",
      desc: "الميزانيات، التدفقات النقدية، الموافقات، والتقارير المالية الذكية.",
    },
    {
      icon: "📦",
      name: "Procurement",
      arabic: "المشتريات",
      status: "ROADMAP",
      color: "bg-amber-100 text-amber-700",
      desc: "طلبات الشراء، الموردون، العقود، وسير الاعتمادات.",
    },
    {
      icon: "⚙️",
      name: "Operations",
      arabic: "العمليات",
      status: "ROADMAP",
      color: "bg-cyan-100 text-cyan-700",
      desc: "إدارة العمليات، الإجراءات، مؤشرات الأداء والتحسين المستمر.",
    },
    {
      icon: "⚖️",
      name: "Legal & Compliance",
      arabic: "القانونية والامتثال",
      status: "ROADMAP",
      color: "bg-red-100 text-red-700",
      desc: "العقود، الامتثال، المخاطر القانونية والموافقات.",
    },
    {
      icon: "📈",
      name: "Sales",
      arabic: "المبيعات",
      status: "FUTURE",
      color: "bg-indigo-100 text-indigo-700",
      desc: "Sales Pipeline، العملاء، العروض، وإدارة الفرص.",
    },
    {
      icon: "🤝",
      name: "Customer Success",
      arabic: "نجاح العملاء",
      status: "FUTURE",
      color: "bg-pink-100 text-pink-700",
      desc: "قياس رضا العملاء، التجديدات، والدعم الاستباقي.",
    },
    {
      icon: "💻",
      name: "IT & Digital",
      arabic: "تقنية المعلومات",
      status: "FUTURE",
      color: "bg-slate-200 text-slate-700",
      desc: "إدارة البنية التحتية والأمن السيبراني والتكاملات.",
    },
  ];

  const vision = [
    "منصة واحدة لجميع إدارات المؤسسة.",
    "Corporate Brain مشترك بين جميع الوحدات.",
    "Digital Workforce متخصص لكل إدارة.",
    "Executive Dashboard موحد للإدارة العليا.",
  ];

  const foundation = [
    "Executive Journey",
    "Corporate DNA",
    "Corporate Brain",
    "Digital Workforce",
    "Command Center",
    "Executive Dashboard",
  ];

  return (
    <main
      className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-6 py-12 text-white"
      dir="rtl"
    >
      <div className="mx-auto max-w-7xl">
        <section className="rounded-3xl border border-slate-700 bg-slate-900/70 p-10 shadow-xl">
          <p className="font-bold text-emerald-300">
            KAFU Enterprise Platform
          </p>

          <h1 className="mt-4 text-5xl font-black">
            خارطة وحدات KAFU AI
          </h1>

          <p className="mt-6 max-w-5xl text-xl leading-9 text-slate-300">
            KAFU ليس نظام موارد بشرية، بل منصة Enterprise AI تبني عقلاً
            مؤسسياً واحداً يغذي جميع الإدارات بواسطة وكلاء رقميين متخصصين.
          </p>
        </section>

        {loading && (
          <section className="mt-10 rounded-3xl border border-slate-700 bg-white p-10 text-center text-slate-900 shadow-xl">
            <p className="text-xl font-bold">جاري تحميل وحدات KAFU AI...</p>
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
            <section className="mt-10 grid gap-6 md:grid-cols-4">
              <div className="rounded-3xl border border-slate-700 bg-white p-6 text-slate-900 shadow-xl">
                <p className="text-slate-500">الشركة</p>
                <h2 className="mt-3 text-3xl font-black">
                  {company?.name || "-"}
                </h2>
              </div>

              <div className="rounded-3xl border border-slate-700 bg-white p-6 text-slate-900 shadow-xl">
                <p className="text-slate-500">الوحدة الحالية</p>
                <h2 className="mt-3 text-3xl font-black">
                  HR
                </h2>
              </div>

              <div className="rounded-3xl border border-slate-700 bg-white p-6 text-slate-900 shadow-xl">
                <p className="text-slate-500">Discovery Answers</p>
                <h2 className="mt-3 text-3xl font-black">
                  {answers.length}
                </h2>
              </div>

              <div className="rounded-3xl border border-slate-700 bg-white p-6 text-slate-900 shadow-xl">
                <p className="text-slate-500">Foundation Status</p>
                <h2 className="mt-3 text-3xl font-black">
                  Completed
                </h2>
              </div>
            </section>

            <section className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {modules.map((module) => (
                <div
                  key={module.name}
                  className="rounded-3xl border border-slate-700 bg-white p-8 text-slate-900 shadow-xl transition hover:-translate-y-1 hover:border-emerald-500"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-5xl">
                      {module.icon}
                    </div>

                    <span
                      className={`rounded-full px-4 py-2 text-sm font-bold ${module.color}`}
                    >
                      {module.status}
                    </span>
                  </div>

                  <h2 className="mt-6 text-2xl font-bold">
                    {module.arabic}
                  </h2>

                  <p className="mt-2 font-bold text-emerald-700">
                    {module.name}
                  </p>

                  <p className="mt-5 leading-8 text-slate-600">
                    {module.desc}
                  </p>
                </div>
              ))}
            </section>

            <section className="mt-10 grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl border border-slate-700 bg-white p-8 text-slate-900 shadow-xl">
                <h2 className="text-3xl font-bold">
                  رؤية المنصة
                </h2>

                <div className="mt-6 space-y-4">
                  {vision.map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl bg-emerald-50 p-4 text-emerald-900"
                    >
                      ✅ {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-700 bg-white p-8 text-slate-900 shadow-xl">
                <h2 className="text-3xl font-bold">
                  المرحلة الحالية
                </h2>

                <p className="mt-4 leading-8 text-slate-600">
                  تم الانتهاء من تأسيس منصة الموارد البشرية الذكية لـ{" "}
                  <span className="font-bold text-slate-900">
                    {company?.name || "الشركة"}
                  </span>
                  ، وتشمل:
                </p>

                <div className="mt-6 space-y-3">
                  {foundation.map((item) => (
                    <div
                      key={item}
                      className="rounded-xl bg-slate-100 p-4"
                    >
                      ✅ {item}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="mt-12 rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-10">
              <h2 className="text-4xl font-black">
                🎉 Foundation Phase Completed
              </h2>

              <p className="mt-5 max-w-5xl text-lg leading-9 text-slate-300">
                تم الانتهاء من بناء الهيكل التنفيذي ومنصة العرض الخاصة بـ KAFU AI
                وربطها بالبيانات الحقيقية لهذه الشركة. المرحلة التالية ستركز
                على رفع مصادر المعرفة، تشغيل Corporate Brain فعلياً، وتفعيل
                أول وكيل ذكي داخل بيئة العمل.
              </p>

              <div className="mt-8 flex flex-col gap-4 md:flex-row">
                <Link
                  href="/dashboard"
                  className="rounded-2xl bg-emerald-600 px-8 py-5 text-center font-bold text-white transition hover:bg-emerald-700"
                >
                  العودة إلى Executive Dashboard
                </Link>

                <Link
                  href="/"
                  className="rounded-2xl border border-slate-500 px-8 py-5 text-center font-bold text-white transition hover:bg-slate-800"
                >
                  Start New Executive Assessment
                </Link>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}