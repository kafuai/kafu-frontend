import { SecurityPolicy } from "./securityPolicy";
import { SecurityAuthorizationRequest } from "./securityTypes";
import { matchesSecurityPermission } from "./securityPermission";

export interface SecurityPolicyRuntimeResult {
  allowed: boolean;
  matchedPolicies: SecurityPolicy[];
  deniedPolicies: SecurityPolicy[];
  evaluatedAt: Date;
}

export function evaluateSecurityPolicies(
  request: SecurityAuthorizationRequest,
  policies: SecurityPolicy[],
): SecurityPolicyRuntimeResult {
  const enabledPolicies = policies.filter((policy) => policy.enabled);

  const matchedPolicies = enabledPolicies.filter((policy) =>
    policy.permissions.some((permission) =>
      matchesSecurityPermission(permission, request.resource, request.action),
    ),
  );

  const deniedPolicies = matchedPolicies.filter(
    (policy) => policy.effect === "deny",
  );

  return {
    allowed: matchedPolicies.length > 0 && deniedPolicies.length === 0,
    matchedPolicies,
    deniedPolicies,
    evaluatedAt: new Date(),
  };
}