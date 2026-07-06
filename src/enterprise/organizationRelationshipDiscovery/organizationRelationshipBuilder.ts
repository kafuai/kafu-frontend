import {
  OrganizationRelationship,
} from "./organizationRelationshipTypes";
import { OrganizationRelationshipGraph } from "./organizationRelationshipGraph";

export class OrganizationRelationshipBuilder {
  private readonly relationships: OrganizationRelationship[] = [];
  private organizationId = "";

  setOrganization(id: string): this {
    this.organizationId = id;
    return this;
  }

  addRelationship(
    relationship: OrganizationRelationship
  ): this {
    this.relationships.push(relationship);
    return this;
  }

  build(): OrganizationRelationshipGraph {
    return {
      organizationId: this.organizationId,
      relationships: [...this.relationships],
    };
  }
}