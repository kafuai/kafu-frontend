import { SecurityPolicy } from "./securityPolicy";
import {
  SecurityPermission,
  SecurityPolicyEffect,
} from "./securityTypes";

export interface SecurityPolicyFactoryInput {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  effect?: SecurityPolicyEffect;
  permissions: SecurityPermission[];
  enabled?: boolean;
}

export function createEnterpriseSecurityPolicy(
  input: SecurityPolicyFactoryInput,
): SecurityPolicy {
  const now = new Date();

  return {
    id: input.id,
    organizationId: input.organizationId,
    name: input.name,
    description: input.description,
    effect: input.effect ?? "allow",
    permissions: input.permissions,
    enabled: input.enabled ?? true,
    createdAt: now,
    updatedAt: now,
  };
}