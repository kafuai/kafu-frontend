import { CommunicationMessage } from "./communicationTypes";

export type SmsDeliveryRequest = {
  message: CommunicationMessage;
};

export function createSmsDeliveryRequest(
  message: CommunicationMessage,
): SmsDeliveryRequest {
  return {
    message,
  };
}