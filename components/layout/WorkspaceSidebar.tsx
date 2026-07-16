"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BrainCircuit,
  Building2,
  Gauge,
  LayoutDashboard,
  Network,
  Route,
  Sparkles,
  UsersRound,
} from "lucide-react";

import { useLocalization } from "@/components/localization/LocalizationContext";

const navigationSections = [
  {
    id: "workspace",
    title: {
      ar: "مساحة العمل",
      en: "Workspace",
    },
    items: [
      {
        translationKey: "navigation.workspace",
        href: "/company-workspace",
        icon: Building2,
      },
      {
        translationKey: "navigation.dashboard",
        href: "/company-dashboard",
        icon: LayoutDashboard,
      },
      {
        label: {
          ar: "الرحلة التنفيذية",
          en: "Executive Journey",
        },
        href: "/journey",
        icon: Route,
      },
    ],
  },
  {
    id: "intelligence",
    title: {
      ar: "الذكاء المؤسسي",
      en: "Enterprise Intelligence",
    },
    items: [
      {
        translationKey: "navigation.modules",
        href: "/modules",
        icon: Network,
      },
      {
        translationKey: "navigation.corporateBrain",
        href: "/corporate-brain",
        icon: BrainCircuit,
      },
      {
        translationKey: "navigation.corporateDNA",
        href: "/corporate-dna",
        icon: Sparkles,
      },
    ],
  },
  {
    id: "operations",
    title: {
      ar: "التنفيذ والعمليات",
      en: "Execution & Operations",
    },
    items: [
      {
        translationKey: "navigation.digitalWorkforce",
        href: "/digital-workforce",
        icon: UsersRound,
      },
      {
        translationKey: "navigation.commandCenter",
        href: "/command-center",
        icon: Gauge,
      },
    ],
  },
];

export default function WorkspaceSidebar() {
  const pathname = usePathname();
  const { locale, t } = useLocalization();

  return (
    <aside className="workspace-sidebar">
      <div className="workspace-sidebar__company">
        <span className="workspace-sidebar__company-icon">
          <Building2 size={20} />
        </span>

        <div className="workspace-sidebar__company-content">
          <span className="workspace-sidebar__company-label">
            {t("workspace.activeCompany")}
          </span>

          <strong className="workspace-sidebar__company-name">
            {t("workspace.companyName")}
          </strong>

          <span className="workspace-sidebar__company-details">
            {t("workspace.companyDetails")}
          </span>
        </div>
      </div>

      <nav
        className="workspace-sidebar__navigation"
        aria-label={
          locale === "ar"
            ? "التنقل داخل مساحة العمل"
            : "Workspace navigation"
        }
      >
        {navigationSections.map((section) => (
          <section
            key={section.id}
            className="workspace-sidebar__section"
          >
            <h2 className="workspace-sidebar__section-title">
              {section.title[locale]}
            </h2>

            <div className="workspace-sidebar__links">
              {section.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);

                const Icon = item.icon;

                const title =
                  "translationKey" in item &&
                  item.translationKey
                    ? t(item.translationKey)
                    : "label" in item && item.label
                      ? item.label[locale]
                      : "";

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="workspace-sidebar__link"
                    data-active={isActive}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <Icon
                      className="workspace-sidebar__link-icon"
                      size={18}
                      strokeWidth={2}
                    />

                    <span>{title}</span>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </nav>

      <div className="workspace-sidebar__status">
        <div className="workspace-sidebar__status-heading">
          <span className="workspace-sidebar__status-indicator" />

          <strong>
            {locale === "ar"
              ? "المنصة تعمل"
              : "Platform Operational"}
          </strong>
        </div>

        <p>
          {locale === "ar"
            ? "أنظمة الذكاء المؤسسي متصلة وجاهزة."
            : "Enterprise intelligence systems are connected and ready."}
        </p>
      </div>
    </aside>
  );
}