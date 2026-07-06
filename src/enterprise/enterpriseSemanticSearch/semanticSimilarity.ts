export function calculateSemanticSimilarity(
  source: string,
  target: string,
): number {
  const sourceTerms = new Set(source.toLowerCase().split(/\s+/));
  const targetTerms = new Set(target.toLowerCase().split(/\s+/));

  const intersection = [...sourceTerms].filter((term) =>
    targetTerms.has(term),
  ).length;

  const union = new Set([
    ...sourceTerms,
    ...targetTerms,
  ]).size;

  return union === 0 ? 0 : intersection / union;
}