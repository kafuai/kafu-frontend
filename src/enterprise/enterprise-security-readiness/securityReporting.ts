import { EnterpriseSecurityModel } from "./enterpriseSecurityTypes";

export class SecurityReporting {
  constructor(private readonly security: EnterpriseSecurityModel) {}

  getReadinessStatus(): string {
    return `${this.security.compliance}:${this.security.score}`;
  }
}
