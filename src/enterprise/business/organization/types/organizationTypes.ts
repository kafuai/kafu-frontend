export interface CreateOrganizationInput {
  id: string;
  name: string;
  industry: string;
  size: "small" | "medium" | "large" | "enterprise";
}