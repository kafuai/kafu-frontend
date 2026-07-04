import {
  SecurityAuthorizationRequest,
  SecurityAuthorizationResult,
  SecurityPermission,
  SecurityRole,
} from "./securityTypes";
import { authorizeSecurityRequest } from "./securityAuthorization";

export interface SecurityAccessEvaluation {
  request: SecurityAuthorizationRequest;
  result: SecurityAuthorizationResult;
  evaluatedAt: Date;
}

export function evaluateSecurityAccess(
  request: SecurityAuthorizationRequest,
  roles: SecurityRole[],
  permissions: SecurityPermission[],
): SecurityAccessEvaluation {
  return {
    request,
    result: authorizeSecurityRequest(request, roles, permissions),
    evaluatedAt: new Date(),
  };
}