import {
  CreatePositionInput,
  PositionStatus,
} from "../types/positionTypes";

export interface Position extends CreatePositionInput {
  readonly status: PositionStatus;
  readonly createdAt: number;
  readonly updatedAt: number;
}