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

export default function CorporateDNAPage() {
  const [company, setCompany] = useState<Company | null>(null);
  const [answers, setAnswers] = useState<DiscoveryAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadCorporateDNA() {
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

    loadCorporateDNA();
  }, []);

  const getAnswer = (order: number) => {
    return (
      answers.find((item) => item.question_order === order)?.answer ||
      "لم يتم إدخال إجابة بعد."
    );
  };

  const dnaSections = [
    {
      icon: "🏢",
      title: "Company Identity",
      subtitle: "هوية المؤسسة",
      desc: "تعريف المؤسسة وسياقها التشغيلي الأساسي.",
      items: [
        `اسم الشركة: ${company?.name || "-"}`,
        `القطاع: ${company?.industry || "-"}`,
        `الدولة: ${company?.country || "-"}`,
        `عدد الموظفين: ${company?.employee_count || "-"}`,
      ],
    },
    {
      icon: "🎯",
      title: "Strategic Direction",
      subtitle: "الاتجاه الاستراتيجي",
      desc: "الأهداف والفرص التي تسعى الإدارة لتحقيقها.",
      items: [getAnswer(4), getAnswer(5)],
    },
    {
      icon: "⚙️",
      title: "Operating Model",
      subtitle: "نموذج التشغيل",
      desc: "طريقة العمل الحالية والعمليات التي تحتاج تحسين.",
      items: [
        getAnswer(2),
        "توجد فرصة لتحويل العمليات المتكررة إلى مسارات رقمية.",
        "يجب ربط التشغيل مع Corporate Brain لضمان دقة التنفيذ.",
      ],
    },
    {
      icon: "👥",
      title: "Human Capital",
      subtitle: "رأس المال البشري",
      desc: "الصورة الأولية لتأثير كفو على الموظفين وتجربة العمل.",
      items: [
        "تحسين تجربة الموظفين من خلال تقليل الطلبات اليدوية.",
        "تسريع الوصول إلى السياسات والإجابات الداخلية.",
        "دعم فريق الموارد البشرية بوكلاء رقميين متخصصين.",
      ],
    },
    {
      icon: "⚠️",
      title: "Pain Points",
      subtitle: "التحديات",
      desc: "أهم التحديات التي ظهرت من جلسة الاستكشاف.",
      items: [getAnswer(1), getAnswer(2), getAnswer(3)],
    },
    {
      icon: "🚀",
      title: "AI Opportunities",
      subtitle: "فرص كفو",
      desc: "المناطق التي يمكن أن يحقق فيها كفو قيمة عملية وسريعة.",
      items: [
        "أتمتة العمليات المتكررة عالية الاستهلاك للوقت.",
        "بناء Corporate Brain من السياسات والمعرفة الداخلية.",
        "تفعيل Digital Workforce لدعم الموارد البشرية والإدارة.",
        "إصدار Executive Brief دوري للإدارة العليا.",
      ],
    },
  ];

  const readiness = [
    { label: "وضوح البيانات", value: answers.length > 0 ? "80%" : "40%" },
    { label: "فرص الأتمتة", value: "85%" },
    { label: "جاهزية الفريق الرقمي", value: "70%" },
    { label: "قابلية بناء Corporate Brain", value: "75%" },
  ];

  return (
    <main
      className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-6 py-12 text-white"
      dir="rtl"
    >
      <div className="mx-auto max-w-7xl">
        <section className="rounded-3xl border border-slate-700 bg-slate-900/70 p-10 shadow-xl">
          <p className="font-bold text-emerald-300">
            Corporate DNA Builder
          </p>

          <h1 className="mt-4 text-5xl font-black leading-tight">
            تم بناء الملف الجيني الأولي للمؤسسة
          </h1>

          <p className="mt-6 max-w-5xl text-xl leading-9 text-slate-300">
            بناءً على بيانات الشركة وجلسة الاستكشاف، بدأ كفو بتكوين صورة
            تنفيذية عن المؤسسة: من هويتها وسياقها التشغيلي إلى التحديات
            والفرص التي يمكن تحويلها إلى توصيات وقرارات عملية.
          </p>
        </section>

        {loading && (
          <section className="mt-10 rounded-3xl border border-slate-700 bg-white p-10 text-center text-slate-900 shadow-xl">
            <p className="text-xl font-bold">جاري بناء Corporate DNA...</p>
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
            <section className="mt-10 grid gap-6 lg:grid-cols-4">
              {readiness.map((item) => (
                <div
                  key={item.label}
                  className="rounded-3xl border border-slate-700 bg-white p-6 text-slate-900 shadow-xl"
                >
                  <p className="font-semibold text-slate-500">{item.label}</p>

                  <h2 className="mt-4 text-4xl font-black">
                    {item.value}
                  </h2>

                  <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-emerald-600"
                      style={{ width: item.value }}
                    />
                  </div>
                </div>
              ))}
            </section>

            <section className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {dnaSections.map((section) => (
                <div
                  key={section.title}
                  className="rounded-3xl border border-slate-700 bg-white p-8 text-slate-900 shadow-xl transition hover:-translate-y-1 hover:border-emerald-500"
                >
                  <div className="text-5xl">{section.icon}</div>

                  <p className="mt-6 font-bold text-emerald-700">
                    {section.title}
                  </p>

                  <h2 className="mt-2 text-2xl font-bold">
                    {section.subtitle}
                  </h2>

                  <p className="mt-4 leading-8 text-slate-600">
                    {section.desc}
                  </p>

                  <div className="mt-6 space-y-3">
                    {section.items.map((item) => (
                      <div
                        key={item}
                        className="rounded-2xl bg-slate-100 px-4 py-3 leading-7 text-slate-700"
                      >
                        ✅ {item}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </section>

            <section className="mt-12 rounded-3xl border border-slate-700 bg-white p-10 text-slate-900 shadow-xl">
              <h3 className="text-3xl font-bold">
                ماذا يعني هذا الملف؟
              </h3>

              <p className="mt-5 max-w-5xl text-lg leading-9 text-slate-600">
                هذا ليس تقريراً نهائياً، بل هو الطبقة الأولى من فهم كفو
                للمؤسسة اعتماداً على بيانات فعلية محفوظة. سيتم استخدام هذا
                الملف لاحقاً لبناء Corporate Brain، وتحديد الفريق الرقمي
                المناسب، وتوليد التوصيات التنفيذية، وقياس التحسن مع مرور الوقت.
              </p>

              <div className="mt-8 grid gap-6 md:grid-cols-4">
                <div className="rounded-2xl bg-slate-100 p-5 text-center">
                  <h4 className="font-bold">1. Discovery</h4>
                  <p className="mt-2 text-sm text-slate-600">فهم الواقع الحالي</p>
                </div>

                <div className="rounded-2xl bg-emerald-50 p-5 text-center text-emerald-900">
                  <h4 className="font-bold">2. Corporate DNA</h4>
                  <p className="mt-2 text-sm">بناء الملف الجيني</p>
                </div>

                <div className="rounded-2xl bg-slate-100 p-5 text-center">
                  <h4 className="font-bold">3. Corporate Brain</h4>
                  <p className="mt-2 text-sm text-slate-600">
                    تحويل المعرفة إلى عقل مؤسسي
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-100 p-5 text-center">
                  <h4 className="font-bold">4. Digital Workforce</h4>
                  <p className="mt-2 text-sm text-slate-600">
                    تشغيل الفريق الرقمي
                  </p>
                </div>
              </div>
            </section>

            <section className="mt-12 flex flex-col justify-between gap-6 rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-10 md:flex-row md:items-center">
              <div>
                <h3 className="text-3xl font-bold">
                  الخطوة التالية: بناء Corporate Brain
                </h3>

                <p className="mt-4 max-w-3xl text-lg leading-9 text-slate-300">
                  بعد تكوين الملف الجيني الأولي، سيبدأ كفو ببناء طبقة المعرفة
                  المؤسسية التي ستغذي الوكلاء الذكيين والتوصيات التنفيذية.
                </p>
              </div>

              <Link
                href="/corporate-brain"
                className="rounded-2xl bg-emerald-600 px-8 py-5 text-center font-bold text-white transition hover:bg-emerald-700"
              >
                الانتقال إلى Corporate Brain
              </Link>
            </section>
          </>
        )}
      </div>
    </main>
  );
}