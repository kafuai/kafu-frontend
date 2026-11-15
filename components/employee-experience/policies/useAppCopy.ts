// useAppCopy.ts
import {
  CATEGORY_OPTIONS_AR,
  CATEGORY_OPTIONS_EN,
  POLICY_TYPE_OPTIONS_AR,
  POLICY_TYPE_OPTIONS_EN,
} from "./types";

export function useAppCopy(isArabic: boolean) {
  const categoryOptions = isArabic ? CATEGORY_OPTIONS_AR : CATEGORY_OPTIONS_EN;
  const policyTypeOptions = isArabic ? POLICY_TYPE_OPTIONS_AR : POLICY_TYPE_OPTIONS_EN;

  const copy = {
    pageTitle: isArabic ? "سياسات الشركة" : "Company Policies",
    pageDescription: isArabic
      ? "هذه السياسات يستخدمها الذكاء الاصطناعي للرد على استفسارات الموظفين."
      : "These policies are used by the AI to answer employee inquiries.",
    addPolicy: isArabic ? "إضافة سياسة" : "Add Policy",
    loading: isArabic ? "جارِ التحميل..." : "Loading...",
    forbidden: isArabic ? "هذه الصفحة متاحة فقط لفريق الموارد البشرية." : "This page is available to HR only.",
    retry: isArabic ? "إعادة المحاولة" : "Retry",
    category: isArabic ? "الفئة" : "Category",
    policyTypeLabel: isArabic ? "النوع (اختياري)" : "Type (optional)",
    noType: isArabic ? "— بدون نوع —" : "— No type —",
    policyTitle: isArabic ? "عنوان السياسة" : "Policy Title",
    policyTitlePlaceholder: isArabic ? "مثال: سياسة الإجازة السنوية" : "e.g. Annual Leave Policy",
    policyContent: isArabic ? "نص السياسة" : "Policy Content",
    policyContentPlaceholder: isArabic ? "اكتب نص السياسة كاملاً هنا..." : "Write the full policy text here...",
    save: isArabic ? "حفظ" : "Save",
    cancel: isArabic ? "إلغاء" : "Cancel",
    noPolicies: isArabic ? "لا توجد سياسات مضافة بعد." : "No policies added yet.",
    confirmDelete: isArabic ? "هل أنت متأكد من حذف هذه السياسة؟" : "Are you sure you want to delete this policy?",
    errUnableLoad: isArabic ? "تعذر تحميل السياسات." : "Unable to load policies.",
    errUnableCreate: isArabic ? "تعذر إنشاء السياسة." : "Unable to create policy.",
    errUnableUpdate: isArabic ? "تعذر تحديث السياسة." : "Unable to update policy.",
    errUnableDelete: isArabic ? "تعذر حذف السياسة." : "Unable to delete policy.",
    errDuplicate: isArabic
      ? "توجد سياسة بنفس الفئة والنوع مسبقًا."
      : "A policy with the same category and type already exists.",
    errTitleRequired: isArabic ? "عنوان السياسة مطلوب" : "Policy title is required",
    errContentRequired: isArabic ? "نص السياسة مطلوب" : "Policy content is required",
  };

  return { copy, categoryOptions, policyTypeOptions };
}