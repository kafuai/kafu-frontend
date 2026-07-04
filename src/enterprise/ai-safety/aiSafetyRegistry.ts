import { AISafetyPolicy } from "./aiSafetyPolicy";
import { AISafetyReport } from "./aiSafetyReport";

export interface AISafetyRegistrySnapshot {
  organizationId: string;
  policies: AISafetyPolicy[];
  reports: AISafetyReport[];
  updatedAt: Date;
}

export class AISafetyRegistry {
  private readonly policies = new Map<string, AISafetyPolicy>();
  private readonly reports = new Map<string, AISafetyReport>();

  registerPolicy(policy: AISafetyPolicy): void {
    this.policies.set(policy.id, policy);
  }

  getPolicy(policyId: string): AISafetyPolicy | undefined {
    return this.policies.get(policyId);
  }

  listPolicies(): AISafetyPolicy[] {
    return Array.from(this.policies.values());
  }

  saveReport(report: AISafetyReport): void {
    this.reports.set(report.id, report);
  }

  getReport(reportId: string): AISafetyReport | undefined {
    return this.reports.get(reportId);
  }

  listReports(): AISafetyReport[] {
    return Array.from(this.reports.values());
  }

  snapshot(organizationId: string): AISafetyRegistrySnapshot {
    return {
      organizationId,
      policies: this.listPolicies().filter(
        (policy) => policy.organizationId === organizationId,
      ),
      reports: this.listReports().filter(
        (report) => report.organizationId === organizationId,
      ),
      updatedAt: new Date(),
    };
  }
}