export function cleanGroundedAIText(text: string): string {
  return text
    // Remove internal evidence identifiers like:
    // [COMPANY-NAME], [DISCOVERY-1], [ca34d0ef-fdb2-4ef6-b401-...]
    .replace(/\[[A-Za-z0-9_-]+\]/gi, "")

    // Remove leftover spaces/newlines caused by removed citations
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")

    // Fix spacing before punctuation
    .replace(/\s+([.,!?;:])/g, "$1")

    // Remove empty lines containing only whitespace
    .replace(/^\s+|\s+$/g, "")

    .trim();
}