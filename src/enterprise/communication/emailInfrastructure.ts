import { CommunicationMessage } from "./communicationTypes";

export type EmailDeliveryRequest = {
  message: CommunicationMessage;
};

export function createEmailDeliveryRequest(
  message: CommunicationMessage,
): EmailDeliveryRequest {
  return {
    message,
  };
}