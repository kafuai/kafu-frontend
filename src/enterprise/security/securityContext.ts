import {
  SecurityAuthenticationContext,
  SecurityPrincipal,
} from "./securityTypes";

export interface SecurityContext {
  principal: SecurityPrincipal;
  authentication?: SecurityAuthenticationContext;
  organizationId: string;
  createdAt: Date;
}

export function createSecurityContext(
  principal: SecurityPrincipal,
  authentication?: SecurityAuthenticationContext,
): SecurityContext {
  return {
    principal,
    authentication,
    organizationId: principal.organizationId,
    createdAt: new Date(),
  };
}