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

export default function CorporateBrainPage() {
  const [company, setCompany] = useState<Company | null>(null);
  const [answers, setAnswers] = useState<DiscoveryAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadCorporateBrain() {
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

    loadCorporateBrain();
  }, []);

  const discoveryItems =
    answers.length > 0
      ? answers.map((item) => item.answer || item.question)
      : ["لا توجد إجابات Discovery محفوظة بعد."];

  const knowledgeLayers = [
    {
      icon: "🧠",
      title: "Internal Knowledge",
      subtitle: "المعرفة الداخلية",
      readiness: "45%",
      desc: "هذه الطبقة ستتكون من سياسات الشركة وإجراءاتها وعقودها ونماذجها الداخلية.",
      items: [
        `الشركة: ${company?.name || "-"}`,
        `القطاع: ${company?.industry || "-"}`,
        "السياسات الداخلية: لم يتم رفعها بعد",
        "الإجراءات والنماذج: بانتظار الإضافة",
      ],
    },
    {
      icon: "⚖️",
      title: "Regulatory Knowledge",
      subtitle: "المعرفة التنظيمية",
      readiness: company?.country === "Saudi Arabia" ? "70%" : "50%",
      desc: "هذه الطبقة تربط معرفة الشركة بالأنظمة واللوائح المرتبطة بسوق العمل.",
      items: [
        `الدولة: ${company?.country || "-"}`,
        "Saudi Labor Law",
        "MHRSD",
        "Qiwa / GOSI",
      ],
    },
    {
      icon: "📊",
      title: "Discovery Intelligence",
      subtitle: "ذكاء الاستكشاف",
      readiness: answers.length > 0 ? "85%" : "30%",
      desc: "هذه الطبقة تعتمد على بيانات Assessment وDiscovery وCorporate DNA.",
      items: [
        "Assessment Data",
        "Discovery Answers",
        "Corporate DNA",
        "Executive Priorities",
      ],
    },
  ];

  const insights = [
    `Corporate Brain الخاص بـ ${company?.name || "هذه المؤسسة"} سيبدأ من بيانات Assessment وDiscovery الحالية.`,
    "أول فجوة معرفية واضحة هي عدم رفع السياسات والإجراءات الداخلية بعد.",
    "أفضل بداية عملية هي رفع أكثر 10 سياسات أو نماذج استخداماً داخل الموارد البشرية.",
    "كل إجابة مستقبلية يجب أن تكون مرتبطة بمصدر واضح داخل Corporate Brain.",
  ];

  const nextSteps = [
    "إنشاء جدول Knowledge Sources في قاعدة البيانات.",
    "رفع السياسات والإجراءات الداخلية.",
    "ربط كل مصدر معرفة بالشركة الحالية.",
    "تشغيل أول استعلام ذكي موثق.",
  ];

  return (
    <main
      className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-6 py-12 text-white"
      dir="rtl"
    >
      <div className="mx-auto max-w-7xl">
        <section className="rounded-3xl border border-slate-700 bg-slate-900/70 p-10 shadow-xl">
          <p className="font-bold text-emerald-300">
            Enterprise Knowledge Hub
          </p>

          <h1 className="mt-4 text-5xl font-black">
            بناء Corporate Brain
          </h1>

          <p className="mt-6 max-w-5xl text-xl leading-9 text-slate-300">
            بعد بناء Corporate DNA، يبدأ كفو ببناء العقل المؤسسي الذي يجمع
            المعرفة الداخلية والأنظمة ونتائج الاستكشاف في منصة معرفية واحدة
            تغذي جميع الوكلاء الذكيين.
          </p>
        </section>

        {loading && (
          <section className="mt-10 rounded-3xl border border-slate-700 bg-white p-10 text-center text-slate-900 shadow-xl">
            <p className="text-xl font-bold">جاري تحميل Corporate Brain...</p>
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
            <section className="mt-10 grid gap-6 lg:grid-cols-3">
              {knowledgeLayers.map((layer) => (
                <div
                  key={layer.title}
                  className="rounded-3xl border border-slate-700 bg-white p-8 text-slate-900 shadow-xl transition hover:-translate-y-1 hover:border-emerald-500"
                >
                  <div className="text-5xl">{layer.icon}</div>

                  <p className="mt-5 font-bold text-emerald-700">
                    {layer.title}
                  </p>

                  <h2 className="mt-2 text-2xl font-bold">
                    {layer.subtitle}
                  </h2>

                  <p className="mt-4 leading-8 text-slate-600">
                    {layer.desc}
                  </p>

                  <div className="mt-6">
                    <div className="mb-2 flex justify-between text-sm font-bold text-slate-600">
                      <span>جاهزية الطبقة</span>
                      <span>{layer.readiness}</span>
                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="h-full rounded-full bg-emerald-600"
                        style={{ width: layer.readiness }}
                      />
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    {layer.items.map((item) => (
                      <div
                        key={item}
                        className="rounded-2xl bg-slate-100 px-4 py-3 leading-7"
                      >
                        ✅ {item}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </section>

            <section className="mt-10 grid gap-8 lg:grid-cols-2">
              <div className="rounded-3xl border border-slate-700 bg-white p-8 text-slate-900 shadow-xl">
                <h3 className="text-3xl font-bold">
                  ما الذي اكتشفه كفو؟
                </h3>

                <div className="mt-6 space-y-4">
                  {insights.map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl bg-emerald-50 p-5 leading-8 text-emerald-900"
                    >
                      💡 {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-700 bg-white p-8 text-slate-900 shadow-xl">
                <h3 className="text-3xl font-bold">
                  عينة من ذكاء الاستكشاف
                </h3>

                <div className="mt-6 space-y-4">
                  {discoveryItems.slice(0, 4).map((item, index) => (
                    <div
                      key={`${item}-${index}`}
                      className="rounded-2xl bg-slate-100 p-5 leading-8 text-slate-700"
                    >
                      {index + 1}. {item}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="mt-12 rounded-3xl border border-slate-700 bg-white p-10 text-slate-900 shadow-xl">
              <h3 className="text-3xl font-bold">
                الخطوات القادمة لبناء العقل المؤسسي
              </h3>

              <div className="mt-6 grid gap-4 md:grid-cols-4">
                {nextSteps.map((item, index) => (
                  <div
                    key={item}
                    className="rounded-2xl bg-slate-100 p-5"
                  >
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 font-bold text-white">
                      {index + 1}
                    </div>

                    <p className="font-semibold leading-7">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-12 rounded-3xl border border-slate-700 bg-white p-10 text-slate-900 shadow-xl">
              <h3 className="text-3xl font-bold">
                مثال على الاستعلام الذكي
              </h3>

              <p className="mt-5 text-lg leading-8 text-slate-600">
                عندما يصبح Corporate Brain جاهزاً، لن يقدم كفو إجابات عامة،
                بل سيبحث داخل معرفة المؤسسة ثم يربطها بالتشريعات ويعرض مصدر
                الإجابة ومستوى الثقة.
              </p>

              <div className="mt-8 rounded-3xl bg-slate-100 p-8">
                <div className="text-slate-500">
                  سؤال تنفيذي
                </div>

                <div className="mt-3 text-2xl font-bold">
                  هل يحق للموظف الحصول على إجازة زواج؟
                </div>

                <div className="mt-6 rounded-2xl bg-white p-6 leading-8 shadow-sm">
                  سيبحث كفو داخل سياسات {company?.name || "الشركة"}، ثم داخل
                  الأنظمة ذات العلاقة، ثم يقدم الإجابة مع ذكر مصدر كل معلومة
                  ونسبة الثقة.
                </div>
              </div>
            </section>

            <section className="mt-12 flex flex-col justify-between gap-6 rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-10 md:flex-row md:items-center">
              <div>
                <h3 className="text-3xl font-bold">
                  الخطوة التالية: Digital Workforce
                </h3>

                <p className="mt-4 max-w-3xl text-lg leading-9 text-slate-300">
                  بعد اكتمال العقل المؤسسي، يستطيع كفو اقتراح الفريق الرقمي
                  المناسب وبناء الوكلاء الذكيين الذين سيعملون داخل المؤسسة.
                </p>
              </div>

              <Link
                href="/digital-workforce"
                className="rounded-2xl bg-emerald-600 px-8 py-5 font-bold text-white transition hover:bg-emerald-700"
              >
                الانتقال إلى Digital Workforce
              </Link>
            </section>
          </>
        )}
      </div>
    </main>
  );
}