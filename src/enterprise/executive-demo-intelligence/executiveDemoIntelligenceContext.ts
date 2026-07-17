import type {
  ExecutiveDemoIntelligenceContext,
  ExecutiveDemoIntelligencePriority,
} from "./executiveDemoIntelligenceTypes";

export interface CreateExecutiveDemoIntelligenceContextInput {
  sessionId: string;
  organizationId: string;
  companyName: string;
  industry?: string;
  country?: string;
  executiveRole?: string;
  readinessScore?: number;
  corporateBrainScore?: number;
  discoveryAnswersCount?: number;
  overdueLeads?: number;
  activeModules?: string[];
  currentStage?: string;
  capturedAt?: string;
}

function normalizeScore(score?: number): number | undefined {
  if (score === undefined) {
    return undefined;
  }

  return Math.min(100, Math.max(0, Math.round(score)));
}

export function createExecutiveDemoIntelligenceContext(
  input: CreateExecutiveDemoIntelligenceContextInput,
): ExecutiveDemoIntelligenceContext {
  return {
    sessionId: input.sessionId.trim(),
    organizationId: input.organizationId.trim(),
    companyName: input.companyName.trim(),
    industry: input.industry?.trim(),
    country: input.country?.trim(),
    executiveRole: input.executiveRole?.trim(),
    readinessScore: normalizeScore(input.readinessScore),
    corporateBrainScore: normalizeScore(input.corporateBrainScore),
    discoveryAnswersCount: Math.max(
      0,
      Math.round(input.discoveryAnswersCount ?? 0),
    ),
    overdueLeads: Math.max(0, Math.round(input.overdueLeads ?? 0)),
    activeModules: Array.from(
      new Set(
        (input.activeModules ?? [])
          .map((moduleName) => moduleName.trim())
          .filter(Boolean),
      ),
    ),
    currentStage: input.currentStage?.trim(),
    capturedAt: input.capturedAt ?? new Date().toISOString(),
  };
}

export function resolveExecutiveDemoContextPriority(
  context: ExecutiveDemoIntelligenceContext,
): ExecutiveDemoIntelligencePriority {
  if (
    (context.readinessScore !== undefined && context.readinessScore < 40) ||
    (context.overdueLeads ?? 0) >= 10
  ) {
    return "critical";
  }

  if (
    (context.readinessScore !== undefined && context.readinessScore < 60) ||
    (context.overdueLeads ?? 0) > 0
  ) {
    return "high";
  }

  if (
    context.discoveryAnswersCount !== undefined &&
    context.discoveryAnswersCount < 5
  ) {
    return "medium";
  }

  return "low";
}

export function hasSufficientExecutiveDemoContext(
  context: ExecutiveDemoIntelligenceContext,
): boolean {
  return Boolean(
    context.sessionId &&
      context.organizationId &&
      context.companyName &&
      context.capturedAt,
  );
}
