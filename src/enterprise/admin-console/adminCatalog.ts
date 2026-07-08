export interface AdminCatalogItem {
  code: string;
  name: string;
  enabled: boolean;
}

export class AdminCatalog {
  private readonly items = new Map<string, AdminCatalogItem>();

  add(item: AdminCatalogItem): void {
    this.items.set(item.code, item);
  }

  list(): AdminCatalogItem[] {
    return [...this.items.values()];
  }
}
