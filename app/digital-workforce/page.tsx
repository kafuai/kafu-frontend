"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getCurrentCompanyId } from "@/lib/companySession";
import { useLocalization } from "@/components/localization/LocalizationContext";

import { Company, DiscoveryAnswer } from "@/components/digetal-workforce/types";
import { useAppCopy } from "@/components/digetal-workforce/useAppCopy";
import HeroSection from "@/components/digetal-workforce/HeroSection";
import { LoadingView, ErrorView } from "@/components/digetal-workforce/StatusViews";
import ImpactCardsSection from "@/components/digetal-workforce/ImpactCardsSection";
import StrategySection from "@/components/digetal-workforce/StrategySection";
import DigitalAgentsSection from "@/components/digetal-workforce/DigitalAgentsSection";
import OperatingModelSection from "@/components/digetal-workforce/OperatingModelSection";

export default function DigitalWorkforcePage() {
  const { locale } = useLocalization();
  const isArabic = locale === "ar";

  const [company, setCompany] = useState<Company | null>(null);
  const [answers, setAnswers] = useState<DiscoveryAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const { copy, impactCards, team, roadmap } = useAppCopy(isArabic, company, answers);

  useEffect(() => {
    async function loadDigitalWorkforce() {
      const companyId = getCurrentCompanyId();

      if (!companyId) {
        setMessage(copy.errNoCompany);
        setLoading(false);
        return;
      }

      const { data: companyData, error: companyError } = await supabase
        .from("companies")
        .select("id, name, industry, country, employee_count")
        .eq("id", companyId)
        .single();

      if (companyError) {
        setMessage(`${copy.errCompanyLoad} ${companyError.message}`);
        setLoading(false);
        return;
      }

      const { data: answersData, error: answersError } = await supabase
        .from("discovery_answers")
        .select("id, question, answer, question_order")
        .eq("company_id", companyId)
        .order("question_order", { ascending: true });

      if (answersError) {
        setMessage(`${copy.errAnswersLoad} ${answersError.message}`);
        setLoading(false);
        return;
      }

      setCompany(companyData);
      setAnswers(answersData || []);
      setLoading(false);
    }

    loadDigitalWorkforce();
  }, [isArabic, copy.errNoCompany, copy.errCompanyLoad, copy.errAnswersLoad]);

  return (
    <main
      className="min-h-[calc(100vh-64px)] bg-[var(--background)] px-4 py-5 text-[var(--text-primary)] sm:px-6 lg:px-8"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div className="mx-auto max-w-[1540px]">
        <HeroSection isArabic={isArabic} />

        {loading && <LoadingView isArabic={isArabic} />}

        {!loading && message && <ErrorView isArabic={isArabic} message={message} />}

        {!loading && !message && (
          <>
            <ImpactCardsSection impactCards={impactCards} />
            <StrategySection isArabic={isArabic} companyName={company?.name || (isArabic ? "هذه المؤسسة" : "this company")} roadmap={roadmap} />
            <DigitalAgentsSection isArabic={isArabic} team={team} />
            <OperatingModelSection isArabic={isArabic} />
          </>
        )}
      </div>
    </main>
  );
}