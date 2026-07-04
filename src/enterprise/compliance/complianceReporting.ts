import { ComplianceAssessment } from "./complianceAssessment";
import { ComplianceFinding } from "./complianceFinding";

export interface ComplianceReport {
  generatedAt: string;
  frameworkId: string;
  assessmentCount: number;
  findingCount: number;
  complianceScore: number;
}

export function generateComplianceReport(
  frameworkId: string,
  assessments: ComplianceAssessment[],
  findings: ComplianceFinding[],
): ComplianceReport {
  const assessmentCount = assessments.length;

  const complianceScore =
    assessmentCount === 0
      ? 0
      : Math.round(
          assessments.reduce((sum, a) => sum + a.overallScore, 0) /
            assessmentCount,
        );

  return {
    generatedAt: new Date().toISOString(),
    frameworkId,
    assessmentCount,
    findingCount: findings.length,
    complianceScore,
  };
}