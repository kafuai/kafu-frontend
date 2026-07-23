"use client";

import {
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  FileText,
  LockKeyhole,
  MessageSquareText,
  Mic,
  Paperclip,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import DiscoveryResponseComposer, {
  type DiscoveryLocalAttachment,
} from "@/components/discovery/DiscoveryResponseComposer";
import { persistDiscoveryCommunication } from "@/components/discovery/discoveryCommunicationPersistence";
import { getCurrentCompanyId } from "@/lib/companySession";
import { supabase } from "@/lib/supabase";

const QUESTIONS = [
  "ما أكثر ثلاثة تحديات تشغل الإدارة التنفيذية حالياً؟",
  "ما أكثر عملية داخل المؤسسة تستهلك وقتاً وجهداً أكثر من اللازم؟",
  "ما أكثر قرار تتمنى أن تحصل عليه الإدارة بشكل أسرع؟",
  "ما أكبر فرصة للتحسين خلال الـ 12 شهراً القادمة؟",
  "إذا نجحت مبادرة كفو بعد سنة، ما المؤشر الذي سيجعلك تقول إنها كانت ناجحة؟",
];

export default function DiscoveryPage() {
  const router = useRouter();

  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const [answers, setAnswers] = useState<string[]>(
    Array(QUESTIONS.length).fill("")
  );

  const [attachmentsByQuestion, setAttachmentsByQuestion] =
    useState<DiscoveryLocalAttachment[][]>(
      Array.from(
        { length: QUESTIONS.length },
        () => []
      )
    );

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [hasError, setHasError] = useState(false);

  const progress =
    ((currentQuestion + 1) / QUESTIONS.length) * 100;

  const completedAnswers = answers.filter(
    (answer) => answer.trim().length > 0
  ).length;

  const totalAttachments =
    attachmentsByQuestion.reduce(
      (total, items) => total + items.length,
      0
    );

  function updateAnswer(value: string) {
    setAnswers((current) =>
      current.map((answer, index) =>
        index === currentQuestion ? value : answer
      )
    );
  }

  function updateAttachments(
    attachments: DiscoveryLocalAttachment[]
  ) {
    setAttachmentsByQuestion((current) =>
      current.map((items, index) =>
        index === currentQuestion
          ? attachments
          : items
      )
    );
  }

  function goToPreviousQuestion() {
    setMessage("");
    setHasError(false);

    setCurrentQuestion((current) =>
      Math.max(0, current - 1)
    );
  }

  function goToNextQuestion() {
    setMessage("");
    setHasError(false);

    setCurrentQuestion((current) =>
      Math.min(QUESTIONS.length - 1, current + 1)
    );
  }

  async function handleFinish() {
    setLoading(true);
    setMessage(
      "جاري حفظ الإجابات ورفع الملفات والتسجيلات..."
    );
    setHasError(false);

    const companyId = getCurrentCompanyId();

    if (!companyId) {
      setLoading(false);
      setHasError(true);
      setMessage(
        "لم يتم العثور على بيانات الشركة. يرجى الرجوع إلى صفحة Assessment وإدخال بيانات الشركة أولاً."
      );

      return;
    }

    try {
      const communicationResult =
        await persistDiscoveryCommunication({
          companyId,
          questions: QUESTIONS,
          answers,
          attachmentsByQuestion,
        });

      const rows = QUESTIONS.map(
        (question, index) => ({
          company_id: companyId,
          question,
          answer: answers[index] || "",
          question_order: index + 1,
        })
      );

      const { error } = await supabase
        .from("discovery_answers")
        .insert(rows);

      if (error) {
        throw new Error(
          `تعذر حفظ الإجابات النصية: ${error.message}`
        );
      }

      setMessage(
        `تم حفظ جلسة الاستكشاف بنجاح: ${communicationResult.messageCount} مدخلات و${communicationResult.attachmentCount} مرفقات.`
      );

      window.setTimeout(() => {
        router.push("/executive-summary");
      }, 1100);
    } catch (error) {
      setLoading(false);
      setHasError(true);
      setMessage(
        error instanceof Error
          ? `حدث خطأ أثناء حفظ جلسة الاستكشاف: ${error.message}`
          : "حدث خطأ غير متوقع أثناء حفظ جلسة الاستكشاف."
      );
    }
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[var(--background)] text-[var(--text-primary)]"
    >
      <section className="relative overflow-hidden border-b border-slate-800 bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.16),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.12),transparent_38%)]" />

        <div className="relative mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14 lg:px-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-black text-emerald-300">
                <Sparkles size={15} />
                Executive Discovery Workspace
              </div>

              <h1 className="mt-5 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                جلسة الاستكشاف التنفيذية
              </h1>

              <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
                شارك المعرفة المؤسسية بالنص أو الملفات
                أو التسجيلات الصوتية، ليحوّلها KAFU AI
                إلى صورة تنفيذية وتوصيات قابلة للقياس.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 lg:w-[420px]">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur">
                <MessageSquareText
                  size={18}
                  className="mx-auto text-emerald-300"
                />

                <p className="mt-2 text-2xl font-black text-white">
                  {completedAnswers}
                </p>

                <p className="mt-1 text-[11px] font-bold text-slate-400">
                  إجابات
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur">
                <Paperclip
                  size={18}
                  className="mx-auto text-blue-300"
                />

                <p className="mt-2 text-2xl font-black text-white">
                  {totalAttachments}
                </p>

                <p className="mt-1 text-[11px] font-bold text-slate-400">
                  مرفقات
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur">
                <ShieldCheck
                  size={18}
                  className="mx-auto text-violet-300"
                />

                <p className="mt-2 text-2xl font-black text-white">
                  آمن
                </p>

                <p className="mt-1 text-[11px] font-bold text-slate-400">
                  سياق مؤسسي
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-7 px-5 py-8 sm:px-8 lg:grid-cols-[minmax(0,1fr)_310px] lg:px-10 lg:py-10">
        <section className="min-w-0 rounded-[28px] border border-[var(--border-default)] bg-[var(--surface)] p-5 shadow-[var(--shadow-medium)] sm:p-7 lg:p-9">
          <div className="flex flex-col gap-5 border-b border-[var(--border-default)] pb-7 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--brand-primary)]">
                السؤال التنفيذي
              </p>

              <h2 className="mt-2 text-2xl font-black text-[var(--text-primary)] sm:text-3xl">
                {currentQuestion + 1}
                <span className="mx-2 text-base text-[var(--text-muted)]">
                  /
                </span>
                {QUESTIONS.length}
              </h2>
            </div>

            <div className="w-full sm:max-w-[320px]">
              <div className="mb-2 flex items-center justify-between text-xs font-black text-[var(--text-muted)]">
                <span>تقدم الجلسة</span>
                <span dir="ltr">
                  {Math.round(progress)}%
                </span>
              </div>

              <div
                className="h-2.5 overflow-hidden rounded-full bg-[var(--surface-muted)]"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(progress)}
              >
                <div
                  className="h-full rounded-full bg-emerald-600 transition-all duration-500"
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="pt-8">
            <div className="flex items-start gap-4">
              <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                <BrainCircuit size={22} />
              </span>

              <div>
                <p className="text-xs font-black text-emerald-700">
                  KAFU AI Discovery
                </p>

                <h3 className="mt-2 text-xl font-black leading-9 text-[var(--text-primary)] sm:text-2xl">
                  {QUESTIONS[currentQuestion]}
                </h3>

                <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                  يمكنك الجمع بين الإجابة النصية
                  والمستندات والتسجيل الصوتي في السؤال
                  نفسه.
                </p>
              </div>
            </div>

            <DiscoveryResponseComposer
              answer={answers[currentQuestion]}
              attachments={
                attachmentsByQuestion[currentQuestion]
              }
              disabled={loading}
              onAnswerChange={updateAnswer}
              onAttachmentsChange={updateAttachments}
            />
          </div>

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-[var(--border-default)] pt-7 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              disabled={
                currentQuestion === 0 || loading
              }
              onClick={goToPreviousQuestion}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 text-sm font-black text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowRight size={17} />
              السابق
            </button>

            {currentQuestion <
            QUESTIONS.length - 1 ? (
              <button
                type="button"
                disabled={loading}
                onClick={goToNextQuestion}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-7 text-sm font-black text-white shadow-sm transition hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                التالي
                <ArrowLeft size={17} />
              </button>
            ) : (
              <button
                type="button"
                disabled={loading}
                onClick={handleFinish}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-emerald-700 bg-emerald-700 px-7 text-sm font-black text-white shadow-lg shadow-emerald-900/10 transition hover:border-emerald-800 hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200 disabled:cursor-not-allowed disabled:border-slate-300 disabled:bg-slate-300 disabled:text-slate-600 disabled:shadow-none"
              >
                <CheckCircle2 size={18} />

                {loading
                  ? "جاري حفظ الإجابات..."
                  : "حفظ ومراجعة الملخص التنفيذي"}
              </button>
            )}
          </div>

          {message && (
            <div
              className={`mt-6 rounded-xl border px-5 py-4 text-center text-sm font-black ${
                hasError
                  ? "border-red-200 bg-red-50 text-red-700"
                  : "border-emerald-200 bg-emerald-50 text-emerald-800"
              }`}
            >
              {message}
            </div>
          )}
        </section>

        <aside className="space-y-5">
          <section className="rounded-[24px] border border-[var(--border-default)] bg-[var(--surface)] p-6 shadow-[var(--shadow-small)]">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <FileText size={18} />
              </span>

              <h2 className="font-black text-[var(--text-primary)]">
                إرشادات الإجابة
              </h2>
            </div>

            <div className="mt-5 space-y-4 text-sm leading-7 text-[var(--text-secondary)]">
              <p>
                ركّز على الواقع الحالي والأثر التنفيذي
                وليس الوصف العام.
              </p>

              <p>
                أرفق التقارير أو السياسات أو البيانات
                التي تدعم إجابتك.
              </p>

              <p>
                يمكنك تسجيل إجابة صوتية عندما تكون
                التفاصيل أسرع في الشرح.
              </p>
            </div>
          </section>

          <section className="rounded-[24px] border border-emerald-200 bg-emerald-50 p-6">
            <div className="flex items-center gap-3 text-emerald-900">
              <Mic size={18} />
              <h2 className="font-black">
                مدخلات متعددة
              </h2>
            </div>

            <p className="mt-4 text-sm leading-7 text-emerald-900/75">
              النص والملفات والصوت ستكوّن معًا سياقًا
              مؤسسيًا أكثر دقة للتحليل التنفيذي.
            </p>
          </section>

          <section className="rounded-[24px] border border-slate-200 bg-slate-950 p-6 text-white">
            <div className="flex items-center gap-3">
              <LockKeyhole
                size={18}
                className="text-emerald-300"
              />

              <h2 className="font-black">
                خصوصية مؤسسية
              </h2>
            </div>

            <p className="mt-4 text-sm leading-7 text-slate-300">
              يتم ربط كل مدخل بسياق الشركة والسؤال
              التنفيذي لضمان التتبع والاستخدام الصحيح
              داخل KAFU AI.
            </p>
          </section>
        </aside>
      </div>
    </main>
  );
}

