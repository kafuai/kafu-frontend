import type {
  TalentProfileRecord,
  TalentStatus,
} from "./talentTypes";

export function createTalentRecord(
  record: TalentProfileRecord
): TalentProfileRecord {
  return {
    ...record,
    updatedAt: new Date().toISOString(),
  };
}

export function updateTalentStatus(
  record: TalentProfileRecord,
  status: TalentStatus
): TalentProfileRecord {
  return {
    ...record,
    status,
    updatedAt: new Date().toISOString(),
  };
}

export function isTalentActive(
  record: TalentProfileRecord
): boolean {
  return record.status === "active";
}
