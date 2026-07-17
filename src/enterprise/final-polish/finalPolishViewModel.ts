import {
  FinalPolishPlan,
} from "./finalPolishTypes";
import {
  summarizeFinalPolish,
} from "./finalPolishSummary";

export interface FinalPolishViewItem {
  id: string;
  title: string;
  category: string;
  priority: string;
  status: string;
  required: boolean;
}

export interface FinalPolishViewModel {
  id: string;
  companyName: string;
  heading: string;
  subheading: string;
  statusLabel: string;
  scoreLabel: string;
  polishReady: boolean;
  scorePercentage: number;
  items: FinalPolishViewItem[];
  unresolvedIssues: string[];
  recommendations: string[];
  footerSummary: string;
}

export function buildFinalPolishViewModel(
  plan: FinalPolishPlan,
): FinalPolishViewModel {
  const summary = summarizeFinalPolish(plan);

  return {
    id: plan.id,
    companyName: plan.companyName,
    heading: plan.title,
    subheading:
      "Enterprise product final polish and executive experience review",
    statusLabel: plan.status.replace(/-/g, " "),
    scoreLabel: `${summary.scorePercentage}% completion`,
    polishReady: summary.polishReady,
    scorePercentage: summary.scorePercentage,
    items: plan.items.map((item) => ({
      id: item.id,
      title: item.title,
      category: item.category.replace(/-/g, " "),
      priority: item.priority,
      status: item.status.replace(/-/g, " "),
      required: item.required,
    })),
    unresolvedIssues: plan.issues
      .filter((issue) => !issue.resolved)
      .map((issue) => `${issue.title}: ${issue.description}`),
    recommendations: summary.recommendations,
    footerSummary: summary.summary,
  };
}
