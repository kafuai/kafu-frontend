import { SecurityAuthorizationRequest, SecurityAuthorizationResult } from "./securityTypes";

export interface SecurityDecisionHistoryRecord {
  id: string;
  request: SecurityAuthorizationRequest;
  result: SecurityAuthorizationResult;
  decidedAt: Date;
}

export class SecurityDecisionHistory {
  private readonly records: SecurityDecisionHistoryRecord[] = [];

  add(record: SecurityDecisionHistoryRecord): void {
    this.records.push(record);
  }

  list(): SecurityDecisionHistoryRecord[] {
    return [...this.records];
  }

  clear(): void {
    this.records.length = 0;
  }
}