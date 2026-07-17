import {
  ProductionReadinessQAReport,
} from "./productionReadinessQATypes";
import {
  summarizeProductionReadinessQA,
} from "./productionReadinessQASummary";

export interface ProductionReadinessQAViewCheck {
  id: string;
  title: string;
  category: string;
  severity: string;
  status: string;
  required: boolean;
}

export interface ProductionReadinessQAViewModel {
  id: string;
  companyName: string;
  heading: string;
  subheading: string;
  statusLabel: string;
  scoreLabel: string;
  productionReady: boolean;
  scorePercentage: number;
  checks: ProductionReadinessQAViewCheck[];
  unresolvedIssues: string[];
  recommendations: string[];
  footerSummary: string;
}

export function buildProductionReadinessQAViewModel(
  report: ProductionReadinessQAReport,
): ProductionReadinessQAViewModel {
  const summary = summarizeProductionReadinessQA(report);

  return {
    id: report.id,
    companyName: report.companyName,
    heading: report.title,
    subheading:
      "Enterprise production readiness and quality assurance",
    statusLabel: report.status.replace(/-/g, " "),
    scoreLabel: `${summary.scorePercentage}% readiness`,
    productionReady: summary.productionReady,
    scorePercentage: summary.scorePercentage,
    checks: report.checks.map((check) => ({
      id: check.id,
      title: check.title,
      category: check.category.replace(/-/g, " "),
      severity: check.severity,
      status: check.status.replace(/-/g, " "),
      required: check.required,
    })),
    unresolvedIssues: report.issues
      .filter((issue) => !issue.resolved)
      .map((issue) => `${issue.title}: ${issue.description}`),
    recommendations: summary.recommendations,
    footerSummary: summary.summary,
  };
}
