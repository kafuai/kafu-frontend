import { EnterpriseContext } from "./contextTypes";

export interface ContextProfile {
  id: string;
  tenantId: string;
  subjectId: string;
  subjectType: "user" | "team" | "department" | "organization" | "process";
  contexts: EnterpriseContext[];
  activeContextIds: string[];
  lastResolvedAt?: string;
}

export function createContextProfile(input: {
  id: string;
  tenantId: string;
  subjectId: string;
  subjectType: ContextProfile["subjectType"];
  contexts?: EnterpriseContext[];
}): ContextProfile {
  return {
    id: input.id,
    tenantId: input.tenantId,
    subjectId: input.subjectId,
    subjectType: input.subjectType,
    contexts: input.contexts ?? [],
    activeContextIds: input.contexts?.map((context) => context.id) ?? [],
  };
}