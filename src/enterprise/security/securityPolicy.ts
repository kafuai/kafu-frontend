import {
  SecurityPolicyEffect,
  SecurityPermission,
} from "./securityTypes";

export interface SecurityPolicy {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  effect: SecurityPolicyEffect;
  permissions: SecurityPermission[];
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export function createSecurityPolicy(
  input: Omit<SecurityPolicy, "createdAt" | "updatedAt">,
): SecurityPolicy {
  const now = new Date();

  return {
    ...input,
    createdAt: now,
    updatedAt: now,
  };
}