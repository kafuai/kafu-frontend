import type { EnterpriseMemoryRecord } from "./memoryTypes";

export function searchEnterpriseMemory(
  records: readonly EnterpriseMemoryRecord[],
  keyword: string,
): EnterpriseMemoryRecord[] {
  const normalized = keyword.trim().toLowerCase();

  if (!normalized) {
    return [];
  }

  return records.filter((record) => {
    const values = [
      record.payload.title,
      record.payload.content,
      record.payload.summary ?? "",
      ...record.payload.keywords,
      ...record.metadata.tags,
    ];

    return values.some((value) =>
      value.toLowerCase().includes(normalized),
    );
  });
}