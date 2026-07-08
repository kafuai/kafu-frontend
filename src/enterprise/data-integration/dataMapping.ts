import type { DataIntegrationAuditMetadata } from "./dataIntegrationTypes";

export interface DataMappingField {
  sourceField: string;
  targetField: string;
  required: boolean;
}

export interface DataMapping extends DataIntegrationAuditMetadata {
  id: string;
  name: string;
  sourceId: string;
  sinkId: string;
  fields: DataMappingField[];
}

export const createDataMapping = (
  mapping: DataMapping
): DataMapping => mapping;

export const requiredFieldCount = (
  mapping: DataMapping
): number => mapping.fields.filter(field => field.required).length;

export const hasFieldMapping = (
  mapping: DataMapping,
  sourceField: string
): boolean => mapping.fields.some(field => field.sourceField === sourceField);
