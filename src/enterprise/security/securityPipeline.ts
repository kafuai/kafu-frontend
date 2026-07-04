import { SecurityAuthorizationRequest } from "./securityTypes";
import { SecurityPolicy } from "./securityPolicy";
import {
  evaluateSecurityPolicies,
  SecurityPolicyRuntimeResult,
} from "./securityPolicyRuntime";

export interface SecurityPipelineResult {
  policyEvaluation: SecurityPolicyRuntimeResult;
  completedAt: Date;
}

export function executeSecurityPipeline(
  request: SecurityAuthorizationRequest,
  policies: SecurityPolicy[],
): SecurityPipelineResult {
  return {
    policyEvaluation: evaluateSecurityPolicies(request, policies),
    completedAt: new Date(),
  };
}