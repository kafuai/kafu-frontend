import { CommunicationMessage } from "./communicationTypes";
import { validateCommunicationMessage } from "./communicationValidator";

export function prepareNotification(
  message: CommunicationMessage,
): CommunicationMessage {
  const errors = validateCommunicationMessage(message);

  if (errors.length > 0) {
    throw new Error(errors.join("\n"));
  }

  return {
    ...message,
    updatedAt: new Date(),
  };
}