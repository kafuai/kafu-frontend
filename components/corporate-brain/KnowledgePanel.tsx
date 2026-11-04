"use client";

import { useMemo, useState } from "react";
import { BookOpenCheck, Building2, FileSearch, FileText } from "lucide-react";
import { useLocalization } from "@/components/localization/LocalizationContext";
import { useAppCopy } from "./useAppCopy";
import type { Company, DiscoveryAnswer, KnowledgeSourceStatus } from "./types";
import KnowledgeSourceCard from "./KnowledgeSourceCard";

interface KnowledgePanelProps {
  company: Company;
  answers: DiscoveryAnswer[];
}

export default function KnowledgePanel({ company, answers }: KnowledgePanelProps) {
  const { locale } = useLocalization();
  const copy = useAppCopy(locale).knowledgePanel;
  const [searchQuery, setSearchQuery] = useState("");

  const knowledgeSources = useMemo(() => [
    {
      id: "company", icon: Building2, title: copy.sources.companyTitle, description: copy.sources.companyDesc,
      sourceCount: company.name ? 1 : 0, readiness: company.name ? 100 : 0,
      status: (company.name ? "ready" : "missing") as KnowledgeSourceStatus,
      searchableText: `${company.name ?? ""} ${company.industry ?? ""} ${company.country ?? ""}`,
    },
    {
      id: "discovery", icon: FileSearch, title: copy.sources.discoveryTitle, description: copy.sources.discoveryDesc,
      sourceCount: answers.length, readiness: answers.length > 0 ? 100 : 0,
      status: (answers.length > 0 ? "ready" : "missing") as KnowledgeSourceStatus,
      searchableText: answers.map((item) => `${item.question} ${item.answer}`).join(" "),
    },
    {
      id: "policies", icon: BookOpenCheck, title: copy.sources.policiesTitle, description: copy.sources.policiesDesc,
      sourceCount: 0, readiness: 0, status: "missing" as KnowledgeSourceStatus, searchableText: copy.sources.searchTagsPolicies,
    },
  ], [answers, company, copy]);

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredSources = useMemo(() => {
    if (!normalizedQuery) return knowledgeSources;
    return knowledgeSources.filter((s) => `${s.title} ${s.description} ${s.searchableText}`.toLowerCase().includes(normalizedQuery));
  }, [knowledgeSources, normalizedQuery]);

  return (
    <section className="overflow-hidden rounded-3xl border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-small)]">
      <div className="border-b border-[var(--border-default)] px-5 py-5 md:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-subtle)] text-[var(--brand-primary)]">
              <FileText size={20} />
            </span>
            <div className="min-w-0">
              <h2 className="text-base font-black text-[var(--text-primary)] md:text-lg">{copy.title}</h2>
              <p className="mt-1 max-w-3xl text-xs leading-6 text-[var(--text-muted)]">{copy.desc}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="p-5 md:p-6">
        {filteredSources.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredSources.map((source) => (
              <KnowledgeSourceCard key={source.id} {...source} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[var(--border-strong)] bg-[var(--surface-muted)] px-6 py-10 text-center">
            <FileSearch size={28} className="mx-auto text-[var(--text-muted)]" />
            <h3 className="mt-4 text-sm font-black text-[var(--text-primary)]">{copy.emptyTitle}</h3>
            <p className="mt-2 text-xs text-[var(--text-muted)]">{copy.emptyDesc}</p>
          </div>
        )}
      </div>
    </section>
  );
}