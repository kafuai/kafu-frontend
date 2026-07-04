import { AIAccountabilityActor } from "./aiAccountabilityTypes";
import { AIResponsibilityAssignment } from "./aiResponsibilityAssignment";

export interface AIAccountabilityOwnerProfile {
  actor: AIAccountabilityActor;
  activeDecisionIds: string[];
  acceptedResponsibilityCount: number;
  pendingResponsibilityCount: number;
  remediationResponsibilityCount: number;
  lastAssignedAt?: Date;
}

export function buildAIAccountabilityOwnerProfile(
  actor: AIAccountabilityActor,
  assignments: AIResponsibilityAssignment[],
): AIAccountabilityOwnerProfile {
  const ownedAssignments = assignments.filter(
    (assignment) => assignment.actor.id === actor.id,
  );

  return {
    actor,
    activeDecisionIds: Array.from(
      new Set(ownedAssignments.map((assignment) => assignment.decisionId)),
    ),
    acceptedResponsibilityCount: ownedAssignments.filter(
      (assignment) => assignment.status === "accepted",
    ).length,
    pendingResponsibilityCount: ownedAssignments.filter(
      (assignment) => assignment.status === "assigned",
    ).length,
    remediationResponsibilityCount: ownedAssignments.filter(
      (assignment) => assignment.status === "remediation_required",
    ).length,
    lastAssignedAt: ownedAssignments
      .map((assignment) => assignment.createdAt)
      .sort((a, b) => b.getTime() - a.getTime())[0],
  };
}

export function hasAcceptedAccountabilityOwnership(
  profile: AIAccountabilityOwnerProfile,
): boolean {
  return profile.acceptedResponsibilityCount > 0;
}