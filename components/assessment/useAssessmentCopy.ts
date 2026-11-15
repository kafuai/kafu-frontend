export function useAssessmentCopy(locale: string) {
  const isArabic = locale === "ar";

  const CONTENT = {
    ar: {
      badge: "Executive Discovery",
      title: "دعنا نبدأ بفهم مؤسستكم",
      description: "قبل أن أقترح أي حلول، أحتاج إلى تكوين صورة واضحة عن بيئة العمل، حجم المؤسسة، وأهدافها الحالية. كل معلومة ستساعدني على بناء توصيات أكثر دقة وواقعية.",
      companyInfo: "معلومات المؤسسة",
      placeholders: {
        companyName: "اسم الشركة",
        industry: "القطاع",
        country: "الدولة",
        employeeCount: "عدد الموظفين",
        contactName: "الاسم",
        contactEmail: "البريد الإلكتروني",
        contactPhone: "رقم الجوال",
        contactTitle: "المسمى الوظيفي",
      },
      contactInfo: "مسؤول التواصل",
      whyAsk: {
        title: "لماذا أسأل هذه الأسئلة؟",
        description: "لأن كفو لا يقدم حلولاً جاهزة للجميع. كل مؤسسة لها تحدياتها، ولذلك أبني التوصيات اعتماداً على واقع المؤسسة وليس على افتراضات عامة.",
      },
      buttons: {
        saving: "جاري حفظ البيانات...",
        submit: "متابعة جلسة الاستكشاف",
      },
      messages: {
        saveError: "حدث خطأ أثناء الحفظ: ",
        noUser: "تم حفظ بيانات الشركة، لكن تعذر تحديد المستخدم الحالي.",
        noOrg: "تم حفظ بيانات الشركة، لكن تعذر تحديد المنظمة المرتبطة بها.",
        assessmentError: "تم حفظ بيانات الشركة، لكن تعذر تسجيل اكتمال Assessment: ",
        success: "✅ تم حفظ بيانات الشركة بنجاح. سيتم نقلك إلى جلسة الاستكشاف...",
      },
    },
    en: {
      badge: "Executive Discovery",
      title: "Let's start by understanding your organization",
      description: "Before proposing any solutions, I need a clear picture of your work environment, organization size, and current goals. Every piece of information helps me build more accurate and realistic recommendations.",
      companyInfo: "Organization Information",
      placeholders: {
        companyName: "Company Name",
        industry: "Industry",
        country: "Country",
        employeeCount: "Number of Employees",
        contactName: "Name",
        contactEmail: "Email Address",
        contactPhone: "Phone Number",
        contactTitle: "Job Title",
      },
      contactInfo: "Contact Person",
      whyAsk: {
        title: "Why do I ask these questions?",
        description: "Because KAFU does not offer one-size-fits-all solutions. Every organization has its own challenges, which is why recommendations are built based on your reality, not general assumptions.",
      },
      buttons: {
        saving: "Saving data...",
        submit: "Continue to Discovery Session",
      },
      messages: {
        saveError: "Error saving: ",
        noUser: "Company data saved, but the current user could not be determined.",
        noOrg: "Company data saved, but the associated organization could not be determined.",
        assessmentError: "Company data saved, but failed to record Assessment completion: ",
        success: "✅ Company data saved successfully. Redirecting to discovery session...",
      },
    },
  };

  return isArabic ? CONTENT.ar : CONTENT.en;
}