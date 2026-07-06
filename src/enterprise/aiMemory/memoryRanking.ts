import type { EnterpriseMemoryConfidence, EnterpriseMemoryRecord } from "./memoryTypes";

const confidenceScore: Record<EnterpriseMemoryConfidence, number> = {
  low: 1,
  medium: 2,
  high: 3,
  verified: 4,
};

export function rankEnterpriseMemory(
  records: readonly EnterpriseMemoryRecord[],
): EnterpriseMemoryRecord[] {
  return [...records].sort((first, second) => {
    const confidenceDifference =
      confidenceScore[second.confidence] - confidenceScore[first.confidence];

    if (confidenceDifference !== 0) {
      return confidenceDifference;
    }

    return (
      new Date(second.metadata.updatedAt).getTime() -
      new Date(first.metadata.updatedAt).getTime()
    );
  });
}