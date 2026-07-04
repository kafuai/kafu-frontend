import {
  ExecutiveReasoningContext,
  ExecutiveReasoningStatus,
} from "../types/executiveReasoningTypes";
import {
  ExecutiveReasoningResult,
  ExecutiveReasoningSignal,
} from "../models/executiveReasoningModel";
import { ExecutiveReasoningValidator } from "../utils/executiveReasoningValidator";

export class ExecutiveReasoningEngine {
  private status: ExecutiveReasoningStatus = "idle";
  private readonly validator = new ExecutiveReasoningValidator();

  getStatus(): ExecutiveReasoningStatus {
    return this.status;
  }

  reason(context: ExecutiveReasoningContext): ExecutiveReasoningResult {
    this.status = "collecting_context";

    if (!this.validator.validateContext(context)) {
      this.status = "failed";
      throw new Error("Invalid executive reasoning context.");
    }

    this.status = "analyzing";

    const signals = this.buildReasoningSignals(context);

    this.status = "evaluating";

    const result: ExecutiveReasoningResult = {
      id: `${context.organizationId}-reasoning-${Date.now()}`,
      organizationId: context.organizationId,
      objective: context.objective,
      summary: this.buildExecutiveSummary(context, signals),
      signals,
      confidence: context.confidence,
      createdAt: new Date(),
    };

    if (!this.validator.validateResult(result)) {
      this.status = "failed";
      throw new Error("Invalid executive reasoning result.");
    }

    this.status = "completed";

    return result;
  }

  private buildReasoningSignals(
    context: ExecutiveReasoningContext,
  ): ExecutiveReasoningSignal[] {
    const signals: ExecutiveReasoningSignal[] = [
      {
        id: `${context.organizationId}-objective-signal`,
        type: "insight",
        title: "Executive objective interpreted",
        description:
          "KAFU AI interpreted the executive objective and prepared it for enterprise reasoning.",
        priority: context.priority,
        confidence: context.confidence,
        evidence: ["objective", "domain", "priority", "confidence"],
      },
      {
        id: `${context.organizationId}-priority-signal`,
        type: this.resolvePrioritySignalType(context.priority),
        title: "Priority impact assessed",
        description: this.describePriorityImpact(context.priority),
        priority: context.priority,
        confidence: context.confidence,
        evidence: ["priority", "organizational impact", "execution urgency"],
      },
      {
        id: `${context.organizationId}-domain-signal`,
        type: "insight",
        title: "Domain relevance identified",
        description: `The reasoning process mapped the objective to the ${context.domain} enterprise domain.`,
        priority: context.priority,
        confidence: context.confidence,
        evidence: ["domain", "enterprise intelligence scope"],
      },
    ];

    return signals;
  }

  private resolvePrioritySignalType(
    priority: ExecutiveReasoningContext["priority"],
  ): ExecutiveReasoningSignal["type"] {
    if (priority === "critical" || priority === "high") {
      return "risk";
    }

    return "insight";
  }

  private describePriorityImpact(
    priority: ExecutiveReasoningContext["priority"],
  ): string {
    if (priority === "critical") {
      return "The objective requires executive attention because it may materially affect enterprise outcomes.";
    }

    if (priority === "high") {
      return "The objective has high operational importance and should be evaluated with strong execution focus.";
    }

    if (priority === "medium") {
      return "The objective has moderate enterprise importance and should be managed through normal prioritization.";
    }

    return "The objective has limited immediate impact but remains useful for organizational learning.";
  }

  private buildExecutiveSummary(
    context: ExecutiveReasoningContext,
    signals: ExecutiveReasoningSignal[],
  ): string {
    const riskSignals = signals.filter((signal) => signal.type === "risk");
    const insightSignals = signals.filter((signal) => signal.type === "insight");

    return [
      `Executive reasoning completed for the ${context.domain} domain.`,
      `${signals.length} reasoning signals were generated.`,
      `${insightSignals.length} insight signals and ${riskSignals.length} risk signals were identified.`,
      `The objective was evaluated with ${context.priority} priority and ${context.confidence} confidence.`,
    ].join(" ");
  }
}