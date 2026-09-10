export function cleanGroundedAIText(text: string): string {
  return text
    // Remove internal evidence identifiers like:
    // [COMPANY-NAME], [COMPANY-INDUSTRY], [DISCOVERY-1]
    .replace(/\[[A-Z0-9_-]+\]/g, "")
    
    // Remove leftover spaces/newlines caused by removed citations
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")

    // Fix spacing before punctuation
    .replace(/\s+([.,!?;:])/g, "$1")

    // Remove empty lines containing only whitespace
    .replace(/^\s+|\s+$/g, "")

    .trim();
}