import type {
  CorporateBrain,
  CorporateBrainRecommendation,
  CorporateBrainSignal,
  StrategicFocus,
  DecisionReadiness,
} from "@/types/corporateBrainModel";

import type { CorporateDNA, TransformationPriority } from "@/types/corporateDNA";
import { buildExecutiveMemory } from "@/lib/executiveMemory";

function clampScore(value: number) {
  if (Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function buildCorporateBrain(dna: CorporateDNA): CorporateBrain {
  const alerts = buildAlerts(dna);
  const opportunities = buildOpportunities(dna);
  const recommendations = buildRecommendations(dna);

  return {
    dna,
    decisionReadiness: calculateDecisionReadiness(dna),
    strategicFocus: buildStrategicFocus(dna),
    intelligenceScore: calculateIntelligenceScore(dna),
    confidenceScore: clampScore(dna.aiConfidence),
    strengths: dna.strengths,
    risks: dna.risks,
    alerts,
    opportunities,
    recommendations,
    executiveMemory: buildExecutiveMemory(dna),
    nextActions: recommendations.slice(0, 3).map((item) => item.title),
    generatedAt: new Date().toISOString(),
  };
}

function calculateDecisionReadiness(dna: CorporateDNA): DecisionReadiness {
  if (dna.aiConfidence < 60) return "needs_data";
  if (dna.maturityScore < 50) return "high_risk";
  if (dna.dataQualityScore < 70) return "needs_alignment";
  return "ready";
}

function calculateIntelligenceScore(dna: CorporateDNA) {
  return clampScore(
    dna.maturityScore * 0.4 +
      dna.aiConfidence * 0.35 +
      dna.dataQualityScore * 0.25,
  );
}

function buildStrategicFocus(dna: CorporateDNA): StrategicFocus[] {
  const focus = dna.priorities.map((priority) => {
    switch (priority) {
      case "hr_foundation":
        return "stabilize_foundation";
      case "operations_efficiency":
        return "improve_operations";
      case "leadership_alignment":
        return "strengthen_leadership";
      case "growth_enablement":
        return "accelerate_growth";
      case "risk_reduction":
        return "reduce_risk";
      case "data_quality":
        return "stabilize_foundation";
      case "corporate_brain":
        return "build_digital_maturity";
      case "executive_readiness":
        return "strengthen_leadership";
      case "digital_maturity":
      default:
        return "build_digital_maturity";
    }
  });

  return Array.from(new Set(focus)).slice(0, 4);
}

function buildAlerts(dna: CorporateDNA): CorporateBrainSignal[] {
  return dna.risks.map((risk) => ({
    title: risk.title,
    description: risk.description,
    level: risk.confidence >= 60 ? "high" : "medium",
    source: "Corporate DNA",
  }));
}

function buildOpportunities(dna: CorporateDNA): CorporateBrainSignal[] {
  return dna.strengths.map((item) => ({
    title: item.title,
    description: item.description,
    level: item.confidence >= 75 ? "high" : "medium",
    source: "Corporate DNA",
  }));
}

function getRecommendationText(priority: TransformationPriority) {
  switch (priority) {
    case "data_quality":
      return {
        title: "رفع جودة البيانات التنفيذية",
        description:
          "تنظيم بيانات الشركة ومدخلات Discovery لضمان قراءة تنفيذية أدق وتوصيات أعلى موثوقية.",
        expectedImpact: "Higher AI confidence and better executive recommendations",
      };

    case "executive_readiness":
      return {
        title: "رفع الجاهزية التنفيذية",
        description:
          "تحسين وضوح القرار، ترتيب الأولويات، وتحويل التحليل إلى مبادرات قابلة للتنفيذ.",
        expectedImpact: "Stronger decision readiness and improved execution clarity",
      };

    case "corporate_brain":
      return {
        title: "بناء Corporate Brain",
        description:
          "تحويل المعرفة الداخلية والسياسات والعمليات إلى طبقة ذكاء مؤسسي قابلة للاستخدام.",
        expectedImpact: "Centralized institutional knowledge and smarter decisions",
      };

    case "digital_maturity":
      return {
        title: "رفع النضج الرقمي",
        description:
          "تجهيز المؤسسة لتفعيل أدوات ووكلاء ذكاء اصطناعي يدعمون التشغيل والقرارات.",
        expectedImpact: "Better digital scalability and AI-powered execution",
      };

    case "growth_enablement":
      return {
        title: "تمكين النمو",
        description:
          "تحويل الجاهزية الحالية إلى خطوات نمو واضحة وقابلة للقياس خلال المرحلة القادمة.",
        expectedImpact: "Clearer growth path and better scalability",
      };

    case "risk_reduction":
      return {
        title: "تقليل المخاطر التشغيلية",
        description:
          "تحديد نقاط الضعف المؤسسية ومعالجتها قبل التوسع أو بناء طبقات ذكاء إضافية.",
        expectedImpact: "Lower operational risk and stronger resilience",
      };

    case "operations_efficiency":
      return {
        title: "تحسين كفاءة العمليات",
        description:
          "تبسيط العمليات المتكررة وتحويلها إلى نماذج تشغيل أكثر وضوحًا وقابلية للقياس.",
        expectedImpact: "Improved operational efficiency",
      };

    case "leadership_alignment":
      return {
        title: "مواءمة القيادة",
        description:
          "رفع مستوى التوافق بين القيادة، الأولويات، والقرارات التنفيذية القادمة.",
        expectedImpact: "Better leadership alignment",
      };

    case "hr_foundation":
    default:
      return {
        title: "تقوية الأساس المؤسسي",
        description:
          "بناء قاعدة تشغيلية أوضح تدعم الموارد البشرية، العمليات، والقرارات المستقبلية.",
        expectedImpact: "Stronger organizational foundation",
      };
  }
}

function buildRecommendations(dna: CorporateDNA): CorporateBrainRecommendation[] {
  return dna.priorities.map((priority) => {
    const recommendation = getRecommendationText(priority);

    return {
      title: recommendation.title,
      description: recommendation.description,
      priority:
        priority === "data_quality" ||
        priority === "executive_readiness" ||
        priority === "corporate_brain"
          ? "high"
          : "medium",
      expectedImpact: recommendation.expectedImpact,
    };
  });
}