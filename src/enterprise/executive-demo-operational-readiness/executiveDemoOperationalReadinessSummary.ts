import { ExecutiveOperationalReadinessResult } from "./executiveDemoOperationalReadinessTypes";

export interface ExecutiveOperationalReadinessSummary {
  score: number;
  level: ExecutiveOperationalReadinessResult["readinessLevel"];
  headline: string;
  executiveSummary: string;
}

export function buildExecutiveOperationalReadinessSummary(
  result: ExecutiveOperationalReadinessResult,
): ExecutiveOperationalReadinessSummary {
  const headline =
    result.readinessLevel === "excellent"
      ? "Enterprise operations are fully demo-ready."
      : result.readinessLevel === "high"
        ? "Enterprise operations are strongly positioned for the demo."
        : result.readinessLevel === "moderate"
          ? "Enterprise operations require focused preparation."
          : result.readinessLevel === "low"
            ? "Enterprise operations require significant readiness improvements."
            : "Enterprise operations are not currently demo-ready.";

  return {
    score: result.overallScore,
    level: result.readinessLevel,
    headline,
    executiveSummary: `${headline} ${result.strengths.length} strengths and ${result.risks.length} risks were identified.`,
  };
}
