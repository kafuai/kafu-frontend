import {
  createAIAgentProfile,
  activateAIAgentProfile,
} from "../aiAgentProfileFactory";

export function createEmployeeExperienceAgentProfile(
  organizationId: string,
) {
  const profile =
    createAIAgentProfile({
      id: "employee-experience-manager",

      organizationId,

      name:
        "Employee Experience Manager",

      description:
        "Handles employee requests, inquiries, letters, and leave workflows.",

      ownerTeam:
        "Human Resources",

      autonomyLevel:
        "supervised",

      decisionMode:
        "human_approval_required",

      riskLevel:
        "medium",

      systemPurpose:
        "Process routine employee requests while maintaining company and employee context.",

      capabilities: [
        {
          id: "leave-request",
          name: "Leave Request",
          type: "workflow_execution",
          description:
            "Create and track employee leave requests.",
          enabled: true,
          requiresApproval: true,
          riskLevel: "medium",
        },
      ],

      permissions: [
        {
          id: "create-leave-request",
          resource: "employee_leave_requests",
          action: "create",
          allowed: true,
          requiresAudit: true,
        },
      ],

      operatingBoundaries: [
        "Never approve leave automatically.",
        "Only operate within the authenticated organization.",
        "Require manager approval for leave requests.",
      ],

      escalationRules: [
        "Escalate unclear requests.",
        "Escalate authorization failures.",
        "Escalate policy conflicts.",
      ],
    });

  return activateAIAgentProfile(profile);
}