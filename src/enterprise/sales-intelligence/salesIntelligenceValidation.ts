import {
  NEXT_ACTION_PRIORITIES,
  NEXT_ACTION_STATUSES,
  NEXT_ACTION_TYPES,
  SALES_ACTIVITY_CHANNELS,
  SALES_ACTIVITY_TYPES,
  SALES_PIPELINE_STATUSES,
} from "./salesIntelligenceConstants";

function isIncluded<T extends readonly string[]>(
  values: T,
  value: string
): value is T[number] {
  return values.includes(value as T[number]);
}

export function isSalesPipelineStatus(value: string): boolean {
  return isIncluded(SALES_PIPELINE_STATUSES, value);
}

export function isSalesActivityType(value: string): boolean {
  return isIncluded(SALES_ACTIVITY_TYPES, value);
}

export function isSalesActivityChannel(value: string): boolean {
  return isIncluded(SALES_ACTIVITY_CHANNELS, value);
}

export function isNextActionType(value: string): boolean {
  return isIncluded(NEXT_ACTION_TYPES, value);
}

export function isNextActionPriority(value: string): boolean {
  return isIncluded(NEXT_ACTION_PRIORITIES, value);
}

export function isNextActionStatus(value: string): boolean {
  return isIncluded(NEXT_ACTION_STATUSES, value);
}

export function requireNonEmptyText(
  value: string,
  fieldName: string
): string {
  const normalized = value.trim();

  if (!normalized) {
    throw new Error(`${fieldName} is required`);
  }

  return normalized;
}

export function requireValidDate(
  value: string,
  fieldName: string
): string {
  const timestamp = Date.parse(value);

  if (Number.isNaN(timestamp)) {
    throw new Error(`${fieldName} must be a valid date`);
  }

  return new Date(timestamp).toISOString();
}
