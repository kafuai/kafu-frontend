import {
  SecurityAuthorizationRequest,
  SecurityAuthorizationResult,
} from "./securityTypes";
import { SecurityPermissionRegistry } from "./securityPermissionRegistry";
import { SecurityRoleRegistry } from "./securityRoleRegistry";
import { SecurityPolicyRegistry } from "./securityPolicyRegistry";
import { SecurityAuthorizationEngine } from "./securityAuthorizationEngine";
import { SecurityAccessControlEngine } from "./securityAccessControlEngine";
import { SecurityDecisionHistory } from "./securityDecisionHistory";
import { SecurityPolicy } from "./securityPolicy";
import { evaluateSecurityPolicies } from "./securityPolicyRuntime";

export class SecurityEngine {
  private readonly permissions = new SecurityPermissionRegistry();
  private readonly roles = new SecurityRoleRegistry();
  private readonly policies = new SecurityPolicyRegistry();
  private readonly authorization = new SecurityAuthorizationEngine(
    this.roles,
    this.permissions,
  );
  private readonly accessControl = new SecurityAccessControlEngine(
    this.authorization,
  );
  private readonly history = new SecurityDecisionHistory();

  registerPolicy(policy: SecurityPolicy): void {
    this.policies.register(policy);
  }

  evaluateAccess(
    request: SecurityAuthorizationRequest,
  ): SecurityAuthorizationResult {
    const policyResult = evaluateSecurityPolicies(
      request,
      this.policies.list(),
    );

    if (!policyResult.allowed) {
      return {
        decision: "deny",
        reason: "Security policy evaluation denied access.",
      };
    }

    const result = this.accessControl.canAccess(request);

    this.history.add({
      id: `${request.principal.id}-${Date.now()}`,
      request,
      result,
      decidedAt: new Date(),
    });

    return result;
  }

  getDecisionHistory(): SecurityDecisionHistory {
    return this.history;
  }
}