import {
  CustomerOpportunity,
  CustomerRelationship,
} from "./customerRelationshipManagementTypes";
import {
  calculateCustomerOpportunityWeightedValue,
  isCustomerOpportunityOpen,
} from "./customerOpportunity";

export interface CustomerRelationshipDashboardSummary {
  totalRelationships: number;
  activeRelationships: number;
  atRiskRelationships: number;
  openOpportunities: number;
  pipelineWeightedValue: number;
  averageHealthScore: number;
}

export function buildCustomerRelationshipDashboardSummary(input: {
  relationships: CustomerRelationship[];
  opportunities: CustomerOpportunity[];
}): CustomerRelationshipDashboardSummary {
  const openOpportunities = input.opportunities.filter(isCustomerOpportunityOpen);

  return {
    totalRelationships: input.relationships.length,
    activeRelationships: input.relationships.filter(
      (relationship) => relationship.status === "active",
    ).length,
    atRiskRelationships: input.relationships.filter(
      (relationship) =>
        relationship.status === "at_risk" ||
        relationship.riskLevel === "high" ||
        relationship.riskLevel === "critical",
    ).length,
    openOpportunities: openOpportunities.length,
    pipelineWeightedValue: openOpportunities.reduce(
      (total, opportunity) =>
        total + calculateCustomerOpportunityWeightedValue(opportunity),
      0,
    ),
    averageHealthScore:
      input.relationships.length === 0
        ? 0
        : Number(
            (
              input.relationships.reduce(
                (total, relationship) => total + relationship.healthScore,
                0,
              ) / input.relationships.length
            ).toFixed(2),
          ),
  };
}