export type KPILevel =
  | "employee"
  | "department"
  | "organization";

export interface KPIInput {
  id: string;
  organizationId: string;
  level: KPILevel;
  referenceId: string;
  name: string;
  target: number;
  actual: number;
}