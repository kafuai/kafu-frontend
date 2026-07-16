"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  BrainCircuit,
  ChevronDown,
  Search,
  Sparkles,
  UserRound,
} from "lucide-react";

import LanguageSwitcher from "@/components/localization/LanguageSwitcher";
import { useLocalization } from "@/components/localization/LocalizationContext";
import ThemeSwitcher from "@/components/theme/ThemeSwitcher";

const navigationItems = [
  {
    key: "navigation.home",
    href: "/",
  },
  {
    key: "navigation.workspace",
    href: "/company-workspace",
  },
  {
    key: "navigation.dashboard",
    href: "/company-dashboard",
  },
  {
    key: "navigation.corporateBrain",
    href: "/corporate-brain",
  },
  {
    key: "navigation.corporateDNA",
    href: "/corporate-dna",
  },
  {
    key: "navigation.digitalWorkforce",
    href: "/digital-workforce",
  },
  {
    key: "navigation.commandCenter",
    href: "/command-center",
  },
];

export default function EnterpriseHeader() {
  const pathname = usePathname();
  const { t } = useLocalization();

  return (
    <header className="enterprise-header">
      <div className="enterprise-header__inner">
        <div className="enterprise-header__brand-group">
          <Link href="/" className="enterprise-brand">
            <span className="enterprise-brand__mark">
              <BrainCircuit size={21} strokeWidth={2.2} />
            </span>

            <span className="enterprise-brand__wordmark">
              KAFU <strong>AI</strong>
            </span>
          </Link>

          <button
            type="button"
            className="workspace-selector"
            aria-label={t("workspace.activeCompany")}
          >
            <span className="workspace-selector__content">
              <span className="workspace-selector__label">
                {t("workspace.activeCompany")}
              </span>

              <span className="workspace-selector__name">
                {t("workspace.companyName")}
              </span>
            </span>

            <ChevronDown size={16} />
          </button>
        </div>

        <nav
          className="enterprise-navigation"
          aria-label="Enterprise navigation"
        >
          {navigationItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className="enterprise-navigation__link"
                data-active={isActive}
              >
                {t(item.key)}
              </Link>
            );
          })}
        </nav>

        <div className="enterprise-header__actions">
          <button
            type="button"
            className="enterprise-icon-button enterprise-search-button"
            aria-label={t("common.search")}
            title={t("common.search")}
          >
            <Search size={18} />
          </button>

          <div className="ai-status">
            <span className="ai-status__indicator" />

            <Sparkles size={15} />

            <span>{t("common.active")}</span>
          </div>

          <ThemeSwitcher />

          <LanguageSwitcher />

          <button
            type="button"
            className="enterprise-icon-button"
            aria-label={t("common.notifications")}
            title={t("common.notifications")}
          >
            <Bell size={18} />

            <span className="notification-indicator" />
          </button>

          <button
            type="button"
            className="user-menu"
            aria-label="User menu"
          >
            <span className="user-menu__avatar">
              <UserRound size={18} />
            </span>

            <span className="user-menu__content">
              <span className="user-menu__name">Jaber</span>
              <span className="user-menu__role">Executive</span>
            </span>

            <ChevronDown size={15} />
          </button>
        </div>
      </div>
    </header>
  );
}