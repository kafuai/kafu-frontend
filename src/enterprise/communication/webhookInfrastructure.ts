import { CommunicationMessage } from "./communicationTypes";

export type WebhookDeliveryRequest = {
  message: CommunicationMessage;
};

export function createWebhookDeliveryRequest(
  message: CommunicationMessage,
): WebhookDeliveryRequest {
  return {
    message,
  };
}