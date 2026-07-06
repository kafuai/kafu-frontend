import { EnterpriseResponse } from "./responseTypes";

export function createEnterpriseResponseRecord(
  response: EnterpriseResponse,
): EnterpriseResponse {
  return {
    ...response,
    content: response.content.trim(),
    generatedAt: new Date().toISOString(),
  };
}