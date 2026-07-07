export interface AISimulationEvent {
  id: string;
  scenarioId: string;
  type: string;
  timestamp: string;
  details: string;
}

export function createAISimulationEvent(
  event: AISimulationEvent,
): AISimulationEvent {
  return event;
}
