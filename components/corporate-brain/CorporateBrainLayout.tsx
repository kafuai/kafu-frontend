"use client";

import { useState } from "react";
import {
  BookOpenCheck,
  Database,
  FileText,
  Network,
  ShieldCheck,
} from "lucide-react";

import { useLocalization } from "@/components/localization/LocalizationContext";

import CorporateBrainConversation from "./CorporateBrainConversation";
import CorporateBrainDecisionPanel from "./CorporateBrainDecisionPanel";
import CorporateBrainHero from "./CorporateBrainHero";
import CorporateBrainKnowledgeGraph from "./CorporateBrainKnowledgeGraph";
import CorporateBrainKnowledgePanel from "./CorporateBrainKnowledgePanel";
import CorporateBrainMemory from "./CorporateBrainMemory";
import CorporateBrainPromptComposer from "./CorporateBrainPromptComposer";
import CorporateBrainRelatedInsights from "./CorporateBrainRelatedInsights";
import CorporateBrainSuggestedActions from "./CorporateBrainSuggestedActions";
import CorporateBrainTimeline from "./CorporateBrainTimeline";

export interface CorporateBrainCompany {
  id: string;
  name: string | null;
  industry: string | null;
  country: string | null;
  employee_count: number | null;
}

export interface CorporateBrainDiscoveryAnswer {
  id: string;
  question: string;
  answer: string;
  question_order: number;
}

interface CorporateBrainLayoutProps {
  company: CorporateBrainCompany;
  answers: CorporateBrainDiscoveryAnswer[];
}

export default function CorporateBrainLayout({
  company,
  answers,
}: CorporateBrainLayoutProps) {
  const { locale } = useLocalization();
  const isArabic = locale === "ar";

 const [prompt, setPrompt] = useState("");
 const [submittedPrompt, setSubmittedPrompt] = useState("");
 const [aiResponse, setAIResponse] = useState("");
 const [aiLoading, setAILoading] = useState(false);
 const [aiError, setAIError] = useState("");

  const companyName =
    company.name || (isArabic ? "المؤسسة" : "The organization");

  const knowledgeSources = 3 + answers.length;

  async function handleSubmit() {
  const normalizedPrompt = prompt.trim();

  if (!normalizedPrompt || aiLoading) {
    return;
  }

  setSubmittedPrompt(normalizedPrompt);
  setPrompt("");
  setAIResponse("");
  setAIError("");
  setAILoading(true);

  try {
    const discoveryEvidence = answers
      .slice(0, 20)
      .map((answer, index) => ({
        id: `DISCOVERY-${index + 1}`,
        source: "Corporate Discovery",
        label:
          answer.question ||
          `Discovery Answer ${index + 1}`,
        value: answer.answer || "",
      }));

    const evidence = [
      {
        id: "COMPANY-NAME",
        source: "Company Profile",
        label: "Company Name",
        value: company.name ?? "",
      },
      {
        id: "COMPANY-INDUSTRY",
        source: "Company Profile",
        label: "Industry",
        value: company.industry ?? "",
      },
      {
        id: "COMPANY-COUNTRY",
        source: "Company Profile",
        label: "Country",
        value: company.country ?? "",
      },
      {
        id: "COMPANY-EMPLOYEES",
        source: "Company Profile",
        label: "Employee Count",
        value: company.employee_count ?? null,
      },
      ...discoveryEvidence,
    ];

    const response = await fetch(
      "/api/ai/grounded",
      {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          task: isArabic
            ? "أجب عن سؤال المستخدم بالاعتماد حصريًا على أدلة المؤسسة المتاحة. لا تفترض معلومات غير موجودة في الأدلة، وقدم إجابة تنفيذية واضحة ومباشرة."
            : "Answer the user's question using only the supplied enterprise evidence. Do not assume information that is not present in the evidence. Provide a clear and direct executive answer.",

          question: normalizedPrompt,

          locale,

          evidence,
        }),
      },
    );

    const payload = await response.json();

    if (!response.ok) {
      throw new Error(
        payload.error ||
          `Corporate Brain AI request failed with status ${response.status}.`,
      );
    }

    const text =
      payload.data?.text?.trim();

    if (!text) {
      throw new Error(
        isArabic
          ? "لم يتم إرجاع إجابة من طبقة الذكاء الاصطناعي."
          : "The AI intelligence layer returned no answer.",
      );
    }

    setAIResponse(text);
  } catch (error) {
    setAIError(
      error instanceof Error
        ? error.message
        : isArabic
          ? "حدث خطأ أثناء تحليل السؤال."
          : "An error occurred while analyzing the question.",
    );
  } finally {
    setAILoading(false);
  }
}

  const readinessItems = [
    {
      icon: Database,
      title: isArabic ? "بيانات المؤسسة" : "Company Data",
      value: 100,
    },
    {
      icon: FileText,
      title: isArabic
        ? "بيانات الاستكشاف"
        : "Discovery Intelligence",
      value: answers.length > 0 ? 85 : 30,
    },
    {
      icon: BookOpenCheck,
      title: isArabic
        ? "السياسات الداخلية"
        : "Internal Policies",
      value: 45,
    },
    {
      icon: Network,
      title: isArabic
        ? "الرسم المعرفي"
        : "Knowledge Graph",
      value: 62,
    },
  ];

  const overallReadiness = Math.round(
    readinessItems.reduce((total, item) => total + item.value, 0) /
      readinessItems.length,
  );

  return (
    <main
      className="min-h-[calc(100vh-76px)] bg-[var(--background)] px-5 py-6 md:px-8 lg:px-10"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div className="mx-auto max-w-[1580px] space-y-6">
        <CorporateBrainHero
          companyName={companyName}
          knowledgeSources={knowledgeSources}
          discoveryAnswers={answers.length}
        />

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="min-w-0 space-y-5">
            <CorporateBrainConversation
              companyName={companyName}
              userPrompt={submittedPrompt}
              aiResponse={aiResponse}
              aiLoading={aiLoading}
              aiError={aiError}
            />
            <CorporateBrainPromptComposer
              value={prompt}
              onChange={setPrompt}
              onSubmit={handleSubmit}
            />
          </div>

          <aside className="space-y-5">
            <CorporateBrainSuggestedActions onSelect={setPrompt} />

            <section className="overflow-hidden rounded-3xl border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-small)]">
              <div className="h-1 bg-[var(--brand-primary)]" />

              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.12em] text-[var(--brand-primary)]">
                      Knowledge Readiness
                    </p>

                    <h2 className="mt-2 text-base font-black text-[var(--text-primary)]">
                      {isArabic
                        ? "جاهزية العقل المؤسسي"
                        : "Corporate Brain Readiness"}
                    </h2>

                    <p className="mt-1 text-xs leading-6 text-[var(--text-muted)]">
                      {isArabic
                        ? "الحالة الحالية لطبقات المعرفة المؤسسية"
                        : "Current status of enterprise knowledge layers"}
                    </p>
                  </div>

                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--success-background)] text-[var(--success)]">
                    <ShieldCheck size={20} />
                  </span>
                </div>

                <div className="mt-5 flex items-end justify-between rounded-2xl border border-[var(--border-default)] bg-[var(--surface-muted)] px-4 py-3">
                  <div>
                    <p className="text-xs font-bold text-[var(--text-muted)]">
                      {isArabic
                        ? "الجاهزية الإجمالية"
                        : "Overall readiness"}
                    </p>

                    <p className="mt-1 text-2xl font-black text-[var(--text-primary)]">
                      {overallReadiness}%
                    </p>
                  </div>

                  <span className="rounded-full bg-[var(--success-background)] px-3 py-1.5 text-[11px] font-black text-[var(--success)]">
                    {isArabic ? "قيد التطوير" : "In progress"}
                  </span>
                </div>

                <div className="mt-5 space-y-5">
                  {readinessItems.map((item) => {
                    const Icon = item.icon;

                    return (
                      <div key={item.title}>
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <div className="flex min-w-0 items-center gap-2.5">
                            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--brand-subtle)] text-[var(--brand-primary)]">
                              <Icon size={15} />
                            </span>

                            <span className="truncate text-xs font-bold text-[var(--text-secondary)]">
                              {item.title}
                            </span>
                          </div>

                          <span className="shrink-0 text-xs font-black text-[var(--text-primary)]">
                            {item.value}%
                          </span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-[var(--surface-muted)]">
                          <div
                            className="h-full rounded-full bg-[var(--brand-primary)] transition-[width] duration-500"
                            style={{ width: `${item.value}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          </aside>
        </section>

        <CorporateBrainKnowledgePanel
          company={company}
          answers={answers}
        />

        <CorporateBrainDecisionPanel
          companyName={companyName}
          discoveryAnswerCount={answers.length}
        />

        <CorporateBrainMemory
          companyName={companyName}
          discoveryAnswerCount={answers.length}
        />

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(360px,0.8fr)]">
          <CorporateBrainKnowledgeGraph companyName={companyName} />

          <CorporateBrainRelatedInsights />
        </section>

        <CorporateBrainTimeline />
      </div>
    </main>
  );
}