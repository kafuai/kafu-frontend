import type {
  DataConnectorType,
  DataIntegrationAuditMetadata,
  DataIntegrationStatus,
} from "./dataIntegrationTypes";

export interface DataSource extends DataIntegrationAuditMetadata {
  id: string;
  name: string;
  type: DataConnectorType;
  status: DataIntegrationStatus;
  connectorId: string;
  schema?: string;
}

export const createDataSource = (
  source: DataSource
): DataSource => source;

export const isSourceActive = (
  source: DataSource
): boolean => source.status === "active";

export const hasSourceSchema = (
  source: DataSource
): boolean => Boolean(source.schema);
