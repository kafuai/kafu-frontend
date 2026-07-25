import type {
  SalesActivityChannel,
  SalesActivityType,
} from "../salesIntelligenceConstants";

import type {
  UnifiedActivityCategory,
  UnifiedActivityDirection,
} from "./unifiedActivityTypes";

export function classifySalesActivity(
  activityType: SalesActivityType,
): UnifiedActivityCategory {
  switch (activityType) {
    case "status_change":
    case "lead_created":
      return "lifecycle";

    case "assignment":
      return "assignment";

    case "call":
    case "email":
    case "whatsapp":
    case "follow_up":
      return "communication";

    case "meeting":
    case "demo":
    case "proposal":
      return "meeting";

    case "task_completed":
      return "task";

    case "note":
      return "note";

    default:
      return "system";
  }
}

export function resolveActivityDirection(
  channel: SalesActivityChannel | null,
  metadata: Record<string, unknown>,
): UnifiedActivityDirection {
  const direction = metadata.direction;

  if (
    direction === "inbound" ||
    direction === "outbound" ||
    direction === "internal" ||
    direction === "system"
  ) {
    return direction;
  }

  if (
    channel === "system" ||
    channel === "platform"
  ) {
    return "system";
  }

  return null;
}

export function buildActivityTitle(
  activityType: SalesActivityType,
): string {
  switch (activityType) {
    case "lead_created":
      return "Lead created";

    case "assignment":
      return "Opportunity assigned";

    case "status_change":
      return "Sales stage changed";

    case "call":
      return "Call activity";

    case "email":
      return "Email activity";

    case "whatsapp":
      return "WhatsApp activity";

    case "meeting":
      return "Meeting activity";

    case "demo":
      return "Product demonstration";

    case "proposal":
      return "Proposal activity";

    case "note":
      return "Sales note";

    case "task_completed":
      return "Task completed";

    case "follow_up":
      return "Follow-up activity";

    default:
      return "Sales activity";
  }
}
