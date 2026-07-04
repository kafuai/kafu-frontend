export type CrossAnalysisInput = {
  executiveScore: number;
  aiConfidence: number;
  dataQualityScore: number;
  discoveryCompletion: number;
};

export type CrossAnalysisInsight = {
  title: string;
  message: string;
  severity: "success" | "info" | "warning";
};

export function generateCrossAnalysis(
  input: CrossAnalysisInput,
): CrossAnalysisInsight[] {
  const insights: CrossAnalysisInsight[] = [];

  if (
    input.dataQualityScore >= 80 &&
    input.executiveScore < 65
  ) {
    insights.push({
      title: "Execution Gap",
      message:
        "جودة البيانات مرتفعة، لكن الجاهزية التنفيذية أقل من المتوقع، مما يشير إلى فجوة بين المعرفة والتنفيذ.",
      severity: "warning",
    });
  }

  if (
    input.discoveryCompletion >= 100 &&
    input.aiConfidence >= 85
  ) {
    insights.push({
      title: "High Confidence Assessment",
      message:
        "جلسة Discovery مكتملة، وثقة KAFU AI مرتفعة، مما يجعل نتائج التقرير مناسبة لاتخاذ قرارات تنفيذية أولية.",
      severity: "success",
    });
  }

  if (
    input.aiConfidence < 70 &&
    input.dataQualityScore < 70
  ) {
    insights.push({
      title: "Improve Data Foundation",
      message:
        "يوصى بتحسين جودة البيانات واستكمال المعلومات قبل الاعتماد على التوصيات الاستراتيجية.",
      severity: "warning",
    });
  }

  if (
    input.executiveScore >= 85 &&
    input.aiConfidence >= 80
  ) {
    insights.push({
      title: "Enterprise Ready",
      message:
        "المؤسسة تقترب من مستوى جاهزية مؤسسية يسمح بالانتقال إلى مراحل ذكاء أكثر تقدمًا.",
      severity: "success",
    });
  }

  if (insights.length === 0) {
    insights.push({
      title: "Balanced Assessment",
      message:
        "المؤشرات الحالية متوازنة، مع وجود فرص واضحة لتحسين النضج المؤسسي تدريجيًا.",
      severity: "info",
    });
  }

  return insights;
}