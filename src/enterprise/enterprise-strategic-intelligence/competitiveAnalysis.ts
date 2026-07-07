import {
  StrategicInsight,
  StrategicSignal,
} from "./strategicIntelligenceTypes";

export function analyzeCompetitiveSignals(
  signals: StrategicSignal[],
): StrategicInsight[] {
  return signals
    .filter((signal) => signal.type === "competitor")
    .map((signal) => ({
      id: signal.id,
      title: signal.title,
      summary: signal.description,
      confidence: signal.confidence,
      generatedAt: new Date(),
    }));
}