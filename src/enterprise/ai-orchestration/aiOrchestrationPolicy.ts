export interface AIOrchestrationPolicy {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  enabled: boolean;
  requiredApprovals: number;
  allowedCapabilities: string[];
  blockedCapabilities: string[];
  enforceGuardrails: boolean;
}

export function isCapabilityAllowed(
  policy: AIOrchestrationPolicy,
  capability: string,
): boolean {
  if (!policy.enabled) {
    return true;
  }

  if (policy.blockedCapabilities.includes(capability)) {
    return false;
  }

  if (policy.allowedCapabilities.length === 0) {
    return true;
  }

  return policy.allowedCapabilities.includes(capability);
}