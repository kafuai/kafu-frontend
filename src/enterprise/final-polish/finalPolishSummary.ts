import {
  FinalPolishPlan,
} from "./finalPolishTypes";
import {
  assessFinalPolish,
} from "./finalPolishAssessment";

export interface FinalPolishSummary {
  planId: string;
  companyName: string;
  title: string;
  status: string;
  scorePercentage: number;
  polishReady: boolean;
  totalItems: number;
  completedItems: number;
  pendingItems: number;
  blockedItems: number;
  unresolvedIssues: number;
  recommendations: string[];
  summary: string;
}

export function summarizeFinalPolish(
  plan: FinalPolishPlan,
): FinalPolishSummary {
  const assessment = assessFinalPolish(plan);

  return {
    planId: plan.id,
    companyName: plan.companyName,
    title: plan.title,
    status: plan.status,
    scorePercentage: plan.score.scorePercentage,
    polishReady: plan.score.polishReady,
    totalItems: plan.score.totalItems,
    completedItems: plan.score.completedItems,
    pendingItems: plan.score.pendingItems,
    blockedItems: plan.score.blockedItems,
    unresolvedIssues: plan.score.unresolvedIssues,
    recommendations: assessment.recommendations,
    summary:
      `${plan.companyName} final polish is ${plan.score.scorePercentage}% complete with ` +
      `${plan.score.completedItems}/${plan.score.totalItems} completed items.`,
  };
}
