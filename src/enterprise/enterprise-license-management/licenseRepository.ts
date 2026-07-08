export interface LicenseRepository {
  id: string;
  name: string;
  encryptionEnabled: boolean;
  retentionPolicy?: string;
}
