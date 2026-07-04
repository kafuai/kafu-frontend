import {
  AuthenticationMethod,
  SecurityAuthenticationContext,
  SecurityPrincipal,
} from "./securityTypes";

export interface SecurityAuthenticationRequest {
  principal: SecurityPrincipal;
  method: AuthenticationMethod;
}

export function createSecurityAuthenticationContext(
  request: SecurityAuthenticationRequest,
): SecurityAuthenticationContext {
  return {
    principalId: request.principal.id,
    method: request.method,
    authenticatedAt: new Date(),
  };
}