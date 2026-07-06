export type ContextScopeType =
  | "global"
  | "organization"
  | "department"
  | "team"
  | "user"
  | "session";

export interface ContextScope {
  id: string;
  tenantId: string;
  type: ContextScopeType;
  referenceId: string;
  inheritedScopes: string[];
}

export function isScopeMatch(
  scope: ContextScope,
  type: ContextScopeType,
  referenceId: string,
): boolean {
  return scope.type === type && scope.referenceId === referenceId;
}