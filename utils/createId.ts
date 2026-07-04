export function createId(prefix = "kafu"): string {
  return `${prefix}_${crypto.randomUUID()}`;
}