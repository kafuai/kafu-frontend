export type IdentityProviderType =
  | "password"
  | "sso"
  | "saml"
  | "oauth"
  | "oidc";

export type IdentityStatus =
  | "active"
  | "inactive"
  | "pending"
  | "suspended";

export type AccessDecision =
  | "allow"
  | "deny"
  | "conditional";

export type PermissionEffect =
  | "allow"
  | "deny";

export interface IdentityAuditMetadata {
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface IdentityCondition {
  key: string;
  operator: "equals" | "not_equals" | "contains" | "in";
  value: string | string[];
}
