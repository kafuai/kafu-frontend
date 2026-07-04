import { createAIAutonomousGovernanceAuditEntry } from "./aiAutonomousGovernanceAudit";
import {
  createAIAutonomousGovernanceControlStatuses,
} from "./aiAutonomousGovernanceControl";
import {
  AIAutonomousGovernanceDecisionRecord,
} from "./aiAutonomousGovernanceDecision";
import {
  enforceAIAutonomousGovernanceDecision,
  AIAutonomousGovernanceEnforcementResult,
} from "./aiAutonomousGovernanceEnforcement";
import { evaluateAIAutonomousGovernance } from "./aiAutonomousGovernanceEvaluator";
import { AIAutonomousGovernancePolicy } from "./aiAutonomousGovernancePolicy";
import {
  AIAutonomousGovernanceContext,
  AIAutonomousGovernanceControlType,
} from "./aiAutonomousGovernanceTypes";

export interface AIAutonomousGovernanceRuntimeInput {
  context: AIAutonomousGovernanceContext;
  policies: AIAutonomousGovernancePolicy[];
  satisfiedControls?: AIAutonomousGovernanceControlType[];
}

export interface AIAutonomousGovernanceRuntimeResult {
  decision: AIAutonomousGovernanceDecisionRecord;
  enforcement: AIAutonomousGovernanceEnforcementResult;
  audit: ReturnType<typeof createAIAutonomousGovernanceAuditEntry>;
}

export function runAIAutonomousGovernanceRuntime(
  input: AIAutonomousGovernanceRuntimeInput,
): AIAutonomousGovernanceRuntimeResult {
  const decision = evaluateAIAutonomousGovernance(
    input.context,
    input.policies,
  );

  const controlStatuses = createAIAutonomousGovernanceControlStatuses(
    decision,
    input.satisfiedControls ?? [],
  );

  const enforcement = enforceAIAutonomousGovernanceDecision(
    decision,
    controlStatuses,
  );

  const audit = createAIAutonomousGovernanceAuditEntry(
    input.context.organizationId,
    input.context.actorId,
    input.context.capabilityId,
    decision,
    enforcement,
  );

  return {
    decision,
    enforcement,
    audit,
  };
}