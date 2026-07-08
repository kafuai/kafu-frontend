import { BillingInvoice } from "./billingSubscriptionTypes";

export function shouldStartBillingDunning(
  invoice: BillingInvoice,
  now: string,
): boolean {
  return (
    invoice.status === "overdue" &&
    new Date(invoice.dueAt).getTime() < new Date(now).getTime()
  );
}

export function calculateBillingDunningStage(
  invoice: BillingInvoice,
  now: string,
): "none" | "soft_reminder" | "final_notice" | "service_hold" {
  if (!shouldStartBillingDunning(invoice, now)) {
    return "none";
  }

  const daysOverdue = Math.floor(
    (new Date(now).getTime() - new Date(invoice.dueAt).getTime()) /
      (1000 * 60 * 60 * 24),
  );

  if (daysOverdue >= 14) {
    return "service_hold";
  }

  if (daysOverdue >= 7) {
    return "final_notice";
  }

  return "soft_reminder";
}