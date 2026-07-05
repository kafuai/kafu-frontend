export type ShiftType =
  | "morning"
  | "evening"
  | "night"
  | "flexible";

export interface WorkShiftInput {
  id: string;
  organizationId: string;
  name: string;
  type: ShiftType;
  startTime: string;
  endTime: string;
}