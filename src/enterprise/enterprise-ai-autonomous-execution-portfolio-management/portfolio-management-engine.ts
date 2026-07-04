import {
  PortfolioManagementResult,
  PortfolioProfile,
} from "./portfolio-management.types";
import { PortfolioHealthScorer } from "./portfolio-health-scorer";
import { PortfolioPrioritizer } from "./portfolio-prioritizer";
import { PortfolioAllocationEngine } from "./portfolio-allocation-engine";
import { PortfolioStrategicAlignmentMapper } from "./portfolio-strategic-alignment-mapper";
import { PortfolioDecisionRecommender } from "./portfolio-decision-recommender";

export class PortfolioManagementEngine {
  constructor(
    private readonly healthScorer = new PortfolioHealthScorer(),
    private readonly prioritizer = new PortfolioPrioritizer(),
    private readonly allocationEngine = new PortfolioAllocationEngine(),
    private readonly alignmentMapper = new PortfolioStrategicAlignmentMapper(),
    private readonly decisionRecommender = new PortfolioDecisionRecommender(),
  ) {}

  execute(profile: PortfolioProfile): PortfolioManagementResult {
    const health = this.healthScorer.score(profile);

    const prioritizedInitiatives = this.prioritizer.prioritize(
      profile.initiatives,
    );

    const allocationRecommendations =
      this.allocationEngine.recommend(prioritizedInitiatives);

    const alignment = this.alignmentMapper.map(prioritizedInitiatives);

    const decision = this.decisionRecommender.recommend(
      health,
      prioritizedInitiatives,
    );

    return {
      portfolioId: profile.portfolioId,
      health,
      prioritizedInitiatives,
      allocationRecommendations,
      executiveSummary: [
        `Portfolio "${profile.portfolioName}" analyzed successfully.`,
        `Overall Health: ${health.overallScore}/100.`,
        `Strategic Alignment Groups: ${alignment.length}.`,
        `Recommended Decision: ${decision.decision}.`,
        decision.rationale,
      ].join(" "),
    };
  }
}