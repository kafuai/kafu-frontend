import { CustomerGoLiveChecklistItem } from "./customerGoLiveChecklist";
import { CustomerGoLivePlan } from "./customerGoLivePlan";

export interface CustomerGoLiveValidationInput {
  plan: CustomerGoLivePlan;
  checklist: CustomerGoLiveChecklistItem[];
}

export function validateCustomerGoLive(
  input: CustomerGoLiveValidationInput,
): string[] {
  const issues: string[] = [];

  if (!input.plan.organizationId.trim()) {
    issues.push("Organization ID is required.");
  }

  if (!input.plan.goLiveOwner.trim()) {
    issues.push("Go-live owner is required.");
  }

  if (!input.plan.targetGoLiveDate.trim()) {
    issues.push("Target go-live date is required.");
  }

  if (input.plan.launchScope.length === 0) {
    issues.push("At least one launch scope item is required.");
  }

  if (input.plan.supportContacts.length === 0) {
    issues.push("At least one support contact is required.");
  }

  const incompleteRequiredItems = input.checklist.filter(
    (item) => item.required && !item.completed,
  );

  if (incompleteRequiredItems.length > 0) {
    issues.push(
      `${incompleteRequiredItems.length} required go-live checklist item(s) remain incomplete.`,
    );
  }

  return issues;
}
