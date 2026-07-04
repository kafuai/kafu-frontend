import { AIAgentProfile } from "./aiAgentTypes";

export interface AIAgentValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateAIAgentProfile(
  profile: AIAgentProfile,
): AIAgentValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!profile.id.trim()) {
    errors.push("Agent id is required.");
  }

  if (!profile.organizationId.trim()) {
    errors.push("Organization id is required.");
  }

  if (!profile.name.trim()) {
    errors.push("Agent name is required.");
  }

  if (!profile.ownerTeam.trim()) {
    errors.push("Owner team is required.");
  }

  if (!profile.systemPurpose.trim()) {
    errors.push("System purpose is required.");
  }

  if (profile.capabilities.length === 0) {
    warnings.push("Agent has no declared capabilities.");
  }

  if (profile.permissions.length === 0) {
    warnings.push("Agent has no declared permissions.");
  }

  if (
    profile.riskLevel === "critical" &&
    profile.decisionMode === "fully_delegated"
  ) {
    errors.push("Critical-risk agents cannot use fully delegated decision mode.");
  }

  if (
    profile.autonomyLevel === "autonomous" &&
    profile.escalationRules.length === 0
  ) {
    errors.push("Autonomous agents require escalation rules.");
  }

  if (
    profile.decisionMode !== "recommend_only" &&
    profile.operatingBoundaries.length === 0
  ) {
    errors.push("Executable agents require operating boundaries.");
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

export function assertValidAIAgentProfile(profile: AIAgentProfile): void {
  const result = validateAIAgentProfile(profile);

  if (!result.valid) {
    throw new Error(result.errors.join(" "));
  }
}