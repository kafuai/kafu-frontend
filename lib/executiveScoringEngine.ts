export type ExecutiveScoringCompanyInput = {
  name: string | null;
  industry: string | null;
  country: string | null;
  employee_count: number | null;
};

export type ExecutiveScoringAnswerInput = {
  question: string;
  answer: string;
  question_order: number;
};

export type ExecutiveScoringResult = {
  executiveScore: number;
  aiConfidence: number;
  dataQualityScore: number;
  discoveryCompletion: number;
  companyContextScore: number;
  maturityLevel: string;
  status: string;
};

const EXPECTED_DISCOVERY_QUESTIONS = 5;

function clampScore(value: number) {
  if (Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function hasMeaningfulAnswer(answer: ExecutiveScoringAnswerInput) {
  return answer.answer.trim().length > 0;
}

function getCompletedAnswersCount(answers: ExecutiveScoringAnswerInput[]) {
  return answers.filter(hasMeaningfulAnswer).length;
}

function getDiscoveryCompletion(answers: ExecutiveScoringAnswerInput[]) {
  return clampScore(
    (getCompletedAnswersCount(answers) / EXPECTED_DISCOVERY_QUESTIONS) * 100,
  );
}

function getCompanyContextScore(company: ExecutiveScoringCompanyInput | null) {
  const fields = [
    company?.name,
    company?.industry,
    company?.country,
    company?.employee_count,
  ];

  const completedFields = fields.filter((field) => {
    if (typeof field === "number") return field > 0;
    return Boolean(field);
  }).length;

  return clampScore((completedFields / fields.length) * 100);
}

function getDataQualityScore(
  company: ExecutiveScoringCompanyInput | null,
  answers: ExecutiveScoringAnswerInput[],
) {
  const companyContextScore = getCompanyContextScore(company);
  const discoveryCompletion = getDiscoveryCompletion(answers);

  return clampScore(companyContextScore * 0.55 + discoveryCompletion * 0.45);
}

function getAiConfidence(
  company: ExecutiveScoringCompanyInput | null,
  answers: ExecutiveScoringAnswerInput[],
) {
  const dataQualityScore = getDataQualityScore(company, answers);
  const discoveryCompletion = getDiscoveryCompletion(answers);
  const completedAnswers = getCompletedAnswersCount(answers);

  const consistencyScore =
    completedAnswers >= EXPECTED_DISCOVERY_QUESTIONS
      ? 95
      : completedAnswers >= 3
        ? 80
        : completedAnswers > 0
          ? 65
          : 35;

  return clampScore(
    dataQualityScore * 0.4 +
      discoveryCompletion * 0.35 +
      consistencyScore * 0.25,
  );
}

function getExecutiveScore(
  company: ExecutiveScoringCompanyInput | null,
  answers: ExecutiveScoringAnswerInput[],
) {
  const dataQualityScore = getDataQualityScore(company, answers);
  const discoveryCompletion = getDiscoveryCompletion(answers);
  const aiConfidence = getAiConfidence(company, answers);
  const companyContextScore = getCompanyContextScore(company);

  return clampScore(
    dataQualityScore * 0.3 +
      discoveryCompletion * 0.25 +
      aiConfidence * 0.25 +
      companyContextScore * 0.2,
  );
}

function getMaturityLevel(score: number) {
  if (score >= 85) return "Enterprise Ready";
  if (score >= 75) return "Strong Foundation";
  if (score >= 65) return "Developing Intelligence";
  return "Early Intelligence Stage";
}

function getStatus(score: number) {
  if (score >= 85) return "AI Transformation Ready";
  if (score >= 75) return "Operational Readiness";
  if (score >= 65) return "Discovery In Progress";
  return "Needs More Discovery";
}

export function scoreExecutiveReadiness(
  company: ExecutiveScoringCompanyInput | null,
  answers: ExecutiveScoringAnswerInput[],
): ExecutiveScoringResult {
  const executiveScore = getExecutiveScore(company, answers);
  const aiConfidence = getAiConfidence(company, answers);
  const dataQualityScore = getDataQualityScore(company, answers);
  const discoveryCompletion = getDiscoveryCompletion(answers);
  const companyContextScore = getCompanyContextScore(company);

  return {
    executiveScore,
    aiConfidence,
    dataQualityScore,
    discoveryCompletion,
    companyContextScore,
    maturityLevel: getMaturityLevel(executiveScore),
    status: getStatus(executiveScore),
  };
}