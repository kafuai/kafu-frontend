import { generateCrossAnalysis } from "@/lib/crossAnalysisEngine";
import { scoreExecutiveReadiness } from "@/lib/executiveScoringEngine";

export type ExecutiveCompanyInput = {
  name: string | null;
  industry: string | null;
  country: string | null;
  employee_count: number | null;
};

export type ExecutiveAnswerInput = {
  question: string;
  answer: string;
  question_order: number;
};

export type ExecutiveFinding = {
  title: string;
  description: string;
  impact: string;
};

export type ExecutivePriority = {
  title: string;
  description: string;
  timeline: string;
};

export type ExecutiveRisk = {
  title: string;
  description: string;
  level: string;
};

export type ExecutiveQuickWin = {
  title: string;
  description: string;
  effort: string;
};

export type ExecutiveRoadmapPhase = {
  period: string;
  title: string;
  description: string;
  outcome: string;
};

export type ExecutiveReadinessMatrixItem = {
  area: string;
  score: number;
  status: string;
  description: string;
};

export type ExecutiveReportInsights = {
  score: number;
  status: string;
  maturityLevel: string;
  summary: string;
  aiConfidence: number;
  dataQualityScore: number;
  discoveryCompletion: number;
  readinessMatrix: ExecutiveReadinessMatrixItem[];
  findings: ExecutiveFinding[];
  priorities: ExecutivePriority[];
  risks: ExecutiveRisk[];
  quickWins: ExecutiveQuickWin[];
  crossAnalysis: ReturnType<typeof generateCrossAnalysis>;
  roadmap: ExecutiveRoadmapPhase[];
};

const EXPECTED_DISCOVERY_QUESTIONS = 5;

function clampScore(value: number) {
  if (Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function hasMeaningfulAnswer(answer: ExecutiveAnswerInput) {
  return answer.answer.trim().length > 0;
}

function getCompletedAnswersCount(answers: ExecutiveAnswerInput[]) {
  return answers.filter(hasMeaningfulAnswer).length;
}

function getMatrixStatus(score: number) {
  if (score >= 85) return "Ready";
  if (score >= 70) return "Stable";
  if (score >= 50) return "Developing";
  return "Needs Attention";
}

function buildReadinessMatrix(
  company: ExecutiveCompanyInput | null,
  answers: ExecutiveAnswerInput[],
): ExecutiveReadinessMatrixItem[] {
  const scoring = scoreExecutiveReadiness(company, answers);
  const completedAnswers = getCompletedAnswersCount(answers);

  const corporateDnaScore = clampScore(
    scoring.dataQualityScore * 0.45 +
      scoring.discoveryCompletion * 0.35 +
      scoring.companyContextScore * 0.2,
  );

  const corporateBrainScore = clampScore(
    scoring.discoveryCompletion * 0.5 +
      scoring.aiConfidence * 0.3 +
      completedAnswers * 4,
  );

  const digitalWorkforceScore = clampScore(
    corporateBrainScore * 0.45 +
      corporateDnaScore * 0.35 +
      scoring.aiConfidence * 0.2,
  );

  return [
    {
      area: "Company Context",
      score: scoring.companyContextScore,
      status: getMatrixStatus(scoring.companyContextScore),
      description: "اكتمال بيانات الشركة الأساسية: الاسم، القطاع، الدولة، وحجم الفريق.",
    },
    {
      area: "Discovery Intelligence",
      score: scoring.discoveryCompletion,
      status: getMatrixStatus(scoring.discoveryCompletion),
      description: "مدى اكتمال إجابات جلسة الاستكشاف وتحولها إلى مدخلات قابلة للتحليل.",
    },
    {
      area: "Corporate DNA",
      score: corporateDnaScore,
      status: getMatrixStatus(corporateDnaScore),
      description: "جاهزية بناء الهوية التشغيلية والمؤشرات التي تمثل شخصية المؤسسة.",
    },
    {
      area: "Corporate Brain",
      score: corporateBrainScore,
      status: getMatrixStatus(corporateBrainScore),
      description: "جاهزية تحويل المعرفة الداخلية إلى طبقة معرفية ذكية داخل KAFU AI.",
    },
    {
      area: "Digital Workforce",
      score: digitalWorkforceScore,
      status: getMatrixStatus(digitalWorkforceScore),
      description: "جاهزية الشركة لتفعيل وكلاء ذكاء اصطناعي يدعمون الفريق والعمليات.",
    },
  ];
}

function buildDynamicFindings(
  company: ExecutiveCompanyInput | null,
  answers: ExecutiveAnswerInput[],
  dataQualityScore: number,
  discoveryCompletion: number,
  aiConfidence: number,
): ExecutiveFinding[] {
  const completedAnswers = getCompletedAnswersCount(answers);

  return [
    {
      title: "جودة البيانات التنفيذية",
      description:
        dataQualityScore >= 75
          ? "بيانات الشركة ومدخلات Discovery توفر أساسًا جيدًا لإنتاج تحليل تنفيذي موثوق وقابل للتطوير."
          : "جودة البيانات الحالية تحتاج إلى استكمال وتحسين قبل الوصول إلى تحليل تنفيذي عالي الدقة.",
      impact: dataQualityScore >= 75 ? "High" : "Medium",
    },
    {
      title: "اكتمال Discovery Intelligence",
      description:
        discoveryCompletion >= 80
          ? `تم تسجيل ${completedAnswers} إجابات مكتملة، مما يمنح KAFU AI رؤية أوضح حول واقع الشركة وأولوياتها.`
          : `تم تسجيل ${completedAnswers} إجابات مكتملة فقط، لذلك ما زالت قراءة KAFU AI بحاجة إلى مدخلات إضافية.`,
      impact: discoveryCompletion >= 80 ? "High" : "Medium",
    },
    {
      title: "جاهزية بناء Corporate DNA",
      description: company?.industry
        ? `وضوح قطاع الشركة (${company.industry}) يساعد على بناء Corporate DNA أكثر ارتباطًا بطبيعة العمل والقرارات التشغيلية.`
        : "عدم تحديد قطاع الشركة يقلل دقة بناء Corporate DNA ويؤثر على جودة التصنيف والتحليل.",
      impact: company?.industry ? "High" : "Medium",
    },
    {
      title: "ثقة الذكاء الاصطناعي في القراءة التنفيذية",
      description:
        aiConfidence >= 75
          ? "مستوى الثقة الحالي يسمح باستخدام التقرير كنقطة انطلاق قوية للنقاش التنفيذي وتحديد المبادرات."
          : "مستوى الثقة الحالي ما زال متوسطًا، ويجب رفعه من خلال تحسين البيانات وزيادة إجابات الاستكشاف.",
      impact: aiConfidence >= 75 ? "High" : "Medium",
    },
  ];
}

function buildDynamicPriorities(
  company: ExecutiveCompanyInput | null,
  dataQualityScore: number,
  discoveryCompletion: number,
): ExecutivePriority[] {
  const priorities: ExecutivePriority[] = [];

  if (dataQualityScore < 75) {
    priorities.push({
      title: "إكمال وتنظيف بيانات الشركة",
      description:
        "رفع جودة بيانات الشركة الأساسية لأنها تؤثر مباشرة على دقة التقرير التنفيذي ومخرجات المحرك الذكي.",
      timeline: "Immediate",
    });
  }

  if (discoveryCompletion < 100) {
    priorities.push({
      title: "إكمال Discovery Intelligence",
      description:
        "استكمال إجابات الاستكشاف وتحويلها إلى مدخلات منظمة تساعد KAFU AI على بناء قراءة تنفيذية أدق.",
      timeline: "Immediate",
    });
  }

  priorities.push({
    title: "بناء Corporate DNA",
    description: company?.industry
      ? `تصميم Corporate DNA مرتبط بطبيعة قطاع ${company.industry} ويعكس طريقة عمل الشركة وأولوياتها.`
      : "تحويل بيانات الشركة وإجابات الاستكشاف إلى هوية تشغيلية قابلة للقياس والتحليل.",
    timeline: "Next",
  });

  priorities.push({
    title: "تحويل المعرفة إلى Corporate Brain",
    description:
      "بناء طبقة معرفة داخلية تسمح لـ KAFU AI بفهم السياسات، العمليات، الأولويات، والتوصيات التنفيذية.",
    timeline: "90 Days",
  });

  return priorities.slice(0, 4);
}

function buildDynamicRisks(
  company: ExecutiveCompanyInput | null,
  dataQualityScore: number,
  discoveryCompletion: number,
): ExecutiveRisk[] {
  return [
    {
      title: "نقص البيانات التنفيذية",
      description:
        dataQualityScore < 75
          ? "جودة البيانات الحالية أقل من المستوى المطلوب، وهذا قد يؤثر على دقة التحليل والتوصيات."
          : "البيانات الحالية جيدة، لكن يجب الاستمرار في إثرائها لضمان دقة أعلى في المراحل القادمة.",
      level: dataQualityScore < 75 ? "High" : "Medium",
    },
    {
      title: "عدم اكتمال جلسة الاستكشاف",
      description:
        discoveryCompletion < 100
          ? "Discovery لم يكتمل بالكامل بعد، مما يقلل قدرة المحرك على إنتاج قراءة تنفيذية عميقة."
          : "Discovery مكتمل بشكل جيد، ويجب الآن تحويله إلى Corporate DNA و Corporate Brain.",
      level: discoveryCompletion < 100 ? "High" : "Low",
    },
    {
      title: "تشتت المعرفة المؤسسية",
      description:
        "عدم وجود Corporate Brain قد يجعل المعرفة موزعة بين الأشخاص والملفات بدل أن تكون في نظام معرفي واحد.",
      level: "Medium",
    },
    {
      title: "تأخر تفعيل Digital Workforce",
      description:
        "كلما تأخر تحويل المعرفة والعمليات إلى وكلاء ذكاء اصطناعي، قلت سرعة الاستفادة من KAFU AI على مستوى التشغيل.",
      level: company?.employee_count && company.employee_count > 20 ? "Medium" : "Low",
    },
  ];
}

function buildDynamicQuickWins(
  answers: ExecutiveAnswerInput[],
  dataQualityScore: number,
  discoveryCompletion: number,
): ExecutiveQuickWin[] {
  const completedAnswers = getCompletedAnswersCount(answers);

  return [
    {
      title: "رفع جودة بيانات الاستكشاف",
      description:
        dataQualityScore < 75
          ? "مراجعة بيانات الشركة والإجابات الحالية وإكمال الحقول الناقصة لزيادة دقة التقرير التنفيذي."
          : "الاحتفاظ بجودة البيانات الحالية وتحديثها مع كل جلسة Discovery جديدة.",
      effort: "Low",
    },
    {
      title: "إغلاق فجوة Discovery",
      description:
        discoveryCompletion < 100
          ? `إكمال الأسئلة المتبقية؛ حاليًا يوجد ${completedAnswers} إجابات مكتملة من أصل ${EXPECTED_DISCOVERY_QUESTIONS}.`
          : "تحويل إجابات Discovery المكتملة إلى نقاط قرار ومبادرات تنفيذية.",
      effort: "Low",
    },
    {
      title: "تحديد أولويات Corporate DNA",
      description:
        "اختيار أهم المجالات التشغيلية التي يجب أن يبدأ KAFU AI بفهمها وتحليلها وربطها بمؤشرات قابلة للقياس.",
      effort: "Medium",
    },
    {
      title: "اختيار أول عملية قابلة للأتمتة",
      description:
        "تحديد عملية متكررة واحدة تصلح كبداية عملية لبناء Digital Workforce داخل الشركة.",
      effort: "Medium",
    },
  ];
}

function buildDynamicRoadmap(
  dataQualityScore: number,
  discoveryCompletion: number,
): ExecutiveRoadmapPhase[] {
  return [
    {
      period: "30 Days",
      title:
        dataQualityScore < 75 || discoveryCompletion < 100
          ? "تثبيت البيانات و Discovery"
          : "تثبيت Corporate DNA",
      description:
        dataQualityScore < 75 || discoveryCompletion < 100
          ? "تنظيف بيانات الشركة، استكمال إجابات الاستكشاف، وتحويل المدخلات إلى أساس تنفيذي واضح."
          : "تنظيم بيانات الشركة ومخرجات الاستكشاف وبناء الطبقة الأولى من الهوية التشغيلية.",
      outcome: "Operational clarity",
    },
    {
      period: "60 Days",
      title: "بناء Corporate Brain",
      description:
        "تحويل المعرفة والسياسات والعمليات إلى طبقة معرفية قابلة للاستخدام داخل KAFU AI.",
      outcome: "Knowledge intelligence",
    },
    {
      period: "90 Days",
      title: "تفعيل Digital Workforce",
      description:
        "اختيار أول عمليات قابلة للأتمتة وبناء وكلاء ذكاء اصطناعي متخصصين لدعم الفريق.",
      outcome: "AI-powered execution",
    },
  ];
}

export function generateExecutiveReportInsights(
  company: ExecutiveCompanyInput | null,
  answers: ExecutiveAnswerInput[],
): ExecutiveReportInsights {
  const scoring = scoreExecutiveReadiness(company, answers);
  const completedAnswers = getCompletedAnswersCount(answers);
  const readinessMatrix = buildReadinessMatrix(company, answers);

  const crossAnalysis = generateCrossAnalysis({
    executiveScore: scoring.executiveScore,
    aiConfidence: scoring.aiConfidence,
    dataQualityScore: scoring.dataQualityScore,
    discoveryCompletion: scoring.discoveryCompletion,
  });

  return {
    score: scoring.executiveScore,
    status: scoring.status,
    maturityLevel: scoring.maturityLevel,
    aiConfidence: scoring.aiConfidence,
    dataQualityScore: scoring.dataQualityScore,
    discoveryCompletion: scoring.discoveryCompletion,
    readinessMatrix,
    summary:
      completedAnswers > 0
        ? `بناءً على ${completedAnswers} إجابة مكتملة من جلسة الاستكشاف، تظهر الشركة مستوى ${scoring.maturityLevel} مع ثقة تحليلية ${scoring.aiConfidence}% وجودة بيانات ${scoring.dataQualityScore}%.`
        : "لا توجد إجابات كافية حتى الآن لإنتاج قراءة تنفيذية دقيقة. يوصى بإكمال جلسة الاستكشاف قبل اعتماد التقرير.",

    findings: buildDynamicFindings(
      company,
      answers,
      scoring.dataQualityScore,
      scoring.discoveryCompletion,
      scoring.aiConfidence,
    ),

    priorities: buildDynamicPriorities(
      company,
      scoring.dataQualityScore,
      scoring.discoveryCompletion,
    ),

    risks: buildDynamicRisks(
      company,
      scoring.dataQualityScore,
      scoring.discoveryCompletion,
    ),

    quickWins: buildDynamicQuickWins(
      answers,
      scoring.dataQualityScore,
      scoring.discoveryCompletion,
    ),

    crossAnalysis,

    roadmap: buildDynamicRoadmap(
      scoring.dataQualityScore,
      scoring.discoveryCompletion,
    ),
  };
}