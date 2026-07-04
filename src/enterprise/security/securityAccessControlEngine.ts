import {
  SecurityAuthorizationRequest,
  SecurityAuthorizationResult,
} from "./securityTypes";
import { SecurityAuthorizationEngine } from "./securityAuthorizationEngine";

export class SecurityAccessControlEngine {
  constructor(
    private readonly authorizationEngine: SecurityAuthorizationEngine,
  ) {}

  canAccess(
    request: SecurityAuthorizationRequest,
  ): SecurityAuthorizationResult {
    return this.authorizationEngine.evaluate(request);
  }
}