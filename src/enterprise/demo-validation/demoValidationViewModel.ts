import {
  summarizeDemoValidation,
} from "./demoValidationSummary";
import {
  DemoValidationReport,
} from "./demoValidationTypes";

export interface DemoValidationViewCheck {
  id: string;
  title: string;
  category: string;
  severity: string;
  status: string;
  required: boolean;
}

export interface DemoValidationViewModel {
  id: string;
  companyName: string;
  heading: string;
  subheading: string;
  statusLabel: string;
  scoreLabel: string;
  demoReady: boolean;
  scorePercentage: number;
  checks: DemoValidationViewCheck[];
  unresolvedIssues: string[];
  recommendations: string[];
  footerSummary: string;
}

export function buildDemoValidationViewModel(
  report: DemoValidationReport,
): DemoValidationViewModel {
  const summary = summarizeDemoValidation(report);

  return {
    id: report.id,
    companyName: report.companyName,
    heading: report.title,
    subheading:
      "Executive demo validation, readiness, and release confidence",
    statusLabel: report.status.replace(/-/g, " "),
    scoreLabel: `${summary.scorePercentage}% validated`,
    demoReady: summary.demoReady,
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
      .map(
        (issue) =>
          `${issue.title}: ${issue.description}`,
      ),
    recommendations: summary.recommendations,
    footerSummary: summary.summary,
  };
}
