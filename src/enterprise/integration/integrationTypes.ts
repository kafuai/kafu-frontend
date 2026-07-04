export type IntegrationStatus =
  | "inactive"
  | "active"
  | "degraded"
  | "failed";

export type IntegrationDirection =
  | "inbound"
  | "outbound"
  | "bidirectional";

export type IntegrationProtocol =
  | "rest"
  | "graphql"
  | "webhook"
  | "event"
  | "file"
  | "database"
  | "custom";

export type IntegrationDefinition = {
  id: string;
  organizationId: string;
  name: string;
  provider: string;
  protocol: IntegrationProtocol;
  direction: IntegrationDirection;
  status: IntegrationStatus;
  description?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
};

export type IntegrationExecutionContext = {
  organizationId: string;
  integrationId: string;
  correlationId?: string;
  initiatedBy?: string;
  metadata?: Record<string, unknown>;
};

export type IntegrationExecutionResult = {
  integrationId: string;
  success: boolean;
  status: IntegrationStatus;
  message?: string;
  data?: unknown;
  errors?: string[];
  executedAt: Date;
};