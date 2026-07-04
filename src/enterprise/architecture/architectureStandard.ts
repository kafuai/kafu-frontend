import { ArchitectureLifecycleStatus } from "./architectureTypes";

export interface ArchitectureStandard {
  id: string;
  name: string;
  category: string;
  description: string;
  version: string;
  status: ArchitectureLifecycleStatus;
}

export function createArchitectureStandard(
  standard: ArchitectureStandard,
): ArchitectureStandard {
  return { ...standard };
}

export function getActiveArchitectureStandards(
  standards: ArchitectureStandard[],
): ArchitectureStandard[] {
  return standards.filter(
    (standard) => standard.status === "active",
  );
}