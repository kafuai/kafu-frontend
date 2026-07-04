import { EnterpriseContext } from "../context";

export function validateEnterpriseContext(
  context: EnterpriseContext,
): boolean {
  return Boolean(
    context.organizationId &&
      context.generatedAt &&
      Array.isArray(context.items),
  );
}