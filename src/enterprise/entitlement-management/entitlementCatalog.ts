import { EntitlementType } from "./entitlementTypes";

export interface EntitlementCatalogItem {
  code: string;
  name: string;
  type: EntitlementType;
  description?: string;
  enabled: boolean;
}

export class EntitlementCatalog {
  private readonly items = new Map<string, EntitlementCatalogItem>();

  add(item: EntitlementCatalogItem): void {
    this.items.set(item.code, item);
  }

  get(code: string): EntitlementCatalogItem | undefined {
    return this.items.get(code);
  }

  list(): EntitlementCatalogItem[] {
    return [...this.items.values()];
  }
}