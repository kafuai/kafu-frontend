import {
  ExecutiveDecisionContext,
  ExecutiveDecisionStatus,
} from "../types/executiveDecisionTypes";
import {
  ExecutiveDecisionOption,
  ExecutiveDecisionResult,
} from "../models/executiveDecisionModel";
import { ExecutiveDecisionValidator } from "../utils/executiveDecisionValidator";

export class ExecutiveDecisionEngine {
  private status: ExecutiveDecisionStatus = "idle";
  private readonly validator = new ExecutiveDecisionValidator();

  getStatus(): ExecutiveDecisionStatus {
    return this.status;
  }

  decide(context: ExecutiveDecisionContext): ExecutiveDecisionResult {
    this.status = "evaluating";

    if (!this.validator.validateContext(context)) {
      this.status = "failed";
      throw new Error("Invalid executive decision context.");
    }

    this.status = "prioritizing";

    const alternatives = this.buildAlternatives(context);
    const recommendedOption = this.selectRecommendedOption(
      context,
      alternatives,
    );

    const result: ExecutiveDecisionResult = {
      id: `${context.organizationId}-decision-${Date.now()}`,
      organizationId: context.organizationId,
      objective: context.objective,
      recommendedOption,
      alternatives: alternatives.filter(
        (option) => option.id !== recommendedOption.id,
      ),
      rationale: this.buildDecisionRationale(context, recommendedOption),
      confidence: context.confidence,
      createdAt: new Date(),
    };

    if (!this.validator.validateResult(result)) {
      this.status = "failed";
      throw new Error("Invalid executive decision result.");
    }

    this.status = "completed";

    return result;
  }

  private buildAlternatives(
    context: ExecutiveDecisionContext,
  ): ExecutiveDecisionOption[] {
    return [
      {
        id: `${context.organizationId}-decision-option-structured`,
        title: "Proceed with structured executive action",
        description:
          "Move forward with a structured executive action plan aligned with the reasoning output.",
        type: "strategic",
        priority: context.priority,
        confidence: context.confidence,
        expectedImpact:
          "Improved executive clarity, stronger prioritization, and better organizational alignment.",
        risks: ["Execution delay", "Incomplete stakeholder alignment"],
      },
      {
        id: `${context.organizationId}-decision-option-controlled`,
        title: "Proceed through controlled validation",
        description:
          "Validate the reasoning output with key stakeholders before full execution.",
        type: "operational",
        priority: context.priority,
        confidence: context.confidence,
        expectedImpact:
          "Reduced execution uncertainty and improved stakeholder confidence.",
        risks: ["Slower delivery", "Decision fatigue"],
      },
      {
        id: `${context.organizationId}-decision-option-defer`,
        title: "Defer until additional evidence is available",
        description:
          "Delay execution until stronger evidence or additional organizational context is collected.",
        type: "operational",
        priority: "medium",
        confidence: "medium",
        expectedImpact:
          "Lower immediate risk, but slower realization of enterprise value.",
        risks: ["Missed opportunity", "Delayed strategic progress"],
      },
    ];
  }

  private selectRecommendedOption(
    context: ExecutiveDecisionContext,
    options: ExecutiveDecisionOption[],
  ): ExecutiveDecisionOption {
    if (context.priority === "critical" && context.confidence === "high") {
      return options[0];
    }

    if (context.confidence === "low") {
      return options[2];
    }

    if (context.priority === "high" || context.priority === "critical") {
      return options[1];
    }

    return options[0];
  }

  private buildDecisionRationale(
    context: ExecutiveDecisionContext,
    recommendedOption: ExecutiveDecisionOption,
  ): string {
    return [
      context.reasoningSummary,
      `Recommended option: ${recommendedOption.title}.`,
      `Decision priority is ${recommendedOption.priority} with ${recommendedOption.confidence} confidence.`,
      `Expected impact: ${recommendedOption.expectedImpact}`,
    ].join(" ");
  }
}