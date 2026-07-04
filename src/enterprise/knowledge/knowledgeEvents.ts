import {
  KnowledgeAsset,
  KnowledgeClassification,
  KnowledgeSource,
} from "./knowledgeTypes";

export type KnowledgeEventType =
  | "knowledge_source_created"
  | "knowledge_source_enabled"
  | "knowledge_source_disabled"
  | "knowledge_asset_created"
  | "knowledge_asset_activated"
  | "knowledge_asset_archived"
  | "knowledge_asset_deprecated"
  | "knowledge_asset_classified"
  | "knowledge_quality_evaluated"
  | "knowledge_search_performed"
  | "knowledge_gap_detected";

export interface KnowledgeEvent {
  id: string;
  tenantId: string;
  type: KnowledgeEventType;
  entityId: string;
  entityType: "source" | "asset" | "classification" | "search" | "gap";
  message: string;
  occurredAt: string;
  metadata?: Record<string, string | number | boolean>;
}

export function createKnowledgeSourceEvent(
  source: KnowledgeSource,
  type: Extract<
    KnowledgeEventType,
    | "knowledge_source_created"
    | "knowledge_source_enabled"
    | "knowledge_source_disabled"
  >,
  message: string,
): KnowledgeEvent {
  return {
    id: `${source.id}-${type}-${Date.now()}`,
    tenantId: source.metadata.tenantId,
    type,
    entityId: source.id,
    entityType: "source",
    message,
    occurredAt: new Date().toISOString(),
  };
}

export function createKnowledgeAssetEvent(
  asset: KnowledgeAsset,
  type: Extract<
    KnowledgeEventType,
    | "knowledge_asset_created"
    | "knowledge_asset_activated"
    | "knowledge_asset_archived"
    | "knowledge_asset_deprecated"
    | "knowledge_quality_evaluated"
  >,
  message: string,
): KnowledgeEvent {
  return {
    id: `${asset.id}-${type}-${Date.now()}`,
    tenantId: asset.metadata.tenantId,
    type,
    entityId: asset.id,
    entityType: "asset",
    message,
    occurredAt: new Date().toISOString(),
  };
}

export function createKnowledgeClassificationEvent(
  classification: KnowledgeClassification,
  tenantId: string,
): KnowledgeEvent {
  return {
    id: `${classification.assetId}-classified-${Date.now()}`,
    tenantId,
    type: "knowledge_asset_classified",
    entityId: classification.assetId,
    entityType: "classification",
    message: "Knowledge asset classification was updated.",
    occurredAt: new Date().toISOString(),
    metadata: {
      taxonomyNodeCount: classification.taxonomyNodeIds.length,
      sensitivity: classification.sensitivity,
      confidence: classification.confidence,
    },
  };
}

export function filterKnowledgeEventsByTenant(
  events: KnowledgeEvent[],
  tenantId: string,
): KnowledgeEvent[] {
  return events.filter((event) => event.tenantId === tenantId);
}