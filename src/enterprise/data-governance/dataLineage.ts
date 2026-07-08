import type { DataGovernanceAuditMetadata } from "./dataGovernanceTypes";

export interface DataLineageNode {
  id: string;
  name: string;
  type: string;
}

export interface DataLineage extends DataGovernanceAuditMetadata {
  id: string;
  assetId: string;
  sources: DataLineageNode[];
  targets: DataLineageNode[];
}

export const createDataLineage = (
  lineage: DataLineage
): DataLineage => lineage;

export const getSourceCount = (lineage: DataLineage): number =>
  lineage.sources.length;

export const getTargetCount = (lineage: DataLineage): number =>
  lineage.targets.length;
