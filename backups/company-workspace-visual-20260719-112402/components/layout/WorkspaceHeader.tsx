"use client";

import { Activity, Building2, Sparkles } from "lucide-react";

import { useLocalization } from "@/components/localization/LocalizationContext";

export default function WorkspaceHeader() {
  const { locale, t } = useLocalization();

  return (
    <header className="workspace-page-header">
      <div className="workspace-page-header__content">
        <span className="workspace-page-header__eyebrow">
          <Building2 size={14} />
          {t("workspace.label")}
        </span>

        <h1 className="workspace-page-header__title">
          {t("workspace.title")}
        </h1>

        <p className="workspace-page-header__description">
          {locale === "ar"
            ? "إدارة القرارات والأداء والذكاء المؤسسي من مساحة تنفيذ موحدة."
            : "Manage decisions, performance, and enterprise intelligence from one unified execution workspace."}
        </p>
      </div>

      <div
        className="workspace-page-header__signals"
        aria-label={
          locale === "ar"
            ? "حالة مساحة العمل"
            : "Workspace status"
        }
      >
        <div className="workspace-page-header__signal">
          <Activity size={15} />
          <span>{t("common.active")}</span>
        </div>

        <div className="workspace-page-header__signal workspace-page-header__signal--primary">
          <Sparkles size={15} />
          <span>{t("common.phase")}</span>
        </div>
      </div>
    </header>
  );
}
