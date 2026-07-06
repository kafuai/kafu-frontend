import { ResponseCandidate, selectBestResponseCandidate } from "./responseCandidate";
import { ResponseCitation } from "./responseCitation";
import {
  calculateResponseConfidence,
  ResponseConfidence,
} from "./responseConfidence";
import { formatEnterpriseResponse, ResponseFormat } from "./responseFormatter";
import { EnterpriseResponse } from "./responseTypes";

export interface ResponseEngineInput {
  candidates: ResponseCandidate[];
  citations: ResponseCitation[];
  confidence: ResponseConfidence;
  format: ResponseFormat;
}

export interface ResponseEngineOutput {
  response: EnterpriseResponse;
  formatted: string;
  citations: ResponseCitation[];
  confidence: number;
}

export function generateEnterpriseResponse(
  input: ResponseEngineInput,
): ResponseEngineOutput {
  const candidate = selectBestResponseCandidate(input.candidates);

  if (!candidate) {
    throw new Error("No response candidates available.");
  }

  return {
    response: candidate.response,
    formatted: formatEnterpriseResponse(
      candidate.response,
      input.format,
    ),
    citations: input.citations,
    confidence: calculateResponseConfidence(input.confidence),
  };
}