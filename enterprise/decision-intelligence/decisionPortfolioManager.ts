import {
  EnterpriseDecisionPriority,
  EnterpriseDecisionRecord,
  EnterpriseDecisionStatus,
} from "./decisionIntelligenceTypes";

export interface DecisionPortfolioSummary {
  totalDecisions: number;
  criticalDecisions: number;
  highPriorityDecisions: number;
  pendingApprovalDecisions: number;
  activeDecisions: number;
  completedDecisions: number;
  blockedDecisions: number;
  portfolioHealthScore: number;
  executiveAttentionRequired: boolean;
}

function isActiveStatus(status: EnterpriseDecisionStatus): boolean {
  return (
    status === "identified" ||
    status === "recommended" ||
    status === "approved" ||
    status === "in-progress"
  );
}

function priorityWeight(priority: EnterpriseDecisionPriority): number {
  switch (priority) {
    case "critical":
      return 4;
    case "high":
      return 3;
    case "medium":
      return 2;
    case "low":
      return 1;
  }
}

export class DecisionPortfolioManager {
  summarize(
    decisions: EnterpriseDecisionRecord[],
  ): DecisionPortfolioSummary {
    const totalDecisions = decisions.length;

    const criticalDecisions = decisions.filter(
      (decision) =>
        decision.priority === "critical" &&
        isActiveStatus(decision.status),
    ).length;

    const highPriorityDecisions = decisions.filter(
      (decision) =>
        decision.priority === "high" &&
        isActiveStatus(decision.status),
    ).length;

    const pendingApprovalDecisions = decisions.filter(
      (decision) => decision.status === "recommended",
    ).length;

    const activeDecisions = decisions.filter(
      (decision) => decision.status === "in-progress",
    ).length;

    const completedDecisions = decisions.filter(
      (decision) => decision.status === "completed",
    ).length;

    const blockedDecisions = decisions.filter(
      (decision) =>
        decision.status !== "completed" &&
        decision.status !== "rejected" &&
        decision.risks.some(
          (risk) =>
            risk.severity === "critical" &&
            !risk.mitigation,
        ),
    ).length;

    const totalPriorityWeight = decisions.reduce(
      (total, decision) =>
        total + priorityWeight(decision.priority),
      0,
    );

    const completedPriorityWeight = decisions
      .filter((decision) => decision.status === "completed")
      .reduce(
        (total, decision) =>
          total + priorityWeight(decision.priority),
        0,
      );

    const completionScore =
      totalPriorityWeight > 0
        ? (completedPriorityWeight / totalPriorityWeight) * 100
        : 100;

    const riskPenalty =
      criticalDecisions * 8 +
      blockedDecisions * 10 +
      pendingApprovalDecisions * 3;

    const portfolioHealthScore = Math.max(
      0,
      Math.min(
        100,
        Math.round(completionScore - riskPenalty + 30),
      ),
    );

    return {
      totalDecisions,
      criticalDecisions,
      highPriorityDecisions,
      pendingApprovalDecisions,
      activeDecisions,
      completedDecisions,
      blockedDecisions,
      portfolioHealthScore,
      executiveAttentionRequired:
        criticalDecisions > 0 ||
        blockedDecisions > 0 ||
        pendingApprovalDecisions >= 5,
    };
  }

  prioritize(
    decisions: EnterpriseDecisionRecord[],
  ): EnterpriseDecisionRecord[] {
    const statusWeight: Record<EnterpriseDecisionStatus, number> = {
      identified: 4,
      recommended: 5,
      approved: 3,
      "in-progress": 2,
      completed: 0,
      rejected: 0,
    };

    return [...decisions].sort((firstDecision, secondDecision) => {
      const firstScore =
        priorityWeight(firstDecision.priority) * 10 +
        statusWeight[firstDecision.status] +
        firstDecision.risks.filter(
          (risk) => risk.severity === "critical",
        ).length * 5;

      const secondScore =
        priorityWeight(secondDecision.priority) * 10 +
        statusWeight[secondDecision.status] +
        secondDecision.risks.filter(
          (risk) => risk.severity === "critical",
        ).length * 5;

      return secondScore - firstScore;
    });
  }
}
