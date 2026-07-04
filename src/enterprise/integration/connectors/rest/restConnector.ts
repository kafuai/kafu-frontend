import {
  IntegrationDefinition,
  IntegrationExecutionContext,
  IntegrationExecutionResult,
} from "../../integrationTypes";
import { BaseConnector } from "../base/baseConnector";

export class RestConnector extends BaseConnector {
  readonly id = "rest-connector";
  readonly provider = "rest";
  readonly capabilities: Array<"read" | "write" | "sync"> = [
    "read",
    "write",
    "sync",
  ];

  canHandle(integration: IntegrationDefinition): boolean {
    return integration.protocol === "rest";
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
      message: "REST integration executed successfully.",
      data: payload,
      executedAt: new Date(),
    };
  }
}