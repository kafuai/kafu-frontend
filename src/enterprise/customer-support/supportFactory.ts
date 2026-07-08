import {
  CustomerSupportContext,
  SupportChannel,
} from "./customerSupportTypes";

export interface SupportFactoryInput {
  tenantId: string;
  customerId: string;
  workspaceId?: string;
  channel?: SupportChannel;
}

export function createSupportContext(
  input: SupportFactoryInput,
): CustomerSupportContext {
  return {
    tenantId: input.tenantId,
    customerId: input.customerId,
    workspaceId: input.workspaceId,
    channel: input.channel ?? "portal",
  };
}
