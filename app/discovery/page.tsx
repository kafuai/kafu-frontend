"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocalization } from "@/components/localization/LocalizationContext";

import DiscoveryResponseComposer, { type DiscoveryLocalAttachment } from "@/components/discovery/DiscoveryResponseComposer";
import { persistDiscoveryCommunication } from "@/components/discovery/discoveryCommunicationPersistence";
import { getCurrentCompanyId } from "@/lib/companySession";
import { supabase } from "@/lib/supabase";

// Components & Types
import { QUESTIONS_COUNT, DiscoveryDraft, getDiscoveryDraftKey } from "@/components/discovery/types";
import { useAppCopy } from "@/components/discovery/useAppCopy";
import PageHeader from "@/components/discovery/PageHeader";
import QuestionProgress from "@/components/discovery/QuestionProgress";
import ActionButtons from "@/components/discovery/ActionButtons";
import Sidebar from "@/components/discovery/Sidebar";

export default function DiscoveryPage() {
  const router = useRouter();
  const { locale } = useLocalization();
  const isArabic = locale === "ar";
  const { t } = useAppCopy(isArabic);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(QUESTIONS_COUNT).fill(""));
  const [attachmentsByQuestion, setAttachmentsByQuestion] = useState<DiscoveryLocalAttachment[][]>(
    Array.from({ length: QUESTIONS_COUNT }, () => [])
  );

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    async function loadExistingAnswers() {
      const companyId = getCurrentCompanyId();
      if (!companyId) return;

      let supabaseAnswers: string[] = Array(QUESTIONS_COUNT).fill("");

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

      let localDraft: DiscoveryDraft | null = null;
      try {
        const draftKey = getDiscoveryDraftKey(companyId);
        const savedDraft = sessionStorage.getItem(draftKey);
        if (savedDraft) {
          const parsed: unknown = JSON.parse(savedDraft);
          if (parsed && typeof parsed === "object") {
            const candidate = parsed as Record<string, unknown>;
            if (Array.isArray(candidate.answers) && candidate.answers.length === QUESTIONS_COUNT) {
              localDraft = {
                answers: candidate.answers.map((answer) => (typeof answer === "string" ? answer : "")),
                savedAt: typeof candidate.savedAt === "number" ? candidate.savedAt : 0,
              };
            }
          }
        }
      } catch (error) {
        console.error("Failed to load Discovery draft:", error);
      }

      if (localDraft) {
        setAnswers(localDraft.answers);
      } else {
        setAnswers(supabaseAnswers);
      }
    }
    loadExistingAnswers();
  }, []);

  const progress = ((currentQuestion + 1) / QUESTIONS_COUNT) * 100;
  const completedAnswers = answers.filter((answer) => answer.trim().length > 0).length;
  const totalAttachments = attachmentsByQuestion.reduce((total, items) => total + items.length, 0);

  function saveDraft(updatedAnswers: string[]) {
    const companyId = getCurrentCompanyId();
    if (!companyId) return;
    try {
      const draft: DiscoveryDraft = { answers: updatedAnswers, savedAt: Date.now() };
      sessionStorage.setItem(getDiscoveryDraftKey(companyId), JSON.stringify(draft));
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
      const updatedAnswers = current.map((answer, index) => (index === currentQuestion ? value : answer));
      saveDraft(updatedAnswers);
      return updatedAnswers;
    });
  }

  function updateAttachments(attachments: DiscoveryLocalAttachment[]) {
    setAttachmentsByQuestion((current) =>
      current.map((items, index) => (index === currentQuestion ? attachments : items))
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
    setCurrentQuestion((current) => Math.min(QUESTIONS_COUNT - 1, current + 1));
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
      const communicationResult = await persistDiscoveryCommunication({
        companyId,
        questions: [...t.questions],
        answers,
        attachmentsByQuestion,
      });

      const rows = t.questions.map((question, index) => ({
        company_id: companyId,
        question,
        answer: answers[index] || "",
        question_order: index + 1,
      }));

      const { data: existingAnswers, error: existingAnswersError } = await supabase
        .from("discovery_answers")
        .select("id, question_order")
        .eq("company_id", companyId);

      if (existingAnswersError) throw new Error(`${t.messages.verifyAnswersError} ${existingAnswersError.message}`);

      for (const row of rows) {
        const existingAnswer = existingAnswers?.find((item) => item.question_order === row.question_order);
        if (existingAnswer) {
          const { error: updateError } = await supabase.from("discovery_answers").update({ question: row.question, answer: row.answer }).eq("id", existingAnswer.id);
          if (updateError) throw new Error(`${t.messages.updateAnswerError} ${updateError.message}`);
        } else {
          const { error: insertError } = await supabase.from("discovery_answers").insert(row);
          if (insertError) throw new Error(`${t.messages.saveAnswerError} ${insertError.message}`);
        }
      }

      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError) throw new Error(`${t.messages.verifyUserError} ${authError.message}`);
      if (!authData.user) throw new Error(t.messages.noUserFound);

      const { data: membership, error: membershipError } = await supabase
        .from("organization_memberships")
        .select(`organization_id, organizations!inner ( id, company_id )`)
        .eq("user_id", authData.user.id)
        .eq("organizations.company_id", companyId)
        .maybeSingle();

      if (membershipError) throw new Error(`${t.messages.orgDetermineError} ${membershipError.message}`);
      if (!membership?.organization_id) throw new Error(t.messages.orgUserDetermineError);

      const { error: onboardingError } = await supabase
        .from("organizations")
        .update({ onboarding_completed: true })
        .eq("id", membership.organization_id);

      if (onboardingError) throw new Error(`${t.messages.onboardingRecordError} ${onboardingError.message}`);

      clearDraft();
      setMessage(`${t.messages.saveSuccess} ${communicationResult.messageCount} ${t.messages.entries} ${t.messages.andText} ${communicationResult.attachmentCount} ${t.messages.attachments}.`);

      window.setTimeout(() => {
        router.push("/corporate-brain");
      }, 1100);
    } catch (error) {
      setLoading(false);
      setHasError(true);
      saveDraft(answers);
      setMessage(error instanceof Error ? `${t.messages.saveErrorPrefix} ${error.message}` : t.messages.unexpectedError);
    }
  }

  return (
    <main dir={isArabic ? "rtl" : "ltr"} className="min-h-screen bg-[var(--background)] text-[var(--text-primary)] text-start">
      
      <PageHeader t={t} completedAnswers={completedAnswers} totalAttachments={totalAttachments} />

      <div className="mx-auto grid max-w-7xl gap-7 px-5 py-8 sm:px-8 lg:grid-cols-[minmax(0,1fr)_310px] lg:px-10 lg:py-10">
        <section className="min-w-0 rounded-[28px] border border-[var(--border-default)] bg-[var(--surface)] p-5 shadow-[var(--shadow-medium)] sm:p-7 lg:p-9">
          
          <QuestionProgress t={t} currentQuestion={currentQuestion} questionsCount={QUESTIONS_COUNT} progress={progress} />

          <div className="pt-2">
            <DiscoveryResponseComposer
              answer={answers[currentQuestion]}
              attachments={attachmentsByQuestion[currentQuestion]}
              disabled={loading}
              onAnswerChange={updateAnswer}
              onAttachmentsChange={updateAttachments}
            />
          </div>

          <ActionButtons
            t={t}
            isArabic={isArabic}
            currentQuestion={currentQuestion}
            questionsCount={QUESTIONS_COUNT}
            loading={loading}
            goToPreviousQuestion={goToPreviousQuestion}
            goToNextQuestion={goToNextQuestion}
            handleFinish={handleFinish}
            message={message}
            hasError={hasError}
          />
        </section>

        <Sidebar t={t} />
      </div>
    </main>
  );
}