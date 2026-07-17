import {
  createExecutiveDemoIntelligenceContext,
} from "./executiveDemoIntelligenceContext";
import type {
  ExecutiveDemoIntelligenceInput,
} from "./executiveDemoIntelligenceTypes";

export interface ExecutiveDemoIntelligenceAdapterInput {
  sessionId: string;
  organizationId: string;
  companyName: string;
  industry?: string | null;
  country?: string | null;
  executiveRole?: string | null;
  readinessScore?: number | null;
  corporateBrainScore?: number | null;
  discoveryAnswersCount?: number | null;
  overdueLeads?: number | null;
  activeModules?: string[] | null;
  currentStage?: string | null;
}

export function adaptExecutiveDemoIntelligenceInput(
  input: ExecutiveDemoIntelligenceAdapterInput,
): ExecutiveDemoIntelligenceInput {
  return {
    context: createExecutiveDemoIntelligenceContext({
      sessionId: input.sessionId,
      organizationId: input.organizationId,
      companyName: input.companyName,
      industry: normalizeOptionalText(input.industry),
      country: normalizeOptionalText(input.country),
      executiveRole: normalizeOptionalText(input.executiveRole),
      readinessScore: normalizeOptionalNumber(input.readinessScore),
      corporateBrainScore: normalizeOptionalNumber(
        input.corporateBrainScore,
      ),
      discoveryAnswersCount:
        normalizeOptionalNumber(input.discoveryAnswersCount) ?? 0,
      overdueLeads:
        normalizeOptionalNumber(input.overdueLeads) ?? 0,
      activeModules: input.activeModules ?? [],
      currentStage: normalizeOptionalText(input.currentStage),
    }),
    signals: [],
    knowledge: [],
    memory: [],
    objectives: [],
  };
}

function normalizeOptionalText(
  value?: string | null,
): string | undefined {
  const normalizedValue = value?.trim();

  return normalizedValue || undefined;
}

function normalizeOptionalNumber(
  value?: number | null,
): number | undefined {
  return value === null || value === undefined
    ? undefined
    : value;
}
