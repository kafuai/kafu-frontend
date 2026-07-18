"use client";

import { useMemo, useState } from "react";
import {
  BookOpenCheck,
  Building2,
  Database,
  FileSearch,
  FileText,
  Globe2,
  Network,
} from "lucide-react";

import { useLocalization } from "@/components/localization/LocalizationContext";

import CorporateBrainEnterpriseSearch from "./CorporateBrainEnterpriseSearch";
import CorporateBrainKnowledgeSourceCard, {
  type KnowledgeSourceStatus,
} from "./CorporateBrainKnowledgeSourceCard";
import type {
  CorporateBrainCompany,
  CorporateBrainDiscoveryAnswer,
} from "./CorporateBrainLayout";

interface CorporateBrainKnowledgePanelProps {
  company: CorporateBrainCompany;
  answers: CorporateBrainDiscoveryAnswer[];
}

export default function CorporateBrainKnowledgePanel({
  company,
  answers,
}: CorporateBrainKnowledgePanelProps) {
  const { locale } = useLocalization();
  const isArabic = locale === "ar";
  const [searchQuery, setSearchQuery] = useState("");

  const knowledgeSources = useMemo(
    () => [
      {
        id: "company",
        icon: Building2,
        title: isArabic ? "بيانات المؤسسة" : "Company Profile",
        description: isArabic
          ? "بيانات الشركة الأساسية والقطاع والدولة وحجم القوى العاملة."
          : "Core company details, industry, country, and workforce size.",
        sourceCount: 4,
        readiness: 100,
        status: "ready" as KnowledgeSourceStatus,
        searchableText: `${company.name ?? ""} ${company.industry ?? ""} ${company.country ?? ""}`,
      },
      {
        id: "discovery",
        icon: FileSearch,
        title: isArabic ? "ذكاء الاستكشاف" : "Discovery Intelligence",
        description: isArabic
          ? "إجابات التقييم والاستكشاف والأولويات التنفيذية المكتشفة."
          : "Assessment responses, discovery answers, and identified executive priorities.",
        sourceCount: answers.length,
        readiness: answers.length > 0 ? 85 : 30,
        status:
          answers.length > 0
            ? ("ready" as KnowledgeSourceStatus)
            : ("missing" as KnowledgeSourceStatus),
        searchableText: answers
          .map((item) => `${item.question} ${item.answer}`)
          .join(" "),
      },
      {
        id: "policies",
        icon: BookOpenCheck,
        title: isArabic ? "السياسات والإجراءات" : "Policies & Procedures",
        description: isArabic
          ? "المعرفة الداخلية المرتبطة بالسياسات والنماذج وإجراءات العمل."
          : "Internal policies, operating procedures, templates, and process knowledge.",
        sourceCount: 10,
        readiness: 45,
        status: "processing" as KnowledgeSourceStatus,
        searchableText: isArabic
          ? "السياسات الإجراءات النماذج الموارد البشرية"
          : "policies procedures templates human resources",
      },
      {
        id: "regulatory",
        icon: Globe2,
        title: isArabic ? "المعرفة التنظيمية" : "Regulatory Knowledge",
        description: isArabic
          ? "الأنظمة واللوائح المرتبطة ببيئة عمل المؤسسة."
          : "Regulations and legal frameworks connected to the operating environment.",
        sourceCount: company.country ? 4 : 1,
        readiness: company.country === "Saudi Arabia" ? 70 : 50,
        status: "processing" as KnowledgeSourceStatus,
        searchableText: `${company.country ?? ""} regulations compliance labor`,
      },
      {
        id: "performance",
        icon: Database,
        title: isArabic ? "بيانات الأداء" : "Performance Data",
        description: isArabic
          ? "مؤشرات الأداء والنتائج التشغيلية والمالية والاستراتيجية للمؤسسة."
          : "Operational, financial, and strategic performance indicators.",
        sourceCount: 6,
        readiness: 62,
        status: "processing" as KnowledgeSourceStatus,
        searchableText: isArabic
          ? "الأداء المؤشرات المالية التشغيلية الاستراتيجية"
          : "performance metrics financial operational",
      },
      {
        id: "graph",
        icon: Network,
        title: isArabic ? "الرسم المعرفي" : "Knowledge Graph",
        description: isArabic
          ? "الروابط بين المعرفة والقرارات والمخاطر والأهداف المؤسسية."
          : "Connections across knowledge, decisions, risks, and enterprise objectives.",
        sourceCount: 18,
        readiness: 62,
        status: "processing" as KnowledgeSourceStatus,
        searchableText: isArabic
          ? "الرسم المعرفي العلاقات القرارات المخاطر الأهداف"
          : "knowledge graph relationships decisions risks",
      },
    ],
    [answers, company, isArabic],
  );

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredSources = useMemo(() => {
    if (!normalizedQuery) {
      return knowledgeSources;
    }

    return knowledgeSources.filter((source) =>
      `${source.title} ${source.description} ${source.searchableText}`
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [knowledgeSources, normalizedQuery]);

  const totalSourceCount = knowledgeSources.reduce(
    (total, source) => total + source.sourceCount,
    0,
  );

  return (
    <section className="overflow-hidden rounded-3xl border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-small)]">
      <div className="border-b border-[var(--border-default)] px-5 py-5 md:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-subtle)] text-[var(--brand-primary)]">
              <FileText size={20} />
            </span>

            <div className="min-w-0">
              <h2 className="text-base font-black text-[var(--text-primary)] md:text-lg">
                {isArabic
                  ? "طبقة المعرفة المؤسسية"
                  : "Enterprise Knowledge Layer"}
              </h2>

              <p className="mt-1 max-w-3xl text-xs leading-6 text-[var(--text-muted)]">
                {isArabic
                  ? "مصادر المعرفة التي يستخدمها Corporate Brain لفهم المؤسسة وإنتاج إجابات موثوقة."
                  : "Knowledge sources used by Corporate Brain to understand the organization and generate grounded answers."}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap gap-2">
            <span className="rounded-full border border-[var(--border-default)] bg-[var(--surface-muted)] px-3 py-1.5 text-[11px] font-black text-[var(--text-secondary)]">
              {totalSourceCount} {isArabic ? "مصدرًا" : "Sources"}
            </span>

            <span className="rounded-full border border-[var(--success)]/20 bg-[var(--success-background)] px-3 py-1.5 text-[11px] font-black text-[var(--success)]">
              {isArabic ? "المعرفة متصلة" : "Knowledge Connected"}
            </span>
          </div>
        </div>

        <div className="mt-5">
          <CorporateBrainEnterpriseSearch
            value={searchQuery}
            onChange={setSearchQuery}
            resultCount={filteredSources.length}
          />
        </div>
      </div>

      <div className="p-5 md:p-6">
        {filteredSources.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredSources.map((source) => (
              <CorporateBrainKnowledgeSourceCard
                key={source.id}
                icon={source.icon}
                title={source.title}
                description={source.description}
                sourceCount={source.sourceCount}
                readiness={source.readiness}
                status={source.status}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[var(--border-strong)] bg-[var(--surface-muted)] px-6 py-10 text-center">
            <FileSearch
              size={28}
              className="mx-auto text-[var(--text-muted)]"
            />

            <h3 className="mt-4 text-sm font-black text-[var(--text-primary)]">
              {isArabic
                ? "لا توجد نتائج مطابقة"
                : "No matching knowledge found"}
            </h3>

            <p className="mt-2 text-xs text-[var(--text-muted)]">
              {isArabic
                ? "جرّب استخدام مصطلح بحث مختلف."
                : "Try searching with a different term."}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}