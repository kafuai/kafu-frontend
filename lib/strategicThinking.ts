import type { CorporateBrain, StrategicFocus } from "@/types/corporateBrainModel";

export type StrategicThinkingOutput = {
  primaryFocus: StrategicFocus | "unknown";
  thinkingSummary: string;
  strategicQuestions: string[];
};

export function runStrategicThinking(
  brain: CorporateBrain
): StrategicThinkingOutput {
  const primaryFocus = brain.strategicFocus[0] || "unknown";

  return {
    primaryFocus,
    thinkingSummary: buildThinkingSummary(primaryFocus),
    strategicQuestions: buildStrategicQuestions(primaryFocus),
  };
}

function buildThinkingSummary(
  focus: StrategicFocus | "unknown"
): string {
  switch (focus) {
    case "stabilize_foundation":
      return "الأولوية الحالية هي تثبيت الأساس المؤسسي قبل التوسع أو الأتمتة.";

    case "improve_operations":
      return "الأولوية الحالية هي تحسين كفاءة العمليات وتقليل الهدر والتكرار.";

    case "strengthen_leadership":
      return "الأولوية الحالية هي رفع وضوح القيادة وتوحيد اتجاهات القرار.";

    case "accelerate_growth":
      return "الأولوية الحالية هي دعم النمو بطريقة منظمة وقابلة للقياس.";

    case "reduce_risk":
      return "الأولوية الحالية هي تقليل المخاطر التشغيلية والتنظيمية قبل أي توسع كبير.";

    case "build_digital_maturity":
      return "الأولوية الحالية هي رفع النضج الرقمي وربط البيانات بالقرار.";

    default:
      return "لا توجد أولوية استراتيجية واضحة بعد بسبب نقص البيانات.";
  }
}

function buildStrategicQuestions(
  focus: StrategicFocus | "unknown"
): string[] {
  switch (focus) {
    case "stabilize_foundation":
      return [
        "ما هي السياسات أو الإجراءات الأساسية غير المكتملة؟",
        "ما أكثر منطقة تسبب اعتمادًا على الأشخاص بدل النظام؟",
        "ما الحد الأدنى من التوثيق المطلوب قبل التوسع؟",
      ];

    case "improve_operations":
      return [
        "أين يحدث أكبر تكرار أو هدر في العمليات؟",
        "ما العملية التي يمكن تحسينها خلال 30 يومًا؟",
        "ما المؤشر التشغيلي الأهم الذي يجب مراقبته؟",
      ];

    case "strengthen_leadership":
      return [
        "هل القرارات الحالية مركزية أكثر من اللازم؟",
        "ما القرارات التي تحتاج وضوح ملكية ومسؤولية؟",
        "كيف يتم نقل الأولويات من القيادة إلى الفرق؟",
      ];

    case "accelerate_growth":
      return [
        "ما أكثر قناة نمو قابلة للتوسع؟",
        "ما العائق الداخلي الأكبر أمام النمو؟",
        "ما الموارد المطلوبة للنمو بدون زيادة الفوضى؟",
      ];

    case "reduce_risk":
      return [
        "ما المخاطر التي قد تؤثر مباشرة على الاستمرارية؟",
        "ما المخاطر التي تحتاج معالجة فورية؟",
        "هل توجد مؤشرات إنذار مبكر واضحة؟",
      ];

    case "build_digital_maturity":
      return [
        "ما البيانات التي لا تزال غير منظمة؟",
        "أي قرار تنفيذي يحتاج لوحة قياس واضحة؟",
        "ما النظام الذي يجب ربطه أولًا بالمنصة؟",
      ];

    default:
      return [
        "ما البيانات الناقصة لبناء قراءة استراتيجية أوضح؟",
        "ما القرار التنفيذي الأهم المطلوب دعمه؟",
      ];
  }
}