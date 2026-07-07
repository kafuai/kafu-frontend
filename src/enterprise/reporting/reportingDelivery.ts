export type ReportingDeliveryChannel = "email" | "dashboard" | "webhook" | "storage";

export interface ReportingDeliveryTarget {
  channel: ReportingDeliveryChannel;
  destination: string;
  enabled: boolean;
}

export interface ReportingDeliveryResult {
  delivered: boolean;
  channel: ReportingDeliveryChannel;
  deliveredAt?: string;
  error?: string;
}

export function deliverReportingOutput(target: ReportingDeliveryTarget): ReportingDeliveryResult {
  if (!target.enabled) {
    return {
      delivered: false,
      channel: target.channel,
      error: "Delivery target is disabled",
    };
  }

  return {
    delivered: true,
    channel: target.channel,
    deliveredAt: new Date().toISOString(),
  };
}
