import {
  FinalPolishIssue,
  FinalPolishPlan,
} from "./finalPolishTypes";

export interface FinalPolishAssessment {
  planId: string;
  polishReady: boolean;
  scorePercentage: number;
  blockingIssues: FinalPolishIssue[];
  recommendations: string[];
  assessmentSummary: string;
}

export function assessFinalPolish(
  plan: FinalPolishPlan,
): FinalPolishAssessment {
  const blockingIssues = plan.issues.filter(
    (issue) =>
      !issue.resolved &&
      (issue.priority === "critical" ||
        issue.priority === "high"),
  );

  const recommendations: string[] = [];

  plan.items.forEach((item) => {
    if (
      item.required &&
      item.status !== "completed" &&
      item.status !== "not-applicable"
    ) {
      recommendations.push(
        `Complete polish item: ${item.title}.`,
      );
    }
  });

  blockingIssues.forEach((issue) => {
    recommendations.push(
      `Resolve issue: ${issue.title}.`,
    );
  });

  if (recommendations.length === 0) {
    recommendations.push(
      "Proceed to executive demo validation.",
    );
  }

  return {
    planId: plan.id,
    polishReady: plan.score.polishReady,
    scorePercentage: plan.score.scorePercentage,
    blockingIssues,
    recommendations,
    assessmentSummary: plan.score.polishReady
      ? "Final polish is complete."
      : `Final polish score is ${plan.score.scorePercentage}%.`,
  };
}
