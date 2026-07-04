export type SecurityPrincipalType =
  | "user"
  | "service"
  | "apiKey"
  | "system";

export type AuthenticationMethod =
  | "password"
  | "oauth"
  | "saml"
  | "oidc"
  | "apiKey"
  | "token";

export type AuthorizationDecision =
  | "allow"
  | "deny";

export type SecurityPolicyEffect =
  | "allow"
  | "deny";

export type SecurityAuditSeverity =
  | "info"
  | "warning"
  | "critical";

export interface SecurityPrincipal {
  id: string;
  organizationId: string;
  type: SecurityPrincipalType;
  roles: string[];
}

export interface SecurityPermission {
  id: string;
  name: string;
  resource: string;
  action: string;
  description?: string;
}

export interface SecurityRole {
  id: string;
  name: string;
  description?: string;
  permissions: string[];
}

export interface SecurityPolicyReference {
  id: string;
  name: string;
}

export interface SecurityAuthenticationContext {
  principalId: string;
  method: AuthenticationMethod;
  authenticatedAt: Date;
}

export interface SecurityAuthorizationRequest {
  principal: SecurityPrincipal;
  resource: string;
  action: string;
}

export interface SecurityAuthorizationResult {
  decision: AuthorizationDecision;
  reason?: string;
}

export interface SecurityAuditRecord {
  id: string;
  organizationId: string;
  principalId: string;
  action: string;
  resource: string;
  severity: SecurityAuditSeverity;
  timestamp: Date;
}

export interface SecurityEvent {
  type: string;
  organizationId: string;
  timestamp: Date;
  payload?: Record<string, unknown>;
}