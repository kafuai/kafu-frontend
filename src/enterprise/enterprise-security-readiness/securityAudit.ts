import { EnterpriseSecurityModel } from "./enterpriseSecurityTypes";

export class SecurityAudit {
  constructor(private readonly security: EnterpriseSecurityModel) {}

  getAuditSummary(): string {
    return `Security score ${this.security.score} with ${this.security.findings.length} findings.`;
  }
}
