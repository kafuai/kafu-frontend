import {
  StrategicInsight,
  StrategicSignal,
} from "./strategicIntelligenceTypes";

export function analyzeMarketSignals(
  signals: StrategicSignal[],
): StrategicInsight[] {
  return signals
    .filter((signal) => signal.type === "market")
    .map((signal) => ({
      id: signal.id,
      title: signal.title,
      summary: signal.description,
      confidence: signal.confidence,
      generatedAt: new Date(),
    }));
}