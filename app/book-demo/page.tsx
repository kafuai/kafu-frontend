"use client";

import React, { useState } from "react";
import { useLocalization } from "@/components/localization/LocalizationContext";
import { CheckCircle2 } from "lucide-react"; 


const CONTENT = {
  ar: {
    heading: "شاهد KAFU AI أثناء العمل",
    description: "اكتشف كيف يمكن لمنصة الذكاء المؤسسي الخاصة بنا تحويل آلية اتخاذ القرار والتنفيذ في مؤسستك.",
    expectTitle: "ماذا تتوقع من العرض التجريبي؟",
    bullets: [
      "جولة حية مخصصة لحالة الاستخدام والتحديات الخاصة بك.",
      "نقاش استراتيجي حول كيفية دمج المنصة مع عملياتك الحالية.",
      "خارطة طريق واضحة للبدء بتجربة تنفيذية موجهة (Pilot).",
    ],
    formTitle: "احجز عرضك التجريبي",
    formSubtitle: "املأ النموذج أدناه، وسيقوم خبراء الأتمتة لدينا بتجهيز بيئة تجريبية مخصصة لك.",
  },
  en: {
    heading: "See KAFU AI in Action",
    description: "Discover how our enterprise intelligence platform can transform your organization's decision-making and execution.",
    expectTitle: "What to expect from the demo?",
    bullets: [
      "A live walkthrough tailored to your specific use case.",
      "A strategic discussion on integrating the platform into your workflows.",
      "A clear roadmap for starting a controlled executive Pilot.",
    ],
    formTitle: "Book Your Demo",
    formSubtitle: "Fill out the form below, and our experts will tailor a custom sandbox for your walkthrough.",
  },
};

export default function BookDemoForm() {
  const { locale } = useLocalization();
  const isArabic = locale === "ar";
  const t = isArabic ? CONTENT.ar : CONTENT.en;

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setStatus("success");
        setMessage(isArabic ? "تم الإرسال بنجاح! سنتواصل معك قريباً." : "Request sent successfully! We will contact you soon.");
        form.reset();
      } else {
        setStatus("error");
        setMessage(isArabic ? "حدث خطأ أثناء الإرسال." : "An error occurred while sending.");
      }
    } catch (error) {
      setStatus("error");
      setMessage(isArabic ? "فشل الاتصال بالخادم، تأكد من الإنترنت." : "Network error. Please check your connection.");
    }
  };

  return (
    <div
      dir={isArabic ? "rtl" : "ltr"}
      className="min-h-screen bg-[var(--landing-bg-primary)] flex items-center justify-center p-6 py-20 lg:px-10 font-sans"
    >
      <div className="w-full max-w-7xl mx-auto grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-20 items-center">
        
        {/* --- القسم النصي (Value Proposition) --- */}
        <div className="max-w-2xl text-start">
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--landing-text-primary)] sm:text-5xl lg:text-6xl">
            {t.heading}
          </h1>
          <p className="mt-6 text-lg leading-8 text-[var(--landing-text-secondary)]">
            {t.description}
          </p>

          <div className="mt-10">
            <h3 className="text-lg font-semibold text-[var(--landing-text-primary)]">
              {t.expectTitle}
            </h3>
            <ul className="mt-6 space-y-5">
              {t.bullets.map((bullet, index) => (
                <li key={index} className="flex gap-4 items-start">
                  <div className="mt-1 shrink-0">
                    <CheckCircle2 size={20} className="text-[var(--landing-accent)]" />
                  </div>
                  <p className="text-base leading-7 text-[var(--landing-text-secondary)]">
                    {bullet}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* --- قسم النموذج (Form) --- */}
        <div className="relative w-full bg-[var(--landing-surface)] border border-[var(--landing-border)] rounded-[24px] p-7 sm:p-10 shadow-[var(--shadow-large)]">
          <div className="mb-8 text-start">
            <h2 className="text-2xl font-bold text-[var(--landing-text-primary)] mb-2">
              {t.formTitle}
            </h2>
            <p className="text-[var(--landing-text-secondary)] text-sm leading-relaxed">
              {t.formSubtitle}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 text-start">
            {/* Row 1: Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-[var(--landing-text-primary)] font-medium">
                  {isArabic ? "الاسم الأول" : "First Name"} <span className="text-[var(--landing-accent)]">*</span>
                </label>
                <input
                  name="firstName"
                  type="text"
                  required
                  className="p-3 bg-[var(--landing-bg-primary)] border border-[var(--landing-border)] rounded-xl text-[var(--landing-text-primary)] placeholder-[var(--landing-text-muted)] focus:outline-none focus:border-[var(--landing-accent)] focus:ring-1 focus:ring-[var(--landing-accent)] transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-[var(--landing-text-primary)] font-medium">
                  {isArabic ? "الاسم الأخير" : "Last Name"} <span className="text-[var(--landing-accent)]">*</span>
                </label>
                <input
                  name="lastName"
                  type="text"
                  required
                  className="p-3 bg-[var(--landing-bg-primary)] border border-[var(--landing-border)] rounded-xl text-[var(--landing-text-primary)] placeholder-[var(--landing-text-muted)] focus:outline-none focus:border-[var(--landing-accent)] focus:ring-1 focus:ring-[var(--landing-accent)] transition-all"
                />
              </div>
            </div>

            {/* Row 2: Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-[var(--landing-text-primary)] font-medium">
                  {isArabic ? "البريد الإلكتروني للعمل" : "Work Email"} <span className="text-[var(--landing-accent)]">*</span>
                </label>
                <input
                  name="workEmail"
                  type="email"
                  dir="ltr"
                  placeholder="name@company.com"
                  required
                  className="p-3 bg-[var(--landing-bg-primary)] border border-[var(--landing-border)] rounded-xl text-[var(--landing-text-primary)] placeholder-[var(--landing-text-muted)] focus:outline-none focus:border-[var(--landing-accent)] focus:ring-1 focus:ring-[var(--landing-accent)] transition-all text-left"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-[var(--landing-text-primary)] font-medium">
                  {isArabic ? "رقم الهاتف" : "Phone Number"} <span className="text-[var(--landing-accent)]">*</span>
                </label>
                <input
                  name="phoneNumber"
                  dir="ltr"
                  value={phoneNumber}
                  onChange={(e) => {
                    const onlyNumbers = e.target.value.replace(/[^0-9+]/g, "");
                    setPhoneNumber(onlyNumbers);
                  }}
                  required
                  className="p-3 bg-[var(--landing-bg-primary)] border border-[var(--landing-border)] rounded-xl text-[var(--landing-text-primary)] placeholder-[var(--landing-text-muted)] focus:outline-none focus:border-[var(--landing-accent)] focus:ring-1 focus:ring-[var(--landing-accent)] transition-all text-left"
                />
              </div>
            </div>

            {/* Row 3: Company Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-[var(--landing-text-primary)] font-medium">
                  {isArabic ? "اسم الشركة" : "Company Name"} <span className="text-[var(--landing-accent)]">*</span>
                </label>
                <input
                  name="companyName"
                  type="text"
                  required
                  className="p-3 bg-[var(--landing-bg-primary)] border border-[var(--landing-border)] rounded-xl text-[var(--landing-text-primary)] placeholder-[var(--landing-text-muted)] focus:outline-none focus:border-[var(--landing-accent)] focus:ring-1 focus:ring-[var(--landing-accent)] transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5 relative">
                <label className="text-sm text-[var(--landing-text-primary)] font-medium">
                  {isArabic ? "حجم الشركة" : "Company Size"} <span className="text-[var(--landing-accent)]">*</span>
                </label>
                <select
                  name="companySize"
                  required
                  className="p-3 bg-[var(--landing-bg-primary)] border border-[var(--landing-border)] rounded-xl text-[var(--landing-text-primary)] appearance-none focus:outline-none focus:border-[var(--landing-accent)] focus:ring-1 focus:ring-[var(--landing-accent)] transition-all w-full cursor-pointer"
                >
                  <option value="">{isArabic ? "اختر الحجم..." : "Select..."}</option>
                  <option value="1-50">1-50</option>
                  <option value="51-200">51-200</option>
                  <option value="201-1000">201-1000</option>
                  <option value="1000+">1000+</option>
                </select>
                <div className={`absolute ${isArabic ? "left-4" : "right-4"} top-[40px] pointer-events-none`}>
                  <svg className="w-4 h-4 text-[var(--landing-text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Row 4: Textarea */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-[var(--landing-text-primary)] font-medium">
                {isArabic ? "كيف يمكننا مساعدتك؟" : "How can we help?"}
              </label>
              <textarea
                name="useCase"
                rows={3}
                placeholder={isArabic ? "حدثنا باختصار عن التحديات التي تواجهها..." : "Tell us briefly about your challenges..."}
                className="p-3 bg-[var(--landing-bg-primary)] border border-[var(--landing-border)] rounded-xl text-[var(--landing-text-primary)] placeholder-[var(--landing-text-muted)] focus:outline-none focus:border-[var(--landing-accent)] focus:ring-1 focus:ring-[var(--landing-accent)] transition-all resize-none"
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="pt-4 flex flex-col gap-4">
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#5C80FF] to-[#9B6BFF] text-white font-bold text-base hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--landing-surface)] focus:ring-[#7B75FF] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 shadow-lg"
              >
                {status === "loading" ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isArabic ? "جاري الإرسال..." : "Sending..."}
                  </>
                ) : (
                  isArabic ? "تأكيد الحجز" : "Book Demo"
                )}
              </button>

              {/* Messages */}
              {status === "success" && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-sm text-center font-medium">
                  {message}
                </div>
              )}
              {status === "error" && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center font-medium">
                  {message}
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}