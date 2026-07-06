import { EnterpriseContext } from "./contextTypes";

export interface ContextAccessPolicy {
  id: string;
  tenantId: string;
  allowedSourceTypes: string[];
  blockedTags: string[];
}

export function canUseContext(
  context: EnterpriseContext,
  policy: ContextAccessPolicy,
): boolean {
  return (
    policy.allowedSourceTypes.includes(context.metadata.source) &&
    !context.metadata.tags.some((tag) => policy.blockedTags.includes(tag))
  );
}