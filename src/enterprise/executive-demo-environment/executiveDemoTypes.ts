export type DemoStatus =
  | "draft"
  | "ready"
  | "running"
  | "completed";

export interface DemoScenarioModel {
  id: string;
  name: string;
  status: DemoStatus;
}

export interface DemoDatasetModel {
  id: string;
  name: string;
  records: number;
}

export interface ExecutiveDemoModel {
  environment: string;
  scenarios: DemoScenarioModel[];
  datasets: DemoDatasetModel[];
}
