import { AIExecutionComplianceAssessment } from "./aiAutonomousExecutionComplianceTypes";

export interface AIExecutionComplianceReport {
  assessmentId: string;
  executionId: string;
  overallStatus: string;
  complianceScore: number;
  passedControls: number;
  failedControls: number;
  warningControls: number;
  generatedAt: string;
}

export function createAIExecutionComplianceReport(
  assessment: AIExecutionComplianceAssessment
): AIExecutionComplianceReport {
  const passedControls = assessment.findings.filter(
    (f) => f.status === "compliant"
  ).length;

  const failedControls = assessment.findings.filter(
    (f) => f.status === "violation"
  ).length;

  const warningControls = assessment.findings.filter(
    (f) => f.status === "warning"
  ).length;

  return {
    assessmentId: assessment.assessmentId,
    executionId: assessment.executionId,
    overallStatus: assessment.status,
    complianceScore: assessment.score,
    passedControls,
    failedControls,
    warningControls,
    generatedAt: new Date().toISOString(),
  };
}