import { useEffect, useState } from "react";
import { getCurrentCompanyId } from "@/lib/companySession";
import { supabase } from "@/lib/supabase";
import {
  DiscoveryAnswer,
  ExecutiveSummaryCompany,
} from "@/types/executiveSummary";

export function useExecutiveSummary() {
  const [company, setCompany] = useState<ExecutiveSummaryCompany | null>(null);
  const [answers, setAnswers] = useState<DiscoveryAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadSummaryData() {
      const companyId = getCurrentCompanyId();

      if (!companyId) {
        setMessage("لم يتم العثور على بيانات الشركة. يرجى الرجوع إلى صفحة Assessment.");
        setLoading(false);
        return;
      }

      const { data: companyData, error: companyError } = await supabase
        .from("companies")
        .select("id, name, industry, country, employee_count, contact_name, contact_title")
        .eq("id", companyId)
        .single();

      if (companyError) {
        setMessage("حدث خطأ أثناء تحميل بيانات الشركة: " + companyError.message);
        setLoading(false);
        return;
      }

      const { data: answersData, error: answersError } = await supabase
        .from("discovery_answers")
        .select("id, question, answer, question_order")
        .eq("company_id", companyId)
        .order("question_order", { ascending: true });

      if (answersError) {
        setMessage("حدث خطأ أثناء تحميل إجابات الاستكشاف: " + answersError.message);
        setLoading(false);
        return;
      }

      setCompany(companyData);
      setAnswers(answersData || []);
      setLoading(false);
    }

    loadSummaryData();
  }, []);

  return {
    company,
    answers,
    loading,
    message,
  };
}