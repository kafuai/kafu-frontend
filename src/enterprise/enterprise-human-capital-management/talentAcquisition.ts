export interface TalentAcquisitionRequest {
  role: string;
  department: string;
  priority: "low" | "medium" | "high";
  approved: boolean;
}

export function canStartTalentAcquisition(
  request: TalentAcquisitionRequest
): boolean {
  return request.approved;
}

export function isCriticalHiring(
  request: TalentAcquisitionRequest
): boolean {
  return request.priority === "high";
}
