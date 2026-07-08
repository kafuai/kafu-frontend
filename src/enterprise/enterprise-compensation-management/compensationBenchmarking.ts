export interface CompensationBenchmark {
  market: string;
  internalValue: number;
  externalValue: number;
}

export function calculateMarketDifference(
  benchmark: CompensationBenchmark
): number {
  return (
    benchmark.internalValue -
    benchmark.externalValue
  );
}

export function isCompetitive(
  benchmark: CompensationBenchmark
): boolean {
  return (
    benchmark.internalValue >=
    benchmark.externalValue
  );
}
