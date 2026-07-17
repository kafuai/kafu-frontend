import {
  approveFinalPolishPlan,
  calculateFinalPolishScore,
  refreshFinalPolishPlan,
} from "./finalPolish";
import {
  buildFinalPolish,
} from "./finalPolishBuilder";
import {
  FinalPolishContext,
} from "./finalPolishContext";
import {
  FinalPolishIssue,
  FinalPolishPlan,
} from "./finalPolishTypes";
import {
  assertFinalPolishPlanValid,
} from "./finalPolishValidator";

export interface FinalPolishEngineInput {
  context: FinalPolishContext;
  title?: string;
  issues?: FinalPolishIssue[];
}

export class FinalPolishEngine {
  create(
    input: FinalPolishEngineInput,
  ): FinalPolishPlan {
    return buildFinalPolish({
      context: input.context,
      title: input.title,
      issues: input.issues,
      autoRefresh: true,
    });
  }

  refresh(
    plan: FinalPolishPlan,
  ): FinalPolishPlan {
    const refreshed = refreshFinalPolishPlan(plan);

    assertFinalPolishPlanValid(refreshed);

    return refreshed;
  }

  recalculate(
    plan: FinalPolishPlan,
  ): FinalPolishPlan {
    const updated: FinalPolishPlan = {
      ...plan,
      score: calculateFinalPolishScore(
        plan.items,
        plan.issues,
      ),
      updatedAt: new Date().toISOString(),
    };

    assertFinalPolishPlanValid(updated);

    return updated;
  }

  approve(
    plan: FinalPolishPlan,
  ): FinalPolishPlan {
    const refreshed = this.refresh(plan);

    return approveFinalPolishPlan(refreshed);
  }
}
