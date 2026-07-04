import { AITransparencyRecord } from "./aiTransparencyRecord";
import { AIDataSourceDisclosure } from "./aiDataSourceDisclosure";
import { AIExplanation } from "./aiExplanation";
import { AIHumanReviewDisclosure } from "./aiHumanReviewDisclosure";

export interface AITransparencyAssessment {
  transparencyRecordId: string;
  readyForDisclosure: boolean;
  score: number;
  findings: string[];
  assessedAt: Date;
}

export interface AssessAITransparencyInput {
  record: AITransparencyRecord;
  explanations?: AIExplanation[];
  dataSources?: AIDataSourceDisclosure[];
  humanReview?: AIHumanReviewDisclosure;
}

export function assessAITransparency(
  input: AssessAITransparencyInput,
): AITransparencyAssessment {
  const findings: string[] = [];
  let score = 100;

  if (input.record.requiresUserDisclosure && !input.record.summary.trim()) {
    score -= 30;
    findings.push("User disclosure is required but summary is missing.");
  }

  if (input.explanations?.length === 0) {
    score -= 20;
    findings.push("No AI explanations are attached.");
  }

  if (input.dataSources?.length === 0) {
    score -= 20;
    findings.push("No data source disclosures are attached.");
  }

  if (
    input.record.requiresHumanReviewDisclosure &&
    !input.humanReview
  ) {
    score -= 20;
    findings.push("Human review disclosure is required but missing.");
  }

  if (
    (input.record.riskLevel === "high" ||
      input.record.riskLevel === "critical") &&
    input.record.limitations.length === 0
  ) {
    score -= 10;
    findings.push("High-risk AI transparency record has no limitations.");
  }

  const normalizedScore = Math.max(0, score);

  return {
    transparencyRecordId: input.record.id,
    readyForDisclosure: normalizedScore >= 70,
    score: normalizedScore,
    findings,
    assessedAt: new Date(),
  };
}