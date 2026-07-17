import {
  createFinalPolishPlan,
  refreshFinalPolishPlan,
} from "./finalPolish";
import {
  buildFinalPolishPlanInput,
  FinalPolishContext,
} from "./finalPolishContext";
import {
  FinalPolishIssue,
  FinalPolishPlan,
} from "./finalPolishTypes";
import {
  assertFinalPolishPlanValid,
} from "./finalPolishValidator";

export interface FinalPolishBuilderInput {
  context: FinalPolishContext;
  title?: string;
  issues?: FinalPolishIssue[];
  autoRefresh?: boolean;
}

export function buildFinalPolish(
  input: FinalPolishBuilderInput,
): FinalPolishPlan {
  const planInput = buildFinalPolishPlanInput(input.context);

  planInput.title = input.title?.trim() ?? planInput.title;
  planInput.issues = input.issues ?? [];

  const plan = createFinalPolishPlan(planInput);

  const finalizedPlan =
    input.autoRefresh ?? true
      ? refreshFinalPolishPlan(plan)
      : plan;

  assertFinalPolishPlanValid(finalizedPlan);

  return finalizedPlan;
}
