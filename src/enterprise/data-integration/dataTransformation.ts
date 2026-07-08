import type { DataIntegrationAuditMetadata } from "./dataIntegrationTypes";

export interface DataTransformation extends DataIntegrationAuditMetadata {
  id: string;
  name: string;
  expression: string;
  enabled: boolean;
}

export const createDataTransformation = (
  transformation: DataTransformation
): DataTransformation => transformation;

export const isTransformationEnabled = (
  transformation: DataTransformation
): boolean => transformation.enabled;

export const disableTransformation = (
  transformation: DataTransformation
): DataTransformation => ({
  ...transformation,
  enabled: false,
});
