import {
  SecurityAuthorizationRequest,
  SecurityAuthorizationResult,
} from "./securityTypes";
import { SecurityEngine } from "./securityEngine";

export class SecurityRuntime {
  private readonly engine = new SecurityEngine();

  evaluate(
    request: SecurityAuthorizationRequest,
  ): SecurityAuthorizationResult {
    return this.engine.evaluateAccess(request);
  }

  getEngine(): SecurityEngine {
    return this.engine;
  }
}