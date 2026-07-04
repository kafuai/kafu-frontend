"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getCurrentCompanyId } from "@/lib/companySession";

export default function DiscoveryPage() {
  const router = useRouter();

  const questions = [
    "ما أكثر ثلاثة تحديات تشغل الإدارة التنفيذية حالياً؟",
    "ما أكثر عملية داخل المؤسسة تستهلك وقتاً وجهداً أكثر من اللازم؟",
    "ما أكثر قرار تتمنى أن تحصل عليه الإدارة بشكل أسرع؟",
    "ما أكبر فرصة للتحسين خلال الـ 12 شهراً القادمة؟",
    "إذا نجحت مبادرة كفو بعد سنة، ما المؤشر الذي سيجعلك تقول إنها كانت ناجحة؟",
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>(
    Array(questions.length).fill("")
  );
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  function handleAnswer(value: string) {
    const updated = [...answers];
    updated[currentQuestion] = value;
    setAnswers(updated);
  }

  async function handleFinish() {
    setLoading(true);
    setMessage("");

    const companyId = getCurrentCompanyId();

    if (!companyId) {
      setLoading(false);
      setMessage(
        "لم يتم العثور على بيانات الشركة. يرجى الرجوع إلى صفحة Assessment وإدخال بيانات الشركة أولاً."
      );
      return;
    }

    const rows = questions.map((question, index) => ({
      company_id: companyId,
      question,
      answer: answers[index] || "",
      question_order: index + 1,
    }));

    const { error } = await supabase.from("discovery_answers").insert(rows);

    if (error) {
      setLoading(false);
      setMessage("حدث خطأ أثناء حفظ الإجابات: " + error.message);
      return;
    }

    setMessage("✅ تم حفظ إجابات جلسة الاستكشاف بنجاح.");

    setTimeout(() => {
      router.push("/executive-summary");
    }, 1000);
  }

  return (
    <main
      className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-6 py-12 text-white"
      dir="rtl"
    >
      <div className="mx-auto max-w-5xl">
        <section className="rounded-3xl border border-slate-700 bg-slate-900/70 p-10 shadow-xl">
          <p className="font-bold text-emerald-300">
            Executive Discovery Session
          </p>

          <h1 className="mt-4 text-5xl font-black leading-tight">
            جلسة الاستكشاف التنفيذية
          </h1>

          <p className="mt-6 max-w-4xl text-xl leading-9 text-slate-300">
            الآن نبدأ بفهم واقع المؤسسة من منظور تنفيذي. الهدف ليس جمع
            معلومات عامة، بل تحديد أين يمكن لكفو أن يصنع أثراً واضحاً وقابلاً
            للقياس.
          </p>
        </section>

        <section className="mt-8 rounded-3xl border border-slate-700 bg-white p-10 text-slate-900 shadow-xl">
          <div className="rounded-2xl bg-slate-100 p-8 text-lg leading-9 text-slate-700">
            <p className="font-bold text-slate-900">أهلاً بك...</p>

            <p className="mt-4">
              لن أبدأ باقتراح حلول أو أنظمة قبل أن أفهم التحديات الحقيقية
              داخل المؤسسة.
            </p>

            <p className="mt-4">
              إجاباتك ستساعد كفو على بناء صورة تنفيذية أوضح، ثم تحويلها إلى
              ملخص عملي وتوصيات قابلة للتنفيذ.
            </p>
          </div>

          <div className="mt-10">
            <div className="mb-3 flex justify-between font-bold text-slate-700">
              <span>
                السؤال {currentQuestion + 1} من {questions.length}
              </span>

              <span>{Math.round(progress)}%</span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full bg-emerald-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-3xl font-bold leading-relaxed text-slate-900">
              {questions[currentQuestion]}
            </h2>

            <textarea
              value={answers[currentQuestion]}
              onChange={(e) => handleAnswer(e.target.value)}
              rows={8}
              className="mt-8 w-full rounded-2xl border p-6 text-lg outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              placeholder="اكتب إجابتك هنا..."
            />
          </div>

          <div className="mt-10 flex justify-between gap-4">
            <button
              type="button"
              disabled={currentQuestion === 0 || loading}
              onClick={() => setCurrentQuestion((prev) => prev - 1)}
              className="cursor-pointer rounded-xl border px-8 py-4 font-bold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              السابق
            </button>

            {currentQuestion < questions.length - 1 ? (
              <button
                type="button"
                disabled={loading}
                onClick={() => setCurrentQuestion((prev) => prev + 1)}
                className="cursor-pointer rounded-xl bg-emerald-600 px-8 py-4 font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                التالي
              </button>
            ) : (
              <button
                type="button"
                disabled={loading}
                onClick={handleFinish}
                className="cursor-pointer rounded-xl bg-slate-900 px-8 py-4 font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "جاري حفظ الإجابات..." : "حفظ ومراجعة الملخص التنفيذي"}
              </button>
            )}
          </div>

          {message && (
            <p className="mt-6 text-center font-bold text-emerald-700">
              {message}
            </p>
          )}
        </section>

        <section className="mt-10 rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-8 text-center">
          <h3 className="text-2xl font-bold text-emerald-300">
            لماذا هذه الأسئلة؟
          </h3>

          <p className="mx-auto mt-4 max-w-4xl text-lg leading-8 text-slate-300">
            لأن كفو لا يبني توصياته على افتراضات عامة. كل إجابة تساعد على
            تكوين Corporate DNA أدق للمؤسسة، ثم تحويله إلى قرارات وتوصيات
            تنفيذية أوضح.
          </p>
        </section>
      </div>
    </main>
  );
}