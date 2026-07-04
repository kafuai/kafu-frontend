import {
  ArchitectureConstraint,
  ArchitectureCriticality,
  ArchitectureLifecycleStatus,
  ArchitectureMaturityLevel,
  ArchitectureQualityAttribute,
} from "./architectureTypes";

export interface ArchitectureDomain {
  id: string;
  name: string;
  description: string;
  owner: string;
  status: ArchitectureLifecycleStatus;
  maturityLevel: ArchitectureMaturityLevel;
  criticality: ArchitectureCriticality;
  capabilities: string[];
  systems: string[];
  qualityAttributes: ArchitectureQualityAttribute[];
  constraints: ArchitectureConstraint[];
}

export function createArchitectureDomain(params: ArchitectureDomain): ArchitectureDomain {
  return {
    ...params,
    capabilities: [...params.capabilities],
    systems: [...params.systems],
    qualityAttributes: [...params.qualityAttributes],
    constraints: [...params.constraints],
  };
}

export function isArchitectureDomainActive(domain: ArchitectureDomain): boolean {
  return domain.status === "active";
}

export function getMissionCriticalDomains(
  domains: ArchitectureDomain[],
): ArchitectureDomain[] {
  return domains.filter((domain) => domain.criticality === "mission-critical");
}