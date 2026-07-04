export type ExecutiveReportInput = {
  companyName?: string | null;
  industry?: string | null;
  country?: string | null;
  employeeCount?: number | null;
  readinessScore: number;
  corporateBrainScore: number;
  discoveryAnswersCount: number;
  overdueLeads: number;
  pipelineValue: number;
  conversionRate: number;
};

function clampScore(value: number) {
  if (Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function formatCurrency(value: number) {
  return `${value.toLocaleString()} SAR`;
}

function getExecutiveScore(input: ExecutiveReportInput) {
  const discoveryWeight = Math.min(input.discoveryAnswersCount / 5, 1) * 20;
  const readinessWeight = input.readinessScore * 0.35;
  const brainWeight = input.corporateBrainScore * 0.25;
  const conversionWeight = Math.min(input.conversionRate, 100) * 0.15;
  const pipelineWeight = input.pipelineValue > 0 ? 5 : 0;
  const riskPenalty = input.overdueLeads > 0 ? Math.min(input.overdueLeads * 4, 15) : 0;

  return clampScore(
    discoveryWeight +
      readinessWeight +
      brainWeight +
      conversionWeight +
      pipelineWeight -
      riskPenalty
  );
}

function getDataQualityScore(input: ExecutiveReportInput) {
  const fields = [
    input.companyName,
    input.industry,
    input.country,
    input.employeeCount,
    input.discoveryAnswersCount,
    input.pipelineValue,
    input.conversionRate,
  ];

  const completedFields = fields.filter((field) => {
    if (typeof field === "number") return field > 0;
    return Boolean(field);
  }).length;

  return clampScore((completedFields / fields.length) * 100);
}

function getDiscoveryCompletion(input: ExecutiveReportInput) {
  return clampScore((input.discoveryAnswersCount / 5) * 100);
}

function getAiConfidence(input: ExecutiveReportInput) {
  const dataQualityScore = getDataQualityScore(input);
  const discoveryCompletion = getDiscoveryCompletion(input);
  const stabilityScore = input.overdueLeads > 0 ? 72 : 94;

  return clampScore(
    dataQualityScore * 0.4 + discoveryCompletion * 0.4 + stabilityScore * 0.2
  );
}

function getMaturityLevel(score: number) {
  if (score >= 85) return "Enterprise Ready";
  if (score >= 70) return "Growth Ready";
  if (score >= 50) return "Developing";
  return "Early Stage";
}

function getExecutiveStatus(score: number) {
  if (score >= 85) return "جاهزية عالية";
  if (score >= 70) return "جاهزية جيدة";
  if (score >= 50) return "جاهزية متوسطة";
  return "تحتاج تحسين";
}

function getBusinessStage(input: ExecutiveReportInput, executiveScore: number) {
  if (executiveScore >= 85) return "Scale Stage";
  if (input.pipelineValue > 0 && input.conversionRate >= 30) return "Growth Stage";
  if (input.discoveryAnswersCount >= 5) return "Foundation Stage";
  return "Discovery Stage";
}

function getOrganizationPattern(input: ExecutiveReportInput) {
  if (input.overdueLeads > 0) return "Decision Bottleneck";
  if (input.corporateBrainScore >= 80 && input.readinessScore >= 75) {
    return "Structured Execution";
  }
  if (input.conversionRate < 25 && input.pipelineValue > 0) {
    return "Commercial Friction";
  }
  return "Emerging Operating Model";
}

function buildDynamicFinding(input: ExecutiveReportInput, executiveScore: number) {
  if (input.discoveryAnswersCount < 5) {
    return "نتائج Discovery غير مكتملة، مما يقلل دقة القراءة التنفيذية ويجعل التوصيات الحالية بحاجة إلى بيانات إضافية قبل اعتمادها.";
  }

  if (input.overdueLeads > 0) {
    return `يوجد ${input.overdueLeads} عنصر متأخر في Pipeline، وهذا يشير إلى وجود بطء في المتابعة أو فجوة في تحويل الفرص إلى قرارات تنفيذية.`;
  }

  if (input.pipelineValue > 0 && input.conversionRate < 25) {
    return "توجد قيمة تجارية في Pipeline، لكن معدل التحويل الحالي منخفض نسبيًا، مما يشير إلى فرصة لتحسين جودة المتابعة وآلية الإغلاق.";
  }

  if (executiveScore >= 80) {
    return "المؤشرات التنفيذية الحالية تعكس جاهزية قوية للانتقال إلى طبقة أعمق من الذكاء المؤسسي وربط التوصيات بالبيانات الحية.";
  }

  return "المؤشرات الحالية تظهر أساسًا جيدًا، لكن ما زالت هناك فرصة لتحسين جودة البيانات والجاهزية التشغيلية قبل التوسع.";
}

function buildDynamicRecommendation(input: ExecutiveReportInput) {
  if (input.discoveryAnswersCount < 5) {
    return "الأولوية الأولى هي إكمال Discovery حتى يستطيع KAFU AI توليد قراءة تنفيذية أكثر دقة وتوصيات أعلى موثوقية.";
  }

  if (input.overdueLeads > 0) {
    return "ينصح بعقد مراجعة تنفيذية قصيرة لمعالجة العناصر المتأخرة وتحويلها إلى قرارات واضحة خلال 7 أيام.";
  }

  if (input.pipelineValue > 0 && input.conversionRate < 25) {
    return "ينصح بتحليل أسباب انخفاض التحويل وربط Pipeline بتوصيات مبيعات وتشغيل أكثر دقة.";
  }

  return "الخطوة التالية هي تفعيل Executive Intelligence Engine وربطه بمؤشرات الشركة الحية.";
}

function buildExecutiveNarrative(
  input: ExecutiveReportInput,
  executiveScore: number,
  status: string
) {
  const company = input.companyName || "الشركة الحالية";
  const industry = input.industry || "القطاع غير المحدد";
  const country = input.country || "السوق الحالي";

  return `يعرض KAFU AI قراءة تنفيذية أولية عن ${company} في ${industry} داخل ${country}. النتيجة الحالية ${executiveScore}%، وهي تعكس ${status}. تعتمد هذه القراءة على مستوى اكتمال Discovery، جودة البيانات، جاهزية التشغيل، مؤشرات Corporate Brain، وحالة Pipeline الحالية.`;
}

export function buildExecutiveReport(input: ExecutiveReportInput) {
  const executiveScore = getExecutiveScore(input);
  const aiConfidence = getAiConfidence(input);
  const dataQualityScore = getDataQualityScore(input);
  const discoveryCompletion = getDiscoveryCompletion(input);
  const maturityLevel = getMaturityLevel(executiveScore);
  const status = getExecutiveStatus(executiveScore);
  const businessStage = getBusinessStage(input, executiveScore);
  const organizationPattern = getOrganizationPattern(input);
  const dynamicFinding = buildDynamicFinding(input, executiveScore);
  const dynamicRecommendation = buildDynamicRecommendation(input);

  return {
    title: `Executive Report — ${input.companyName || "KAFU AI"}`,

    intelligence: {
      executiveScore,
      aiConfidence,
      dataQualityScore,
      discoveryCompletion,
      maturityLevel,
      status,
    },

    corporateDNA: {
      maturityScore: executiveScore,
      businessStage,
      organizationPattern,
    },

    corporateBrain: {
      score: clampScore(input.corporateBrainScore),
      decisionStyle:
        input.overdueLeads > 0 ? "Delayed Decision Flow" : "Balanced Decision Flow",
      executionMode:
        input.readinessScore >= 75 ? "Structured Execution" : "Developing Execution",
      riskBehavior:
        input.overdueLeads > 0 ? "Reactive Risk Handling" : "Controlled Risk Handling",
    },

    readinessMatrix: {
      discovery: discoveryCompletion,
      dataQuality: dataQualityScore,
      corporateBrain: clampScore(input.corporateBrainScore),
      businessReadiness: clampScore(input.readinessScore),
      commercialReadiness: clampScore(input.conversionRate),
    },

    overview: {
      heading: "Executive Overview",
      content: buildExecutiveNarrative(input, executiveScore, status),
    },

    readiness: {
      heading: "Readiness Assessment",
      content: `مؤشر الجاهزية التنفيذي الحالي هو ${input.readinessScore}%، بينما وصلت جاهزية Corporate Brain إلى ${input.corporateBrainScore}%. التصنيف الحالي: ${status}.`,
    },

    businessImpact: {
      heading: "Business Impact",
      content: `قيمة الفرص الحالية في Pipeline تساوي ${formatCurrency(
        input.pipelineValue
      )}، ومعدل التحويل الحالي هو ${input.conversionRate}%.`,
    },

    findings: {
      heading: "Dynamic Findings",
      content: dynamicFinding,
    },

    risks: {
      heading: "Executive Risks",
      content:
        input.overdueLeads > 0
          ? `يوجد ${input.overdueLeads} عنصر متأخر يحتاج قرارًا أو متابعة تنفيذية.`
          : "لا توجد مخاطر حرجة ظاهرة حاليًا في Pipeline.",
    },

    recommendation: {
      heading: "Recommended Next Step",
      content: dynamicRecommendation,
    },
  };
}