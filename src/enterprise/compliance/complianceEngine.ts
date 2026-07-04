import {
  ComplianceAssessment,
  createComplianceAssessment,
} from "./complianceAssessment";
import { ComplianceFramework } from "./complianceFramework";
import { ComplianceRegistry } from "./complianceRegistry";

export class ComplianceEngine {
  constructor(
    private readonly registry: ComplianceRegistry = new ComplianceRegistry(),
  ) {}

  registerFramework(framework: ComplianceFramework): void {
    this.registry.register(framework);
  }

  getFramework(id: string): ComplianceFramework | undefined {
    return this.registry.get(id);
  }

  listFrameworks(): ComplianceFramework[] {
    return this.registry.getAll();
  }

  assess(
    assessment: Omit<
      ComplianceAssessment,
      "overallStatus" | "overallScore"
    >,
  ): ComplianceAssessment {
    return createComplianceAssessment(assessment);
  }
}