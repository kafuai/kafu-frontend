export function useAppCopy(locale: string, companyName: string = "") {
  const isArabic = locale === "ar";

  return {
    page: {
      title: "Corporate Brain",
      loading: {
        title: isArabic ? "جاري تشغيل العقل المؤسسي" : "Initializing Corporate Brain",
        description: isArabic
          ? "يتم تحميل بيانات المؤسسة ومصادر المعرفة وإشارات الاستكشاف."
          : "Loading company context, enterprise knowledge, and discovery signals.",
        status: isArabic ? "تحميل بيانات المؤسسة" : "Loading company data",
      },
      error: {
        title: isArabic ? "تعذر تشغيل العقل المؤسسي" : "Corporate Brain unavailable",
        defaultMessage: isArabic ? "لم يتم العثور على بيانات المؤسسة المطلوبة." : "Required company data was not found.",
        backBtn: isArabic ? "العودة إلى التقييم" : "Go to assessment",
        workspaceBtn: isArabic ? "فتح مساحة العمل" : "Open company workspace",
      },
      aiInsight: {
        title: isArabic ? "KAFU AI — التحليل التنفيذي المباشر" : "KAFU AI — Live Executive Intelligence",
        generateBtn: isArabic ? "إنشاء الملخص التنفيذي" : "Generate Executive Summary",
        regenerateBtn: isArabic ? "إعادة الإنشاء" : "Regenerate",
        liveBadge: isArabic ? "مباشر" : "LIVE",
        loadingText: isArabic
          ? "يتم تحليل أدلة المؤسسة من خلال طبقة KAFU Grounded AI..."
          : "Analyzing enterprise evidence through the KAFU Grounded AI layer...",
        sourcesTitle: isArabic ? "المصادر والأدلة" : "Sources & Evidence",
        promptText: isArabic
          ? "اضغط على «إنشاء الملخص التنفيذي» لتحليل بيانات المؤسسة."
          : "Click “Generate Executive Summary” to analyze the company evidence.",
      },
    },
    aiPrompts: {
      task: isArabic
        ? "قدّم ملخصًا تنفيذيًا موجزًا عن المؤسسة بالاعتماد حصريًا على الأدلة المتاحة، وحدد أهم الأولويات أو المخاطر أو الفرص التي تستحق انتباه الإدارة."
        : "Provide a concise executive intelligence summary of the company using only the supplied evidence. Identify the most important priorities, risks, or opportunities that deserve management attention.",
      question: isArabic
        ? "ما أهم ما يجب على الإدارة معرفته واتخاذ قرار بشأنه الآن؟"
        : "What should management understand and act on now?",
    },
    hero: {
      sparkle: isArabic ? "الذكاء التنفيذي للمؤسسة" : "Enterprise Executive Intelligence",
      title: isArabic ? "العقل المؤسسي" : "Corporate Brain",
      desc: isArabic
        ? `العقل المؤسسي لـ ${companyName}، يجمع المعرفة والبيانات والقرارات في مساحة موحدة للذكاء التنفيذي.`
        : `The enterprise brain for ${companyName}, connecting organizational knowledge, data, and decisions in one executive intelligence workspace.`,
      connectedTitle: isArabic ? "العقل المؤسسي متصل" : "Corporate Brain Connected",
      connectedDesc: isArabic ? "جاهز للتحليل والاستجابة" : "Ready to analyze and respond",
      metrics: {
        knowledge: isArabic ? "مصادر المعرفة" : "Knowledge Sources",
        discovery: isArabic ? "إجابات الاستكشاف" : "Discovery Answers",
      },
    },
    conversation: {
      defaultPrompt: isArabic ? "ما أهم الأولويات التنفيذية التي يجب التركيز عليها الآن؟" : "What are the most important executive priorities right now?",
      title: isArabic ? "المساعد التنفيذي الذكي" : "Executive AI Copilot",
      subtitle: isArabic ? "إجابات مبنية على معرفة المؤسسة" : "Answers grounded in enterprise knowledge",
      statusAnalyzing: isArabic ? "جارٍ التحليل" : "Analyzing",
      statusGrounded: isArabic ? "موثّق" : "Grounded",
      analyzingDesc: isArabic ? "يتم تحليل بيانات المؤسسة ونتائج الاستكشاف..." : `Analyzing ${companyName} using current enterprise evidence...`,
      errorDesc: isArabic ? "تعذر إنشاء إجابة من طبقة الذكاء الاصطناعي." : "Unable to generate an answer from the AI intelligence layer.",
      badgeEnterprise: isArabic ? "بيانات المؤسسة" : "Enterprise Data",
    },
    search: {
      placeholder: isArabic ? "ابحث في السياسات والبيانات ونتائج الاستكشاف..." : "Search policies, company data, and discovery insights...",
      ariaLabel: isArabic ? "البحث في المعرفة المؤسسية" : "Search enterprise knowledge",
      clear: isArabic ? "مسح البحث" : "Clear search",
      results: (count: number) => (isArabic ? `${count} نتائج` : `${count} results`),
      available: (count: number) => (isArabic ? `${count} نتيجة معرفية متاحة` : `${count} knowledge results available`),
    },
    graph: {
      title: isArabic ? "الرسم المعرفي للمؤسسة" : "Enterprise Knowledge Graph",
      desc: isArabic ? "تصور مبسط للعلاقات بين المعرفة والأهداف والمخاطر وفرق التنفيذ." : "A simplified map of relationships across knowledge, objectives, risks, and execution.",
      connections: (count: number) => (isArabic ? `${count} علاقة` : `${count} Connections`),
      nodes: {
        company: isArabic ? "المؤسسة" : "Organization",
        policies: isArabic ? "السياسات" : "Policies",
        policiesCount: (count: number) => (isArabic ? `${count} مصادر` : `${count} sources`),
        objectives: isArabic ? "الأهداف" : "Objectives",
        objectivesCount: (count: number) => (isArabic ? `${count} أهداف` : `${count} objectives`),
        risks: isArabic ? "المخاطر" : "Risks",
        risksCount: (count: number) => (isArabic ? `${count} مخاطر` : `${count} risks`),
        teams: isArabic ? "فرق التنفيذ" : "Execution Teams",
        teamsCount: (count: number) => (isArabic ? `${count} فرق` : `${count} teams`),
      },
    },
    knowledgePanel: {
      title: isArabic ? "طبقة المعرفة المؤسسية" : "Enterprise Knowledge Layer",
      desc: isArabic ? "مصادر المعرفة التي يستخدمها النظام لفهم المؤسسة وإنتاج إجابات موثوقة." : "Knowledge sources used to understand the organization and generate grounded answers.",
      emptyTitle: isArabic ? "لا توجد نتائج مطابقة" : "No matching knowledge found",
      emptyDesc: isArabic ? "جرّب استخدام مصطلح بحث مختلف." : "Try searching with a different term.",
      sources: {
        companyTitle: isArabic ? "بيانات المؤسسة" : "Company Profile",
        companyDesc: isArabic ? "بيانات الشركة الأساسية والقطاع والدولة وحجم القوى العاملة." : "Core company details, industry, country, and workforce size.",
        discoveryTitle: isArabic ? "ذكاء الاستكشاف" : "Discovery Intelligence",
        discoveryDesc: isArabic ? "إجابات التقييم والاستكشاف والأولويات التنفيذية المكتشفة." : "Assessment responses, discovery answers, and identified executive priorities.",
        policiesTitle: isArabic ? "السياسات والإجراءات" : "Policies & Procedures",
        policiesDesc: isArabic ? "المعرفة الداخلية المرتبطة بالسياسات والنماذج وإجراءات العمل." : "Internal policies, operating procedures, templates, and process knowledge.",
        searchTagsPolicies: isArabic ? "السياسات الإجراءات النماذج الموارد البشرية" : "policies procedures templates human resources",
      }
    },
    knowledgeCard: {
      status: {
        ready: isArabic ? "جاهز" : "Ready",
        processing: isArabic ? "قيد المعالجة" : "Processing",
        missing: isArabic ? "يحتاج إلى مصادر" : "Sources Needed",
      },
      sourcesCount: isArabic ? "مصادر" : "sources",
      readiness: isArabic ? "نسبة جاهزية المصدر" : "Source readiness",
    },
    memory: {
      title: isArabic ? "ذاكرة المؤسسة الذكية" : "Enterprise AI Memory",
      desc: isArabic ? "السياق المؤسسي الذي يحتفظ به النظام عبر التفاعلات." : "Organizational context retained across interactions.",
      secure: isArabic ? "ذاكرة آمنة" : "Secure Memory",
      available: isArabic ? "متاح للتحليل" : "Available for analysis",
      items: {
        contextTitle: isArabic ? "سياق المؤسسة" : "Enterprise Context",
        contextDesc: isArabic ? `يتذكر النظام بيانات ${companyName} والقطاع والدولة وحجم القوى العاملة.` : `System retains ${companyName} profile, industry, country, and workforce context.`,
        contextStatus: isArabic ? "متصل" : "Connected",
        discoveryTitle: isArabic ? "ذاكرة الاستكشاف" : "Discovery Memory",
        discoveryDesc: (count: number) => isArabic ? `تم حفظ ${count} إشارة استكشافية لاستخدامها في التحليل.` : `${count} discovery signals are retained for analysis.`,
        discoveryStatus: isArabic ? "نشطة" : "Active",
        decisionTitle: isArabic ? "ذاكرة القرارات" : "Decision Memory",
        decisionDesc: isArabic ? "يحتفظ النظام بالتوصيات السابقة ومسؤولي التنفيذ." : "System retains previous recommendations and execution owners.",
        decisionStatus: isArabic ? "قيد التوسع" : "Expanding",
      }
    },
    composer: {
      placeholder: isArabic ? "اسأل العقل المؤسسي عن الأداء أو المخاطر أو القرارات..." : "Ask about performance, risks, decisions, or enterprise knowledge...",
      ariaLabel: isArabic ? "اكتب سؤالك" : "Enter your question",
      attachDisabled: isArabic ? "إرفاق الملفات غير متاح حاليًا" : "File attachments are not currently available",
      voiceDisabled: isArabic ? "الإدخال الصوتي غير متاح حاليًا" : "Voice input is not currently available",
      groundedBadge: isArabic ? "مدعوم بمعرفة المؤسسة" : "Grounded in enterprise knowledge",
      btnAnalyze: isArabic ? "تحليل" : "Analyze",
    },
    actions: {
      title: isArabic ? "استفسارات تنفيذية مقترحة" : "Suggested Executive Queries",
      desc: isArabic ? "ابدأ بتحليل جاهز أو اكتب سؤالك الخاص." : "Start with a ready analysis or ask your own question.",
      items: [
        {
          title: isArabic ? "تحليل أداء المؤسسة" : "Analyze company performance",
          prompt: isArabic ? "حلّل أداء المؤسسة وحدد أهم ثلاث فرص للتحسين." : "Analyze company performance and identify the top three improvement opportunities.",
        },
        {
          title: isArabic ? "مراجعة مخاطر المؤسسة" : "Review enterprise risks",
          prompt: isArabic ? "ما أهم المخاطر المؤسسية التي تتطلب تدخلًا تنفيذيًا؟" : "What enterprise risks currently require executive intervention?",
        },
        {
          title: isArabic ? "مراجعة السياسات الداخلية" : "Review internal policies",
          prompt: isArabic ? "راجع جاهزية السياسات الداخلية وحدد الفجوات المعرفية." : "Review internal policy readiness and identify knowledge gaps.",
        },
        {
          title: isArabic ? "اقتراح قرار تنفيذي" : "Recommend a decision",
          prompt: isArabic ? "اقترح القرار التنفيذي الأعلى أولوية بناءً على بيانات المؤسسة." : "Recommend the highest-priority executive decision based on enterprise data.",
        }
      ]
    },
    layout: {
      readinessTitle: isArabic ? "جاهزية العقل المؤسسي" : "Corporate Brain Readiness",
      readinessDesc: isArabic ? "الحالة الحالية لطبقات المعرفة المؤسسية" : "Current status of enterprise knowledge layers",
      overall: isArabic ? "الجاهزية الإجمالية" : "Overall readiness",
      inProgress: isArabic ? "قيد التطوير" : "In progress",
      items: {
        companyData: isArabic ? "بيانات المؤسسة" : "Company Data",
        discovery: isArabic ? "بيانات الاستكشاف" : "Discovery Intelligence",
        policies: isArabic ? "السياسات الداخلية" : "Internal Policies",
        graph: isArabic ? "الرسم المعرفي" : "Knowledge Graph",
      },
      aiTask: isArabic 
        ? "أنت مساعد تنفيذي لمنصة KAFU AI، ومهمتك الوحيدة هي الإجابة عن الأسئلة المتعلقة بالمؤسسة اعتمادًا حصريًا على الأدلة (enterprise evidence) المرسلة إليك. لا تستخدم معرفتك العامة للإجابة." 
        : "You are an executive assistant for KAFU AI. Answer questions exclusively using the supplied enterprise evidence. Do not use outside knowledge."
    }
  };
}