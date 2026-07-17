import type {
  ExecutiveDemoIntelligenceContext,
  ExecutiveDemoIntelligenceInput,
  ExecutiveDemoIntelligenceKnowledgeItem,
  ExecutiveDemoIntelligenceMemoryItem,
  ExecutiveDemoIntelligenceObjective,
  ExecutiveDemoIntelligenceSignal,
} from "./executiveDemoIntelligenceTypes";

export interface ExecutiveDemoIntelligenceValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

function validateRequiredText(
  value: string,
  fieldName: string,
  errors: string[],
): void {
  if (!value.trim()) {
    errors.push(`${fieldName} is required.`);
  }
}

function validateScore(
  value: number,
  fieldName: string,
  errors: string[],
): void {
  if (!Number.isFinite(value) || value < 0 || value > 100) {
    errors.push(`${fieldName} must be between 0 and 100.`);
  }
}

export function validateExecutiveDemoIntelligenceContext(
  context: ExecutiveDemoIntelligenceContext,
): ExecutiveDemoIntelligenceValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  validateRequiredText(context.sessionId, "sessionId", errors);
  validateRequiredText(context.organizationId, "organizationId", errors);
  validateRequiredText(context.companyName, "companyName", errors);
  validateRequiredText(context.capturedAt, "capturedAt", errors);

  if (context.readinessScore !== undefined) {
    validateScore(context.readinessScore, "readinessScore", errors);
  }

  if (context.corporateBrainScore !== undefined) {
    validateScore(
      context.corporateBrainScore,
      "corporateBrainScore",
      errors,
    );
  }

  if ((context.discoveryAnswersCount ?? 0) < 5) {
    warnings.push(
      "Discovery evidence is limited and may reduce intelligence confidence.",
    );
  }

  if (!context.industry) {
    warnings.push(
      "Industry context is missing from the executive demo session.",
    );
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

function validateSignal(
  signal: ExecutiveDemoIntelligenceSignal,
  errors: string[],
): void {
  validateRequiredText(signal.id, "signal.id", errors);
  validateRequiredText(signal.title, "signal.title", errors);
  validateRequiredText(signal.description, "signal.description", errors);
  validateRequiredText(signal.source, "signal.source", errors);
  validateScore(signal.score, "signal.score", errors);
}

function validateKnowledgeItem(
  item: ExecutiveDemoIntelligenceKnowledgeItem,
  errors: string[],
): void {
  validateRequiredText(item.id, "knowledge.id", errors);
  validateRequiredText(item.category, "knowledge.category", errors);
  validateRequiredText(item.title, "knowledge.title", errors);
  validateRequiredText(item.source, "knowledge.source", errors);
  validateScore(
    item.relevanceScore,
    "knowledge.relevanceScore",
    errors,
  );
}

function validateMemoryItem(
  item: ExecutiveDemoIntelligenceMemoryItem,
  errors: string[],
): void {
  validateRequiredText(item.id, "memory.id", errors);
  validateRequiredText(item.sessionId, "memory.sessionId", errors);
  validateRequiredText(
    item.organizationId,
    "memory.organizationId",
    errors,
  );
  validateRequiredText(item.key, "memory.key", errors);
  validateRequiredText(item.value, "memory.value", errors);
}

function validateObjective(
  objective: ExecutiveDemoIntelligenceObjective,
  errors: string[],
): void {
  validateRequiredText(objective.id, "objective.id", errors);
  validateRequiredText(objective.title, "objective.title", errors);
  validateRequiredText(
    objective.description,
    "objective.description",
    errors,
  );
}

export function validateExecutiveDemoIntelligenceInput(
  input: ExecutiveDemoIntelligenceInput,
): ExecutiveDemoIntelligenceValidationResult {
  const contextValidation =
    validateExecutiveDemoIntelligenceContext(input.context);

  const errors = [...contextValidation.errors];
  const warnings = [...contextValidation.warnings];

  for (const signal of input.signals ?? []) {
    validateSignal(signal, errors);
  }

  for (const knowledgeItem of input.knowledge ?? []) {
    validateKnowledgeItem(knowledgeItem, errors);
  }

  for (const memoryItem of input.memory ?? []) {
    validateMemoryItem(memoryItem, errors);
  }

  for (const objective of input.objectives ?? []) {
    validateObjective(objective, errors);
  }

  if ((input.signals?.length ?? 0) === 0) {
    warnings.push(
      "No intelligence signals were provided or derived.",
    );
  }

  if ((input.objectives?.length ?? 0) === 0) {
    warnings.push(
      "No executive demo intelligence objectives were provided.",
    );
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
