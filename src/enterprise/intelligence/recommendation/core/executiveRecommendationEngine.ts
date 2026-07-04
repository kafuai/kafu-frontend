import {
  ExecutiveRecommendationContext,
  ExecutiveRecommendationStatus,
} from "../types/executiveRecommendationTypes";
import {
  ExecutiveRecommendationItem,
  ExecutiveRecommendationResult,
} from "../models/executiveRecommendationModel";
import { ExecutiveRecommendationValidator } from "../utils/executiveRecommendationValidator";

export class ExecutiveRecommendationEngine {
  private status: ExecutiveRecommendationStatus = "idle";
  private readonly validator = new ExecutiveRecommendationValidator();

  getStatus(): ExecutiveRecommendationStatus {
    return this.status;
  }

  recommend(
    context: ExecutiveRecommendationContext,
  ): ExecutiveRecommendationResult {
    this.status = "analyzing_decision";

    if (!this.validator.validateContext(context)) {
      this.status = "failed";
      throw new Error("Invalid executive recommendation context.");
    }

    this.status = "generating";

    const recommendations = this.buildRecommendations(context);

    const result: ExecutiveRecommendationResult = {
      id: `${context.organizationId}-recommendation-${Date.now()}`,
      organizationId: context.organizationId,
      objective: context.objective,
      recommendations,
      summary: this.buildRecommendationSummary(context, recommendations),
      confidence: context.confidence,
      createdAt: new Date(),
    };

    if (!this.validator.validateResult(result)) {
      this.status = "failed";
      throw new Error("Invalid executive recommendation result.");
    }

    this.status = "completed";

    return result;
  }

  private buildRecommendations(
    context: ExecutiveRecommendationContext,
  ): ExecutiveRecommendationItem[] {
    const baseRisks = context.risks ?? [];

    return [
      {
        id: `${context.organizationId}-recommendation-action-path`,
        title: "Translate decision into an executable action path",
        description:
          "Convert the selected executive decision into a structured action path with clear ownership and measurable outcomes.",
        category: "strategic_action",
        priority: context.priority,
        confidence: context.confidence,
        expectedOutcome:
          "Faster execution, clearer accountability, and stronger executive alignment.",
        actions: [
          "Define decision owner",
          "Set execution milestones",
          "Align stakeholders",
          "Track measurable outcomes",
        ],
        risks: baseRisks,
      },
      {
        id: `${context.organizationId}-recommendation-governance-control`,
        title: "Attach governance and progress controls",
        description:
          "Add lightweight governance checkpoints to ensure the decision remains aligned with executive intent.",
        category: "governance",
        priority: context.priority,
        confidence: context.confidence,
        expectedOutcome:
          "Reduced execution uncertainty and improved visibility across stakeholders.",
        actions: [
          "Define review cadence",
          "Create escalation path",
          "Track decision risks",
          "Report progress to leadership",
        ],
        risks: [...baseRisks, "Weak follow-up discipline"],
      },
      {
        id: `${context.organizationId}-recommendation-risk-mitigation`,
        title: "Prepare risk mitigation actions",
        description:
          "Identify execution risks early and prepare mitigation actions before implementation begins.",
        category: "risk_mitigation",
        priority: context.priority,
        confidence: context.confidence,
        expectedOutcome:
          "Lower delivery uncertainty and stronger operational resilience.",
        actions: [
          "List execution assumptions",
          "Identify dependency risks",
          "Assign mitigation owners",
          "Review risks before launch",
        ],
        risks: [...baseRisks, "Unclear dependency ownership"],
      },
    ];
  }

  private buildRecommendationSummary(
    context: ExecutiveRecommendationContext,
    recommendations: ExecutiveRecommendationItem[],
  ): string {
    return [
      `${recommendations.length} executive recommendations were generated for the selected decision.`,
      `The recommendations focus on execution readiness, governance control, and risk mitigation.`,
      `Priority is ${context.priority} with ${context.confidence} confidence.`,
    ].join(" ");
  }
}