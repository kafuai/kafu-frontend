export interface PartnerEnablementResource {
  id: string;
  partnerId: string;
  title: string;
  category: string;
  completed: boolean;
}

export function markEnablementCompleted(
  resource: PartnerEnablementResource,
): PartnerEnablementResource {
  return {
    ...resource,
    completed: true,
  };
}
