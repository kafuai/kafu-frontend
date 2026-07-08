import { SecurityFinding } from "./enterpriseSecurityTypes";

export class AccessReview {
  constructor(private readonly findings: SecurityFinding[]) {}

  getCriticalFindings(): SecurityFinding[] {
    return this.findings.filter((finding) => finding.level === "critical");
  }
}
