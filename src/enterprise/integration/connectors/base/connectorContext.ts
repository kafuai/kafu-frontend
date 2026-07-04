import { IntegrationExecutionContext } from "../../integrationTypes";

export type ConnectorExecutionContext = IntegrationExecutionContext & {
  requestId?: string;
  timeoutMs?: number;
  retryAttempts?: number;
};