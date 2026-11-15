"use client";

import { useState } from "react";
import { BookOpenCheck, Database, FileText, Network, ShieldCheck } from "lucide-react";
import { useLocalization } from "@/components/localization/LocalizationContext";
import { useAppCopy } from "./useAppCopy";
import type { Company, DiscoveryAnswer } from "./types";

import Conversation from "./Conversation";
import Hero from "./Hero";
import KnowledgeGraph from "./KnowledgeGraph";
import KnowledgePanel from "./KnowledgePanel";
import Memory from "./Memory";
import PromptComposer from "./PromptComposer";
import SuggestedActions from "./SuggestedActions";

interface LayoutProps {
  company: Company;
  answers: DiscoveryAnswer[];
}

export default function Layout({ company, answers }: LayoutProps) {
  const { locale } = useLocalization();
  const copy = useAppCopy(locale, company.name || "").layout;
  const companyName = company.name || "The organization";

  const [prompt, setPrompt] = useState("");
  const [submittedPrompt, setSubmittedPrompt] = useState("");
  const [aiResponse, setAIResponse] = useState("");
  const [aiLoading, setAILoading] = useState(false);
  const [aiError, setAIError] = useState("");

  const knowledgeSources = 3 + answers.length;

  async function handleSubmit() {
    const normalizedPrompt = prompt.trim();
    if (!normalizedPrompt || aiLoading) return;

    setSubmittedPrompt(normalizedPrompt);
    setPrompt("");
    setAIResponse("");
    setAIError("");
    setAILoading(true);

    try {
      const discoveryEvidence = answers.slice(0, 20).map((answer, index) => ({
        id: `DISCOVERY-${index + 1}`, source: "Corporate Discovery",
        label: answer.question || `Discovery Answer ${index + 1}`, value: answer.answer || "",
      }));
      const evidence = [
        { id: "COMPANY-NAME", source: "Company Profile", label: "Company Name", value: company.name ?? "" },
        { id: "COMPANY-INDUSTRY", source: "Company Profile", label: "Industry", value: company.industry ?? "" },
        { id: "COMPANY-COUNTRY", source: "Company Profile", label: "Country", value: company.country ?? "" },
        { id: "COMPANY-EMPLOYEES", source: "Company Profile", label: "Employee Count", value: company.employee_count ?? null },
        ...discoveryEvidence,
      ];

      const response = await fetch("/api/ai/grounded", {
        method: "POST", credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: copy.aiTask, question: normalizedPrompt, locale, evidence }),
      });

      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || `Request failed with status ${response.status}.`);

      const text = payload.data?.text?.trim();
      if (!text) throw new Error("The AI intelligence layer returned no answer.");
      setAIResponse(text);
    } catch (error) {
      setAIError(error instanceof Error ? error.message : "An error occurred while analyzing the question.");
    } finally {
      setAILoading(false);
    }
  }

  const readinessItems = [
    { icon: Database, title: copy.items.companyData, value: 100 },
    { icon: FileText, title: copy.items.discovery, value: answers.length > 0 ? 85 : 30 },
    { icon: BookOpenCheck, title: copy.items.policies, value: 45 },
    { icon: Network, title: copy.items.graph, value: 62 },
  ];
  const overallReadiness = Math.round(readinessItems.reduce((total, item) => total + item.value, 0) / readinessItems.length);

  return (
    <div className="mx-auto max-w-[1580px] space-y-6">
      <Hero companyName={companyName} knowledgeSources={knowledgeSources} discoveryAnswers={answers.length} />
      
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 space-y-5">
          <Conversation companyName={companyName} userPrompt={submittedPrompt} aiResponse={aiResponse} aiLoading={aiLoading} aiError={aiError} />
          <PromptComposer value={prompt} onChange={setPrompt} onSubmit={handleSubmit} />
        </div>
        
        <aside className="space-y-5">
          <SuggestedActions onSelect={setPrompt} />
          <section className="overflow-hidden rounded-3xl border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-small)]">
            <div className="h-1 bg-[var(--brand-primary)]" />
            <div className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.12em] text-[var(--brand-primary)]">Knowledge Readiness</p>
                  <h2 className="mt-2 text-base font-black text-[var(--text-primary)]">{copy.readinessTitle}</h2>
                  <p className="mt-1 text-xs leading-6 text-[var(--text-muted)]">{copy.readinessDesc}</p>
                </div>
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--success-background)] text-[var(--success)]">
                  <ShieldCheck size={20} />
                </span>
              </div>
              <div className="mt-5 flex items-end justify-between rounded-2xl border border-[var(--border-default)] bg-[var(--surface-muted)] px-4 py-3">
                <div>
                  <p className="text-xs font-bold text-[var(--text-muted)]">{copy.overall}</p>
                  <p className="mt-1 text-2xl font-black text-[var(--text-primary)]">{overallReadiness}%</p>
                </div>
                <span className="rounded-full bg-[var(--success-background)] px-3 py-1.5 text-[11px] font-black text-[var(--success)]">{copy.inProgress}</span>
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
                          <span className="truncate text-xs font-bold text-[var(--text-secondary)]">{item.title}</span>
                        </div>
                        <span className="shrink-0 text-xs font-black text-[var(--text-primary)]">{item.value}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-[var(--surface-muted)]">
                        <div className="h-full rounded-full bg-[var(--brand-primary)] transition-[width] duration-500" style={{ width: `${item.value}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </aside>
      </section>

      <KnowledgePanel company={company} answers={answers} />
      <Memory companyName={companyName} discoveryAnswerCount={answers.length} />
      <section className="grid gap-6">
        <KnowledgeGraph companyName={companyName} />
      </section>
    </div>
  );
}