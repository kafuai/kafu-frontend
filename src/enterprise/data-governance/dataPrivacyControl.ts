import type { DataGovernanceAuditMetadata } from "./dataGovernanceTypes";

export interface DataPrivacyControl extends DataGovernanceAuditMetadata {
  id: string;
  assetId: string;
  encryptionRequired: boolean;
  maskingRequired: boolean;
  anonymizationRequired: boolean;
}

export const createDataPrivacyControl = (
  control: DataPrivacyControl
): DataPrivacyControl => control;

export const requiresProtection = (
  control: DataPrivacyControl
): boolean =>
  control.encryptionRequired ||
  control.maskingRequired ||
  control.anonymizationRequired;

export const requiresEncryption = (
  control: DataPrivacyControl
): boolean => control.encryptionRequired;
