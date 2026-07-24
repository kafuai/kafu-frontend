"use client";

import {
  useEffect,
  useState,
} from "react";

import { useWorkspaceScope } from "@/hooks/useWorkspaceScope";
import { supabase } from "@/lib/supabase";
import {
  DiscoveryAnswer,
  ExecutiveSummaryCompany,
} from "@/types/executiveSummary";

export function useExecutiveSummary() {
  const {
    activeCompanyId,
    isLoading: isScopeLoading,
    error: scopeError,
  } = useWorkspaceScope();

  const [company, setCompany] =
    useState<ExecutiveSummaryCompany | null>(
      null,
    );

  const [answers, setAnswers] =
    useState<DiscoveryAnswer[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [message, setMessage] =
    useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadSummaryData() {
      if (isScopeLoading) {
        return;
      }

      setLoading(true);
      setMessage("");

      if (scopeError) {
        if (isMounted) {
          setCompany(null);
          setAnswers([]);
          setMessage(
            `تعذر التحقق من مساحة العمل: ${scopeError}`,
          );
          setLoading(false);
        }

        return;
      }

      if (!activeCompanyId) {
        if (isMounted) {
          setCompany(null);
          setAnswers([]);
          setMessage(
            "لم يتم اختيار شركة نشطة. اختر شركة من محدد مساحة العمل.",
          );
          setLoading(false);
        }

        return;
      }

      try {
        const [
          {
            data: companyData,
            error: companyError,
          },
          {
            data: answersData,
            error: answersError,
          },
        ] = await Promise.all([
          supabase
            .from("companies")
            .select(
              "id, name, industry, country, employee_count, contact_name, contact_title",
            )
            .eq("id", activeCompanyId)
            .single(),

          supabase
            .from("discovery_answers")
            .select(
              "id, question, answer, question_order",
            )
            .eq(
              "company_id",
              activeCompanyId,
            )
            .order(
              "question_order",
              {
                ascending: true,
              },
            ),
        ]);

        if (companyError) {
          throw new Error(
            companyError.message,
          );
        }

        if (answersError) {
          throw new Error(
            answersError.message,
          );
        }

        if (!isMounted) {
          return;
        }

        setCompany(companyData);
        setAnswers(
          answersData ?? [],
        );
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Unknown error";

        if (isMounted) {
          setCompany(null);
          setAnswers([]);
          setMessage(
            `تعذر تحميل الملخص التنفيذي: ${errorMessage}`,
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void loadSummaryData();

    return () => {
      isMounted = false;
    };
  }, [
    activeCompanyId,
    isScopeLoading,
    scopeError,
  ]);

  return {
    company,
    answers,
    loading:
      loading || isScopeLoading,
    message,
  };
}
