import { CommunicationMessage } from "./communicationTypes";

export function validateCommunicationMessage(
  message: CommunicationMessage,
): string[] {
  const errors: string[] = [];

  if (!message.id) errors.push("Communication message id is required.");
  if (!message.organizationId) errors.push("Organization id is required.");
  if (!message.recipient?.id) errors.push("Recipient id is required.");
  if (!message.payload?.body) errors.push("Communication body is required.");

  if (message.channel === "email" && !message.recipient.email) {
    errors.push("Email recipient requires an email address.");
  }

  if (message.channel === "sms" && !message.recipient.phone) {
    errors.push("SMS recipient requires a phone number.");
  }

  if (message.channel === "push" && !message.recipient.deviceToken) {
    errors.push("Push recipient requires a device token.");
  }

  if (message.channel === "webhook" && !message.recipient.webhookUrl) {
    errors.push("Webhook recipient requires a webhook URL.");
  }

  return errors;
}