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

  const [prompt, setPrompt] = useState("");
  const [submittedPrompt, setSubmittedPrompt] =
    useState("");

  const companyName =
    company.name ||
    (locale === "ar"
      ? "المؤسسة"
      : "The organization");

  const knowledgeSources = 3 + answers.length;

  function handleSubmit() {
    const normalizedPrompt = prompt.trim();

    if (!normalizedPrompt) {
      return;
    }

    setSubmittedPrompt(normalizedPrompt);
    setPrompt("");
  }

  const readinessItems = [
    {
      icon: Database,
      title:
        locale === "ar"
          ? "بيانات المؤسسة"
          : "Company Data",
      value: "100%",
    },
    {
      icon: FileText,
      title:
        locale === "ar"
          ? "بيانات الاستكشاف"
          : "Discovery Intelligence",
      value: answers.length > 0 ? "85%" : "30%",
    },
    {
      icon: BookOpenCheck,
      title:
        locale === "ar"
          ? "السياسات الداخلية"
          : "Internal Policies",
      value: "45%",
    },
    {
      icon: Network,
      title:
        locale === "ar"
          ? "الرسم المعرفي"
          : "Knowledge Graph",
      value: "62%",
    },
  ];

  return (
    <div className="min-h-[calc(100vh-76px)] bg-[var(--background)] px-5 py-7 md:px-8 lg:px-10">
      <div className="mx-auto max-w-[1580px] space-y-6">
        <CorporateBrainHero
          companyName={companyName}
          knowledgeSources={knowledgeSources}
          discoveryAnswers={answers.length}
        />

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-5">
            <CorporateBrainConversation
              companyName={companyName}
              userPrompt={submittedPrompt}
            />

            <CorporateBrainPromptComposer
              value={prompt}
              onChange={setPrompt}
              onSubmit={handleSubmit}
            />
          </div>

          <aside className="space-y-5">
            <CorporateBrainSuggestedActions
              onSelect={setPrompt}
            />

            <section className="rounded-[24px] border border-[var(--border-default)] bg-[var(--surface)] p-5 shadow-[var(--shadow-small)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-black text-[var(--text-primary)]">
                    {locale === "ar"
                      ? "جاهزية العقل المؤسسي"
                      : "Corporate Brain Readiness"}
                  </h2>

                  <p className="mt-1 text-xs text-[var(--text-muted)]">
                    {locale === "ar"
                      ? "حالة طبقات المعرفة الحالية"
                      : "Current knowledge layer status"}
                  </p>
                </div>

                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--success-background)] text-[var(--success)]">
                  <ShieldCheck size={19} />
                </span>
              </div>

              <div className="mt-5 space-y-5">
                {readinessItems.map((item) => {
                  const Icon = item.icon;
                  const numericValue = Number.parseInt(
                    item.value,
                    10,
                  );

                  return (
                    <div key={item.title}>
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <Icon
                            size={15}
                            className="text-[var(--brand-primary)]"
                          />

                          <span className="text-xs font-bold text-[var(--text-secondary)]">
                            {item.title}
                          </span>
                        </div>

                        <span className="text-xs font-black text-[var(--text-primary)]">
                          {item.value}
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-[var(--surface-muted)]">
                        <div
                          className="h-full rounded-full bg-[var(--brand-primary)]"
                          style={{
                            width: `${numericValue}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </aside>
        </div>

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

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(360px,0.8fr)]">
          <CorporateBrainKnowledgeGraph
            companyName={companyName}
          />

          <CorporateBrainRelatedInsights />
        </div>

        <CorporateBrainTimeline />
      </div>
    </div>
  );
}