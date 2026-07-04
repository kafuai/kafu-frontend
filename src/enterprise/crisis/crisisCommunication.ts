export type CrisisCommunicationChannel =
  | "email"
  | "sms"
  | "push"
  | "phone"
  | "webhook"
  | "internal"
  | "press";

export type CrisisAudience =
  | "employees"
  | "customers"
  | "partners"
  | "executives"
  | "board"
  | "regulators"
  | "public";

export type CrisisCommunication = {
  id: string;
  crisisId: string;
  channel: CrisisCommunicationChannel;
  audience: CrisisAudience;
  subject: string;
  message: string;
  createdAt: string;
  createdBy: string;
  approvedBy?: string;
  deliveredAt?: string;
};