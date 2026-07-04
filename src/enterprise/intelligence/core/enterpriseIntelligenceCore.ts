import { EnterpriseIntelligenceContract } from "../contracts/enterpriseIntelligenceContract";
import {
  ExecutiveDecisionContext,
  ExecutiveDecisionEngine,
  ExecutiveDecisionResult,
  ExecutiveRecommendationContext,
  ExecutiveRecommendationEngine,
  ExecutiveRecommendationResult,
  ExecutiveReasoningContext,
  ExecutiveReasoningEngine,
  ExecutiveReasoningResult,
  OrganizationMemoryContext,
  OrganizationMemoryEngine,
  OrganizationMemoryRecord,
  OrganizationMemoryRecordType,
  OrganizationMemorySnapshot,
} from "../index";
import { EnterpriseIntelligenceStatus } from "../types/enterpriseIntelligenceTypes";
import { EnterpriseIntelligenceValidator } from "../utils/enterpriseIntelligenceValidator";

export class EnterpriseIntelligenceCore implements EnterpriseIntelligenceContract {
  readonly name = "EnterpriseIntelligenceCore";

  private status: EnterpriseIntelligenceStatus = "idle";
  private readonly validator = new EnterpriseIntelligenceValidator();
  private readonly memory = new OrganizationMemoryEngine();
  private readonly reasoning = new ExecutiveReasoningEngine();
  private readonly decision = new ExecutiveDecisionEngine();
  private readonly recommendation = new ExecutiveRecommendationEngine();

  async initialize(): Promise<void> {
    this.status = "ready";
  }

  async dispose(): Promise<void> {
    this.status = "idle";
  }

  getStatus(): EnterpriseIntelligenceStatus {
    return this.status;
  }

  remember(
    context: OrganizationMemoryContext,
    type: OrganizationMemoryRecordType,
    title: string,
    description: string,
    tags: string[] = [],
  ): OrganizationMemoryRecord {
    this.status = "learning";

    const result = this.memory.record(context, type, title, description, tags);

    this.status = "ready";

    return result;
  }

  getMemorySnapshot(organizationId: string): OrganizationMemorySnapshot {
    this.status = "learning";

    const result = this.memory.snapshot(organizationId);

    this.status = "ready";

    return result;
  }

  reason(context: ExecutiveReasoningContext): ExecutiveReasoningResult {
    this.status = "reasoning";

    const result = this.reasoning.reason(context);

    this.status = "ready";

    return result;
  }

  decide(context: ExecutiveDecisionContext): ExecutiveDecisionResult {
    this.status = "reasoning";

    const result = this.decision.decide(context);

    this.status = "ready";

    return result;
  }

  recommend(
    context: ExecutiveRecommendationContext,
  ): ExecutiveRecommendationResult {
    this.status = "planning";

    const result = this.recommendation.recommend(context);

    this.status = "ready";

    return result;
  }

  validate(): boolean {
    return Boolean(
      this.validator &&
        this.memory &&
        this.reasoning &&
        this.decision &&
        this.recommendation,
    );
  }
}