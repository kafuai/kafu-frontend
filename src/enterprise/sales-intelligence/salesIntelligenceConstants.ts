export const SALES_PIPELINE_STATUSES = [
  "new",
  "contacted",
  "qualified",
  "demo_scheduled",
  "demo_completed",
  "proposal_sent",
  "negotiation",
  "won",
  "lost",
] as const;

export type SalesPipelineStatus =
  (typeof SALES_PIPELINE_STATUSES)[number];

export const SALES_ACTIVITY_TYPES = [
  "lead_created",
  "assignment",
  "status_change",
  "call",
  "email",
  "whatsapp",
  "meeting",
  "demo",
  "proposal",
  "note",
  "task_completed",
  "follow_up",
] as const;

export type SalesActivityType =
  (typeof SALES_ACTIVITY_TYPES)[number];

export const SALES_ACTIVITY_CHANNELS = [
  "system",
  "phone",
  "email",
  "whatsapp",
  "video",
  "in_person",
  "platform",
] as const;

export type SalesActivityChannel =
  (typeof SALES_ACTIVITY_CHANNELS)[number];

export const NEXT_ACTION_TYPES = [
  "call",
  "email",
  "whatsapp",
  "meeting",
  "demo",
  "proposal",
  "internal_review",
  "follow_up",
  "custom",
] as const;

export type NextActionType =
  (typeof NEXT_ACTION_TYPES)[number];

export const NEXT_ACTION_PRIORITIES = [
  "low",
  "medium",
  "high",
  "critical",
] as const;

export type NextActionPriority =
  (typeof NEXT_ACTION_PRIORITIES)[number];

export const NEXT_ACTION_STATUSES = [
  "open",
  "in_progress",
  "completed",
  "cancelled",
] as const;

export type NextActionStatus =
  (typeof NEXT_ACTION_STATUSES)[number];
