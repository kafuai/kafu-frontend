import { EnterpriseExecutionPolicyCatalog } from "./policyCatalog";
import { EnterpriseExecutionPolicyEvaluationContext } from "./policyEvaluationContext";
import { EnterpriseExecutionPolicyDecision } from "./policyDecision";
import { matchEnterpriseExecutionPolicies } from "./policyMatcher";
import { resolveEnterpriseExecutionPolicies } from "./policyResolver";

export function executeEnterpriseExecutionPolicyEngine(
  catalog: EnterpriseExecutionPolicyCatalog,
  context: EnterpriseExecutionPolicyEvaluationContext
): EnterpriseExecutionPolicyDecision {
  const candidates = matchEnterpriseExecutionPolicies(catalog, context);

  return resolveEnterpriseExecutionPolicies(candidates, context);
}