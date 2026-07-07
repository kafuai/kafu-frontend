import {
  CustomerInteraction,
  CustomerOpportunity,
  CustomerRelationship,
  CustomerRelationshipPolicy,
  CustomerRelationshipRiskLevel,
} from "./customerRelationshipManagementTypes";
import { isNegativeCustomerInteraction } from "./customerInteraction";
import {
  calculateCustomerOpportunityWeightedValue,
  isCustomerOpportunityOpen,
} from "./customerOpportunity";

export interface CustomerRelationshipEngineInput {
  relationships: CustomerRelationship[];
  interactions: CustomerInteraction[];
  opportunities: CustomerOpportunity[];
  policy: CustomerRelationshipPolicy;
}

export interface CustomerRelationshipRiskSignal {
  id: string;
  accountId: string;
  level: CustomerRelationshipRiskLevel;
  title: string;
  description: string;
  detectedAt: string;
}

export interface CustomerRelationshipEngineResult {
  riskSignals: CustomerRelationshipRiskSignal[];
  openOpportunities: CustomerOpportunity[];
  pipelineWeightedValue: number;
  generatedAt: string;
}

export function runCustomerRelationshipEngine(
  input: CustomerRelationshipEngineInput,
): CustomerRelationshipEngineResult {
  const riskSignals = detectCustomerRelationshipRisks(input);
  const openOpportunities = input.opportunities.filter(isCustomerOpportunityOpen);

  return {
    riskSignals,
    openOpportunities,
    pipelineWeightedValue: openOpportunities.reduce(
      (total, opportunity) =>
        total + calculateCustomerOpportunityWeightedValue(opportunity),
      0,
    ),
    generatedAt: new Date().toISOString(),
  };
}

function detectCustomerRelationshipRisks(
  input: CustomerRelationshipEngineInput,
): CustomerRelationshipRiskSignal[] {
  const healthRisks = input.relationships
    .filter(
      (relationship) =>
        relationship.healthScore < input.policy.minimumHealthScore ||
        relationship.riskLevel === "high" ||
        relationship.riskLevel === "critical",
    )
    .map((relationship) => ({
      id: `crm-risk-health-${relationship.id}`,
      accountId: relationship.accountId,
      level: relationship.riskLevel,
      title: "Customer relationship health risk",
      description: `Customer account ${relationship.accountId} requires attention due to health or risk indicators.`,
      detectedAt: new Date().toISOString(),
    }));

  const interactionRisks = input.interactions
    .filter(isNegativeCustomerInteraction)
    .map((interaction) => ({
      id: `crm-risk-interaction-${interaction.id}`,
      accountId: interaction.accountId,
      level: "medium" as CustomerRelationshipRiskLevel,
      title: "Negative customer interaction detected",
      description: `Customer account ${interaction.accountId} has a negative interaction signal.`,
      detectedAt: new Date().toISOString(),
    }));

  return [...healthRisks, ...interactionRisks];
}