import { IntegrationEvent } from "./integrationEvents";

export type IntegrationAuditRecord = {
  id: string;
  integrationId: string;
  event: IntegrationEvent;
  recordedAt: Date;
};

export class IntegrationAudit {
  private readonly records: IntegrationAuditRecord[] = [];

  record(record: IntegrationAuditRecord): void {
    this.records.push(record);
  }

  list(): IntegrationAuditRecord[] {
    return [...this.records];
  }

  clear(): void {
    this.records.length = 0;
  }
}