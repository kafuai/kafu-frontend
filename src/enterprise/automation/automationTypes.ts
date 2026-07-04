export type AutomationTriggerType =
  | "manual"
  | "scheduled"
  | "event"
  | "workflow";

export type AutomationActionType =
  | "workflow"
  | "notification"
  | "assignment"
  | "integration"
  | "decision";

export type AutomationStatus =
  | "draft"
  | "active"
  | "paused"
  | "completed"
  | "failed";

export type AutomationTrigger = {
  type: AutomationTriggerType;
  source?: string;
  eventName?: string;
  schedule?: string;
};

export type AutomationCondition = {
  field: string;
  operator:
    | "equals"
    | "notEquals"
    | "contains"
    | "greaterThan"
    | "lessThan"
    | "exists";
  value?: string | number | boolean;
};

export type AutomationAction = {
  type: AutomationActionType;
  target: string;
  payload?: Record<string, unknown>;
};

export type AutomationDefinition = {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  status: AutomationStatus;
  trigger: AutomationTrigger;
  conditions: AutomationCondition[];
  actions: AutomationAction[];
  createdAt: Date;
  updatedAt: Date;
};