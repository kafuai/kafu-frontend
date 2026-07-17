import {
  ExecutiveApprover,
  ExecutiveApprovalCondition,
  ExecutiveApprovalEvidence,
  ExecutiveApprovalPriority,
  ExecutiveApprovalRiskLevel,
} from "./executiveApprovalTypes";

export interface ExecutiveApprovalContext {
  organizationId: string;
  approvalRequestId: string;
  decisionId: string;

  decisionTitle: string;
  decisionSummary?: string | null;

  requestedBy: string;
  requestedAt: string;

  priority: ExecutiveApprovalPriority;
  riskLevel: ExecutiveApprovalRiskLevel;

  strategicAlignmentScore: number;
  decisionConfidenceScore: number;
  executionReadinessScore: number;
  financialImpactScore: number;
  complianceScore: number;

  estimatedFinancialImpact?: number | null;
  currency?: string | null;

  approvers: ExecutiveApprover[];
  conditions: ExecutiveApprovalCondition[];
  evidence: ExecutiveApprovalEvidence[];

  policyIds: string[];
  riskIds: string[];
  dependencyIds: string[];

  requiresCommitteeApproval: boolean;
  requiresBoardApproval: boolean;
  emergencyApproval: boolean;

  evaluatedAt: string;
}

export interface CreateExecutiveApprovalContextInput {
  organizationId: string;
  approvalRequestId: string;
  decisionId: string;

  decisionTitle: string;
  decisionSummary?: string | null;

  requestedBy: string;
  requestedAt?: string;

  priority?: ExecutiveApprovalPriority;
  riskLevel?: ExecutiveApprovalRiskLevel;

  strategicAlignmentScore?: number;
  decisionConfidenceScore?: number;
  executionReadinessScore?: number;
  financialImpactScore?: number;
  complianceScore?: number;

  estimatedFinancialImpact?: number | null;
  currency?: string | null;

  approvers?: ExecutiveApprover[];
  conditions?: ExecutiveApprovalCondition[];
  evidence?: ExecutiveApprovalEvidence[];

  policyIds?: string[];
  riskIds?: string[];
  dependencyIds?: string[];

  requiresCommitteeApproval?: boolean;
  requiresBoardApproval?: boolean;
  emergencyApproval?: boolean;

  evaluatedAt?: string;
}

function normalizeScore(score: number | undefined): number {
  if (score === undefined || Number.isNaN(score)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(score)));
}

export function createExecutiveApprovalContext(
  input: CreateExecutiveApprovalContextInput,
): ExecutiveApprovalContext {
  const now = new Date().toISOString();

  return {
    organizationId: input.organizationId,
    approvalRequestId: input.approvalRequestId,
    decisionId: input.decisionId,

    decisionTitle: input.decisionTitle,
    decisionSummary: input.decisionSummary ?? null,

    requestedBy: input.requestedBy,
    requestedAt: input.requestedAt ?? now,

    priority: input.priority ?? "medium",
    riskLevel: input.riskLevel ?? "moderate",

    strategicAlignmentScore: normalizeScore(
      input.strategicAlignmentScore,
    ),
    decisionConfidenceScore: normalizeScore(
      input.decisionConfidenceScore,
    ),
    executionReadinessScore: normalizeScore(
      input.executionReadinessScore,
    ),
    financialImpactScore: normalizeScore(
      input.financialImpactScore,
    ),
    complianceScore: normalizeScore(
      input.complianceScore,
    ),

    estimatedFinancialImpact:
      input.estimatedFinancialImpact ?? null,
    currency: input.currency ?? null,

    approvers: input.approvers ?? [],
    conditions: input.conditions ?? [],
    evidence: input.evidence ?? [],

    policyIds: input.policyIds ?? [],
    riskIds: input.riskIds ?? [],
    dependencyIds: input.dependencyIds ?? [],

    requiresCommitteeApproval:
      input.requiresCommitteeApproval ?? false,
    requiresBoardApproval:
      input.requiresBoardApproval ?? false,
    emergencyApproval:
      input.emergencyApproval ?? false,

    evaluatedAt: input.evaluatedAt ?? now,
  };
}
