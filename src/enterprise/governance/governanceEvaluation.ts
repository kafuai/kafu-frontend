import { GovernancePolicy } from "./governancePolicy";
import { GovernanceDecision, GovernanceSubject } from "./governanceTypes";

export type GovernanceEvaluationResult = {
  subject: GovernanceSubject;
  matchedPolicies: GovernancePolicy[];
  decision: GovernanceDecision;
};