import type { EnterpriseMemoryRecord } from "./memoryTypes";

export function isEnterpriseMemoryExpired(
  record: EnterpriseMemoryRecord,
  now: Date = new Date(),
): boolean {
  if (!record.retention.expiresAt) {
    return false;
  }

  return new Date(record.retention.expiresAt).getTime() <= now.getTime();
}

export function shouldReviewEnterpriseMemory(
  record: EnterpriseMemoryRecord,
  now: Date = new Date(),
): boolean {
  if (!record.retention.reviewAfter) {
    return false;
  }

  return new Date(record.retention.reviewAfter).getTime() <= now.getTime();
}

export function filterReusableEnterpriseMemory(
  records: readonly EnterpriseMemoryRecord[],
): EnterpriseMemoryRecord[] {
  return records.filter(
    (record) =>
      record.status === "active" &&
      !isEnterpriseMemoryExpired(record) &&
      record.retention.allowReasoningReuse,
  );
}