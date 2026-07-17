import { evaluateExecutiveOperationalReadiness } from "./executiveDemoOperationalReadinessEvaluator";
import { buildExecutiveOperationalReadinessRecommendations } from "./executiveDemoOperationalReadinessRecommendations";
import { buildExecutiveOperationalReadinessSnapshot } from "./executiveDemoOperationalReadinessSnapshot";
import { buildExecutiveOperationalReadinessSummary } from "./executiveDemoOperationalReadinessSummary";
import { ExecutiveOperationalReadinessInput } from "./executiveDemoOperationalReadinessTypes";

export function buildExecutiveOperationalReadinessReport(
  input: ExecutiveOperationalReadinessInput,
) {
  const result = evaluateExecutiveOperationalReadiness(input);

  return {
    result,
    summary: buildExecutiveOperationalReadinessSummary(result),
    recommendations:
      buildExecutiveOperationalReadinessRecommendations(result),
    snapshot: buildExecutiveOperationalReadinessSnapshot(input, result),
  };
}
