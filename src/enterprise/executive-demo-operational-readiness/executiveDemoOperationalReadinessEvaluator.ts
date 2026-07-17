import {
  ExecutiveOperationalReadinessInput,
  ExecutiveOperationalReadinessResult,
} from "./executiveDemoOperationalReadinessTypes";
import { buildExecutiveOperationalReadiness } from "./executiveDemoOperationalReadiness";
import { validateExecutiveOperationalReadiness } from "./executiveDemoOperationalReadinessValidator";

export function evaluateExecutiveOperationalReadiness(
  input: ExecutiveOperationalReadinessInput,
): ExecutiveOperationalReadinessResult {
  validateExecutiveOperationalReadiness(input);

  return buildExecutiveOperationalReadiness(input);
}