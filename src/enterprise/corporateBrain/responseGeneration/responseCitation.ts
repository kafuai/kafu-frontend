export interface ResponseCitation {
  id: string;
  title: string;
  source: string;
  reference: string;
  confidence: number;
}

export function sortResponseCitations(
  citations: ResponseCitation[],
): ResponseCitation[] {
  return [...citations].sort(
    (a, b) => b.confidence - a.confidence,
  );
}