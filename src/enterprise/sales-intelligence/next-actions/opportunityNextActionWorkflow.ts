import type {
  SalesPipelineNextAction,
} from "../salesIntelligenceTypes";

import {
  cancelOpportunityNextAction,
  completeOpportunityNextAction,
  createOpportunityNextAction,
  listOpportunityNextActions,
  transitionOpportunityNextAction,
  updateOpportunityNextAction,
} from "./opportunityNextActionRepository";

import type {
  CancelOpportunityNextActionInput,
  CompleteOpportunityNextActionInput,
  CreateOpportunityNextActionInput,
  OpportunityNextActionMutationResult,
  OpportunityNextActionQuery,
  OpportunityNextActionSnapshot,
  TransitionOpportunityNextActionInput,
  UpdateOpportunityNextActionInput,
} from "./opportunityNextActionTypes";

export class OpportunityNextActionWorkflow {
  list(
    query: OpportunityNextActionQuery,
  ): Promise<OpportunityNextActionSnapshot> {
    return listOpportunityNextActions(
      query,
    );
  }

  create(
    input: CreateOpportunityNextActionInput,
  ): Promise<OpportunityNextActionMutationResult> {
    return createOpportunityNextAction(
      input,
    );
  }

  update(
    input: UpdateOpportunityNextActionInput,
  ): Promise<OpportunityNextActionMutationResult> {
    return updateOpportunityNextAction(
      input,
    );
  }

  transition(
    input: TransitionOpportunityNextActionInput,
  ): Promise<SalesPipelineNextAction> {
    return transitionOpportunityNextAction(
      input,
    );
  }

  complete(
    input: CompleteOpportunityNextActionInput,
  ): Promise<SalesPipelineNextAction> {
    return completeOpportunityNextAction(
      input,
    );
  }

  cancel(
    input: CancelOpportunityNextActionInput,
  ): Promise<SalesPipelineNextAction> {
    return cancelOpportunityNextAction(
      input,
    );
  }
}

export const opportunityNextActionWorkflow =
  new OpportunityNextActionWorkflow();
