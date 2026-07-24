import type {
  EmailTemplate,
} from "./emailTemplateTypes";

const createdAt = "2026-07-24T00:00:00.000Z";

export const enterpriseEmailTemplates:
  readonly EmailTemplate[] = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    key: "authentication.welcome",
    name: "Welcome to KAFU AI",
    category: "authentication",
    status: "active",
    subject: "مرحبًا بك في KAFU AI، {{fullName}}",
    htmlBody: `
      <div dir="rtl">
        <h1>مرحبًا بك في KAFU AI</h1>
        <p>مرحبًا {{fullName}}،</p>
        <p>
          تم إنشاء مساحة عمل {{companyName}} بنجاح.
        </p>
        <p>
          يمكنك الآن الدخول إلى المنصة والبدء في
          إدارة المعرفة والقرارات والعمليات المؤسسية.
        </p>
        <p>
          <a href="{{loginUrl}}">
            الدخول إلى KAFU AI
          </a>
        </p>
      </div>
    `.trim(),
    textBody: `
مرحبًا {{fullName}}،

تم إنشاء مساحة عمل {{companyName}} بنجاح.

الدخول إلى KAFU AI:
{{loginUrl}}
    `.trim(),
    variables: [
      {
        key: "fullName",
        label: "الاسم الكامل",
        required: true,
      },
      {
        key: "companyName",
        label: "اسم المؤسسة",
        required: true,
      },
      {
        key: "loginUrl",
        label: "رابط تسجيل الدخول",
        required: true,
      },
    ],
    createdAt,
    updatedAt: createdAt,
  },
  {
    id: "22222222-2222-4222-8222-222222222222",
    key: "authentication.password-reset",
    name: "Password Reset",
    category: "authentication",
    status: "active",
    subject: "تحديث كلمة المرور في KAFU AI",
    htmlBody: `
      <div dir="rtl">
        <h1>طلب تحديث كلمة المرور</h1>
        <p>مرحبًا {{fullName}}،</p>
        <p>
          تلقينا طلبًا لتحديث كلمة مرور حسابك.
        </p>
        <p>
          <a href="{{resetUrl}}">
            تحديث كلمة المرور
          </a>
        </p>
        <p>
          تجاهل هذه الرسالة إذا لم تطلب التحديث.
        </p>
      </div>
    `.trim(),
    textBody: `
مرحبًا {{fullName}}،

استخدم الرابط التالي لتحديث كلمة المرور:
{{resetUrl}}

تجاهل هذه الرسالة إذا لم تطلب التحديث.
    `.trim(),
    variables: [
      {
        key: "fullName",
        label: "الاسم الكامل",
        required: false,
        fallbackValue: "مستخدم KAFU AI",
      },
      {
        key: "resetUrl",
        label: "رابط تحديث كلمة المرور",
        required: true,
      },
    ],
    createdAt,
    updatedAt: createdAt,
  },
  {
    id: "33333333-3333-4333-8333-333333333333",
    key: "communication.new-message",
    name: "New Communication Message",
    category: "communication",
    status: "active",
    subject: "رسالة جديدة من {{senderName}}",
    htmlBody: `
      <div dir="rtl">
        <h1>لديك رسالة جديدة</h1>
        <p>
          أرسل {{senderName}} رسالة في
          {{conversationTitle}}.
        </p>
        <blockquote>{{messagePreview}}</blockquote>
        <p>
          <a href="{{conversationUrl}}">
            فتح المحادثة
          </a>
        </p>
      </div>
    `.trim(),
    textBody: `
رسالة جديدة من {{senderName}}
في: {{conversationTitle}}

{{messagePreview}}

فتح المحادثة:
{{conversationUrl}}
    `.trim(),
    variables: [
      {
        key: "senderName",
        label: "اسم المرسل",
        required: true,
      },
      {
        key: "conversationTitle",
        label: "عنوان المحادثة",
        required: true,
      },
      {
        key: "messagePreview",
        label: "معاينة الرسالة",
        required: true,
      },
      {
        key: "conversationUrl",
        label: "رابط المحادثة",
        required: true,
      },
    ],
    createdAt,
    updatedAt: createdAt,
  },
  {
    id: "44444444-4444-4444-8444-444444444444",
    key: "notification.executive-alert",
    name: "Executive Alert",
    category: "notification",
    status: "active",
    subject: "تنبيه تنفيذي: {{alertTitle}}",
    htmlBody: `
      <div dir="rtl">
        <h1>{{alertTitle}}</h1>
        <p>{{alertSummary}}</p>
        <p>
          مستوى الأولوية:
          <strong>{{priority}}</strong>
        </p>
        <p>
          <a href="{{actionUrl}}">
            مراجعة التفاصيل
          </a>
        </p>
      </div>
    `.trim(),
    textBody: `
تنبيه تنفيذي: {{alertTitle}}

{{alertSummary}}

مستوى الأولوية: {{priority}}

مراجعة التفاصيل:
{{actionUrl}}
    `.trim(),
    variables: [
      {
        key: "alertTitle",
        label: "عنوان التنبيه",
        required: true,
      },
      {
        key: "alertSummary",
        label: "ملخص التنبيه",
        required: true,
      },
      {
        key: "priority",
        label: "الأولوية",
        required: true,
      },
      {
        key: "actionUrl",
        label: "رابط الإجراء",
        required: true,
      },
    ],
    createdAt,
    updatedAt: createdAt,
  },
  {
    id: "55555555-5555-4555-8555-555555555555",
    key: "commercial.demo-request",
    name: "Demo Request Confirmation",
    category: "commercial",
    status: "active",
    subject: "تم استلام طلب العرض التجريبي",
    htmlBody: `
      <div dir="rtl">
        <h1>شكرًا لاهتمامك بـ KAFU AI</h1>
        <p>مرحبًا {{fullName}}،</p>
        <p>
          تم استلام طلب العرض التجريبي الخاص
          بمؤسسة {{companyName}}.
        </p>
        <p>
          سيتواصل معك فريقنا خلال {{responseWindow}}.
        </p>
      </div>
    `.trim(),
    textBody: `
مرحبًا {{fullName}}،

تم استلام طلب العرض التجريبي الخاص بمؤسسة
{{companyName}}.

سيتواصل معك فريقنا خلال {{responseWindow}}.
    `.trim(),
    variables: [
      {
        key: "fullName",
        label: "الاسم الكامل",
        required: true,
      },
      {
        key: "companyName",
        label: "اسم المؤسسة",
        required: true,
      },
      {
        key: "responseWindow",
        label: "مدة الاستجابة",
        required: false,
        fallbackValue: "يوم عمل واحد",
      },
    ],
    createdAt,
    updatedAt: createdAt,
  },
];
