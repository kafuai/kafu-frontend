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

export default function JourneyPage() {
  const [company, setCompany] = useState<Company | null>(null);
  const [answers, setAnswers] = useState<DiscoveryAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadJourney() {
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

    loadJourney();
  }, []);

  const journey = [
    {
      step: "01",
      title: "Executive Assessment",
      subtitle: "التقييم التنفيذي",
      status: company ? "Completed" : "Pending",
      desc: `تم تسجيل بيانات ${company?.name || "المؤسسة"} وبناء الصورة الأولية عن القطاع والحجم والسوق.`,
    },
    {
      step: "02",
      title: "Executive Discovery",
      subtitle: "جلسة الاستكشاف",
      status: answers.length > 0 ? "Completed" : "Pending",
      desc: `تم حفظ ${answers.length} إجابات من جلسة الاستكشاف لفهم التحديات والأولويات وطريقة العمل الحالية.`,
    },
    {
      step: "03",
      title: "Executive Validation",
      subtitle: "التحقق التنفيذي",
      status: answers.length > 0 ? "Completed" : "Pending",
      desc: "تم تحويل بيانات Discovery إلى ملخص تنفيذي قابل للمراجعة والاعتماد.",
    },
    {
      step: "04",
      title: "Corporate DNA",
      subtitle: "بناء الملف الجيني",
      status: answers.length > 0 ? "Completed" : "Pending",
      desc: "تم بناء Corporate DNA اعتماداً على بيانات الشركة وإجابات Discovery.",
    },
    {
      step: "05",
      title: "Corporate Brain",
      subtitle: "العقل المؤسسي",
      status: answers.length > 0 ? "In Progress" : "Pending",
      desc: "تم تحديد طبقات المعرفة المطلوبة لبناء العقل المؤسسي، مع الحاجة إلى رفع السياسات والإجراءات لاحقاً.",
    },
    {
      step: "06",
      title: "Digital Workforce",
      subtitle: "الفريق الرقمي",
      status: "Recommended",
      desc: "تم اقتراح فريق رقمي مرحلي يناسب احتياجات المؤسسة الحالية.",
    },
    {
      step: "07",
      title: "Command Center",
      subtitle: "مركز القيادة",
      status: "Ready",
      desc: "تم تجهيز مركز قيادة يعرض حالة الوكلاء، الأنشطة، التنبيهات، والتوصيات.",
    },
    {
      step: "08",
      title: "Executive Dashboard",
      subtitle: "لوحة القيادة التنفيذية",
      status: "Ready",
      desc: "تم تجهيز لوحة تنفيذية تلخص الجاهزية، المخاطر، التوصيات، ومؤشرات الأعمال.",
    },
  ];

  return (
    <main
      className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-6 py-12 text-white"
      dir="rtl"
    >
      <div className="mx-auto max-w-7xl">
        <section className="rounded-3xl border border-slate-700 bg-slate-900/70 p-10 shadow-xl">
          <p className="font-bold text-emerald-300">
            KAFU Executive Journey
          </p>

          <h1 className="mt-4 text-5xl font-black leading-tight">
            رحلة المؤسسة مع كفو
          </h1>

          <p className="mt-6 max-w-5xl text-xl leading-9 text-slate-300">
            هذه ليست رحلة داخل نظام، بل رحلة تحول تبدأ بفهم المؤسسة، ثم بناء
            المعرفة، ثم تشكيل الفريق الرقمي، ثم تشغيله، وأخيراً تمكين الإدارة
            من اتخاذ قرارات أفضل.
          </p>
        </section>

        {loading && (
          <section className="mt-10 rounded-3xl border border-slate-700 bg-white p-10 text-center text-slate-900 shadow-xl">
            <p className="text-xl font-bold">جاري تحميل رحلة المؤسسة...</p>
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
                <p className="text-slate-500">القطاع</p>
                <h2 className="mt-3 text-3xl font-black">
                  {company?.industry || "-"}
                </h2>
              </div>

              <div className="rounded-3xl border border-slate-700 bg-white p-6 text-slate-900 shadow-xl">
                <p className="text-slate-500">Discovery Answers</p>
                <h2 className="mt-3 text-3xl font-black">
                  {answers.length}
                </h2>
              </div>

              <div className="rounded-3xl border border-slate-700 bg-white p-6 text-slate-900 shadow-xl">
                <p className="text-slate-500">Journey Status</p>
                <h2 className="mt-3 text-3xl font-black">
                  Active
                </h2>
              </div>
            </section>

            <section className="mt-10 space-y-6">
              {journey.map((item) => (
                <div
                  key={item.step}
                  className="rounded-3xl border border-slate-700 bg-white p-8 text-slate-900 shadow-xl transition hover:-translate-y-1 hover:border-emerald-500"
                >
                  <div className="flex flex-col gap-6 md:flex-row md:items-center">
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-slate-900 text-3xl font-black text-white">
                      {item.step}
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                        <div>
                          <p className="font-bold text-emerald-700">
                            {item.title}
                          </p>

                          <h2 className="mt-2 text-3xl font-bold">
                            {item.subtitle}
                          </h2>
                        </div>

                        <span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700">
                          {item.status}
                        </span>
                      </div>

                      <p className="mt-4 max-w-5xl text-lg leading-9 text-slate-600">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </section>

            <section className="mt-12 rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-10">
              <h2 className="text-3xl font-bold">
                المرحلة التالية
              </h2>

              <p className="mt-4 max-w-5xl text-lg leading-9 text-slate-300">
                بعد اكتمال رحلة التأسيس لـ {company?.name || "المؤسسة"}،
                تبدأ المرحلة الثانية بتحويل هذه النماذج إلى نظام حي يعمل على
                بيانات المؤسسة الفعلية، ويستخدم الذكاء الاصطناعي لتوليد
                المعرفة والتوصيات واتخاذ الإجراءات.
              </p>

              <div className="mt-8">
                <Link
                  href="/modules"
                  className="inline-block rounded-2xl bg-emerald-600 px-8 py-5 font-bold text-white transition hover:bg-emerald-700"
                >
                  استعراض جميع وحدات KAFU AI
                </Link>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}