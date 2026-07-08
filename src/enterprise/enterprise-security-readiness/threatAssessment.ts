import { SecurityFinding } from "./enterpriseSecurityTypes";

export class ThreatAssessment {
  constructor(private readonly findings: SecurityFinding[]) {}

  getThreatCount(): number {
    return this.findings.length;
  }
}
