import { EnterpriseRiskIndicator } from "./riskIndicators";
import {
  EnterpriseRiskThreshold,
  isRiskCritical,
  isRiskWarning,
} from "./riskThresholds";

export class EnterpriseRiskMonitor {
  evaluate(
    indicator: EnterpriseRiskIndicator,
    threshold: EnterpriseRiskThreshold,
  ): "normal" | "warning" | "critical" {
    if (isRiskCritical(indicator.currentValue, threshold)) {
      return "critical";
    }

    if (isRiskWarning(indicator.currentValue, threshold)) {
      return "warning";
    }

    return "normal";
  }
}