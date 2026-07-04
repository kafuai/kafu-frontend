import {
  IntegrationDefinition,
  IntegrationExecutionContext,
  IntegrationExecutionResult,
} from "../../integrationTypes";
import { BaseConnector } from "../base/baseConnector";

export class WebhookConnector extends BaseConnector {
  readonly id = "webhook-connector";
  readonly provider = "webhook";
  readonly capabilities: Array<"read" | "write" | "sync"> = [
    "read",
    "write",
    "sync",
  ];

  canHandle(integration: IntegrationDefinition): boolean {
    return integration.protocol === "webhook";
  }

  async execute(
    integration: IntegrationDefinition,
    _context: IntegrationExecutionContext,
    payload?: unknown,
  ): Promise<IntegrationExecutionResult> {
    return {
      integrationId: integration.id,
      success: true,
      status: "active",
      message: "Webhook integration executed successfully.",
      data: payload,
      executedAt: new Date(),
    };
  }
}