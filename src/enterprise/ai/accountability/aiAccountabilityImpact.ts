import { AIAccountabilitySeverity } from "./aiAccountabilityTypes";

export type AIAccountabilityImpactCategory =
  | "customer"
  | "employee"
  | "financial"
  | "legal"
  | "security"
  | "privacy"
  | "operational"
  | "reputation";

export interface AIAccountabilityImpact {
  id: string;
  organizationId: string;
  decisionId: string;
  category: AIAccountabilityImpactCategory;
  severity: AIAccountabilitySeverity;
  description: string;
  affectedStakeholders: string[];
  estimatedAffectedCount?: number;
  reversible: boolean;
  mitigationAvailable: boolean;
  mitigationSummary?: string;
  assessedBy: string;
  assessedAt: Date;
}

export interface CreateAIAccountabilityImpactInput {
  id: string;
  organizationId: string;
  decisionId: string;
  category: AIAccountabilityImpactCategory;
  severity: AIAccountabilitySeverity;
  description: string;
  affectedStakeholders?: string[];
  estimatedAffectedCount?: number;
  reversible?: boolean;
  mitigationAvailable?: boolean;
  mitigationSummary?: string;
  assessedBy: string;
}

export function createAIAccountabilityImpact(
  input: CreateAIAccountabilityImpactInput,
  now: Date = new Date(),
): AIAccountabilityImpact {
  return {
    id: input.id,
    organizationId: input.organizationId,
    decisionId: input.decisionId,
    category: input.category,
    severity: input.severity,
    description: input.description,
    affectedStakeholders: input.affectedStakeholders ?? [],
    estimatedAffectedCount: input.estimatedAffectedCount,
    reversible: input.reversible ?? true,
    mitigationAvailable: input.mitigationAvailable ?? false,
    mitigationSummary: input.mitigationSummary,
    assessedBy: input.assessedBy,
    assessedAt: now,
  };
}

export function requiresImpactEscalation(
  impact: AIAccountabilityImpact,
): boolean {
  return (
    impact.severity === "critical" ||
    impact.severity === "high" ||
    (!impact.reversible && !impact.mitigationAvailable)
  );
}

export function calculateImpactScore(impact: AIAccountabilityImpact): number {
  const severityScore: Record<AIAccountabilitySeverity, number> = {
    low: 1,
    medium: 2,
    high: 3,
    critical: 4,
  };

  const affectedMultiplier =
    impact.estimatedAffectedCount === undefined
      ? 1
      : impact.estimatedAffectedCount >= 1000
        ? 2
        : impact.estimatedAffectedCount >= 100
          ? 1.5
          : 1;

  const reversibilityPenalty = impact.reversible ? 0 : 1;
  const mitigationPenalty = impact.mitigationAvailable ? 0 : 1;

  return (
    severityScore[impact.severity] * affectedMultiplier +
    reversibilityPenalty +
    mitigationPenalty
  );
}