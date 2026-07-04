import { AIAutonomousEvolutionAssessment } from "./aiAutonomousEvolutionAssessment";
import { AIAutonomousEvolutionDecision } from "./aiAutonomousEvolutionDecision";
import { AIAutonomousEvolutionPlan } from "./aiAutonomousEvolutionPlan";

export interface AIAutonomousEvolutionReport {
  candidateId: string;
  decision: string;
  riskLevel: string;
  eligible: boolean;
  requiresHumanApproval: boolean;
  plannedSteps: number;
  generatedAt: Date;
}

export function createAIAutonomousEvolutionReport(
  assessment: AIAutonomousEvolutionAssessment,
  decision: AIAutonomousEvolutionDecision,
  plan?: AIAutonomousEvolutionPlan,
): AIAutonomousEvolutionReport {
  return {
    candidateId: assessment.candidateId,
    decision: decision.type,
    riskLevel: assessment.riskLevel,
    eligible: assessment.eligible,
    requiresHumanApproval: assessment.requiresHumanApproval,
    plannedSteps: plan?.steps.length ?? 0,
    generatedAt: new Date(),
  };
}