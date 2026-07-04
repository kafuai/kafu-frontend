import { CommunicationMessage } from "./communicationTypes";

export type InAppNotification = {
  message: CommunicationMessage;
  read: boolean;
};

export function createInAppNotification(
  message: CommunicationMessage,
): InAppNotification {
  return {
    message,
    read: false,
  };
}