import { ComplianceStatus, ComplianceMetadata, ComplianceOwner } from "./complianceTypes";

export interface ComplianceAssessmentResult {
  controlId: string;
  status: ComplianceStatus;
  score: number;
  evidenceIds: string[];
  notes?: string;
}

export interface ComplianceAssessment {
  id: string;
  frameworkId: string;
  title: string;
  assessedAt: string;
  assessedBy: ComplianceOwner;
  results: ComplianceAssessmentResult[];
  overallStatus: ComplianceStatus;
  overallScore: number;
  metadata: ComplianceMetadata;
}

export function calculateComplianceScore(
  results: ComplianceAssessmentResult[],
): number {
  if (results.length === 0) {
    return 0;
  }

  const total = results.reduce((sum, result) => sum + result.score, 0);
  return Math.round(total / results.length);
}

export function resolveComplianceStatus(score: number): ComplianceStatus {
  if (score >= 90) {
    return "compliant";
  }

  if (score >= 60) {
    return "partially_compliant";
  }

  return "non_compliant";
}

export function createComplianceAssessment(
  assessment: Omit<ComplianceAssessment, "overallStatus" | "overallScore">,
): ComplianceAssessment {
  const overallScore = calculateComplianceScore(assessment.results);

  return {
    ...assessment,
    overallScore,
    overallStatus: resolveComplianceStatus(overallScore),
    metadata: {
      ...assessment.metadata,
      updatedAt: new Date().toISOString(),
    },
  };
}