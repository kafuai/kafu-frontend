import { EnterpriseContext } from "./contextTypes";

export class ContextFactory {
  static create(context: EnterpriseContext): EnterpriseContext {
    return {
      ...context,
      metadata: {
        ...context.metadata,
        updatedAt: new Date().toISOString(),
      },
    };
  }
}