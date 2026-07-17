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
  const [searchQuery, setSearchQuery] = useState("");

  const knowledgeSources = useMemo(
    () => [
      {
        id: "company",
        icon: Building2,
        title:
          locale === "ar"
            ? "بيانات المؤسسة"
            : "Company Profile",
        description:
          locale === "ar"
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
        title:
          locale === "ar"
            ? "ذكاء الاستكشاف"
            : "Discovery Intelligence",
        description:
          locale === "ar"
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
        title:
          locale === "ar"
            ? "السياسات والإجراءات"
            : "Policies & Procedures",
        description:
          locale === "ar"
            ? "المعرفة الداخلية المرتبطة بالسياسات والنماذج وإجراءات العمل."
            : "Internal policies, operating procedures, templates, and process knowledge.",
        sourceCount: 10,
        readiness: 45,
        status: "processing" as KnowledgeSourceStatus,
        searchableText:
          locale === "ar"
            ? "السياسات الإجراءات النماذج الموارد البشرية"
            : "policies procedures templates human resources",
      },
      {
        id: "regulatory",
        icon: Globe2,
        title:
          locale === "ar"
            ? "المعرفة التنظيمية"
            : "Regulatory Knowledge",
        description:
          locale === "ar"
            ? "الأنظمة واللوائح المرتبطة ببيئة عمل المؤسسة."
            : "Regulations and legal frameworks connected to the operating environment.",
        sourceCount: company.country ? 4 : 1,
        readiness:
          company.country === "Saudi Arabia" ? 70 : 50,
        status: "processing" as KnowledgeSourceStatus,
        searchableText: `${company.country ?? ""} regulations compliance labor`,
      },
      {
        id: "performance",
        icon: Database,
        title:
          locale === "ar"
            ? "بيانات الأداء"
            : "Performance Data",
        description:
          locale === "ar"
            ? "مؤشرات الأداء والنتائج التشغيلية والمالية والاستراتيجية للمؤسسة."
            : "Operational, financial, and strategic performance indicators.",
        sourceCount: 6,
        readiness: 62,
        status: "processing" as KnowledgeSourceStatus,
        searchableText:
          locale === "ar"
            ? "الأداء المؤشرات المالية التشغيلية الاستراتيجية"
            : "performance metrics financial operational",
      },
      {
        id: "graph",
        icon: Network,
        title:
          locale === "ar"
            ? "الرسم المعرفي"
            : "Knowledge Graph",
        description:
          locale === "ar"
            ? "الروابط بين المعرفة والقرارات والمخاطر والأهداف المؤسسية."
            : "Connections across knowledge, decisions, risks, and enterprise objectives.",
        sourceCount: 18,
        readiness: 62,
        status: "processing" as KnowledgeSourceStatus,
        searchableText:
          locale === "ar"
            ? "الرسم المعرفي العلاقات القرارات المخاطر الأهداف"
            : "knowledge graph relationships decisions risks",
      },
    ],
    [answers, company, locale],
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
    <section className="rounded-[28px] border border-[var(--border-default)] bg-[var(--surface)] p-5 shadow-[var(--shadow-small)] md:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3">
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--brand-subtle)] text-[var(--brand-primary)]">
            <FileText size={20} />
          </span>

          <div>
            <h2 className="text-lg font-black text-[var(--text-primary)]">
              {locale === "ar"
                ? "طبقة المعرفة المؤسسية"
                : "Enterprise Knowledge Layer"}
            </h2>

            <p className="mt-1 max-w-3xl text-xs leading-6 text-[var(--text-muted)]">
              {locale === "ar"
                ? "مصادر المعرفة التي يستخدمها Corporate Brain لفهم المؤسسة وإنتاج إجابات موثوقة."
                : "Knowledge sources used by Corporate Brain to understand the organization and generate grounded answers."}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-[var(--surface-muted)] px-3 py-2 text-[11px] font-black text-[var(--text-secondary)]">
            {totalSourceCount}{" "}
            {locale === "ar" ? "مصدرًا" : "Sources"}
          </span>

          <span className="rounded-full bg-[var(--success-background)] px-3 py-2 text-[11px] font-black text-[var(--success)]">
            {locale === "ar"
              ? "المعرفة متصلة"
              : "Knowledge Connected"}
          </span>
        </div>
      </div>

      <div className="mt-6">
        <CorporateBrainEnterpriseSearch
          value={searchQuery}
          onChange={setSearchQuery}
          resultCount={filteredSources.length}
        />
      </div>

      {filteredSources.length > 0 ? (
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
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
        <div className="mt-6 rounded-[22px] border border-dashed border-[var(--border-strong)] bg-[var(--surface-muted)] p-10 text-center">
          <FileSearch
            size={28}
            className="mx-auto text-[var(--text-muted)]"
          />

          <h3 className="mt-4 text-sm font-black text-[var(--text-primary)]">
            {locale === "ar"
              ? "لا توجد نتائج مطابقة"
              : "No matching knowledge found"}
          </h3>

          <p className="mt-2 text-xs text-[var(--text-muted)]">
            {locale === "ar"
              ? "جرّب استخدام مصطلح بحث مختلف."
              : "Try searching with a different term."}
          </p>
        </div>
      )}
    </section>
  );
}
