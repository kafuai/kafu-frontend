import type {
  FinalProductCategoryResult,
  FinalProductReleaseDecision,
  FinalProductValidationFinding,
  FinalProductValidationResult,
  FinalProductValidationSeverity,
  FinalProductValidationStatus,
} from "./finalProductValidationTypes";
import type {
  FinalProductValidationContext,
} from "./finalProductValidationContext";

const DEFAULT_SCORE_BY_STATUS: Record<
  FinalProductValidationStatus,
  number
> = {
  passed: 100,
  failed: 0,
  pending: 0,
  "not-applicable": 100,
};

const BLOCKING_SEVERITIES = new Set<FinalProductValidationSeverity>([
  "critical",
  "high",
]);

function normalizeScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function resolveDecision(
  overallScore: number,
  blockingIssues: number,
  pendingRequirements: number,
): FinalProductReleaseDecision {
  if (blockingIssues > 0 || overallScore < 70) {
    return "hold-release";
  }

  if (pendingRequirements > 0 || overallScore < 85) {
    return "conditionally-ready";
  }

  if (overallScore < 95) {
    return "ready-for-pilot";
  }

  return "ready-for-production";
}

function buildRecommendations(
  findings: FinalProductValidationFinding[],
): string[] {
  const recommendations: string[] = [];

  const blockers = findings.filter((finding) => finding.blocking);
  const pending = findings.filter((finding) => finding.status === "pending");
  const failed = findings.filter((finding) => finding.status === "failed");

  if (blockers.length > 0) {
    recommendations.push(
      `Resolve ${blockers.length} blocking validation issue(s) before release approval.`,
    );
  }

  if (failed.length > blockers.length) {
    recommendations.push(
      "Create remediation owners and target dates for all non-blocking failures.",
    );
  }

  if (pending.length > 0) {
    recommendations.push(
      `Complete evidence collection for ${pending.length} pending requirement(s).`,
    );
  }

  if (blockers.length === 0 && failed.length === 0 && pending.length === 0) {
    recommendations.push(
      "Approve the release candidate and proceed with the formal v1.0 release process.",
    );
  }

  return recommendations;
}

export function validateFinalProduct(
  context: FinalProductValidationContext,
): FinalProductValidationResult {
  if (!context.productName) {
    throw new Error("Product name is required.");
  }

  if (!context.version) {
    throw new Error("Product version is required.");
  }

  const findings: FinalProductValidationFinding[] =
    context.requirements.map((requirement) => {
      const evidence =
        context.evidenceByRequirementId.get(requirement.id);

      const status = evidence?.status ?? "pending";
      const score = normalizeScore(
        evidence?.score ?? DEFAULT_SCORE_BY_STATUS[status],
      );

      const minimumScore = requirement.minimumScore ?? 100;
      const failedThreshold = score < minimumScore;
      const unresolved =
        status === "failed" || status === "pending" || failedThreshold;

      const blocking =
        requirement.required &&
        unresolved &&
        BLOCKING_SEVERITIES.has(requirement.severity);

      return {
        requirementId: requirement.id,
        title: requirement.title,
        category: requirement.category,
        severity: requirement.severity,
        status,
        blocking,
        score,
        evidence: evidence?.evidence,
        notes: evidence?.notes,
      };
    });

  const categories = Array.from(
    new Set(findings.map((finding) => finding.category)),
  );

  const categoryResults: FinalProductCategoryResult[] =
    categories.map((category) => {
      const categoryFindings = findings.filter(
        (finding) => finding.category === category,
      );

      const totalScore = categoryFindings.reduce(
        (sum, finding) => sum + finding.score,
        0,
      );

      return {
        category,
        score:
          categoryFindings.length > 0
            ? normalizeScore(totalScore / categoryFindings.length)
            : 0,
        passed: categoryFindings.filter(
          (finding) =>
            finding.status === "passed" ||
            finding.status === "not-applicable",
        ).length,
        failed: categoryFindings.filter(
          (finding) => finding.status === "failed",
        ).length,
        pending: categoryFindings.filter(
          (finding) => finding.status === "pending",
        ).length,
        total: categoryFindings.length,
        blockingIssues: categoryFindings.filter(
          (finding) => finding.blocking,
        ).length,
      };
    });

  const overallScore =
    findings.length > 0
      ? normalizeScore(
          findings.reduce(
            (sum, finding) => sum + finding.score,
            0,
          ) / findings.length,
        )
      : 0;

  const blockers = findings.filter((finding) => finding.blocking);
  const failedRequirements = findings.filter(
    (finding) => finding.status === "failed",
  ).length;
  const pendingRequirements = findings.filter(
    (finding) => finding.status === "pending",
  ).length;
  const passedRequirements = findings.filter(
    (finding) =>
      finding.status === "passed" ||
      finding.status === "not-applicable",
  ).length;

  return {
    productName: context.productName,
    version: context.version,
    evaluatedAt: context.evaluatedAt,
    summary: {
      overallScore,
      totalRequirements: findings.length,
      passedRequirements,
      failedRequirements,
      pendingRequirements,
      blockingIssues: blockers.length,
      decision: resolveDecision(
        overallScore,
        blockers.length,
        pendingRequirements,
      ),
    },
    categoryResults,
    findings,
    blockers,
    recommendations: buildRecommendations(findings),
  };
}
