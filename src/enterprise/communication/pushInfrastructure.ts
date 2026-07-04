import { CommunicationMessage } from "./communicationTypes";

export type PushDeliveryRequest = {
  message: CommunicationMessage;
};

export function createPushDeliveryRequest(
  message: CommunicationMessage,
): PushDeliveryRequest {
  return {
    message,
  };
}