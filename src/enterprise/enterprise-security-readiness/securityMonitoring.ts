import { SecurityFinding } from "./enterpriseSecurityTypes";

export class SecurityMonitoring {
  constructor(private readonly findings: SecurityFinding[]) {}

  getHighSeverityFindings(): SecurityFinding[] {
    return this.findings.filter(
      (finding) => finding.level === "high" || finding.level === "critical"
    );
  }
}
