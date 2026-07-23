import type { WebsiteLanguage } from "./LanguageProvider";

const englishTranslations = {
  contact: {
    hero: {
      eyebrow: "Contact KAFU AI",
      title: "Let's start with your organization's priorities.",
      description:
        "Whether you are evaluating enterprise AI, planning transformation initiatives, or exploring strategic collaboration, we will tailor the conversation to your business objectives.",
    },

    panel: {
      eyebrow: "Get in Touch",
      title: "Connect with the KAFU AI team.",
      description:
        "Complete the form to request an executive discovery session, discuss enterprise AI readiness, or explore strategic partnership opportunities.",
      emailButton: "Email hello@kafu.ai",
      note:
        "Prefer email? Include your organization, your role, and the primary business challenge or opportunity you would like to discuss.",
    },

    conversationTypes: [
      {
        title: "Executive Discovery",
        description:
          "Explore your organization's priorities, challenges, and opportunities through a focused executive conversation.",
      },
      {
        title: "Enterprise AI Readiness",
        description:
          "Discuss governance, organizational context, adoption strategy, and a practical roadmap for enterprise AI.",
      },
      {
        title: "Strategic Partnerships",
        description:
          "Connect with KAFU AI to explore technology alliances, consulting partnerships, and enterprise collaboration opportunities.",
      },
    ],

    formSection: {
      eyebrow: "Request an Executive Conversation",
      title: "Tell us where your organization wants to go next.",
      description:
        "Share a few details about your priorities, current challenges, and the type of conversation you would like to begin.",
    },

    nextStep: {
      eyebrow: "Continue Exploring",
      title: "Learn more before your executive conversation.",
      platform: "Explore Platform",
      solutions: "Explore Solutions",
    },
  },

  form: {
    fields: {
      fullName: "Full name",
      workEmail: "Work email",
      organization: "Organization",
      role: "Role or job title",
      companySize: "Organization size",
      interest: "Conversation type",
      message: "What would you like to discuss?",
      optional: "Optional",
    },

    placeholders: {
      message:
        "Tell us about your priorities, current challenges, governance requirements, or the outcomes you want to achieve.",
    },

    companySizes: {
      placeholder: "Select organization size",
      size1: "1-49 employees",
      size2: "50-249 employees",
      size3: "250-999 employees",
      size4: "1,000-4,999 employees",
      size5: "5,000+ employees",
    },

    interests: {
      placeholder: "Select conversation type",
      executiveDiscovery: "Executive Discovery",
      enterpriseReadiness: "Enterprise AI Readiness",
      strategicPartnership: "Strategic Partnership",
    },

    validation: {
      fullName: "Please enter your full name.",
      workEmail: "Please enter a valid work email address.",
      organization: "Please enter your organization name.",
      role: "Please enter your role or job title.",
      companySize: "Please select your organization size.",
      interest: "Please select a conversation type.",
    },

    submission: {
      errorTitle: "We could not submit your request",
      errorMessage: "We could not submit your request. Please try again.",
      directContact: "Contact hello@kafu.ai directly",
      consent:
        "By submitting this form, you agree that KAFU AI may contact you regarding your request.",
      submitting: "Submitting request...",
      submit: "Request Executive Discovery",
    },
  },

  thankYou: {
    eyebrow: "Request Received",
    title: "Thank you for contacting KAFU AI.",
    description:
      "Your executive discovery request has been received. Our team will review your organization, priorities, and preferred conversation type before following up with the appropriate next step.",
    home: "Return Home",
    platform: "Explore the Platform",
  },
} as const;

const arabicTranslations = {
  contact: {
    hero: {
      eyebrow: "تواصل مع KAFU AI",
      title: "لنبدأ بأولويات مؤسستك.",
      description:
        "سواء كنتم تقيّمون فرص الذكاء الاصطناعي المؤسسي، أو تخططون لمبادرات التحول، أو تستكشفون تعاونًا استراتيجيًا، فسنصمم المحادثة بما يتوافق مع أهداف أعمالكم.",
    },

    panel: {
      eyebrow: "تواصل معنا",
      title: "تواصل مع فريق KAFU AI.",
      description:
        "أكمل النموذج لطلب جلسة استكشاف تنفيذية، أو مناقشة جاهزية مؤسستك للذكاء الاصطناعي، أو استكشاف فرص الشراكة الاستراتيجية.",
      emailButton: "راسلنا على hello@kafu.ai",
      note:
        "تفضل التواصل عبر البريد الإلكتروني؟ اذكر اسم مؤسستك، ومنصبك، وأبرز تحدٍ أو فرصة ترغب في مناقشتها.",
    },

    conversationTypes: [
      {
        title: "الاستكشاف التنفيذي",
        description:
          "استكشف أولويات مؤسستك وتحدياتها وفرصها من خلال محادثة تنفيذية مركزة.",
      },
      {
        title: "جاهزية الذكاء الاصطناعي المؤسسي",
        description:
          "ناقش الحوكمة والسياق التنظيمي واستراتيجية التبني وخريطة طريق عملية للذكاء الاصطناعي المؤسسي.",
      },
      {
        title: "الشراكات الاستراتيجية",
        description:
          "تواصل مع KAFU AI لاستكشاف التحالفات التقنية والشراكات الاستشارية وفرص التعاون المؤسسي.",
      },
    ],

    formSection: {
      eyebrow: "اطلب محادثة تنفيذية",
      title: "أخبرنا إلى أين تريد مؤسستك أن تتجه.",
      description:
        "شارك معنا بعض التفاصيل حول أولوياتك وتحدياتك الحالية ونوع المحادثة التي ترغب في بدئها.",
    },

    nextStep: {
      eyebrow: "واصل الاستكشاف",
      title: "تعرّف أكثر قبل محادثتك التنفيذية.",
      platform: "استكشف المنصة",
      solutions: "استكشف الحلول",
    },
  },

  form: {
    fields: {
      fullName: "الاسم الكامل",
      workEmail: "البريد الإلكتروني للعمل",
      organization: "اسم المؤسسة",
      role: "المنصب أو المسمى الوظيفي",
      companySize: "حجم المؤسسة",
      interest: "نوع المحادثة",
      message: "ما الموضوع الذي ترغب في مناقشته؟",
      optional: "اختياري",
    },

    placeholders: {
      message:
        "أخبرنا عن أولوياتك أو التحديات الحالية أو متطلبات الحوكمة أو النتائج التي ترغب في تحقيقها.",
    },

    companySizes: {
      placeholder: "اختر حجم المؤسسة",
      size1: "من 1 إلى 49 موظفًا",
      size2: "من 50 إلى 249 موظفًا",
      size3: "من 250 إلى 999 موظفًا",
      size4: "من 1,000 إلى 4,999 موظفًا",
      size5: "5,000 موظف أو أكثر",
    },

    interests: {
      placeholder: "اختر نوع المحادثة",
      executiveDiscovery: "الاستكشاف التنفيذي",
      enterpriseReadiness: "جاهزية الذكاء الاصطناعي المؤسسي",
      strategicPartnership: "شراكة استراتيجية",
    },

    validation: {
      fullName: "يرجى إدخال الاسم الكامل.",
      workEmail: "يرجى إدخال بريد إلكتروني صحيح للعمل.",
      organization: "يرجى إدخال اسم المؤسسة.",
      role: "يرجى إدخال المنصب أو المسمى الوظيفي.",
      companySize: "يرجى اختيار حجم المؤسسة.",
      interest: "يرجى اختيار نوع المحادثة.",
    },

    submission: {
      errorTitle: "تعذر إرسال طلبك",
      errorMessage: "تعذر إرسال طلبك. يرجى المحاولة مرة أخرى.",
      directContact: "تواصل مباشرة عبر hello@kafu.ai",
      consent:
        "بإرسال هذا النموذج، فإنك توافق على أن تتواصل معك KAFU AI بخصوص طلبك.",
      submitting: "جارٍ إرسال الطلب...",
      submit: "طلب جلسة استكشاف تنفيذية",
    },
  },

  thankYou: {
    eyebrow: "تم استلام الطلب",
    title: "شكرًا لتواصلك مع KAFU AI.",
    description:
      "تم استلام طلب جلسة الاستكشاف التنفيذية. سيقوم فريقنا بمراجعة معلومات مؤسستك وأولوياتك ونوع المحادثة التي اخترتها، ثم التواصل معك لتحديد الخطوة المناسبة التالية.",
    home: "العودة إلى الرئيسية",
    platform: "استكشف المنصة",
  },
} as const;

export const websiteTranslations = {
  en: englishTranslations,
  ar: arabicTranslations,
} as const;

