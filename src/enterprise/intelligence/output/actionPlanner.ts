import { AIDecision } from "./decisionTypes";

export class ActionPlanner {
  plan(decision: AIDecision) {
    return decision.actions.map((action) => {
      return {
        ...action,
        executed: false,
      };
    });
  }
}