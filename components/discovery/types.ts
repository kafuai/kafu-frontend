export const QUESTIONS_COUNT = 5;
export const DISCOVERY_DRAFT_PREFIX = "kafu_discovery_draft_";

export type DiscoveryDraft = {
  answers: string[];
  savedAt: number;
};

export function getDiscoveryDraftKey(companyId: string): string {
  return `${DISCOVERY_DRAFT_PREFIX}${companyId}`;
}

export const CONTENT = {
  ar: {
    questions: [
      "ما أكثر ثلاثة تحديات تشغل الإدارة التنفيذية حالياً؟",
      "ما أكثر عملية داخل المؤسسة تستهلك وقتاً وجهداً أكثر من اللازم؟",
      "ما أكثر قرار تتمنى أن تحصل عليه الإدارة بشكل أسرع؟",
      "ما أكبر فرصة للتحسين خلال الـ 12 شهراً القادمة؟",
      "إذا نجحت مبادرة كفو بعد سنة، ما المؤشر الذي سيجعلك تقول إنها كانت ناجحة؟",
    ],
    header: {
      badge: "Executive Discovery Workspace",
      title: "جلسة الاستكشاف التنفيذية",
      description: "شارك المعرفة المؤسسية، ليحوّلها KAFU AI إلى صورة تنفيذية وتوصيات قابلة للقياس.",
    },
    stats: {
      answers: "إجابات",
      attachments: "مرفقات",
      secure: "آمن",
      context: "سياق مؤسسي",
    },
    progress: {
      executiveQuestion: "السؤال التنفيذي",
      sessionProgress: "تقدم الجلسة",
      discoveryBadge: "KAFU AI Discovery",
    },
    buttons: {
      previous: "السابق",
      next: "التالي",
      saving: "جاري حفظ الإجابات...",
      saveAndReview: "حفظ ومراجعة الملخص التنفيذي",
    },
    sidebar: {
      guidelinesTitle: "إرشادات الإجابة",
      guidelinesDesc: "ركّز على الواقع الحالي والأثر التنفيذي وليس الوصف العام.",
      privacyTitle: "خصوصية مؤسسية",
      privacyDesc: "يتم ربط كل مدخل بسياق الشركة والسؤال التنفيذي لضمان التتبع والاستخدام الصحيح داخل KAFU AI.",
    },
    messages: {
      answerRequired: "يرجى الإجابة على السؤال قبل الانتقال للسؤال التالي.",
      allAnswersRequired: "يرجى الإجابة على جميع الأسئلة قبل إكمال جلسة الاستكشاف.",
      savingState: "جاري حفظ الإجابات ورفع الملفات والتسجيلات...",
      noCompanyData: "لم يتم العثور على بيانات الشركة. يرجى الرجوع إلى صفحة التقييم وإدخال بيانات الشركة أولاً.",
      verifyAnswersError: "تعذر التحقق من إجابات Discovery الموجودة:",
      updateAnswerError: "تعذر تحديث إجابة Discovery:",
      saveAnswerError: "تعذر حفظ إجابة Discovery:",
      verifyUserError: "تعذر التحقق من المستخدم الحالي:",
      noUserFound: "لم يتم العثور على المستخدم الحالي.",
      orgDetermineError: "تعذر تحديد المنظمة المرتبطة بالشركة:",
      orgUserDetermineError: "تعذر تحديد المنظمة المرتبطة بالمستخدم والشركة.",
      onboardingRecordError: "تعذر تسجيل اكتمال الإعداد (Onboarding):",
      saveSuccess: "تم حفظ جلسة الاستكشاف بنجاح:",
      entries: "مدخلات",
      attachments: "مرفقات",
      andText: "و",
      saveErrorPrefix: "حدث خطأ أثناء حفظ جلسة الاستكشاف:",
      unexpectedError: "حدث خطأ غير متوقع أثناء حفظ جلسة الاستكشاف.",
    },
  },
  en: {
    questions: [
      "What are the top three challenges currently occupying executive management?",
      "Which process within the organization consumes an unnecessary amount of time and effort?",
      "What is the one decision you wish management could make faster?",
      "What is the biggest opportunity for improvement over the next 12 months?",
      "If the KAFU initiative succeeds in a year, what metric will make you consider it a success?",
    ],
    header: {
      badge: "Executive Discovery Workspace",
      title: "Executive Discovery Session",
      description: "Share enterprise knowledge, so KAFU AI can transform it into an executive view and measurable recommendations.",
    },
    stats: {
      answers: "Answers",
      attachments: "Attachments",
      secure: "Secure",
      context: "Enterprise Context",
    },
    progress: {
      executiveQuestion: "Executive Question",
      sessionProgress: "Session Progress",
      discoveryBadge: "KAFU AI Discovery",
    },
    buttons: {
      previous: "Previous",
      next: "Next",
      saving: "Saving answers...",
      saveAndReview: "Save & Review Executive Summary",
    },
    sidebar: {
      guidelinesTitle: "Answering Guidelines",
      guidelinesDesc: "Focus on the current reality and executive impact rather than general descriptions.",
      privacyTitle: "Enterprise Privacy",
      privacyDesc: "Each entry is linked to the company's context and executive question to ensure tracking and proper usage within KAFU AI.",
    },
    messages: {
      answerRequired: "Please answer the question before moving to the next one.",
      allAnswersRequired: "Please answer all questions before completing the discovery session.",
      savingState: "Saving answers and uploading files and recordings...",
      noCompanyData: "Company data not found. Please return to the Assessment page and enter company data first.",
      verifyAnswersError: "Could not verify existing Discovery answers:",
      updateAnswerError: "Could not update Discovery answer:",
      saveAnswerError: "Could not save Discovery answer:",
      verifyUserError: "Could not verify the current user:",
      noUserFound: "Current user not found.",
      orgDetermineError: "Could not determine the organization linked to the company:",
      orgUserDetermineError: "Could not determine the organization linked to the user and company.",
      onboardingRecordError: "Could not record Onboarding completion:",
      saveSuccess: "Discovery session saved successfully:",
      entries: "entries",
      attachments: "attachments",
      andText: "and",
      saveErrorPrefix: "An error occurred while saving the discovery session:",
      unexpectedError: "An unexpected error occurred while saving the discovery session.",
    },
  },
} as const;