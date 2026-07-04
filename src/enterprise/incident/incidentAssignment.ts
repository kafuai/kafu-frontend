export type IncidentAssignmentInput = {
  incidentId: string;
  assigneeId: string;
  assignedBy: string;
  notes?: string;
};

export type IncidentAssignment = IncidentAssignmentInput & {
  assignedAt: Date;
};

export function assignIncident(
  input: IncidentAssignmentInput,
): IncidentAssignment {
  return {
    ...input,
    assignedAt: new Date(),
  };
}

export function reassignIncident(
  assignment: IncidentAssignment,
  assigneeId: string,
): IncidentAssignment {
  return {
    ...assignment,
    assigneeId,
    assignedAt: new Date(),
  };
}