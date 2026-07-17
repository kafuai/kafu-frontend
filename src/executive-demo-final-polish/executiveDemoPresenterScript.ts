import type {
  ExecutiveDemoStage,
} from "./executiveDemoFinalPolishTypes";

export interface ExecutiveDemoPresenterStep {
  stage: ExecutiveDemoStage;
  headline: string;
  talkingPoints: string[];
  presenterAction: string;
  avoid: string;
}

export const EXECUTIVE_DEMO_PRESENTER_SCRIPT: readonly ExecutiveDemoPresenterStep[] =
  [
    {
      stage: "opening",
      headline: "ابدأ بالقيمة وليس بالخصائص",
      talkingPoints: [
        "KAFU AI يربط فهم المنظمة بالقرار والتنفيذ.",
        "الهدف هو تقليل التشتت وتسريع القرارات ووضوح المسؤولية.",
      ],
      presenterAction:
        "قدّم الوعد الرئيسي خلال أول دقيقة دون الدخول في تفاصيل تقنية.",
      avoid:
        "لا تبدأ بشرح الصفحات أو بنية النظام أو عدد الوحدات.",
    },
    {
      stage: "problem",
      headline: "عرّف المشكلة التنفيذية",
      talkingPoints: [
        "البيانات موزعة بين الإدارات والأنظمة.",
        "القرارات لا تتحول دائمًا إلى تنفيذ واضح.",
        "القيادة تحتاج رؤية موحدة ومستمرة.",
      ],
      presenterAction:
        "اربط المشكلة بواقع العميل دون افتراض تفاصيل غير مؤكدة.",
      avoid:
        "لا تضخم المشكلة أو تنتقد أنظمة العميل الحالية.",
    },
    {
      stage: "discovery",
      headline: "أثبت أن النظام يفهم السياق",
      talkingPoints: [
        "تبدأ التجربة بجمع سياق الشركة وأولوياتها وتحدياتها.",
        "هذا يمنع التوصيات العامة والمنفصلة عن الواقع.",
      ],
      presenterAction:
        "اعرض أمثلة محددة من بيانات الشركة التجريبية بسرعة.",
      avoid:
        "لا تقرأ كل سؤال أو كل إجابة داخل Discovery.",
    },
    {
      stage: "assessment",
      headline: "حوّل المدخلات إلى تشخيص",
      talkingPoints: [
        "يقيّم KAFU AI الجاهزية والنضج والفجوات.",
        "النتيجة ليست رقمًا فقط، بل مدخل لاتخاذ القرار.",
      ],
      presenterAction:
        "ركّز على أهم نتيجتين أو ثلاث نتائج فقط.",
      avoid:
        "لا تشرح جميع المؤشرات بالتفصيل.",
    },
    {
      stage: "intelligence",
      headline: "أظهر عقل المؤسسة",
      talkingPoints: [
        "يجمع KAFU AI المعرفة المؤسسية في نموذج مترابط.",
        "يحوّل البيانات المتفرقة إلى فهم تنفيذي قابل للاستخدام.",
      ],
      presenterAction:
        "اربط كل Insight بمشكلة أو فرصة واضحة.",
      avoid:
        "لا تستخدم لغة تقنية معقدة عن المحركات الداخلية.",
    },
    {
      stage: "recommendation",
      headline: "انتقل من الفهم إلى القرار",
      talkingPoints: [
        "التوصيات مرتبة حسب الأولوية والأثر.",
        "كل توصية مرتبطة بسبب ونتيجة متوقعة.",
      ],
      presenterAction:
        "اعرض توصية واحدة رئيسية وتوصية داعمة.",
      avoid:
        "لا تستعرض قائمة طويلة من التوصيات.",
    },
    {
      stage: "executive-summary",
      headline: "قدّم لقطة القيادة",
      talkingPoints: [
        "تعرض الصفحة أهم المخاطر والفرص والأولويات.",
        "يمكن للقيادة فهم الوضع واتخاذ موقف بسرعة.",
      ],
      presenterAction:
        "قدّم الصفحة كما لو كنت تعرضها على الرئيس التنفيذي.",
      avoid:
        "لا تتوقف عند كل بطاقة أو مؤشر.",
    },
    {
      stage: "command-center",
      headline: "أثبت أن النظام يقود التنفيذ",
      talkingPoints: [
        "كل قرار ينتقل إلى مسؤول وموعد وحالة متابعة.",
        "يمكن رؤية التأخير والمخاطر والتقدم من مكان واحد.",
      ],
      presenterAction:
        "اعرض مسار قرار واحد من التوصية إلى التنفيذ.",
      avoid:
        "لا تستعرض كل الجداول أو كل الحالات.",
    },
    {
      stage: "digital-workforce",
      headline: "اشرح نموذج العمل الجديد",
      talkingPoints: [
        "الأدوار الرقمية تدعم الموظفين والقيادة.",
        "الهدف هو رفع القدرة وليس استبدال الفرق.",
      ],
      presenterAction:
        "قدّم مثالًا واحدًا واقعيًا على دور رقمي.",
      avoid:
        "لا تعد بأتمتة كاملة غير مثبتة.",
    },
    {
      stage: "closing",
      headline: "اختم بخطوة عملية",
      talkingPoints: [
        "KAFU AI يربط المعرفة والقرار والتنفيذ.",
        "الخطوة المناسبة هي Pilot محدود بمؤشرات نجاح واضحة.",
      ],
      presenterAction:
        "اطلب اتفاقًا على اجتماع Pilot أو جلسة Discovery.",
      avoid:
        "لا تنهِ العرض بعبارة عامة دون Next Step.",
    },
    {
      stage: "questions",
      headline: "أدر الأسئلة بثقة",
      talkingPoints: [
        "أجب وفق ما هو موجود فعليًا في المنتج.",
        "حوّل الأسئلة التفصيلية إلى متطلبات Pilot عند الحاجة.",
      ],
      presenterAction:
        "سجّل الأسئلة المهمة واربطها بالخطوة التالية.",
      avoid:
        "لا تقدم وعود Features خارج Feature Freeze.",
    },
  ] as const;
