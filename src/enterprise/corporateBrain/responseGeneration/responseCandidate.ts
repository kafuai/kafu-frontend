import { EnterpriseResponse } from "./responseTypes";

export interface ResponseCandidate {
  id: string;
  response: EnterpriseResponse;
  score: number;
  reason: string;
}

export function selectBestResponseCandidate(
  candidates: ResponseCandidate[],
): ResponseCandidate | undefined {
  return [...candidates].sort((a, b) => b.score - a.score)[0];
}