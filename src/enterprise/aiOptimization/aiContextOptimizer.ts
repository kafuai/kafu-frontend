export interface AIContextItem {
  id: string;
  content: string;
  relevanceScore: number;
  freshnessScore: number;
  trustScore: number;
  tokenEstimate: number;
  required?: boolean;
}

export interface AIContextOptimizationInput {
  organizationId: string;
  maxTokens: number;
  contextItems: AIContextItem[];
}

export interface AIContextOptimizationResult {
  organizationId: string;
  selectedItems: AIContextItem[];
  removedItems: AIContextItem[];
  tokenEstimate: number;
  compressionRatio: number;
  createdAt: Date;
}

export function optimizeAIContext(
  input: AIContextOptimizationInput,
): AIContextOptimizationResult {
  const requiredItems = input.contextItems.filter((item) => item.required);
  const optionalItems = input.contextItems
    .filter((item) => !item.required)
    .sort((a, b) => scoreContextItem(b) - scoreContextItem(a));

  const selectedItems: AIContextItem[] = [...requiredItems];
  let tokenEstimate = selectedItems.reduce((sum, item) => sum + item.tokenEstimate, 0);

  for (const item of optionalItems) {
    if (tokenEstimate + item.tokenEstimate <= input.maxTokens) {
      selectedItems.push(item);
      tokenEstimate += item.tokenEstimate;
    }
  }

  const selectedIds = new Set(selectedItems.map((item) => item.id));
  const removedItems = input.contextItems.filter((item) => !selectedIds.has(item.id));

  const originalTokens = input.contextItems.reduce((sum, item) => sum + item.tokenEstimate, 0);

  return {
    organizationId: input.organizationId,
    selectedItems,
    removedItems,
    tokenEstimate,
    compressionRatio: originalTokens === 0 ? 0 : 1 - tokenEstimate / originalTokens,
    createdAt: new Date(),
  };
}

function scoreContextItem(item: AIContextItem): number {
  return item.relevanceScore * 0.5 + item.trustScore * 0.3 + item.freshnessScore * 0.2;
}