import {
  assertCommunicationPermission,
  evaluateCommunicationPermission,
  type CommunicationPermissionAction,
  type CommunicationPermissionContext,
  type CommunicationPermissionDecision,
  type CommunicationPermissionRule,
} from "../domain/permissionModels";

export interface CommunicationAuthorizationRequest {
  readonly action: CommunicationPermissionAction;
  readonly context: CommunicationPermissionContext;
  readonly isResourceOwner?: boolean;
}

export class CommunicationAuthorizationService {
  constructor(
    private readonly rules?:
      readonly CommunicationPermissionRule[],
  ) {}

  evaluate(
    request: CommunicationAuthorizationRequest,
  ): CommunicationPermissionDecision {
    return evaluateCommunicationPermission(
      request.action,
      request.context,
      this.rules,
      request.isResourceOwner ?? false,
    );
  }

  assert(
    request: CommunicationAuthorizationRequest,
  ): void {
    assertCommunicationPermission(
      request.action,
      request.context,
      this.rules,
      request.isResourceOwner ?? false,
    );
  }
}
