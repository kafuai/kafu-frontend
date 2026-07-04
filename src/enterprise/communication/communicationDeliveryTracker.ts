import { CommunicationDeliveryRecord } from "./communicationDelivery";

export class CommunicationDeliveryTracker {
  private readonly records: CommunicationDeliveryRecord[] = [];

  track(record: CommunicationDeliveryRecord): void {
    this.records.push(record);
  }

  list(): CommunicationDeliveryRecord[] {
    return [...this.records];
  }

  findByMessage(messageId: string): CommunicationDeliveryRecord[] {
    return this.records.filter(
      (record) => record.messageId === messageId,
    );
  }
}