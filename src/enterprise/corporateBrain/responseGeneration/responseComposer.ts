import { EnterpriseResponse, ResponsePurpose, ResponseTone } from "./responseTypes";

export function composeEnterpriseResponse(input: {
  id: string;
  tenantId: string;
  purpose: ResponsePurpose;
  tone: ResponseTone;
  content: string;
}): EnterpriseResponse {
  return {
    ...input,
    content: input.content.trim(),
    generatedAt: new Date().toISOString(),
  };
}