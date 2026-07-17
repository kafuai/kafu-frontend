import type {
  ExecutiveDemoIntelligenceContext,
  ExecutiveDemoIntelligenceKnowledgeItem,
} from "./executiveDemoIntelligenceTypes";

export interface CreateExecutiveDemoKnowledgeInput {
  id: string;
  category: string;
  title: string;
  summary: string;
  relevanceScore: number;
  source: string;
  tags?: string[];
}

function normalizeRelevanceScore(score: number): number {
  return Math.min(100, Math.max(0, Math.round(score)));
}

export function createExecutiveDemoIntelligenceKnowledgeItem(
  input: CreateExecutiveDemoKnowledgeInput,
): ExecutiveDemoIntelligenceKnowledgeItem {
  return {
    id: input.id.trim(),
    category: input.category.trim(),
    title: input.title.trim(),
    summary: input.summary.trim(),
    relevanceScore: normalizeRelevanceScore(input.relevanceScore),
    source: input.source.trim(),
    tags: Array.from(
      new Set(
        (input.tags ?? [])
          .map((tag) => tag.trim().toLowerCase())
          .filter(Boolean),
      ),
    ),
  };
}

export function buildExecutiveDemoContextKnowledge(
  context: ExecutiveDemoIntelligenceContext,
): ExecutiveDemoIntelligenceKnowledgeItem[] {
  const knowledge: ExecutiveDemoIntelligenceKnowledgeItem[] = [];

  knowledge.push(
    createExecutiveDemoIntelligenceKnowledgeItem({
      id: `${context.organizationId}-organization-profile`,
      category: "organization",
      title: `${context.companyName} executive profile`,
      summary: [
        context.industry ? `Industry: ${context.industry}.` : undefined,
        context.country ? `Country: ${context.country}.` : undefined,
        context.executiveRole
          ? `Executive role: ${context.executiveRole}.`
          : undefined,
      ]
        .filter(Boolean)
        .join(" "),
      relevanceScore: 100,
      source: "executive-demo-context",
      tags: [
        context.companyName,
        context.industry ?? "",
        context.country ?? "",
      ],
    }),
  );

  if (context.currentStage) {
    knowledge.push(
      createExecutiveDemoIntelligenceKnowledgeItem({
        id: `${context.organizationId}-current-stage`,
        category: "journey",
        title: "Current executive demo stage",
        summary: context.currentStage,
        relevanceScore: 90,
        source: "executive-demo-context",
        tags: ["journey", "stage", context.currentStage],
      }),
    );
  }

  if ((context.activeModules?.length ?? 0) > 0) {
    knowledge.push(
      createExecutiveDemoIntelligenceKnowledgeItem({
        id: `${context.organizationId}-active-modules`,
        category: "capability",
        title: "Active enterprise capabilities",
        summary: `Active modules: ${context.activeModules?.join(", ")}.`,
        relevanceScore: 85,
        source: "executive-demo-context",
        tags: ["modules", "capabilities", ...(context.activeModules ?? [])],
      }),
    );
  }

  return knowledge;
}

export function rankExecutiveDemoIntelligenceKnowledge(
  knowledge: ExecutiveDemoIntelligenceKnowledgeItem[],
): ExecutiveDemoIntelligenceKnowledgeItem[] {
  return [...knowledge].sort(
    (left, right) => right.relevanceScore - left.relevanceScore,
  );
}

export function findExecutiveDemoKnowledgeByTags(
  knowledge: ExecutiveDemoIntelligenceKnowledgeItem[],
  tags: string[],
): ExecutiveDemoIntelligenceKnowledgeItem[] {
  const normalizedTags = new Set(
    tags.map((tag) => tag.trim().toLowerCase()).filter(Boolean),
  );

  return rankExecutiveDemoIntelligenceKnowledge(
    knowledge.filter((item) =>
      item.tags.some((tag) => normalizedTags.has(tag.toLowerCase())),
    ),
  );
}
