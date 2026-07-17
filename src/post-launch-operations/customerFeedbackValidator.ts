import { CustomerFeedbackRecord } from "./customerFeedbackRecord";

export function validateCustomerFeedback(
  feedback: CustomerFeedbackRecord,
): string[] {
  const issues: string[] = [];

  if (!feedback.id.trim()) {
    issues.push("Feedback ID is required.");
  }

  if (!feedback.organizationId.trim()) {
    issues.push("Organization ID is required.");
  }

  if (!feedback.customerName.trim()) {
    issues.push("Customer name is required.");
  }

  if (!feedback.summary.trim()) {
    issues.push("Feedback summary is required.");
  }

  if (
    feedback.priority === "critical" &&
    (!feedback.owner || !feedback.owner.trim())
  ) {
    issues.push("Critical customer feedback must have an owner.");
  }

  if (
    feedback.status === "resolved" &&
    (!feedback.resolvedAt || !feedback.resolvedAt.trim())
  ) {
    issues.push("Resolved feedback must include a resolution date.");
  }

  return issues;
}
