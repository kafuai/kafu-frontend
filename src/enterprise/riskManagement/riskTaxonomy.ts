import {
  EnterpriseRiskCategory,
  EnterpriseRiskSeverity,
  EnterpriseRiskLikelihood,
} from "./riskTypes";

export interface EnterpriseRiskTaxonomyDefinition {
  category: EnterpriseRiskCategory;
  description: string;
  defaultSeverity: EnterpriseRiskSeverity;
  defaultLikelihood: EnterpriseRiskLikelihood;
  businessImpactFocus: string[];
}

export const enterpriseRiskTaxonomy: EnterpriseRiskTaxonomyDefinition[] = [
  {
    category: "strategic",
    description: "Risks affecting long-term business direction and market positioning.",
    defaultSeverity: "high",
    defaultLikelihood: "possible",
    businessImpactFocus: ["growth", "marketPosition", "executiveDecisionMaking"],
  },
  {
    category: "operational",
    description: "Risks affecting internal operations, delivery, processes, and service quality.",
    defaultSeverity: "medium",
    defaultLikelihood: "likely",
    businessImpactFocus: ["operations", "serviceDelivery", "processReliability"],
  },
  {
    category: "financial",
    description: "Risks affecting budgets, revenue, costs, cash flow, or financial controls.",
    defaultSeverity: "high",
    defaultLikelihood: "possible",
    businessImpactFocus: ["cost", "revenue", "budgetControl"],
  },
  {
    category: "compliance",
    description: "Risks related to laws, regulations, policies, obligations, and audit readiness.",
    defaultSeverity: "high",
    defaultLikelihood: "possible",
    businessImpactFocus: ["regulatoryExposure", "auditReadiness", "policyCompliance"],
  },
  {
    category: "technology",
    description: "Risks affecting systems, architecture, scalability, integrations, or technical debt.",
    defaultSeverity: "medium",
    defaultLikelihood: "likely",
    businessImpactFocus: ["platformReliability", "architecture", "scalability"],
  },
  {
    category: "security",
    description: "Risks affecting confidentiality, integrity, availability, identity, or access.",
    defaultSeverity: "critical",
    defaultLikelihood: "possible",
    businessImpactFocus: ["dataProtection", "accessControl", "systemSecurity"],
  },
  {
    category: "vendor",
    description: "Risks caused by suppliers, third parties, outsourcing, or external dependencies.",
    defaultSeverity: "medium",
    defaultLikelihood: "possible",
    businessImpactFocus: ["thirdPartyReliability", "contracts", "dependencyRisk"],
  },
  {
    category: "reputation",
    description: "Risks affecting public trust, brand confidence, stakeholders, or customer perception.",
    defaultSeverity: "high",
    defaultLikelihood: "possible",
    businessImpactFocus: ["trust", "brand", "stakeholderConfidence"],
  },
  {
    category: "businessContinuity",
    description: "Risks affecting continuity, resilience, recovery, or critical service availability.",
    defaultSeverity: "critical",
    defaultLikelihood: "possible",
    businessImpactFocus: ["continuity", "resilience", "criticalServices"],
  },
];

export function getEnterpriseRiskTaxonomy(
  category: EnterpriseRiskCategory,
): EnterpriseRiskTaxonomyDefinition | undefined {
  return enterpriseRiskTaxonomy.find((item) => item.category === category);
}