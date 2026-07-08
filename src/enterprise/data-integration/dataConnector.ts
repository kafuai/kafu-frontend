import type {
  DataConnectorType,
  DataIntegrationAuditMetadata,
  DataIntegrationStatus,
} from "./dataIntegrationTypes";

export interface DataConnector extends DataIntegrationAuditMetadata {
  id: string;
  name: string;
  type: DataConnectorType;
  status: DataIntegrationStatus;
  endpoint?: string;
  owner: string;
}

export const createDataConnector = (
  connector: DataConnector
): DataConnector => connector;

export const isConnectorActive = (
  connector: DataConnector
): boolean => connector.status === "active";

export const isApiConnector = (
  connector: DataConnector
): boolean => connector.type === "api";
