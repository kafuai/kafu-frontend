import {
  CustomerOpportunity,
  CustomerRelationship,
} from "./customerRelationshipManagementTypes";
import { isCustomerOpportunityOpen } from "./customerOpportunity";

export interface CustomerRelationshipExecutiveReport {
  title: string;
  generatedAt: string;
  summary: string;
  totalRelationships: number;
  atRiskRelationships: number;
  openOpportunities: number;
  recommendations: string[];
}

export function buildCustomerRelationshipExecutiveReport(input: {
  relationships: CustomerRelationship[];
  opportunities: CustomerOpportunity[];
  generatedAt?: string;
}): CustomerRelationshipExecutiveReport {
  const atRiskRelationships = input.relationships.filter(
    (relationship) =>
      relationship.status === "at_risk" ||
      relationship.riskLevel === "high" ||
      relationship.riskLevel === "critical",
  ).length;

  const openOpportunities = input.opportunities.filter(
    isCustomerOpportunityOpen,
  ).length;

  return {
    title: "Customer Relationship Executive Report",
    generatedAt: input.generatedAt ?? new Date().toISOString(),
    summary:
      atRiskRelationships > 0
        ? "Customer relationships require executive attention."
        : "Customer relationships are operating within expected parameters.",
    totalRelationships: input.relationships.length,
    atRiskRelationships,
    openOpportunities,
    recommendations: buildCustomerRelationshipRecommendations(
      atRiskRelationships,
      openOpportunities,
    ),
  };
}

function buildCustomerRelationshipRecommendations(
  atRiskRelationships: number,
  openOpportunities: number,
): string[] {
  const recommendations: string[] = [];

  if (atRiskRelationships > 0) {
    recommendations.push(
      "Prioritize outreach for at-risk customer relationships.",
      "Review recent negative interactions and assign follow-up owners.",
    );
  }

  if (openOpportunities > 0) {
    recommendations.push(
      "Review pipeline quality and next actions for open opportunities.",
    );
  }

  if (recommendations.length === 0) {
    recommendations.push(
      "Maintain current CRM operating rhythm and continue monitoring health signals.",
    );
  }

  return recommendations;
}