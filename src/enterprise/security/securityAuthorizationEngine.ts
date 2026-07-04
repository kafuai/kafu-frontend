import {
  SecurityAuthorizationRequest,
  SecurityAuthorizationResult,
} from "./securityTypes";
import { SecurityPermissionRegistry } from "./securityPermissionRegistry";
import { SecurityRoleRegistry } from "./securityRoleRegistry";
import { authorizeSecurityRequest } from "./securityAuthorization";

export class SecurityAuthorizationEngine {
  constructor(
    private readonly roles: SecurityRoleRegistry,
    private readonly permissions: SecurityPermissionRegistry,
  ) {}

  evaluate(
    request: SecurityAuthorizationRequest,
  ): SecurityAuthorizationResult {
    return authorizeSecurityRequest(
      request,
      this.roles.list(),
      this.permissions.list(),
    );
  }
}