import type {
  DataAssetStatus,
  DataGovernanceAuditMetadata,
  DataTag,
} from "./dataGovernanceTypes";

export interface DataCatalog extends DataGovernanceAuditMetadata {
  id: string;
  name: string;
  description: string;
  owner: string;
  status: DataAssetStatus;
  tags: DataTag[];
}

export const createDataCatalog = (
  catalog: DataCatalog
): DataCatalog => catalog;

export const isCatalogActive = (
  catalog: DataCatalog
): boolean => catalog.status === "active";

export const hasCatalogTag = (
  catalog: DataCatalog,
  key: string
): boolean => catalog.tags.some(tag => tag.key === key);
