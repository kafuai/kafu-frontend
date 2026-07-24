import type {
  DemoExperience,
} from "./demoExperienceTypes";

const createdAt =
  "2026-07-24T00:00:00.000Z";

export const enterpriseDemoExperience:
  DemoExperience = {
  id: "66666666-6666-4666-8666-666666666666",
  key: "enterprise-product-tour",
  name: "KAFU AI Enterprise Product Tour",
  description:
    "رحلة مؤسسية موجهة لاستعراض القيمة الأساسية لمنصة KAFU AI.",
  status: "active",
  createdAt,
  updatedAt: createdAt,
  steps: [
    {
      id: "demo-step-01",
      key: "welcome",
      title: "مرحبًا بك في KAFU AI",
      description:
        "التعرف على رحلة العرض التجريبي والقيمة المؤسسية الأساسية.",
      type: "introduction",
      route: "/welcome",
      order: 1,
      estimatedMinutes: 2,
      required: true,
    },
    {
      id: "demo-step-02",
      key: "company-profile",
      title: "ملف المؤسسة",
      description:
        "استعراض بيانات المؤسسة والسياق التشغيلي الأساسي.",
      type: "navigation",
      route: "/company-profile",
      order: 2,
      estimatedMinutes: 3,
      required: true,
    },
    {
      id: "demo-step-03",
      key: "corporate-brain",
      title: "العقل المؤسسي",
      description:
        "استعراض إدارة المعرفة والذاكرة التنظيمية.",
      type: "insight",
      route: "/corporate-brain",
      order: 3,
      estimatedMinutes: 4,
      required: true,
    },
    {
      id: "demo-step-04",
      key: "executive-summary",
      title: "الملخص التنفيذي",
      description:
        "استعراض الأولويات والإشارات التنفيذية.",
      type: "insight",
      route: "/executive-summary",
      order: 4,
      estimatedMinutes: 4,
      required: true,
    },
    {
      id: "demo-step-05",
      key: "command-center",
      title: "مركز القيادة",
      description:
        "استعراض العمليات والقرارات والتنبيهات المؤسسية.",
      type: "action",
      route: "/command-center",
      order: 5,
      estimatedMinutes: 4,
      required: true,
    },
    {
      id: "demo-step-06",
      key: "sales-intelligence",
      title: "ذكاء المبيعات",
      description:
        "استعراض الرؤية التجارية والفرص ومؤشرات المبيعات.",
      type: "insight",
      route: "/sales-intelligence",
      order: 6,
      estimatedMinutes: 4,
      required: true,
    },
    {
      id: "demo-step-07",
      key: "completion",
      title: "اكتمال العرض التجريبي",
      description:
        "تلخيص القيمة المؤسسية والخطوات التالية.",
      type: "completion",
      route: "/company-dashboard",
      order: 7,
      estimatedMinutes: 2,
      required: true,
    },
  ],
};
