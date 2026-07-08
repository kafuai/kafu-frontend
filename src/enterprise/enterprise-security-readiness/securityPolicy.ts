import { SecurityPolicyModel } from "./enterpriseSecurityTypes";

export class SecurityPolicy {
  constructor(private readonly policies: SecurityPolicyModel[]) {}

  getEnabledPolicies(): SecurityPolicyModel[] {
    return this.policies.filter((policy) => policy.enabled);
  }
}
