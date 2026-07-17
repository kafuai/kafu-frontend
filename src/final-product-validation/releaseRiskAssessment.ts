import type {
  FinalProductValidationCategory,
  FinalProductValidationFinding,
  FinalProductValidationResult,
  FinalProductValidationSeverity,
} from "./finalProductValidationTypes";

export type ReleaseRiskLevel =
  | "low"
  | "moderate"
  | "high"
  | "critical";

export interface ReleaseRisk {
  id: string;
  title: string;
  category: FinalProductValidationCategory;
  severity: FinalProductValidationSeverity;
  riskLevel: ReleaseRiskLevel;
  score: number;
  mitigation: string;
}

export interface ReleaseRiskAssessment {
  level: ReleaseRiskLevel;
  score: number;
  risks: ReleaseRisk[];
  releaseRecommendation: string;
}

function severityWeight(
  severity: FinalProductValidationSeverity,
): number {
  const weights: Record<FinalProductValidationSeverity, number> = {
    critical: 40,
    high: 25,
    medium: 15,
    low: 5,
  };

  return weights[severity];
}

function statusWeight(
  finding: FinalProductValidationFinding,
): number {
  if (finding.status === "failed") {
    return 30;
  }

  if (finding.status === "pending") {
    return 20;
  }

  return Math.max(0, 100 - finding.score) / 2;
}

function resolveRiskLevel(score: number): ReleaseRiskLevel {
  if (score >= 75) {
    return "critical";
  }

  if (score >= 50) {
    return "high";
  }

  if (score >= 25) {
    return "moderate";
  }

  return "low";
}

function resolveMitigation(
  finding: FinalProductValidationFinding,
): string {
  if (finding.blocking) {
    return "Resolve and revalidate before release approval.";
  }

  if (finding.status === "pending") {
    return "Collect evidence and assign an accountable validation owner.";
  }

  return "Document remediation and complete it before general availability.";
}

export function assessReleaseRisk(
  result: FinalProductValidationResult,
): ReleaseRiskAssessment {
  const riskyFindings = result.findings.filter(
    (finding) =>
      finding.status === "failed" ||
      finding.status === "pending" ||
      finding.score < 85,
  );

  const risks = riskyFindings
    .map((finding) => {
      const score = Math.min(
        100,
        Math.round(
          severityWeight(finding.severity) + statusWeight(finding),
        ),
      );

      return {
        id: finding.requirementId,
        title: finding.title,
        category: finding.category,
        severity: finding.severity,
        riskLevel: resolveRiskLevel(score),
        score,
        mitigation: resolveMitigation(finding),
      };
    })
    .sort((left, right) => right.score - left.score);

  const assessmentScore =
    risks.length > 0
      ? Math.min(
          100,
          Math.round(
            risks.reduce((total, risk) => total + risk.score, 0) /
              risks.length,
          ),
        )
      : 0;

  const level = resolveRiskLevel(assessmentScore);

  const releaseRecommendation =
    level === "critical"
      ? "Stop the release and resolve all critical risks."
      : level === "high"
        ? "Hold production release and complete risk remediation."
        : level === "moderate"
          ? "Proceed only with controlled pilot conditions."
          : "Proceed with the planned release process.";

  return {
    level,
    score: assessmentScore,
    risks,
    releaseRecommendation,
  };
}
