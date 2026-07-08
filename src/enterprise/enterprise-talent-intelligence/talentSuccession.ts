export interface TalentSuccession {
  role: string;
  candidates: string[];
  readinessThreshold: number;
}

export function hasSuccessionCandidates(
  succession: TalentSuccession
): boolean {
  return succession.candidates.length > 0;
}

export function isSuccessionCovered(
  succession: TalentSuccession
): boolean {
  return (
    succession.candidates.length >=
    succession.readinessThreshold
  );
}
