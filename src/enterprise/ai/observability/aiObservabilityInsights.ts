import { AIObservabilitySignal } from "./aiObservabilityTypes";

export interface AIObservabilityInsight {
  id: string;
  title: string;
  description: string;
  confidence: number;
  createdAt: Date;
}

export function generateAIObservabilityInsights(
  signals: AIObservabilitySignal[],
): AIObservabilityInsight[] {
  const insights: AIObservabilityInsight[] = [];

  const latencySignals = signals.filter((signal) => signal.type === "latency");
  const errorSignals = signals.filter((signal) => signal.type === "error");
  const qualitySignals = signals.filter((signal) => signal.type === "quality");
  const driftSignals = signals.filter((signal) => signal.type === "drift");

  if (latencySignals.length > 10) {
    insights.push({
      id: "latency-volume",
      title: "High Latency Activity",
      description:
        "A significant number of latency observations were collected. Review request throughput and model response times.",
      confidence: 0.92,
      createdAt: new Date(),
    });
  }

  if (errorSignals.length > 0) {
    insights.push({
      id: "error-presence",
      title: "Errors Detected",
      description:
        "AI execution errors were observed. Investigate provider responses and runtime failures.",
      confidence: 0.95,
      createdAt: new Date(),
    });
  }

  if (
    qualitySignals.some(
      (signal) => signal.value !== undefined && signal.value < 0.7,
    )
  ) {
    insights.push({
      id: "quality-degradation",
      title: "Quality Degradation",
      description:
        "Some AI quality scores are below the expected threshold.",
      confidence: 0.90,
      createdAt: new Date(),
    });
  }

  if (
    driftSignals.some(
      (signal) => signal.value !== undefined && signal.value >= 0.3,
    )
  ) {
    insights.push({
      id: "model-drift",
      title: "Potential Model Drift",
      description:
        "Model behavior may be drifting from the established baseline.",
      confidence: 0.88,
      createdAt: new Date(),
    });
  }

  return insights;
}