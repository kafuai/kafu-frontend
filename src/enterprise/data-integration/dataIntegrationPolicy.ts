import type { DataIntegrationAuditMetadata } from "./dataIntegrationTypes";

export interface DataIntegrationPolicy extends DataIntegrationAuditMetadata {
  id: string;
  name: string;
  retryAttempts: number;
  timeoutSeconds: number;
  stopOnFailure: boolean;
}

export const createDataIntegrationPolicy = (
  policy: DataIntegrationPolicy
): DataIntegrationPolicy => policy;

export const shouldStopOnFailure = (
  policy: DataIntegrationPolicy
): boolean => policy.stopOnFailure;

export const canRetry = (
  policy: DataIntegrationPolicy,
  attempts: number
): boolean => attempts < policy.retryAttempts;
