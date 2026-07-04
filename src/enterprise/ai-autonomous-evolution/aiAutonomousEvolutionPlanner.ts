import { AIAutonomousEvolutionAssessment } from "./aiAutonomousEvolutionAssessment";
import { AIAutonomousEvolutionCandidate } from "./aiAutonomousEvolutionCandidate";
import { AIAutonomousEvolutionDecision } from "./aiAutonomousEvolutionDecision";
import {
  AIAutonomousEvolutionPlan,
  AIAutonomousEvolutionPlanStep,
  createAIAutonomousEvolutionPlan,
} from "./aiAutonomousEvolutionPlan";

export interface CreateAIAutonomousEvolutionPlanFromDecisionInput {
  planId: string;
  candidate: AIAutonomousEvolutionCandidate;
  assessment: AIAutonomousEvolutionAssessment;
  decision: AIAutonomousEvolutionDecision;
}

export function createAIAutonomousEvolutionPlanFromDecision(
  input: CreateAIAutonomousEvolutionPlanFromDecisionInput,
): AIAutonomousEvolutionPlan | undefined {
  if (input.decision.type !== "approve" && input.decision.type !== "require_human_review") {
    return undefined;
  }

  const requiresApproval = input.decision.type === "require_human_review";

  const steps: AIAutonomousEvolutionPlanStep[] = [
    {
      id: `${input.candidate.id}-validate-baseline`,
      title: "Validate current baseline",
      description: "Capture the current capability, behavior, and runtime baseline before evolution.",
      requiredApproval: false,
      rollbackAction: "Restore captured baseline.",
      order: 1,
    },
    {
      id: `${input.candidate.id}-apply-evolution`,
      title: "Apply controlled evolution",
      description: input.candidate.description,
      requiredApproval: requiresApproval,
      rollbackAction: "Disable evolved behavior and restore previous configuration.",
      order: 2,
    },
    {
      id: `${input.candidate.id}-verify-impact`,
      title: "Verify impact",
      description: "Validate success criteria, safety, governance, and operational impact.",
      requiredApproval: false,
      rollbackAction: "Rollback if success criteria are not satisfied.",
      order: 3,
    },
  ];

  return createAIAutonomousEvolutionPlan({
    id: input.planId,
    candidateId: input.candidate.id,
    organizationId: input.candidate.organizationId,
    scope: input.candidate.scope,
    priority: input.candidate.priority,
    objective: input.candidate.expectedBenefit,
    steps,
    rollbackPlan: steps.map((step) => step.rollbackAction),
    successCriteria: [
      "Evolution improves or preserves expected capability outcomes.",
      "No safety, governance, or compliance regression is detected.",
      `Risk remains within approved level: ${input.assessment.riskLevel}.`,
    ],
  });
}