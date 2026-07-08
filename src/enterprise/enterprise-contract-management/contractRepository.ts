export interface ContractRepository {
  id: string;
  name: string;
  location: string;
  retentionPolicy?: string;
  encryptionEnabled: boolean;
}
