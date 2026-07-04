"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

import CompanyHero from "@/components/workspace/hero/CompanyHero";
import WorkspaceActions from "@/components/workspace/actions/WorkspaceActions";
import AIHealthWidget from "@/components/workspace/widgets/AIHealthWidget";
import ExecutiveProgress from "@/components/workspace/dashboard/ExecutiveProgress";
import ExecutiveKPIs from "@/components/workspace/dashboard/ExecutiveKPI";
import Notifications from "@/components/workspace/dashboard/Notifications";
import UpcomingTasks from "@/components/workspace/dashboard/UpcomingTasks";

type Company = {
  id: string;
  name: string | null;
  industry: string | null;
  country: string | null;
  employee_count: number | null;
};

export default function CompanyWorkspacePage() {
  const [company, setCompany] = useState<Company | null>(null);
  const [completedAnswers, setCompletedAnswers] = useState(0);
  const [loading, setLoading] = useState(true);

  const totalQuestions = 44;
  const aiHealthScore = Math.round((completedAnswers / totalQuestions) * 100);

  useEffect(() => {
    loadWorkspace();
  }, []);

  async function loadWorkspace() {
    const { data: companyData } = await supabase
      .from("companies")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (companyData) {
      setCompany(companyData);
    }

    const { count } = await supabase
      .from("discovery_answers")
      .select("*", { count: "exact", head: true });

    setCompletedAnswers(count || 0);
    setLoading(false);
  }

  if (loading) {
    return (
      <main className="p-10">
        <p>Loading Company Workspace...</p>
      </main>
    );
  }

  if (!company) {
    return (
      <main className="p-10">
        <p>No company found.</p>
      </main>
    );
  }

  return (
    <main className="space-y-8">
      <CompanyHero
        name={company.name || "Unnamed Company"}
        industry={company.industry}
        country={company.country}
        employees={company.employee_count}
      />

      <AIHealthWidget score={aiHealthScore} />

      <ExecutiveKPIs />

      <div className="grid gap-6 lg:grid-cols-3">
        <ExecutiveProgress
          completed={completedAnswers}
          total={totalQuestions}
        />

        <div className="lg:col-span-2">
          <WorkspaceActions />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Notifications />
        <UpcomingTasks />
      </div>
    </main>
  );
}