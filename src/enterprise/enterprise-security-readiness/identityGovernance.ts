import { SecurityPolicyModel } from "./enterpriseSecurityTypes";

export class IdentityGovernance {
  constructor(private readonly policies: SecurityPolicyModel[]) {}

  getPolicyCount(): number {
    return this.policies.length;
  }
}
