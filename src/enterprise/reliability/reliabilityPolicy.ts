import { ReliabilityPolicy } from "./reliabilityTypes";

export function createReliabilityPolicy(
  policy: ReliabilityPolicy,
): ReliabilityPolicy {
  return {
    ...policy,
    enabled: policy.enabled ?? true,
  };
}

export function isReliabilityPolicyActive(
  policy: ReliabilityPolicy,
): boolean {
  return policy.enabled;
}

export function matchesReliabilityPolicy(
  policy: ReliabilityPolicy,
  service: string,
): boolean {
  return policy.enabled && policy.targetService === service;
}