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
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import DiscoveryResponseComposer, {
  type DiscoveryLocalAttachment,
} from "@/components/discovery/DiscoveryResponseComposer";
import { persistDiscoveryCommunication } from "@/components/discovery/discoveryCommunicationPersistence";
import { getCurrentCompanyId } from "@/lib/companySession";
import { supabase } from "@/lib/supabase";
import { useLocalization } from "@/components/localization/LocalizationContext";

const QUESTIONS_COUNT = 5;
const DISCOVERY_DRAFT_PREFIX = "kafu_discovery_draft_";

type DiscoveryDraft = {
  answers: string[];
  savedAt: number;
};

function getDiscoveryDraftKey(companyId: string): string {
  return `${DISCOVERY_DRAFT_PREFIX}${companyId}`;
}

// --- قاموس الترجمة ---
const CONTENT = {
  ar: {
    questions: [
      "ما أكثر ثلاثة تحديات تشغل الإدارة التنفيذية حالياً؟",
      "ما أكثر عملية داخل المؤسسة تستهلك وقتاً وجهداً أكثر من اللازم؟",
      "ما أكثر قرار تتمنى أن تحصل عليه الإدارة بشكل أسرع؟",
      "ما أكبر فرصة للتحسين خلال الـ 12 شهراً القادمة؟",
      "إذا نجحت مبادرة كفو بعد سنة، ما المؤشر الذي سيجعلك تقول إنها كانت ناجحة؟",
    ],
    header: {
      badge: "Executive Discovery Workspace",
      title: "جلسة الاستكشاف التنفيذية",
      description: "شارك المعرفة المؤسسية، ليحوّلها KAFU AI إلى صورة تنفيذية وتوصيات قابلة للقياس.",
    },
    stats: {
      answers: "إجابات",
      attachments: "مرفقات",
      secure: "آمن",
      context: "سياق مؤسسي",
    },
    progress: {
      executiveQuestion: "السؤال التنفيذي",
      sessionProgress: "تقدم الجلسة",
      discoveryBadge: "KAFU AI Discovery",
    },
    buttons: {
      previous: "السابق",
      next: "التالي",
      saving: "جاري حفظ الإجابات...",
      saveAndReview: "حفظ ومراجعة الملخص التنفيذي",
    },
    sidebar: {
      guidelinesTitle: "إرشادات الإجابة",
      guidelinesDesc: "ركّز على الواقع الحالي والأثر التنفيذي وليس الوصف العام.",
      privacyTitle: "خصوصية مؤسسية",
      privacyDesc: "يتم ربط كل مدخل بسياق الشركة والسؤال التنفيذي لضمان التتبع والاستخدام الصحيح داخل KAFU AI.",
    },
    messages: {
      answerRequired: "يرجى الإجابة على السؤال قبل الانتقال للسؤال التالي.",
      allAnswersRequired: "يرجى الإجابة على جميع الأسئلة قبل إكمال جلسة الاستكشاف.",
      savingState: "جاري حفظ الإجابات ورفع الملفات والتسجيلات...",
      noCompanyData: "لم يتم العثور على بيانات الشركة. يرجى الرجوع إلى صفحة التقييم وإدخال بيانات الشركة أولاً.",
      verifyAnswersError: "تعذر التحقق من إجابات Discovery الموجودة:",
      updateAnswerError: "تعذر تحديث إجابة Discovery:",
      saveAnswerError: "تعذر حفظ إجابة Discovery:",
      verifyUserError: "تعذر التحقق من المستخدم الحالي:",
      noUserFound: "لم يتم العثور على المستخدم الحالي.",
      orgDetermineError: "تعذر تحديد المنظمة المرتبطة بالشركة:",
      orgUserDetermineError: "تعذر تحديد المنظمة المرتبطة بالمستخدم والشركة.",
      onboardingRecordError: "تعذر تسجيل اكتمال الإعداد (Onboarding):",
      saveSuccess: "تم حفظ جلسة الاستكشاف بنجاح:",
      entries: "مدخلات",
      attachments: "مرفقات",
      andText: "و",
      saveErrorPrefix: "حدث خطأ أثناء حفظ جلسة الاستكشاف:",
      unexpectedError: "حدث خطأ غير متوقع أثناء حفظ جلسة الاستكشاف.",
    },
  },
  en: {
    questions: [
      "What are the top three challenges currently occupying executive management?",
      "Which process within the organization consumes an unnecessary amount of time and effort?",
      "What is the one decision you wish management could make faster?",
      "What is the biggest opportunity for improvement over the next 12 months?",
      "If the KAFU initiative succeeds in a year, what metric will make you consider it a success?",
    ],
    header: {
      badge: "Executive Discovery Workspace",
      title: "Executive Discovery Session",
      description: "Share enterprise knowledge, so KAFU AI can transform it into an executive view and measurable recommendations.",
    },
    stats: {
      answers: "Answers",
      attachments: "Attachments",
      secure: "Secure",
      context: "Enterprise Context",
    },
    progress: {
      executiveQuestion: "Executive Question",
      sessionProgress: "Session Progress",
      discoveryBadge: "KAFU AI Discovery",
    },
    buttons: {
      previous: "Previous",
      next: "Next",
      saving: "Saving answers...",
      saveAndReview: "Save & Review Executive Summary",
    },
    sidebar: {
      guidelinesTitle: "Answering Guidelines",
      guidelinesDesc: "Focus on the current reality and executive impact rather than general descriptions.",
      privacyTitle: "Enterprise Privacy",
      privacyDesc: "Each entry is linked to the company's context and executive question to ensure tracking and proper usage within KAFU AI.",
    },
    messages: {
      answerRequired: "Please answer the question before moving to the next one.",
      allAnswersRequired: "Please answer all questions before completing the discovery session.",
      savingState: "Saving answers and uploading files and recordings...",
      noCompanyData: "Company data not found. Please return to the Assessment page and enter company data first.",
      verifyAnswersError: "Could not verify existing Discovery answers:",
      updateAnswerError: "Could not update Discovery answer:",
      saveAnswerError: "Could not save Discovery answer:",
      verifyUserError: "Could not verify the current user:",
      noUserFound: "Current user not found.",
      orgDetermineError: "Could not determine the organization linked to the company:",
      orgUserDetermineError: "Could not determine the organization linked to the user and company.",
      onboardingRecordError: "Could not record Onboarding completion:",
      saveSuccess: "Discovery session saved successfully:",
      entries: "entries",
      attachments: "attachments",
      andText: "and",
      saveErrorPrefix: "An error occurred while saving the discovery session:",
      unexpectedError: "An unexpected error occurred while saving the discovery session.",
    },
  },
} as const;

export default function DiscoveryPage() {
  const router = useRouter();
  const { locale } = useLocalization();
  const isArabic = locale === "ar";
  const t = isArabic ? CONTENT.ar : CONTENT.en;

  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [answers, setAnswers] = useState<string[]>(
    Array(QUESTIONS_COUNT).fill("")
  );

  const [attachmentsByQuestion, setAttachmentsByQuestion] = useState<DiscoveryLocalAttachment[][]>(
    Array.from({ length: QUESTIONS_COUNT }, () => [])
  );

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [hasError, setHasError] = useState(false);

  /*
   * Load existing Discovery answers and local draft.
   *
   * Priority:
   * 1. Local draft, if it exists.
   * 2. Supabase saved answers.
   */
  useEffect(() => {
    async function loadExistingAnswers() {
      const companyId = getCurrentCompanyId();

      if (!companyId) {
        return;
      }

      let supabaseAnswers: string[] = Array(QUESTIONS_COUNT).fill("");

      /*
       * 1. Load saved answers from Supabase.
       */
      const { data, error } = await supabase
        .from("discovery_answers")
        .select("question_order, answer")
        .eq("company_id", companyId)
        .order("question_order", { ascending: true });

      if (error) {
        console.error("Failed to load existing Discovery answers:", error);
      } else if (data && data.length > 0) {
        data.forEach((item) => {
          const index = item.question_order - 1;
          if (index >= 0 && index < supabaseAnswers.length) {
            supabaseAnswers[index] = item.answer ?? "";
          }
        });
      }

      /*
       * 2. Load local draft.
       */
      let localDraft: DiscoveryDraft | null = null;

      try {
        const draftKey = getDiscoveryDraftKey(companyId);
        const savedDraft = sessionStorage.getItem(draftKey);

        if (savedDraft) {
          const parsed: unknown = JSON.parse(savedDraft);

          if (parsed && typeof parsed === "object") {
            const candidate = parsed as Record<string, unknown>;

            if (
              Array.isArray(candidate.answers) &&
              candidate.answers.length === QUESTIONS_COUNT
            ) {
              localDraft = {
                answers: candidate.answers.map((answer) =>
                  typeof answer === "string" ? answer : ""
                ),
                savedAt: typeof candidate.savedAt === "number" ? candidate.savedAt : 0,
              };
            }
          }
        }
      } catch (error) {
        console.error("Failed to load Discovery draft:", error);
      }

      /*
       * 3. Draft has priority over Supabase.
       */
      if (localDraft) {
        setAnswers(localDraft.answers);
      } else {
        setAnswers(supabaseAnswers);
      }
    }

    loadExistingAnswers();
  }, []);

  const progress = ((currentQuestion + 1) / QUESTIONS_COUNT) * 100;

  const completedAnswers = answers.filter(
    (answer) => answer.trim().length > 0
  ).length;

  const totalAttachments = attachmentsByQuestion.reduce(
    (total, items) => total + items.length,
    0
  );

  function saveDraft(updatedAnswers: string[]) {
    const companyId = getCurrentCompanyId();
    if (!companyId) return;

    try {
      const draft: DiscoveryDraft = {
        answers: updatedAnswers,
        savedAt: Date.now(),
      };
      sessionStorage.setItem(
        getDiscoveryDraftKey(companyId),
        JSON.stringify(draft)
      );
    } catch (error) {
      console.error("Failed to save Discovery draft:", error);
    }
  }

  function clearDraft() {
    const companyId = getCurrentCompanyId();
    if (!companyId) return;

    try {
      sessionStorage.removeItem(getDiscoveryDraftKey(companyId));
    } catch (error) {
      console.error("Failed to clear Discovery draft:", error);
    }
  }

  function updateAnswer(value: string) {
    setAnswers((current) => {
      const updatedAnswers = current.map((answer, index) =>
        index === currentQuestion ? value : answer
      );
      saveDraft(updatedAnswers);
      return updatedAnswers;
    });
  }

  function updateAttachments(attachments: DiscoveryLocalAttachment[]) {
    setAttachmentsByQuestion((current) =>
      current.map((items, index) =>
        index === currentQuestion ? attachments : items
      )
    );
  }

  function goToPreviousQuestion() {
    setMessage("");
    setHasError(false);
    setCurrentQuestion((current) => Math.max(0, current - 1));
  }

  function goToNextQuestion() {
    setMessage("");
    setHasError(false);

    if (!answers[currentQuestion].trim()) {
      setHasError(true);
      setMessage(t.messages.answerRequired);
      return;
    }

    saveDraft(answers);
    setCurrentQuestion((current) =>
      Math.min(QUESTIONS_COUNT - 1, current + 1)
    );
  }

  async function handleFinish() {
    const hasEmptyAnswer = answers.some((answer) => !answer.trim());

    if (hasEmptyAnswer) {
      setHasError(true);
      setMessage(t.messages.allAnswersRequired);
      return;
    }

    setLoading(true);
    setMessage(t.messages.savingState);
    setHasError(false);

    const companyId = getCurrentCompanyId();

    if (!companyId) {
      setLoading(false);
      setHasError(true);
      setMessage(t.messages.noCompanyData);
      return;
    }

    try {
      /* 1. Persist Discovery communication. */
      const communicationResult = await persistDiscoveryCommunication({
        companyId,
        questions: [...t.questions],
        answers,
        attachmentsByQuestion,
      });

      /* 2. Prepare Discovery answer rows. */
      const rows = t.questions.map((question, index) => ({
        company_id: companyId,
        question,
        answer: answers[index] || "",
        question_order: index + 1,
      }));

      /* 3. Load existing answers */
      const { data: existingAnswers, error: existingAnswersError } =
        await supabase
          .from("discovery_answers")
          .select("id, question_order")
          .eq("company_id", companyId);

      if (existingAnswersError) {
        throw new Error(`${t.messages.verifyAnswersError} ${existingAnswersError.message}`);
      }

      /* 4. Update existing answers or insert */
      for (const row of rows) {
        const existingAnswer = existingAnswers?.find(
          (item) => item.question_order === row.question_order
        );

        if (existingAnswer) {
          const { error: updateError } = await supabase
            .from("discovery_answers")
            .update({
              question: row.question,
              answer: row.answer,
            })
            .eq("id", existingAnswer.id);

          if (updateError) {
            throw new Error(`${t.messages.updateAnswerError} ${updateError.message}`);
          }
        } else {
          const { error: insertError } = await supabase
            .from("discovery_answers")
            .insert(row);

          if (insertError) {
            throw new Error(`${t.messages.saveAnswerError} ${insertError.message}`);
          }
        }
      }

      /* 5. Resolve user organization */
      const { data: authData, error: authError } = await supabase.auth.getUser();

      if (authError) {
        throw new Error(`${t.messages.verifyUserError} ${authError.message}`);
      }

      if (!authData.user) {
        throw new Error(t.messages.noUserFound);
      }

      const { data: membership, error: membershipError } = await supabase
        .from("organization_memberships")
        .select(`
          organization_id,
          organizations!inner (
            id,
            company_id
          )
        `)
        .eq("user_id", authData.user.id)
        .eq("organizations.company_id", companyId)
        .maybeSingle();

      if (membershipError) {
        throw new Error(`${t.messages.orgDetermineError} ${membershipError.message}`);
      }

      if (!membership?.organization_id) {
        throw new Error(t.messages.orgUserDetermineError);
      }

      /* 6. Persist onboarding completion state. */
      const { error: onboardingError } = await supabase
        .from("organizations")
        .update({ onboarding_completed: true })
        .eq("id", membership.organization_id);

      if (onboardingError) {
        throw new Error(`${t.messages.onboardingRecordError} ${onboardingError.message}`);
      }

      /* 7. Everything succeeded. */
      clearDraft();

      setMessage(
        `${t.messages.saveSuccess} ${communicationResult.messageCount} ${t.messages.entries} ${t.messages.andText} ${communicationResult.attachmentCount} ${t.messages.attachments}.`
      );

      window.setTimeout(() => {
        router.push("/corporate-brain");
      }, 1100);
    } catch (error) {
      setLoading(false);
      setHasError(true);
      saveDraft(answers);
      setMessage(
        error instanceof Error
          ? `${t.messages.saveErrorPrefix} ${error.message}`
          : t.messages.unexpectedError
      );
    }
  }

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      className="min-h-screen bg-[var(--background)] text-[var(--text-primary)] text-start"
    >
      <section className="relative overflow-hidden border-b border-slate-800 bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.16),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.12),transparent_38%)]" />

        <div className="relative mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14 lg:px-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-black text-emerald-300">
                <Sparkles size={15} />
                {t.header.badge}
              </div>

              <h1 className="mt-5 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                {t.header.title}
              </h1>

              <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
                {t.header.description}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 lg:w-[420px]">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur">
                <MessageSquareText size={18} className="mx-auto text-emerald-300" />
                <p className="mt-2 text-2xl font-black text-white">{completedAnswers}</p>
                <p className="mt-1 text-[11px] font-bold text-slate-400">{t.stats.answers}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur">
                <Paperclip size={18} className="mx-auto text-blue-300" />
                <p className="mt-2 text-2xl font-black text-white">{totalAttachments}</p>
                <p className="mt-1 text-[11px] font-bold text-slate-400">{t.stats.attachments}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur">
                <ShieldCheck size={18} className="mx-auto text-violet-300" />
                <p className="mt-2 text-2xl font-black text-white">{t.stats.secure}</p>
                <p className="mt-1 text-[11px] font-bold text-slate-400">{t.stats.context}</p>
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
                {t.progress.executiveQuestion}
              </p>
              <h2 className="mt-2 text-2xl font-black text-[var(--text-primary)] sm:text-3xl">
                {currentQuestion + 1}
                <span className="mx-2 text-base text-[var(--text-muted)]">/</span>
                {QUESTIONS_COUNT}
              </h2>
            </div>

            <div className="w-full sm:max-w-[320px]">
              <div className="mb-2 flex items-center justify-between text-xs font-black text-[var(--text-muted)]">
                <span>{t.progress.sessionProgress}</span>
                <span dir="ltr">{Math.round(progress)}%</span>
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
                  style={{ width: `${progress}%` }}
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
                  {t.progress.discoveryBadge}
                </p>
                <h3 className="mt-2 text-xl font-black leading-9 text-[var(--text-primary)] sm:text-2xl">
                  {t.questions[currentQuestion]}
                </h3>
              </div>
            </div>

            <DiscoveryResponseComposer
              answer={answers[currentQuestion]}
              attachments={attachmentsByQuestion[currentQuestion]}
              disabled={loading}
              onAnswerChange={updateAnswer}
              onAttachmentsChange={updateAttachments}
            />
          </div>

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-[var(--border-default)] pt-7 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              disabled={currentQuestion === 0 || loading}
              onClick={goToPreviousQuestion}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 text-sm font-black text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isArabic ? <ArrowRight size={17} /> : <ArrowLeft size={17} />}
              {t.buttons.previous}
            </button>

            {currentQuestion < QUESTIONS_COUNT - 1 ? (
              <button
                type="button"
                disabled={loading}
                onClick={goToNextQuestion}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-7 text-sm font-black text-white shadow-sm transition hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {t.buttons.next}
                {isArabic ? <ArrowLeft size={17} /> : <ArrowRight size={17} />}
              </button>
            ) : (
              <button
                type="button"
                disabled={loading}
                onClick={handleFinish}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-emerald-700 bg-emerald-700 px-7 text-sm font-black text-white shadow-lg shadow-emerald-900/10 transition hover:border-emerald-800 hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200 disabled:cursor-not-allowed disabled:border-slate-300 disabled:bg-slate-300 disabled:text-slate-600 disabled:shadow-none"
              >
                <CheckCircle2 size={18} />
                {loading ? t.buttons.saving : t.buttons.saveAndReview}
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
                {t.sidebar.guidelinesTitle}
              </h2>
            </div>
            <div className="mt-5 space-y-4 text-sm leading-7 text-[var(--text-secondary)]">
              <p>{t.sidebar.guidelinesDesc}</p>
            </div>
          </section>

          <section className="rounded-[24px] border border-slate-200 bg-slate-950 p-6 text-white">
            <div className="flex items-center gap-3">
              <LockKeyhole size={18} className="text-emerald-300" />
              <h2 className="font-black">
                {t.sidebar.privacyTitle}
              </h2>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              {t.sidebar.privacyDesc}
            </p>
          </section>
        </aside>
      </div>
    </main>
  );
}