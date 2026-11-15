"use client";

import { useEffect, useState } from "react";
import { useLocalization } from "@/components/localization/LocalizationContext";
import { getCurrentCompanyId } from "@/lib/companySession";
import { supabase } from "@/lib/supabase";
import { cleanGroundedAIText } from "@/lib/cleanGroundedAIText";
import type { Company, DiscoveryAnswer, AIResponse } from "@/components/corporate-brain/types";
import { useAppCopy } from "@/components/corporate-brain/useAppCopy";

import PageLoading from "@/components/corporate-brain/PageLoading";
import PageError from "@/components/corporate-brain/PageError";
import LiveInsight from "@/components/corporate-brain/LiveInsight";
import Layout from "@/components/corporate-brain/Layout";

export default function CorporateBrainPage() {
  const { locale } = useLocalization();
  const isArabic = locale === "ar";
  const aiPromptsCopy = useAppCopy(locale).aiPrompts;

  const [company, setCompany] = useState<Company | null>(null);
  const [answers, setAnswers] = useState<DiscoveryAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [aiInsight, setAIInsight] = useState("");
  const [aiLoading, setAILoading] = useState(false);
  const [aiError, setAIError] = useState("");
  const [aiCitations, setAICitations] = useState<Array<{ evidenceId: string; source: string; label: string }>>([]);

  const getExecutiveSummaryStorageKey = (companyId: string) => `corporate_brain_executive_summary:${companyId}:${locale}`;

  async function generateExecutiveInsight() {
    if (!company) return;
    setAILoading(true); setAIError(""); setAIInsight(""); setAICitations([]);

    try {
      const discoveryEvidence = answers.slice(0, 20).map((answer, index) => ({
        id: `DISCOVERY-${index + 1}`, source: "Corporate Discovery",
        label: String(answer.question ?? `Discovery Answer ${index + 1}`),
        value: String(answer.answer ?? ""),
      }));

      const evidence = [
        { id: "COMPANY-NAME", source: "Company Profile", label: "Company Name", value: String(company.name ?? "") },
        { id: "COMPANY-INDUSTRY", source: "Company Profile", label: "Industry", value: String(company.industry ?? "") },
        { id: "COMPANY-COUNTRY", source: "Company Profile", label: "Country", value: String(company.country ?? "") },
        { id: "COMPANY-EMPLOYEES", source: "Company Profile", label: "Employee Count", value: company.employee_count ?? null },
        ...discoveryEvidence,
      ];

      const response = await fetch("/api/ai/grounded", {
        method: "POST", credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: aiPromptsCopy.task, question: aiPromptsCopy.question, locale, evidence }),
      });

      const payload = (await response.json()) as AIResponse;
      if (!response.ok) throw new Error(payload.error ?? `Corporate Brain AI request failed with status ${response.status}.`);
      
      const text = payload.data?.text?.trim();
      const citations = payload.data?.citations ?? [];

      if (!text) throw new Error(isArabic ? "لم يتم إرجاع تحليل من طبقة الذكاء الاصطناعي." : "The AI intelligence layer returned no analysis.");

      const cleanedText = cleanGroundedAIText(text);
      setAICitations(citations);
      setAIInsight(cleanedText);

      sessionStorage.setItem(getExecutiveSummaryStorageKey(company.id), JSON.stringify({ text: cleanedText, citations }));
    } catch (error) {
      setAIError(error instanceof Error ? error.message : (isArabic ? "تعذر إنشاء التحليل التنفيذي المدعوم بالذكاء الاصطناعي." : "Unable to generate AI-powered executive intelligence."));
    } finally {
      setAILoading(false);
    }
  }

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      const companyId = getCurrentCompanyId();
      if (!companyId) {
        if (isMounted) { setMessage(isArabic ? "لم يتم العثور على بيانات المؤسسة. يرجى إكمال التقييم أولًا." : "Company data was not found. Please complete the assessment first."); setLoading(false); }
        return;
      }

      try {
        const [ { data: companyData, error: companyError }, { data: answersData, error: answersError } ] = await Promise.all([
          supabase.from("companies").select("id, name, industry, country, employee_count").eq("id", companyId).single(),
          supabase.from("discovery_answers").select("id, question, answer, question_order").eq("company_id", companyId).order("question_order", { ascending: true }),
        ]);

        if (companyError) throw new Error(isArabic ? `تعذر تحميل بيانات المؤسسة: ${companyError.message}` : `Failed to load company data: ${companyError.message}`);
        if (answersError) throw new Error(isArabic ? `تعذر تحميل بيانات الاستكشاف: ${answersError.message}` : `Failed to load discovery data: ${answersError.message}`);

        if (isMounted) {
          setCompany(companyData);
          setAnswers(answersData ?? []);

          if (companyData) {
            const savedSummary = sessionStorage.getItem(getExecutiveSummaryStorageKey(companyData.id));
            if (savedSummary) {
              try {
                const parsed = JSON.parse(savedSummary);
                setAIInsight(parsed.text ?? "");
                setAICitations(parsed.citations ?? []);
              } catch {
                sessionStorage.removeItem(getExecutiveSummaryStorageKey(companyData.id));
              }
            }
          }
        }
      } catch (error) {
        if (isMounted) {
          setMessage(error instanceof Error ? error.message : (isArabic ? "حدث خطأ غير متوقع أثناء تشغيل العقل المؤسسي." : "An unexpected error occurred while initializing Corporate Brain."));
          setCompany(null); setAnswers([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, [isArabic, locale]);

  if (loading) return <PageLoading />;
  if (message || !company) return <PageError message={message} />;

  return (
    <main className="bg-[var(--background)] pb-10" dir={isArabic ? "rtl" : "ltr"}>
      <LiveInsight 
        aiInsight={aiInsight} 
        aiLoading={aiLoading} 
        aiError={aiError} 
        aiCitations={aiCitations} 
        onGenerate={generateExecutiveInsight} 
      />
      <div className="pt-6">
        <Layout company={company} answers={answers} />
      </div>
    </main>
  );
}