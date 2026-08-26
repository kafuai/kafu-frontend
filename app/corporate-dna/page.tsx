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

type LoadError =
  | "no-company"
  | "company-error"
  | "answers-error"
  | null;

export default function CorporateDNAPage() {
  const { locale } = useLocalization();
  const isArabic = locale === "ar";

  const [company, setCompany] = useState<Company | null>(null);
  const [answers, setAnswers] = useState<DiscoveryAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<LoadError>(null);
  const [loadErrorDetail, setLoadErrorDetail] = useState("");

  useEffect(() => {
    let active = true;

    async function loadCorporateDNA() {
      setLoading(true);
      setLoadError(null);
      setLoadErrorDetail("");

      const companyId = getCurrentCompanyId();

      if (!companyId) {
        if (active) {
          setLoadError("no-company");
          setLoading(false);
        }

        return;
      }

      const { data: companyData, error: companyError } =
        await supabase
          .from("companies")
          .select("id, name, industry, country, employee_count")
          .eq("id", companyId)
          .single();

      if (companyError) {
        if (active) {
          setLoadError("company-error");
          setLoadErrorDetail(companyError.message);
          setLoading(false);
        }

        return;
      }

      const { data: answersData, error: answersError } =
        await supabase
          .from("discovery_answers")
          .select("id, question, answer, question_order")
          .eq("company_id", companyId)
          .order("question_order", { ascending: true });

      if (answersError) {
        if (active) {
          setLoadError("answers-error");
          setLoadErrorDetail(answersError.message);
          setLoading(false);
        }

        return;
      }

      if (!active) {
        return;
      }

      setCompany(companyData);
      setAnswers(answersData || []);
      setLoading(false);
    }

    void loadCorporateDNA();

    return () => {
      active = false;
    };
  }, []);

  const getAnswer = (order: number) => {
    return (
      answers.find(
        (item) => item.question_order === order,
      )?.answer ||
      (isArabic
        ? "لم يتم إدخال إجابة بعد."
        : "No answer has been entered yet.")
    );
  };

  const getLoadErrorMessage = () => {
    switch (loadError) {
      case "no-company":
        return isArabic
          ? "لم يتم العثور على بيانات الشركة. يرجى الرجوع إلى صفحة Assessment."
          : "No company data was found. Please return to the Assessment page.";

      case "company-error":
        return isArabic
          ? `حدث خطأ أثناء تحميل بيانات الشركة: ${loadErrorDetail}`
          : `An error occurred while loading company data: ${loadErrorDetail}`;

      case "answers-error":
        return isArabic
          ? `حدث خطأ أثناء تحميل إجابات الاستكشاف: ${loadErrorDetail}`
          : `An error occurred while loading discovery answers: ${loadErrorDetail}`;

      default:
        return "";
    }
  };

  const dnaSections = [
    {
      icon: "🏢",
      title: isArabic
        ? "هوية المؤسسة"
        : "Company Identity",
      desc: isArabic
        ? "تعريف المؤسسة وسياقها التشغيلي الأساسي."
        : "The organization's identity and core operating context.",
      items: [
        isArabic
          ? `اسم الشركة: ${company?.name || "-"}`
          : `Company name: ${company?.name || "-"}`,

        isArabic
          ? `القطاع: ${company?.industry || "-"}`
          : `Industry: ${company?.industry || "-"}`,

        isArabic
          ? `الدولة: ${company?.country || "-"}`
          : `Country: ${company?.country || "-"}`,

        isArabic
          ? `عدد الموظفين: ${company?.employee_count || "-"}`
          : `Employees: ${company?.employee_count || "-"}`,
      ],
    },

    {
      icon: "🎯",
      title: isArabic
        ? "الاتجاه الاستراتيجي"
        : "Strategic Direction",
      desc: isArabic
        ? "الأهداف والفرص التي تسعى الإدارة لتحقيقها."
        : "The goals and opportunities the organization is pursuing.",
      items: [
        getAnswer(4),
        getAnswer(5),
      ],
    },

    {
      icon: "⚙️",
      title: isArabic
        ? "نموذج التشغيل"
        : "Operating Model",
      desc: isArabic
        ? "طريقة العمل الحالية والعمليات التي تحتاج إلى تحسين."
        : "Current ways of working and processes that require improvement.",
      items: [
        getAnswer(2),

        isArabic
          ? "توجد فرصة لتحويل العمليات المتكررة إلى مسارات رقمية."
          : "There is an opportunity to convert repetitive processes into digital workflows.",

        isArabic
          ? "يجب ربط التشغيل مع Corporate Brain لضمان دقة التنفيذ."
          : "Operations should be connected with Corporate Brain to improve execution accuracy.",
      ],
    },

    {
      icon: "👥",
      title: isArabic
        ? "رأس المال البشري"
        : "Human Capital",
      desc: isArabic
        ? "الصورة الأولية لتأثير كفو على الموظفين وتجربة العمل."
        : "The initial view of KAFU's potential impact on employees and the work experience.",
      items: [
        isArabic
          ? "تحسين تجربة الموظفين من خلال تقليل الطلبات اليدوية."
          : "Improve employee experience by reducing manual requests.",

        isArabic
          ? "تسريع الوصول إلى السياسات والإجابات الداخلية."
          : "Accelerate access to internal policies and answers.",

        isArabic
          ? "دعم فريق الموارد البشرية بوكلاء رقميين متخصصين."
          : "Support HR teams with specialized digital agents.",
      ],
    },

    {
      icon: "⚠️",
      title: isArabic
        ? "التحديات"
        : "Pain Points",
      desc: isArabic
        ? "أهم التحديات التي ظهرت من جلسة الاستكشاف."
        : "The key challenges identified during the discovery session.",
      items: [
        getAnswer(1),
        getAnswer(2),
        getAnswer(3),
      ],
    },

    {
      icon: "🚀",
      title: isArabic
        ? "فرص كفو"
        : "AI Opportunities",
      desc: isArabic
        ? "المناطق التي يمكن أن يحقق فيها كفو قيمة عملية وسريعة."
        : "Areas where KAFU can deliver practical and rapid value.",
      items: [
        isArabic
          ? "أتمتة العمليات المتكررة عالية الاستهلاك للوقت."
          : "Automate repetitive, time-consuming processes.",

        isArabic
          ? "بناء Corporate Brain من السياسات والمعرفة الداخلية."
          : "Build Corporate Brain from internal policies and knowledge.",

        isArabic
          ? "تفعيل Digital Workforce لدعم الموارد البشرية والإدارة."
          : "Activate Digital Workforce to support HR and management.",

        isArabic
          ? "إصدار Executive Brief دوري للإدارة العليا."
          : "Generate periodic Executive Briefs for senior management.",
      ],
    },
  ];

  const readiness = [
    {
      label: isArabic
        ? "وضوح البيانات"
        : "Data Clarity",
      value: answers.length > 0 ? "80%" : "40%",
    },

    {
      label: isArabic
        ? "فرص الأتمتة"
        : "Automation Opportunities",
      value: "85%",
    },

    {
      label: isArabic
        ? "جاهزية الفريق الرقمي"
        : "Digital Workforce Readiness",
      value: "70%",
    },

    {
      label: isArabic
        ? "قابلية بناء Corporate Brain"
        : "Corporate Brain Readiness",
      value: "75%",
    },
  ];

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      className="min-h-screen bg-[var(--background)] px-6 py-12 text-[var(--text-primary)]"
    >
      <div className="mx-auto max-w-7xl">
        <section className="rounded-3xl border border-slate-700 bg-slate-900/70 p-10 shadow-xl">
          <p className="font-bold text-emerald-300">
            {isArabic
              ? "منشئ الحمض المؤسسي"
              : "Corporate DNA Builder"}
          </p>

          <h1 className="mt-4 text-5xl font-black leading-tight">
            {isArabic
              ? "تم بناء الملف الجيني الأولي للمؤسسة"
              : "The initial Corporate DNA profile has been built"}
          </h1>

          <p className="mt-6 max-w-5xl text-xl leading-9 text-slate-300">
            {isArabic
              ? "بناءً على بيانات الشركة وجلسة الاستكشاف، بدأ كفو بتكوين صورة تنفيذية عن المؤسسة: من هويتها وسياقها التشغيلي إلى التحديات والفرص التي يمكن تحويلها إلى توصيات وقرارات عملية."
              : "Based on company data and the discovery session, KAFU has started building an executive view of the organization: from its identity and operating context to the challenges and opportunities that can be turned into practical recommendations and decisions."}
          </p>
        </section>

        {loading && (
          <section className="mt-10 rounded-3xl border border-slate-700 bg-white p-10 text-center text-slate-900 shadow-xl">
            <p className="text-xl font-bold">
              {isArabic
                ? "جاري بناء Corporate DNA..."
                : "Building Corporate DNA..."}
            </p>
          </section>
        )}

        {!loading && loadError && (
          <section className="mt-10 rounded-3xl border border-amber-300 bg-amber-50 p-10 text-center text-amber-900 shadow-xl">
            <p className="text-xl font-bold">
              {getLoadErrorMessage()}
            </p>

            <Link
              href="/assessment"
              className="mt-6 inline-block rounded-2xl bg-slate-900 px-8 py-4 font-bold text-white"
            >
              {isArabic
                ? "العودة إلى Assessment"
                : "Return to Assessment"}
            </Link>
          </section>
        )}

        {!loading && !loadError && (
          <>
            <section className="mt-10 grid gap-6 lg:grid-cols-4">
              {readiness.map((item) => (
                <div
                  key={item.label}
                  className="rounded-3xl border border-[var(--border-default)] bg-[var(--surface)] p-6 text-[var(--text-primary)] shadow-[var(--shadow-small)]"
                >
                  <p className="text-sm font-bold text-[var(--text-secondary)]">
                    {item.label}
                  </p>

                  <h2 className="mt-4 text-4xl font-black">
                    {item.value}
                  </h2>

                  <div className="mt-5 h-3 overflow-hidden rounded-full bg-[var(--surface-muted)]">
                    <div
                      className="h-full rounded-full bg-[var(--brand-primary)]"
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
                  className="rounded-3xl border border-[var(--border-default)] bg-[var(--surface)] p-8 text-[var(--text-primary)] shadow-[var(--shadow-small)] transition hover:-translate-y-1 hover:border-[var(--brand-primary)] hover:shadow-[var(--shadow-medium)]"
                >
                  <div className="text-5xl">
                    {section.icon}
                  </div>

                  <h2 className="mt-6 text-2xl font-bold text-[var(--text-primary)]">
                    {section.title}
                  </h2>

                  <p className="mt-4 leading-8 text-[var(--text-secondary)]">
                    {section.desc}
                  </p>

                  <div className="mt-6 space-y-3">
                    {section.items.map((item, index) => (
                      <div
                        key={`${section.title}-${index}`}
                        className="rounded-2xl bg-[var(--surface-muted)] px-4 py-3 leading-7 text-[var(--text-secondary)]"
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
                {isArabic
                  ? "ماذا يعني هذا الملف؟"
                  : "What does this profile mean?"}
              </h3>

              <p className="mt-5 max-w-5xl text-lg leading-9 text-slate-600">
                {isArabic
                  ? "هذا ليس تقريراً نهائياً، بل هو الطبقة الأولى من فهم كفو للمؤسسة اعتماداً على بيانات فعلية محفوظة. سيتم استخدام هذا الملف لاحقاً لبناء Corporate Brain، وتحديد الفريق الرقمي المناسب، وتوليد التوصيات التنفيذية، وقياس التحسن مع مرور الوقت."
                  : "This is not a final report. It is the first layer of KAFU's understanding of the organization based on stored factual data. This profile will later support Corporate Brain, identification of the appropriate digital workforce, executive recommendations, and measurement of improvement over time."}
              </p>

              <div className="mt-8 grid gap-6 md:grid-cols-4">
                <div className="rounded-2xl bg-slate-100 p-5 text-center">
                  <h4 className="font-bold">
                    1. Discovery
                  </h4>

                  <p className="mt-2 text-sm text-slate-600">
                    {isArabic
                      ? "فهم الواقع الحالي"
                      : "Understand the current state"}
                  </p>
                </div>

                <div className="rounded-2xl bg-emerald-50 p-5 text-center text-emerald-900">
                  <h4 className="font-bold">
                    2. Corporate DNA
                  </h4>

                  <p className="mt-2 text-sm">
                    {isArabic
                      ? "بناء الملف الجيني"
                      : "Build the corporate profile"}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-100 p-5 text-center">
                  <h4 className="font-bold">
                    3. Corporate Brain
                  </h4>

                  <p className="mt-2 text-sm text-slate-600">
                    {isArabic
                      ? "تحويل المعرفة إلى عقل مؤسسي"
                      : "Turn knowledge into an enterprise brain"}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-100 p-5 text-center">
                  <h4 className="font-bold">
                    4. Digital Workforce
                  </h4>

                  <p className="mt-2 text-sm text-slate-600">
                    {isArabic
                      ? "تشغيل الفريق الرقمي"
                      : "Activate the digital workforce"}
                  </p>
                </div>
              </div>
            </section>

            <section className="mt-12 flex flex-col justify-between gap-6 rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-10 md:flex-row md:items-center">
              <div>
                <h3 className="text-3xl font-bold">
                  {isArabic
                    ? "الخطوة التالية: بناء Corporate Brain"
                    : "Next step: Build Corporate Brain"}
                </h3>

                <p className="mt-4 max-w-3xl text-lg leading-9 text-slate-300">
                  {isArabic
                    ? "بعد تكوين الملف الجيني الأولي، سيبدأ كفو ببناء طبقة المعرفة المؤسسية التي ستغذي الوكلاء الذكيين والتوصيات التنفيذية."
                    : "After creating the initial Corporate DNA profile, KAFU will build the enterprise knowledge layer that will power intelligent agents and executive recommendations."}
                </p>
              </div>

              <Link
                href="/corporate-brain"
                className="rounded-2xl bg-emerald-600 px-8 py-5 text-center font-bold text-white transition hover:bg-emerald-700"
              >
                {isArabic
                  ? "الانتقال إلى Corporate Brain"
                  : "Go to Corporate Brain"}
              </Link>
            </section>
          </>
        )}
      </div>
    </main>
  );
}