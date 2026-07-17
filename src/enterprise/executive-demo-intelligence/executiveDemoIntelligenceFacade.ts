import {
  orchestrateExecutiveDemoIntelligence,
  type ExecutiveDemoIntelligenceOrchestrationResult,
} from "./executiveDemoIntelligenceOrchestrator";
import type {
  ExecutiveDemoIntelligenceAdapterInput,
} from "./executiveDemoIntelligenceAdapter";

export class ExecutiveDemoIntelligenceFacade {
  run(
    input: ExecutiveDemoIntelligenceAdapterInput,
  ): ExecutiveDemoIntelligenceOrchestrationResult {
    return orchestrateExecutiveDemoIntelligence(input);
  }

  generateExecutiveSummary(
    input: ExecutiveDemoIntelligenceAdapterInput,
  ): string {
    return this.run(input).intelligence.result.executiveSummary;
  }

  generatePrimaryRecommendation(
    input: ExecutiveDemoIntelligenceAdapterInput,
  ): string {
    return this.run(input).intelligence.result.primaryRecommendation;
  }

  generateReport(
    input: ExecutiveDemoIntelligenceAdapterInput,
  ) {
    return this.run(input).report;
  }
}

export function runExecutiveDemoIntelligenceFacade(
  input: ExecutiveDemoIntelligenceAdapterInput,
): ExecutiveDemoIntelligenceOrchestrationResult {
  const facade = new ExecutiveDemoIntelligenceFacade();

  return facade.run(input);
}
