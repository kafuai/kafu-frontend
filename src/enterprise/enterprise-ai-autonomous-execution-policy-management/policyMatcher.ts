import {
  EnterpriseExecutionPolicy
} from "./policyTypes";
import {
  EnterpriseExecutionPolicyCatalog
} from "./policyCatalog";
import {
  EnterpriseExecutionPolicyEvaluationContext
} from "./policyEvaluationContext";

export function matchEnterpriseExecutionPolicies(
  catalog: EnterpriseExecutionPolicyCatalog,
  context: EnterpriseExecutionPolicyEvaluationContext
): EnterpriseExecutionPolicy[] {
  return catalog.policies
    .filter(p => p.status === "active")
    .filter(
      p =>
        p.scope.tenantId === context.target.tenantId &&
        p.scope.environment === context.target.environment &&
        p.scope.appliesTo.includes(context.target.targetType)
    )
    .sort((a, b) => b.priority - a.priority);
}