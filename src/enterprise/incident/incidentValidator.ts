import {
  Incident,
  IncidentCreateInput,
} from "./incidentTypes";

export type IncidentValidationResult = {
  valid: boolean;
  errors: string[];
};

export function validateIncidentCreateInput(
  input: IncidentCreateInput,
): IncidentValidationResult {
  const errors: string[] = [];

  if (!input.organizationId) errors.push("Organization id is required.");
  if (!input.title) errors.push("Incident title is required.");
  if (!input.description) errors.push("Incident description is required.");
  if (!input.severity) errors.push("Incident severity is required.");
  if (!input.source) errors.push("Incident source is required.");

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateIncident(
  incident: Incident,
): IncidentValidationResult {
  const errors: string[] = [];

  if (!incident.id) errors.push("Incident id is required.");
  if (!incident.organizationId) errors.push("Organization id is required.");
  if (!incident.title) errors.push("Incident title is required.");
  if (!incident.description) errors.push("Incident description is required.");
  if (!incident.severity) errors.push("Incident severity is required.");
  if (!incident.status) errors.push("Incident status is required.");
  if (!incident.source) errors.push("Incident source is required.");
  if (!incident.createdAt) errors.push("Incident created date is required.");
  if (!incident.updatedAt) errors.push("Incident updated date is required.");

  return {
    valid: errors.length === 0,
    errors,
  };
}