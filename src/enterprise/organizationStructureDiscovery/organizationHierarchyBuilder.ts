import {
  OrganizationNode,
} from "./organizationNodeTypes";
import { OrganizationHierarchy } from "./organizationHierarchy";

export class OrganizationHierarchyBuilder {
  private readonly nodes: OrganizationNode[] = [];
  private rootNodeId = "";

  setRoot(node: OrganizationNode): this {
    this.rootNodeId = node.id;
    this.nodes.push(node);
    return this;
  }

  addNode(node: OrganizationNode): this {
    this.nodes.push(node);
    return this;
  }

  build(): OrganizationHierarchy {
    return {
      rootNodeId: this.rootNodeId,
      nodes: [...this.nodes],
    };
  }
}