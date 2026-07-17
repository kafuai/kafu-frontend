import { StrategicDecision } from "./strategicDecision";

export interface StrategicDecisionOrganizationContext {
  organizationId: string;
  organizationName?: string | null;
  industry?: string | null;
  country?: string | null;
  employeeCount?: number | null;
  annualRevenue?: number | null;
  currency?: string | null;
}

export interface StrategicDecisionPerformanceContext {
  readinessScore?: number | null;
  corporateBrainScore?: number | null;
  executionScore?: number | null;
  financialHealthScore?: number | null;
  operationalPerformanceScore?: number | null;
  customerExperienceScore?: number | null;
  workforceScore?: number | null;
  riskScore?: number | null;
}

export interface StrategicDecisionExecutionContext {
  activeInitiatives: number;
  delayedInitiatives: number;
  blockedInitiatives: number;
  availableCapacityPercentage?: number | null;
  committedBudget?: number | null;
  availableBudget?: number | null;
}

export interface StrategicDecisionIntelligenceContext {
  organization: StrategicDecisionOrganizationContext;
  performance: StrategicDecisionPerformanceContext;
  execution: StrategicDecisionExecutionContext;
  activeDecisions: StrategicDecision[];
  historicalDecisions?: StrategicDecision[];
  strategicPriorities?: string[];
  knownConstraints?: string[];
  marketSignals?: string[];
  leadershipDirectives?: string[];
  generatedAt: string;
}

export function createStrategicDecisionContext(
  input: Omit<StrategicDecisionIntelligenceContext, "generatedAt">,
): StrategicDecisionIntelligenceContext {
  return {
    ...input,
    activeDecisions: [...input.activeDecisions],
    historicalDecisions: [...(input.historicalDecisions ?? [])],
    strategicPriorities: [...(input.strategicPriorities ?? [])],
    knownConstraints: [...(input.knownConstraints ?? [])],
    marketSignals: [...(input.marketSignals ?? [])],
    leadershipDirectives: [...(input.leadershipDirectives ?? [])],
    generatedAt: new Date().toISOString(),
  };
}
