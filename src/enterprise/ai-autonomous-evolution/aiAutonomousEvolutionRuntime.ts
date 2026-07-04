import {
  AIAutonomousEvolutionAssessment,
  assessAIAutonomousEvolutionCandidate,
} from "./aiAutonomousEvolutionAssessment";
import { AIAutonomousEvolutionCandidate } from "./aiAutonomousEvolutionCandidate";
import {
  AIAutonomousEvolutionDecision,
  createAIAutonomousEvolutionDecision,
} from "./aiAutonomousEvolutionDecision";
import { createAIAutonomousEvolutionEvent } from "./aiAutonomousEvolutionEvents";
import { createAIAutonomousEvolutionPlanFromDecision } from "./aiAutonomousEvolutionPlanner";
import { AIAutonomousEvolutionPolicy } from "./aiAutonomousEvolutionPolicy";
import {
  AIAutonomousEvolutionReport,
  createAIAutonomousEvolutionReport,
} from "./aiAutonomousEvolutionReporter";
import { AIAutonomousEvolutionSignal } from "./aiAutonomousEvolutionSignal";

export interface RunAIAutonomousEvolutionRuntimeInput {
  executionId: string;
  candidate: AIAutonomousEvolutionCandidate;
  policy: AIAutonomousEvolutionPolicy;
  signals: AIAutonomousEvolutionSignal[];
}

export interface AIAutonomousEvolutionRuntimeResult {
  assessment: AIAutonomousEvolutionAssessment;
  decision: AIAutonomousEvolutionDecision;
  report: AIAutonomousEvolutionReport;
  planCreated: boolean;
}

export function runAIAutonomousEvolutionRuntime(
  input: RunAIAutonomousEvolutionRuntimeInput,
): AIAutonomousEvolutionRuntimeResult {
  const assessment = assessAIAutonomousEvolutionCandidate({
    candidate: input.candidate,
    policy: input.policy,
    signals: input.signals,
  });

  const decision = createAIAutonomousEvolutionDecision({
    id: `${input.executionId}-decision`,
    candidate: input.candidate,
    assessment,
  });

  const plan = createAIAutonomousEvolutionPlanFromDecision({
    planId: `${input.executionId}-plan`,
    candidate: input.candidate,
    assessment,
    decision,
  });

  createAIAutonomousEvolutionEvent({
    id: `${input.executionId}-event`,
    organizationId: input.candidate.organizationId,
    candidateId: input.candidate.id,
    type: "autonomous-evolution",
    decision: decision.type,
    message: decision.rationale,
    metadata: {},
  });

  const report = createAIAutonomousEvolutionReport(
    assessment,
    decision,
    plan,
  );

  return {
    assessment,
    decision,
    report,
    planCreated: plan !== undefined,
  };
}