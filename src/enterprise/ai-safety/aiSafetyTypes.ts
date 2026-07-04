export enum AISafetyRiskLevel {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

export enum AISafetyStatus {
  SAFE = "SAFE",
  NEEDS_REVIEW = "NEEDS_REVIEW",
  UNSAFE = "UNSAFE",
  BLOCKED = "BLOCKED",
}

export enum AISafetyDomain {
  HARMFUL_CONTENT = "HARMFUL_CONTENT",
  PRIVACY = "PRIVACY",
  SECURITY = "SECURITY",
  BIAS = "BIAS",
  MISINFORMATION = "MISINFORMATION",
  POLICY_VIOLATION = "POLICY_VIOLATION",
  MODEL_BEHAVIOR = "MODEL_BEHAVIOR",
  DATA_LEAKAGE = "DATA_LEAKAGE",
}

export interface AISafetySignal {
  id: string;
  domain: AISafetyDomain;
  riskLevel: AISafetyRiskLevel;
  message: string;
  confidence: number;
  detectedAt: Date;
}

export interface AISafetyDecision {
  status: AISafetyStatus;
  riskLevel: AISafetyRiskLevel;
  allowExecution: boolean;
  requiresHumanReview: boolean;
  signals: AISafetySignal[];
  reason: string;
  evaluatedAt: Date;
}