import { CommunicationMessage } from "./communicationTypes";
import { prepareNotification } from "./notificationInfrastructure";

export function dispatchCommunication(
  message: CommunicationMessage,
): CommunicationMessage {
  return prepareNotification(message);
}