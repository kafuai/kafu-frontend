import {
  SecurityAuthorizationRequest,
  SecurityAuthorizationResult,
} from "./securityTypes";
import { SecurityEngine } from "./securityEngine";

export class SecurityIntegration {
  constructor(private readonly engine: SecurityEngine) {}

  evaluateEnterpriseAccess(
    request: SecurityAuthorizationRequest,
  ): SecurityAuthorizationResult {
    return this.engine.evaluateAccess(request);
  }
}