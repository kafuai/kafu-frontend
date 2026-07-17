import type {
  ExecutiveDemoAudienceType,
  ExecutiveDemoEnvironmentConfiguration,
} from "./executiveDemoEnvironmentTypes";

export interface ExecutiveDemoAudienceProfile {
  audience: ExecutiveDemoAudienceType;
  narrativeDepth: "brief" | "balanced" | "detailed";
  showFinancialImpact: boolean;
  showOperationalDetail: boolean;
  showTechnicalDetail: boolean;
  presentationStyle: "strategic" | "commercial" | "technical";
}

const audienceProfiles: Record<
  ExecutiveDemoAudienceType,
  Omit<ExecutiveDemoAudienceProfile, "audience">
> = {
  executive: {
    narrativeDepth: "balanced",
    showFinancialImpact: true,
    showOperationalDetail: true,
    showTechnicalDetail: false,
    presentationStyle: "strategic",
  },
  board: {
    narrativeDepth: "brief",
    showFinancialImpact: true,
    showOperationalDetail: false,
    showTechnicalDetail: false,
    presentationStyle: "strategic",
  },
  investor: {
    narrativeDepth: "brief",
    showFinancialImpact: true,
    showOperationalDetail: false,
    showTechnicalDetail: false,
    presentationStyle: "commercial",
  },
  client: {
    narrativeDepth: "balanced",
    showFinancialImpact: true,
    showOperationalDetail: true,
    showTechnicalDetail: false,
    presentationStyle: "commercial",
  },
  internal: {
    narrativeDepth: "detailed",
    showFinancialImpact: true,
    showOperationalDetail: true,
    showTechnicalDetail: true,
    presentationStyle: "technical",
  },
};

export function resolveExecutiveDemoAudienceProfile(
  configuration: ExecutiveDemoEnvironmentConfiguration,
): ExecutiveDemoAudienceProfile {
  return {
    audience: configuration.runtime.audience,
    ...audienceProfiles[configuration.runtime.audience],
  };
}
