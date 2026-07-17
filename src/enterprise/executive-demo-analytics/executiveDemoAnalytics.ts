import {
  buildExecutiveDemoAnalyticsSnapshot,
} from "./executiveDemoAnalyticsBuilder";
import {
  buildExecutiveDemoAnalyticsReport,
} from "./executiveDemoAnalyticsReport";
import {
  buildExecutiveDemoAnalyticsDashboardViewModel,
} from "./executiveDemoAnalyticsDashboard";
import {
  validateExecutiveDemoAnalyticsInput,
  validateExecutiveDemoAnalyticsSnapshot,
} from "./executiveDemoAnalyticsValidator";
import type {
  ExecutiveDemoAnalyticsInput,
  ExecutiveDemoAnalyticsSnapshot,
} from "./executiveDemoAnalyticsTypes";

export interface ExecutiveDemoAnalyticsExecutionResult {
  success: boolean;
  errors: string[];
  snapshot?: ExecutiveDemoAnalyticsSnapshot;
  report?: ReturnType<
    typeof buildExecutiveDemoAnalyticsReport
  >;
  dashboard?: ReturnType<
    typeof buildExecutiveDemoAnalyticsDashboardViewModel
  >;
}

export function executeExecutiveDemoAnalytics(
  input: ExecutiveDemoAnalyticsInput,
): ExecutiveDemoAnalyticsExecutionResult {
  const inputValidation =
    validateExecutiveDemoAnalyticsInput(input);

  if (!inputValidation.valid) {
    return {
      success: false,
      errors: inputValidation.errors,
    };
  }

  const snapshot =
    buildExecutiveDemoAnalyticsSnapshot(input);

  const snapshotValidation =
    validateExecutiveDemoAnalyticsSnapshot(snapshot);

  if (!snapshotValidation.valid) {
    return {
      success: false,
      errors: snapshotValidation.errors,
    };
  }

  const report =
    buildExecutiveDemoAnalyticsReport(snapshot);

  const dashboard =
    buildExecutiveDemoAnalyticsDashboardViewModel(
      report,
      snapshot.metrics,
    );

  return {
    success: true,
    errors: [],
    snapshot,
    report,
    dashboard,
  };
}
