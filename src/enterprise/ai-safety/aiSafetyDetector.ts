import {
  AISafetyDomain,
  AISafetyRiskLevel,
  AISafetySignal,
} from "./aiSafetyTypes";

export interface AISafetyDetectionInput {
  text: string;
  source: "INPUT" | "OUTPUT";
  requestId: string;
}

export interface AISafetyDetectionRule {
  id: string;
  domain: AISafetyDomain;
  riskLevel: AISafetyRiskLevel;
  keywords: string[];
  message: string;
  confidence: number;
}

export const defaultAISafetyDetectionRules: AISafetyDetectionRule[] = [
  {
    id: "detect-data-leakage",
    domain: AISafetyDomain.DATA_LEAKAGE,
    riskLevel: AISafetyRiskLevel.HIGH,
    keywords: ["password", "secret", "api_key", "private key", "token"],
    message: "Potential sensitive data leakage detected.",
    confidence: 0.86,
  },
  {
    id: "detect-security-risk",
    domain: AISafetyDomain.SECURITY,
    riskLevel: AISafetyRiskLevel.HIGH,
    keywords: ["exploit", "bypass", "malware", "credential theft"],
    message: "Potential security-sensitive AI content detected.",
    confidence: 0.82,
  },
  {
    id: "detect-misinformation-risk",
    domain: AISafetyDomain.MISINFORMATION,
    riskLevel: AISafetyRiskLevel.MEDIUM,
    keywords: ["guaranteed fact", "undeniable proof", "secret truth"],
    message: "Potential misinformation-style claim detected.",
    confidence: 0.68,
  },
];

export function detectAISafetySignals(
  input: AISafetyDetectionInput,
  rules: AISafetyDetectionRule[] = defaultAISafetyDetectionRules,
): AISafetySignal[] {
  const normalizedText = input.text.toLowerCase();

  return rules
    .filter((rule) =>
      rule.keywords.some((keyword) =>
        normalizedText.includes(keyword.toLowerCase()),
      ),
    )
    .map((rule) => ({
      id: `${input.requestId}-${rule.id}`,
      domain: rule.domain,
      riskLevel: rule.riskLevel,
      message: `${rule.message} Source: ${input.source}.`,
      confidence: rule.confidence,
      detectedAt: new Date(),
    }));
}