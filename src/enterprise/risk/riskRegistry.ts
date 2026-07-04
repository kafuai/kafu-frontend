import { EnterpriseRisk, RiskStatus } from "./riskTypes";

export type RiskRegistryFilter = {
  organizationId?: string;
  status?: RiskStatus;
  ownerId?: string;
};

export type RiskRegistry = {
  risks: EnterpriseRisk[];
};

export function createRiskRegistry(
  risks: EnterpriseRisk[] = [],
): RiskRegistry {
  return {
    risks,
  };
}

export function registerRisk(
  registry: RiskRegistry,
  risk: EnterpriseRisk,
): RiskRegistry {
  const exists = registry.risks.some((item) => item.id === risk.id);

  return {
    risks: exists
      ? registry.risks.map((item) => (item.id === risk.id ? risk : item))
      : [...registry.risks, risk],
  };
}

export function removeRisk(
  registry: RiskRegistry,
  riskId: string,
): RiskRegistry {
  return {
    risks: registry.risks.filter((risk) => risk.id !== riskId),
  };
}

export function findRiskById(
  registry: RiskRegistry,
  riskId: string,
): EnterpriseRisk | undefined {
  return registry.risks.find((risk) => risk.id === riskId);
}

export function filterRisks(
  registry: RiskRegistry,
  filter: RiskRegistryFilter,
): EnterpriseRisk[] {
  return registry.risks.filter((risk) => {
    if (filter.organizationId && risk.organizationId !== filter.organizationId) {
      return false;
    }

    if (filter.status && risk.status !== filter.status) {
      return false;
    }

    if (filter.ownerId && risk.owner.id !== filter.ownerId) {
      return false;
    }

    return true;
  });
}