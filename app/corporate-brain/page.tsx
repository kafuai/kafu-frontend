"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  AlertTriangle,
  BrainCircuit,
  Building2,
  RefreshCw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import {
  CorporateBrainLayout,
  type CorporateBrainCompany,
  type CorporateBrainDiscoveryAnswer,
} from "@/components/corporate-brain";

import {
  useLocalization,
} from "@/components/localization/LocalizationContext";

import {
  getCurrentCompanyId,
} from "@/lib/companySession";

import {
  supabase,
} from "@/lib/supabase";
import { cleanGroundedAIText } from "@/lib/cleanGroundedAIText";

interface CorporateBrainAIResponse {
  data?: {
    text?: string;
    provider?: string;
    model?: string;
    evidenceCount?: number;

    citations?: Array<{
      evidenceId: string;
      source: string;
      label: string;
    }>;
  };

  error?: string;
  code?: string;
}

export default function CorporateBrainPage() {
  const {
    locale,
  } = useLocalization();

  const isArabic =
    locale === "ar";

  const [
    company,
    setCompany,
  ] =
    useState<
      CorporateBrainCompany | null
    >(null);

  const [
    answers,
    setAnswers,
  ] =
    useState<
      CorporateBrainDiscoveryAnswer[]
    >([]);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    message,
    setMessage,
  ] =
    useState("");

  const [
    aiInsight,
    setAIInsight,
  ] =
    useState("");

  const [
    aiLoading,
    setAILoading,
  ] =
    useState(false);

  const [
    aiError,
    setAIError,
  ] =
    useState("");

  const [
    aiCitations,
    setAICitations,
  ] =
    useState<
      Array<{
        evidenceId: string;
        source: string;
        label: string;
      }>
    >([]);



  useEffect(() => {
    let isMounted = true;

    async function generateCorporateBrainInsight(
      companyData:
        CorporateBrainCompany,

      answersData:
        CorporateBrainDiscoveryAnswer[],
    ) {
      if (isMounted) {
        setAILoading(true);
        setAIError("");
        setAIInsight("");
        setAICitations([]);
      }

      try {
        const discoveryEvidence =
          answersData
            .slice(0, 20)
            .map(
              (
                answer,
                index,
              ) => ({
                id:
                  `DISCOVERY-${index + 1}`,

                source:
                  "Corporate Discovery",

                label:
                  String(
                    answer.question
                    ?? `Discovery Answer ${index + 1}`,
                  ),

                value:
                  String(
                    answer.answer
                    ?? "",
                  ),
              }),
            );

        const evidence = [
          {
            id:
              "COMPANY-NAME",

            source:
              "Company Profile",

            label:
              "Company Name",

            value:
              String(
                companyData.name
                ?? "",
              ),
          },

          {
            id:
              "COMPANY-INDUSTRY",

            source:
              "Company Profile",

            label:
              "Industry",

            value:
              String(
                companyData.industry
                ?? "",
              ),
          },

          {
            id:
              "COMPANY-COUNTRY",

            source:
              "Company Profile",

            label:
              "Country",

            value:
              String(
                companyData.country
                ?? "",
              ),
          },

          {
            id:
              "COMPANY-EMPLOYEES",

            source:
              "Company Profile",

            label:
              "Employee Count",

            value:
              companyData.employee_count
              ?? null,
          },

          ...discoveryEvidence,
        ];

        const response =
          await fetch(
            "/api/ai/grounded",
            {
              method:
                "POST",

              credentials:
                "same-origin",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify({
                  task:
                    isArabic
                      ? "قدّم ملخصًا تنفيذيًا موجزًا عن المؤسسة بالاعتماد حصريًا على الأدلة المتاحة، وحدد أهم الأولويات أو المخاطر أو الفرص التي تستحق انتباه الإدارة."
                      : "Provide a concise executive intelligence summary of the company using only the supplied evidence. Identify the most important priorities, risks, or opportunities that deserve management attention.",

                  question:
                    isArabic
                      ? "ما أهم ما يجب على الإدارة معرفته واتخاذ قرار بشأنه الآن؟"
                      : "What should management understand and act on now?",

                  locale,

                  evidence,
                }),
            },
          );

        const payload =
          (await response.json()) as CorporateBrainAIResponse;

        if (!response.ok) {
          throw new Error(
            payload.error
            ?? `Corporate Brain AI request failed with status ${response.status}.`,
          );
        }

        const text =
          payload.data?.text?.trim();

        const citations =
          payload.data?.citations
          ?? [];

        if (!text) {
          throw new Error(
            isArabic
              ? "لم يتم إرجاع تحليل من طبقة الذكاء الاصطناعي."
              : "The AI intelligence layer returned no analysis.",
          );
        }

        if (isMounted) {
          setAICitations(
            citations,
          );

          setAIInsight(
            cleanGroundedAIText(text),
          );
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : isArabic
              ? "تعذر إنشاء التحليل التنفيذي المدعوم بالذكاء الاصطناعي."
              : "Unable to generate AI-powered executive intelligence.";

        if (isMounted) {
          setAIError(
            errorMessage,
          );
        }
      } finally {
        if (isMounted) {
          setAILoading(
            false,
          );
        }
      }
    }

    async function loadCorporateBrain() {
      if (isMounted) {
        setLoading(true);
        setMessage("");
        setAIInsight("");
        setAIError("");
        setAICitations([]);
      }

      const companyId =
        getCurrentCompanyId();

      if (!companyId) {
        if (isMounted) {
          setMessage(
            isArabic
              ? "لم يتم العثور على بيانات المؤسسة. يرجى إكمال التقييم أولًا."
              : "Company data was not found. Please complete the assessment first.",
          );

          setLoading(false);
        }

        return;
      }

      try {
        const [
          {
            data:
              companyData,

            error:
              companyError,
          },

          {
            data:
              answersData,

            error:
              answersError,
          },
        ] =
          await Promise.all([
            supabase
              .from(
                "companies",
              )
              .select(
                "id, name, industry, country, employee_count",
              )
              .eq(
                "id",
                companyId,
              )
              .single(),

            supabase
              .from(
                "discovery_answers",
              )
              .select(
                "id, question, answer, question_order",
              )
              .eq(
                "company_id",
                companyId,
              )
              .order(
                "question_order",
                {
                  ascending:
                    true,
                },
              ),
          ]);

        if (companyError) {
          throw new Error(
            isArabic
              ? `تعذر تحميل بيانات المؤسسة: ${companyError.message}`
              : `Failed to load company data: ${companyError.message}`,
          );
        }

        if (answersError) {
          throw new Error(
            isArabic
              ? `تعذر تحميل بيانات الاستكشاف: ${answersError.message}`
              : `Failed to load discovery data: ${answersError.message}`,
          );
        }

        const normalizedAnswers =
          answersData
          ?? [];

        if (isMounted) {
          setCompany(
            companyData,
          );

          setAnswers(
            normalizedAnswers,
          );

          setLoading(
            false,
          );
        }

        if (
          companyData
          && isMounted
        ) {
          await generateCorporateBrainInsight(
            companyData,
            normalizedAnswers,
          );
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : isArabic
              ? "حدث خطأ غير متوقع أثناء تشغيل العقل المؤسسي."
              : "An unexpected error occurred while initializing Corporate Brain.";

        if (isMounted) {
          setMessage(
            errorMessage,
          );

          setCompany(
            null,
          );

          setAnswers(
            [],
          );

          setAIInsight(
            "",
          );

          setAICitations(
            [],
          );

          setAIError(
            "",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(
            false,
          );
        }
      }
    }

    void loadCorporateBrain();

    return () => {
      isMounted = false;
    };
  }, [
    isArabic,
    locale,
  ]);

  if (loading) {
    return (
      <main
        className="flex min-h-[calc(100vh-76px)] items-center justify-center bg-[var(--background)] px-5 py-10 md:px-8"
        dir={
          isArabic
            ? "rtl"
            : "ltr"
        }
      >
        <section
          className="relative w-full max-w-md overflow-hidden rounded-[22px] border border-[var(--border-default)] bg-[var(--surface)] px-8 py-10 text-center shadow-[var(--shadow-medium)]"
          role="status"
          aria-live="polite"
        >
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-1 bg-[var(--brand-primary)]"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -start-20 -top-20 h-52 w-52 rounded-full bg-[color-mix(in_srgb,var(--brand-primary)_6%,transparent)]"
          />

          <div className="relative">
            <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-[color-mix(in_srgb,var(--brand-primary)_16%,var(--border-default))] bg-[var(--brand-subtle)] text-[var(--brand-primary)] shadow-[var(--shadow-small)]">
              <RefreshCw
                aria-hidden="true"
                className="animate-spin"
                size={25}
              />
            </span>

            <p className="mt-5 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[var(--brand-primary)]">
              Corporate Brain
            </p>

            <h1 className="mt-2 text-2xl font-extrabold tracking-[-0.03em] text-[var(--text-primary)]">
              {isArabic
                ? "جاري تشغيل العقل المؤسسي"
                : "Initializing Corporate Brain"}
            </h1>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-[var(--text-secondary)]">
              {isArabic
                ? "يتم تحميل بيانات المؤسسة ومصادر المعرفة وإشارات الاستكشاف."
                : "Loading company context, enterprise knowledge, and discovery signals."}
            </p>

            <div className="mt-7 flex items-center justify-center gap-2 text-xs font-bold text-[var(--text-muted)]">
              <BrainCircuit
                size={15}
              />

              <span>
                {isArabic
                  ? "تجهيز طبقة الذكاء التنفيذي"
                  : "Preparing executive intelligence layer"}
              </span>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (
    message
    || !company
  ) {
    return (
      <main
        className="flex min-h-[calc(100vh-76px)] items-center justify-center bg-[var(--background)] px-5 py-10 md:px-8"
        dir={
          isArabic
            ? "rtl"
            : "ltr"
        }
      >
        <section
          className="relative w-full max-w-xl overflow-hidden rounded-[22px] border border-[var(--border-default)] bg-[var(--surface)] px-8 py-10 text-center shadow-[var(--shadow-medium)] md:px-10"
          role="alert"
        >
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-1 bg-[var(--warning)]"
          />

          <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--warning-background)] text-[var(--warning)]">
            <AlertTriangle
              size={26}
            />
          </span>

          <p className="mt-5 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[var(--brand-primary)]">
            Corporate Brain
          </p>

          <h1 className="mt-2 text-2xl font-extrabold tracking-[-0.03em] text-[var(--text-primary)]">
            {isArabic
              ? "تعذر تشغيل العقل المؤسسي"
              : "Corporate Brain unavailable"}
          </h1>

          <p className="mx-auto mt-4 max-w-lg break-words text-sm leading-7 text-[var(--text-secondary)]">
            {message
              || (
                isArabic
                  ? "لم يتم العثور على بيانات المؤسسة المطلوبة."
                  : "Required company data was not found."
              )}
          </p>

          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/assessment"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[var(--brand-primary)] px-6 text-sm font-extrabold text-white shadow-[var(--shadow-small)] transition hover:-translate-y-0.5 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2"
            >
              <Building2
                aria-hidden="true"
                size={17}
              />

              {isArabic
                ? "العودة إلى التقييم"
                : "Go to assessment"}
            </Link>

            <Link
              href="/company-workspace"
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[var(--border-default)] bg-[var(--surface)] px-6 text-sm font-extrabold text-[var(--text-secondary)] transition hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2"
            >
              {isArabic
                ? "فتح مساحة العمل"
                : "Open company workspace"}
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main
      className="bg-[var(--background)]"
      dir={
        isArabic
          ? "rtl"
          : "ltr"
      }
    >
      <section className="mx-auto w-full max-w-[1500px] px-5 pt-6 md:px-8">
        <div className="relative overflow-hidden rounded-[20px] border border-[var(--border-default)] bg-[var(--surface)] px-6 py-5 shadow-[var(--shadow-small)]">
          <div
            aria-hidden="true"
            className="absolute inset-y-0 start-0 w-1 bg-[var(--brand-primary)]"
          />

          <div className="flex items-start gap-4">
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-subtle)] text-[var(--brand-primary)]">
              {aiLoading
                ? (
                  <RefreshCw
                    className="animate-spin"
                    size={20}
                  />
                )
                : (
                  <Sparkles
                    size={20}
                  />
                )}
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-extrabold text-[var(--text-primary)]">
                  {isArabic
                    ? "KAFU AI — التحليل التنفيذي المباشر"
                    : "KAFU AI — Live Executive Intelligence"}
                </p>

                {!aiLoading
                  && aiInsight
                  ? (
                    <span className="rounded-full bg-[var(--success-background)] px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.08em] text-[var(--success)]">
                      {isArabic
                        ? "مباشر"
                        : "LIVE"}
                    </span>
                  )
                  : null}
              </div>

              {aiLoading
                ? (
                  <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
                    {isArabic
                      ? "يتم تحليل أدلة المؤسسة من خلال طبقة KAFU Grounded AI..."
                      : "Analyzing enterprise evidence through the KAFU Grounded AI layer..."}
                  </p>
                )
                : aiInsight
                  ? (
                    <div className="mt-2">
                      <p className="whitespace-pre-line text-sm leading-7 text-[var(--text-secondary)]">
                        {aiInsight}
                      </p>

                      {aiCitations.length > 0 ? (
                    <div className="mt-4">
                      <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.1em] text-[var(--text-muted)]">
                        {isArabic
                          ? "المصادر والأدلة"
                          : "Sources & Evidence"}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {aiCitations.map((citation) => (
                          <span
                            key={citation.evidenceId}
                            title={citation.label}
                            className="inline-flex items-center gap-2 rounded-full border border-[var(--border-default)] bg-[var(--surface)] px-3 py-1.5 text-[10px] font-bold text-[var(--text-secondary)]"
                          >
                            <ShieldCheck
                              aria-hidden="true"
                              size={13}
                              className="shrink-0 text-[var(--success)]"
                            />

                            <span>
                              {citation.source}
                            </span>
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}
                    </div>
                  )
                  : (
                    <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
                      {aiError
                        || (
                          isArabic
                            ? "تعذر إنشاء التحليل التنفيذي المباشر حاليًا."
                            : "Live executive intelligence is temporarily unavailable."
                        )}
                    </p>
                  )}
            </div>
          </div>
        </div>
      </section>

      <CorporateBrainLayout
        company={
          company
        }
        answers={
          answers
        }
      />
    </main>
  );
}