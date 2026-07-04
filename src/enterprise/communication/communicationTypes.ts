export type CommunicationChannel =
  | "email"
  | "sms"
  | "push"
  | "in_app"
  | "webhook";

export type CommunicationPriority =
  | "low"
  | "normal"
  | "high"
  | "critical";

export type CommunicationStatus =
  | "pending"
  | "queued"
  | "sent"
  | "delivered"
  | "failed"
  | "cancelled";

export type CommunicationRecipient = {
  id: string;
  organizationId: string;
  email?: string;
  phone?: string;
  deviceToken?: string;
  webhookUrl?: string;
  locale?: string;
};

export type CommunicationPayload = {
  subject?: string;
  title?: string;
  body: string;
  data?: Record<string, unknown>;
};

export type CommunicationMessage = {
  id: string;
  organizationId: string;
  channel: CommunicationChannel;
  recipient: CommunicationRecipient;
  payload: CommunicationPayload;
  priority: CommunicationPriority;
  status: CommunicationStatus;
  createdAt: Date;
  updatedAt: Date;
};