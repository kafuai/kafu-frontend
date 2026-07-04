import {
  AIAutonomousExecutionAssuranceDomain,
  AIAutonomousExecutionAssuranceInput,
} from "./aiAutonomousExecutionAssuranceTypes";

export interface AIAutonomousExecutionEvidence {
  domain: AIAutonomousExecutionAssuranceDomain;
  coverage: number;
  passed: boolean;
  confidence: number;
  findings: string[];
}

export function collectExecutionAssuranceEvidence(
  input: AIAutonomousExecutionAssuranceInput,
): AIAutonomousExecutionEvidence[] {
  return input.signals.map((signal) => ({
    domain: signal.domain,
    coverage: Math.max(0, Math.min(1, signal.weight)),
    passed: signal.passed,
    confidence: signal.confidence,
    findings: signal.notes ?? [],
  }));
}