import type {
  FinalProductValidationCategory,
  FinalProductValidationFinding,
  FinalProductValidationResult,
  FinalProductValidationSeverity,
} from "./finalProductValidationTypes";

export interface ProductionBlocker {
  requirementId: string;
  title: string;
  category: FinalProductValidationCategory;
  severity: FinalProductValidationSeverity;
  reason: string;
  remediationPriority: number;
}

export interface ProductionBlockerAnalysis {
  releaseBlocked: boolean;
  blockers: ProductionBlocker[];
  criticalCount: number;
  highCount: number;
  affectedCategories: FinalProductValidationCategory[];
}

function resolveRemediationPriority(
  finding: FinalProductValidationFinding,
): number {
  if (finding.severity === "critical") {
    return 1;
  }

  if (finding.severity === "high") {
    return 2;
  }

  if (finding.severity === "medium") {
    return 3;
  }

  return 4;
}

function buildBlockerReason(
  finding: FinalProductValidationFinding,
): string {
  if (finding.status === "pending") {
    return "Required validation evidence is still pending.";
  }

  if (finding.status === "failed") {
    return finding.notes ?? "Required validation has failed.";
  }

  return (
    finding.notes ??
    "The recorded score does not meet the required release threshold."
  );
}

export function analyzeProductionBlockers(
  result: FinalProductValidationResult,
): ProductionBlockerAnalysis {
  const blockers = result.blockers
    .map((finding) => ({
      requirementId: finding.requirementId,
      title: finding.title,
      category: finding.category,
      severity: finding.severity,
      reason: buildBlockerReason(finding),
      remediationPriority: resolveRemediationPriority(finding),
    }))
    .sort(
      (left, right) =>
        left.remediationPriority - right.remediationPriority,
    );

  return {
    releaseBlocked: blockers.length > 0,
    blockers,
    criticalCount: blockers.filter(
      (blocker) => blocker.severity === "critical",
    ).length,
    highCount: blockers.filter(
      (blocker) => blocker.severity === "high",
    ).length,
    affectedCategories: Array.from(
      new Set(blockers.map((blocker) => blocker.category)),
    ),
  };
}
