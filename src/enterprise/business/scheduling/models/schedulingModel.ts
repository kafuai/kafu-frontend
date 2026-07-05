import { ShiftType } from "../types/schedulingTypes";

export interface WorkShift {
  id: string;
  organizationId: string;
  name: string;
  type: ShiftType;
  startTime: string;
  endTime: string;
  createdAt: number;
}