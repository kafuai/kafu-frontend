import { AITransparencyAssessment } from "./aiTransparencyAssessment";
import { AITransparencyReadiness } from "./aiTransparencyReadiness";
import { AITransparencySummary } from "./aiTransparencySummary";

export interface AITransparencyReport {
  transparencyRecordId: string;
  title: string;
  purpose: string;
  readyForDisclosure: boolean;
  readinessLevel: string;
  score: number;
  findings: string[];
  recommendations: string[];
  generatedAt: Date;
}

export interface GenerateAITransparencyReportInput {
  summary: AITransparencySummary;
  assessment: AITransparencyAssessment;
  readiness: AITransparencyReadiness;
}

export function generateAITransparencyReport(
  input: GenerateAITransparencyReportInput,
): AITransparencyReport {
  return {
    transparencyRecordId: input.summary.transparencyRecordId,
    title: input.summary.title,
    purpose: input.summary.purpose,
    readyForDisclosure: input.assessment.readyForDisclosure,
    readinessLevel: input.readiness.level,
    score: input.assessment.score,
    findings: input.assessment.findings,
    recommendations: input.readiness.recommendations,
    generatedAt: new Date(),
  };
}