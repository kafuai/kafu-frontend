import { EnterpriseResponse } from "./responseTypes";

export type ResponseFormat =
  | "plain_text"
  | "markdown"
  | "html"
  | "json";

export function formatEnterpriseResponse(
  response: EnterpriseResponse,
  format: ResponseFormat,
): string {
  switch (format) {
    case "json":
      return JSON.stringify(response, null, 2);

    case "markdown":
      return `# Response\n\n${response.content}`;

    case "html":
      return `<article><p>${response.content}</p></article>`;

    default:
      return response.content;
  }
}