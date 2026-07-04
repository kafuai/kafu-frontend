import { EnterpriseContext, EnterpriseContextItem } from "./contextTypes";

export class ContextBuilder {
  private readonly items: EnterpriseContextItem[] = [];

  add(item: EnterpriseContextItem): this {
    this.items.push(item);
    return this;
  }

  addMany(items: EnterpriseContextItem[]): this {
    this.items.push(...items);
    return this;
  }

  clear(): void {
    this.items.length = 0;
  }

  build(organizationId: string): EnterpriseContext {
    return {
      organizationId,
      generatedAt: new Date().toISOString(),
      items: [...this.items],
    };
  }
}