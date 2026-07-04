import { supabase } from "@/lib/supabase";

export const DIGITAL_WORKFORCE_BASELINE = 6;

export type ExecutiveCompany = {
  id: string;
  name: string | null;
  industry: string | null;
  country: string | null;
  employee_count: number | null;
  contact_name?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  created_at?: string | null;
};

export type ExecutiveInsight = {
  label: string;
  value: string;
  status: "positive" | "warning" | "critical" | "neutral";
};

type PipelineItem = {
  id: string;
  status: string | null;
  opportunity_value: number | null;
  response_deadline: string | null;
};

export function calculateReadinessScore(
  answersCount: number,
  company: ExecutiveCompany | null
) {
  let score = 35;

  if (company?.name) score += 10;
  if (company?.industry) score += 10;
  if (company?.country) score += 10;
  if ((company?.employee_count || 0) > 0) score += 10;

  score += Math.min(answersCount * 5, 25);

  return Math.min(score, 95);
}

export function calculateCorporateBrainScore(answersCount: number) {
  if (answersCount >= 8) return 82;
  if (answersCount >= 5) return 70;
  if (answersCount > 0) return 55;
  return 35;
}

export function calculatePipelineMetrics(
  companies: ExecutiveCompany[],
  pipeline: PipelineItem[]
) {
  const totalCompanies = companies.length;
  const totalLeads = pipeline.length;
  const wonLeads = pipeline.filter((item) => item.status === "Won").length;

  const pipelineValue = pipeline.reduce(
    (sum, item) => sum + (item.opportunity_value || 0),
    0
  );

  const conversionRate =
    totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0;

  const overdueLeads = pipeline.filter((item) => {
    if (!item.response_deadline) return false;

    return (
      item.status !== "Won" &&
      item.status !== "Lost" &&
      new Date(item.response_deadline) < new Date()
    );
  }).length;

  return {
    totalCompanies,
    totalLeads,
    wonLeads,
    pipelineValue,
    conversionRate,
    overdueLeads,
  };
}

export function buildStageCounts(pipeline: PipelineItem[]) {
  return [
    { stage: "New Lead", count: pipeline.filter((p) => p.status === "New Lead").length },
    { stage: "Contacted", count: pipeline.filter((p) => p.status === "Contacted").length },
    { stage: "Meeting", count: pipeline.filter((p) => p.status === "Meeting").length },
    { stage: "Proposal", count: pipeline.filter((p) => p.status === "Proposal").length },
    { stage: "Won", count: pipeline.filter((p) => p.status === "Won").length },
  ];
}

export function buildExecutiveCards({
  company,
  answersCount,
  readinessNumber,
  corporateBrainNumber,
  digitalWorkforceBaseline,
  overdueLeads,
}: {
  company: ExecutiveCompany | null;
  answersCount: number;
  readinessNumber: number;
  corporateBrainNumber: number;
  digitalWorkforceBaseline: number;
  overdueLeads: number;
}) {
  return [
    { title: "الشركة الحالية", value: company?.name || "-", note: "Live company data" },
    { title: "Executive Readiness", value: `${readinessNumber}%`, note: "AI-calculated score" },
    { title: "Discovery Answers", value: `${answersCount}`, note: "Saved inputs" },
    { title: "Digital Workforce", value: `${digitalWorkforceBaseline}`, note: "Recommended agents" },
    { title: "Corporate Brain", value: `${corporateBrainNumber}%`, note: "Knowledge readiness" },
    { title: "Open Alerts", value: `${overdueLeads}`, note: "Need executive review" },
  ];
}

export async function getExecutiveCompanyData(): Promise<{
  company: ExecutiveCompany | null;
  insights: ExecutiveInsight[];
}> {
  const { data: company, error } = await supabase
    .from("companies")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error("Executive Dashboard Supabase Error:", error.message);

    return {
      company: null,
      insights: [],
    };
  }

  const employeeCount = company?.employee_count ?? 0;

  const insights: ExecutiveInsight[] = [
    {
      label: "Company Profile",
      value: company?.name ? "Ready" : "Incomplete",
      status: company?.name ? "positive" : "warning",
    },
    {
      label: "Workforce Size",
      value: employeeCount > 0 ? `${employeeCount}` : "Missing",
      status: employeeCount > 0 ? "positive" : "warning",
    },
    {
      label: "Market Context",
      value: company?.industry ? company.industry : "Not Defined",
      status: company?.industry ? "positive" : "neutral",
    },
    {
      label: "Operating Country",
      value: company?.country ? company.country : "Not Defined",
      status: company?.country ? "positive" : "neutral",
    },
  ];

  return {
    company,
    insights,
  };
}