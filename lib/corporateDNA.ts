export type BusinessStage =
  | "startup"
  | "growth"
  | "mature"
  | "transformation"
  | "enterprise"
  | "unknown";

export type LeadershipStyle =
  | "centralized"
  | "collaborative"
  | "data_driven"
  | "reactive"
  | "balanced"
  | "unknown";

export type OrganizationPattern =
  | "people_dependent"
  | "process_driven"
  | "technology_enabled"
  | "decision_bottleneck"
  | "commercial_friction"
  | "siloed"
  | "unknown";

export type TransformationPriority =
  | "hr_foundation"
  | "operations_efficiency"
  | "leadership_alignment"
  | "digital_maturity"
  | "risk_reduction"
  | "growth_enablement"
  | "data_quality"
  | "corporate_brain"
  | "executive_readiness";

export type CorporateTrait = {
  key: string;
  title: string;
  description: string;
  confidence: number;
};

export type CompanyProfile = {
  name: string | null;
  industry: string | null;
  country: string | null;
  employeeCount: number | null;
};

export type CorporateDNA = {
  company: CompanyProfile;

  businessStage: BusinessStage;
  leadershipStyle: LeadershipStyle;
  organizationPattern: OrganizationPattern;

  maturityScore: number;
  aiConfidence: number;
  dataQualityScore: number;

  strengths: CorporateTrait[];
  risks: CorporateTrait[];
  priorities: TransformationPriority[];

  executiveSummary: string;
  recommendedPath: string;

  generatedAt: string;
};

type BuildCorporateDNAInput = {
  company: CompanyProfile;
  aiConfidence: number;
  dataQualityScore: number;
  maturityScore?: number;
};

function clampScore(value: number) {
  if (Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function getBusinessStage(company: CompanyProfile, maturityScore: number): BusinessStage {
  if (maturityScore >= 85) return "enterprise";
  if (maturityScore >= 75) return "mature";
  if (maturityScore >= 60) return "growth";
  if (company.employeeCount && company.employeeCount >= 50) return "transformation";
  if (company.employeeCount && company.employeeCount > 0) return "startup";
  return "unknown";
}

function getLeadershipStyle(
  aiConfidence: number,
  dataQualityScore: number,
): LeadershipStyle {
  if (dataQualityScore >= 85 && aiConfidence >= 80) return "data_driven";
  if (aiConfidence >= 75) return "collaborative";
  if (dataQualityScore < 50) return "reactive";
  return "balanced";
}

function getOrganizationPattern(
  maturityScore: number,
  dataQualityScore: number,
): OrganizationPattern {
  if (maturityScore >= 85) return "technology_enabled";
  if (dataQualityScore >= 75) return "process_driven";
  if (dataQualityScore < 50) return "people_dependent";
  return "technology_enabled";
}

function buildStrengths(
  aiConfidence: number,
  dataQualityScore: number,
  maturityScore: number,
): CorporateTrait[] {
  return [
    {
      key: "executive_readiness",
      title: "Executive Readiness",
      description:
        maturityScore >= 75
          ? "المؤسسة تظهر جاهزية تنفيذية جيدة تسمح ببناء طبقة ذكاء مؤسسي أكثر تقدمًا."
          : "توجد بداية جيدة لبناء الجاهزية التنفيذية، لكنها تحتاج إلى مزيد من تنظيم البيانات والقرارات.",
      confidence: clampScore(maturityScore),
    },
    {
      key: "ai_confidence",
      title: "AI Confidence",
      description:
        aiConfidence >= 75
          ? "مستوى ثقة KAFU AI في القراءة الحالية جيد ويدعم اتخاذ قرارات أولية."
          : "ثقة التحليل ما زالت بحاجة إلى تحسين عبر استكمال البيانات وزيادة وضوح المدخلات.",
      confidence: clampScore(aiConfidence),
    },
    {
      key: "data_quality",
      title: "Data Foundation",
      description:
        dataQualityScore >= 75
          ? "جودة البيانات الحالية تساعد على إنتاج تحليل تنفيذي أكثر موثوقية."
          : "جودة البيانات تحتاج إلى تحسين قبل الاعتماد الكامل على التوصيات الذكية.",
      confidence: clampScore(dataQualityScore),
    },
  ];
}

function buildRisks(
  dataQualityScore: number,
  maturityScore: number,
): CorporateTrait[] {
  return [
    {
      key: "data_gap",
      title: "Data Gap Risk",
      description:
        dataQualityScore < 75
          ? "نقص أو ضعف اكتمال البيانات قد يقلل دقة Corporate DNA والتوصيات التنفيذية."
          : "مخاطر البيانات منخفضة نسبيًا، مع الحاجة إلى تحديث مستمر للمدخلات.",
      confidence: clampScore(100 - dataQualityScore),
    },
    {
      key: "execution_gap",
      title: "Execution Gap",
      description:
        maturityScore < 70
          ? "هناك فجوة محتملة بين الرؤية التنفيذية والقدرة التشغيلية على التنفيذ."
          : "الفجوة التشغيلية تبدو تحت السيطرة في القراءة الحالية.",
      confidence: clampScore(100 - maturityScore),
    },
  ];
}

function buildPriorities(
  dataQualityScore: number,
  maturityScore: number,
): TransformationPriority[] {
  const priorities: TransformationPriority[] = [];

  if (dataQualityScore < 75) priorities.push("data_quality");
  if (maturityScore < 75) priorities.push("executive_readiness");

  priorities.push("corporate_brain");
  priorities.push("digital_maturity");
  priorities.push("growth_enablement");

  return priorities.slice(0, 4);
}

export function buildCorporateDNA({
  company,
  aiConfidence,
  dataQualityScore,
  maturityScore,
}: BuildCorporateDNAInput): CorporateDNA {
  const finalMaturityScore = clampScore(
    maturityScore ?? aiConfidence * 0.55 + dataQualityScore * 0.45,
  );

  const businessStage = getBusinessStage(company, finalMaturityScore);
  const leadershipStyle = getLeadershipStyle(aiConfidence, dataQualityScore);
  const organizationPattern = getOrganizationPattern(
    finalMaturityScore,
    dataQualityScore,
  );

  return {
    company,
    businessStage,
    leadershipStyle,
    organizationPattern,
    maturityScore: finalMaturityScore,
    aiConfidence: clampScore(aiConfidence),
    dataQualityScore: clampScore(dataQualityScore),
    strengths: buildStrengths(aiConfidence, dataQualityScore, finalMaturityScore),
    risks: buildRisks(dataQualityScore, finalMaturityScore),
    priorities: buildPriorities(dataQualityScore, finalMaturityScore),
    executiveSummary: `تعكس Corporate DNA الحالية مستوى ${businessStage} مع نمط قيادة ${leadershipStyle} ونمط تنظيمي ${organizationPattern}.`,
    recommendedPath:
      finalMaturityScore >= 75
        ? "الانتقال إلى بناء Corporate Brain وربطه بمؤشرات الأداء والقرارات التنفيذية."
        : "استكمال جودة البيانات ورفع الجاهزية التنفيذية قبل التوسع في طبقات الذكاء المؤسسي.",
    generatedAt: new Date().toISOString(),
  };
}