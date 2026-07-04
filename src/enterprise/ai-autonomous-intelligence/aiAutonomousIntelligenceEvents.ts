import { AIAutonomousIntelligenceInsight } from "./aiAutonomousIntelligenceInsight";
import { AIAutonomousIntelligenceReport } from "./aiAutonomousIntelligenceReporter";
import { AIAutonomousIntelligenceSignal } from "./aiAutonomousIntelligenceSignal";

export type AIAutonomousIntelligenceEventType =
  | "ai-autonomous-intelligence.signal.detected"
  | "ai-autonomous-intelligence.insight.created"
  | "ai-autonomous-intelligence.report.generated";

export interface AIAutonomousIntelligenceEvent<TPayload> {
  id: string;
  organizationId: string;
  type: AIAutonomousIntelligenceEventType;
  payload: TPayload;
  occurredAt: Date;
}

export function createAIAutonomousIntelligenceSignalDetectedEvent(
  id: string,
  signal: AIAutonomousIntelligenceSignal,
  occurredAt: Date = new Date(),
): AIAutonomousIntelligenceEvent<AIAutonomousIntelligenceSignal> {
  return {
    id,
    organizationId: signal.organizationId,
    type: "ai-autonomous-intelligence.signal.detected",
    payload: signal,
    occurredAt,
  };
}

export function createAIAutonomousIntelligenceInsightCreatedEvent(
  id: string,
  insight: AIAutonomousIntelligenceInsight,
  occurredAt: Date = new Date(),
): AIAutonomousIntelligenceEvent<AIAutonomousIntelligenceInsight> {
  return {
    id,
    organizationId: insight.organizationId,
    type: "ai-autonomous-intelligence.insight.created",
    payload: insight,
    occurredAt,
  };
}

export function createAIAutonomousIntelligenceReportGeneratedEvent(
  id: string,
  report: AIAutonomousIntelligenceReport,
  occurredAt: Date = new Date(),
): AIAutonomousIntelligenceEvent<AIAutonomousIntelligenceReport> {
  return {
    id,
    organizationId: report.organizationId,
    type: "ai-autonomous-intelligence.report.generated",
    payload: report,
    occurredAt,
  };
}