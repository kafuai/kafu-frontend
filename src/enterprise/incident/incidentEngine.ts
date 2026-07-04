import {
  Incident,
  IncidentCreateInput,
  IncidentStatus,
} from "./incidentTypes";
import { createIncident } from "./incidentFactory";
import { IncidentRegistry } from "./incidentRegistry";
import { updateIncidentStatus } from "./incidentStatus";
import { validateIncidentCreateInput } from "./incidentValidator";

export class IncidentEngine {
  constructor(
    private readonly registry: IncidentRegistry,
  ) {}

  create(input: IncidentCreateInput): Incident {
    const validation = validateIncidentCreateInput(input);

    if (!validation.valid) {
      throw new Error(validation.errors.join(" "));
    }

    const incident = createIncident(input);

    return this.registry.register(incident);
  }

  acknowledge(id: string): Incident {
    return this.transition(id, "acknowledged");
  }

  investigate(id: string): Incident {
    return this.transition(id, "investigating");
  }

  mitigate(id: string): Incident {
    return this.transition(id, "mitigated");
  }

  resolve(id: string): Incident {
    return this.transition(id, "resolved");
  }

  close(id: string): Incident {
    return this.transition(id, "closed");
  }

  private transition(
    id: string,
    status: IncidentStatus,
  ): Incident {
    const incident = this.registry.getById(id);

    if (!incident) {
      throw new Error(`Incident not found: ${id}`);
    }

    const updatedIncident = updateIncidentStatus(
      incident,
      status,
    );

    return this.registry.update(updatedIncident);
  }
}