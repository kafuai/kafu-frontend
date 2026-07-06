import { Position } from "../models/positionModel";
import { CreatePositionInput } from "../types/positionTypes";
import { PositionValidator } from "../utils/positionValidator";

export class PositionManager {
  private readonly validator = new PositionValidator();
  private readonly positions = new Map<string, Position>();

  create(input: CreatePositionInput): Position {
    if (!this.validator.validateCreateInput(input)) {
      throw new Error("Invalid position input.");
    }

    const now = Date.now();

    const position: Position = {
      ...input,
      status: "active",
      createdAt: now,
      updatedAt: now,
    };

    this.positions.set(position.id, position);

    return position;
  }

  get(id: string): Position | undefined {
    return this.positions.get(id);
  }

  list(): Position[] {
    return Array.from(this.positions.values());
  }

  count(): number {
    return this.positions.size;
  }
}