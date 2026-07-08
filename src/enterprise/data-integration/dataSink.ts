import type {
  DataConnectorType,
  DataIntegrationAuditMetadata,
  DataIntegrationStatus,
} from "./dataIntegrationTypes";

export interface DataSink extends DataIntegrationAuditMetadata {
  id: string;
  name: string;
  type: DataConnectorType;
  status: DataIntegrationStatus;
  connectorId: string;
  destination: string;
}

export const createDataSink = (
  sink: DataSink
): DataSink => sink;

export const isSinkActive = (
  sink: DataSink
): boolean => sink.status === "active";

export const isWarehouseSink = (
  sink: DataSink
): boolean => sink.type === "warehouse";
