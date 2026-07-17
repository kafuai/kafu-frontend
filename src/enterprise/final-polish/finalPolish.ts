import {
  FinalPolishIssue,
  FinalPolishItem,
  FinalPolishPlan,
  FinalPolishPlanInput,
  FinalPolishScore,
} from "./finalPolishTypes";

function createFinalPolishId(
  organizationId: string,
): string {
  const normalizedOrganizationId = organizationId
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return `final-polish-${
    normalizedOrganizationId || "organization"
  }-${Date.now()}`;
}

export function calculateFinalPolishScore(
  items: FinalPolishItem[],
  issues: FinalPolishIssue[],
): FinalPolishScore {
  const completedItems = items.filter(
    (item) =>
      item.status === "completed" ||
      item.status === "not-applicable",
  ).length;

  const pendingItems = items.filter(
    (item) =>
      item.status === "pending" ||
      item.status === "in-progress",
  ).length;

  const blockedItems = items.filter(
    (item) => item.status === "blocked",
  ).length;

  const requiredItems = items.filter(
    (item) => item.required,
  );

  const completedRequiredItems = requiredItems.filter(
    (item) =>
      item.status === "completed" ||
      item.status === "not-applicable",
  ).length;

  const unresolvedIssues = issues.filter(
    (issue) => !issue.resolved,
  );

  const criticalIssues = unresolvedIssues.filter(
    (issue) => issue.priority === "critical",
  ).length;

  const scorePercentage =
    items.length === 0
      ? 100
      : Math.round(
          (completedItems / items.length) * 100,
        );

  const allRequiredItemsCompleted =
    completedRequiredItems === requiredItems.length;

  return {
    totalItems: items.length,
    completedItems,
    pendingItems,
    blockedItems,
    requiredItems: requiredItems.length,
    completedRequiredItems,
    unresolvedIssues: unresolvedIssues.length,
    criticalIssues,
    scorePercentage,
    polishReady:
      scorePercentage === 100 &&
      allRequiredItemsCompleted &&
      blockedItems === 0 &&
      criticalIssues === 0,
  };
}

export function createFinalPolishPlan(
  input: FinalPolishPlanInput,
): FinalPolishPlan {
  const timestamp = new Date().toISOString();
  const issues = input.issues ?? [];
  const score = calculateFinalPolishScore(
    input.items,
    issues,
  );

  return {
    id: createFinalPolishId(input.organizationId),
    organizationId: input.organizationId.trim(),
    companyName: input.companyName.trim(),
    title:
      input.title?.trim() ||
      `${input.companyName.trim()} Final Polish`,
    status: score.polishReady ? "ready" : "not-started",
    items: input.items,
    issues,
    score,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export function refreshFinalPolishPlan(
  plan: FinalPolishPlan,
): FinalPolishPlan {
  const score = calculateFinalPolishScore(
    plan.items,
    plan.issues,
  );

  return {
    ...plan,
    status: score.polishReady
      ? "ready"
      : score.blockedItems > 0 ||
          score.criticalIssues > 0
        ? "blocked"
        : "in-progress",
    score,
    updatedAt: new Date().toISOString(),
  };
}

export function approveFinalPolishPlan(
  plan: FinalPolishPlan,
): FinalPolishPlan {
  const refreshedPlan = refreshFinalPolishPlan(plan);

  if (!refreshedPlan.score.polishReady) {
    throw new Error(
      "Final polish plan cannot be approved before all required work is completed.",
    );
  }

  const timestamp = new Date().toISOString();

  return {
    ...refreshedPlan,
    status: "approved",
    approvedAt: timestamp,
    updatedAt: timestamp,
  };
}
