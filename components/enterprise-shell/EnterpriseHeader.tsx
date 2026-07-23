"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Bot,
  BrainCircuit,
  Building2,
  ChevronDown,
  Command,
  Dna,
  Home,
  LayoutDashboard,
  Search,
  Sparkles,
  TrendingUp,
  UserRound,
  UsersRound,
} from "lucide-react";

import LanguageSwitcher from "@/components/localization/LanguageSwitcher";
import { useLocalization } from "@/components/localization/LocalizationContext";
import ThemeSwitcher from "@/components/theme/ThemeSwitcher";

const navigationItems = [
  {
    key: "navigation.home",
    href: "/",
    icon: Home,
  },
  {
    key: "navigation.workspace",
    href: "/company-workspace",
    icon: Building2,
  },
  {
    key: "navigation.dashboard",
    href: "/company-dashboard",
    icon: LayoutDashboard,
  },
  {
    key: "navigation.corporateBrain",
    href: "/corporate-brain",
    icon: BrainCircuit,
  },
  {
    key: "navigation.corporateDNA",
    href: "/corporate-dna",
    icon: Dna,
  },
  {
    key: "navigation.digitalWorkforce",
    href: "/digital-workforce",
    icon: UsersRound,
  },
  {
    key: "navigation.commandCenter",
    href: "/command-center",
    icon: Command,
  },
  {
  key: "navigation.salesIntelligence",
  href: "/sales-intelligence",
  icon: TrendingUp,
  },
];

export default function EnterpriseHeader() {
  const pathname = usePathname();
  const { t } = useLocalization();

  return (
    <header className="kafu-executive-header">
      <div className="kafu-executive-header__inner">
        <div className="kafu-executive-header__brand-zone">
          <Link
            href="/"
            className="kafu-executive-brand"
            aria-label="KAFU AI"
            title="KAFU AI"
          >
            <Image
              src="/brand/kafu-logo-en.png"
              alt="KAFU AI"
              width={1774}
              height={887}
              priority
              className="kafu-executive-brand__logo"
              sizes="112px"
            />
          </Link>

          <span
            className="kafu-executive-header__divider"
            aria-hidden="true"
          />

          <button
            type="button"
            className="kafu-workspace-selector"
            aria-label={`${t("workspace.activeCompany")}: ${t(
              "workspace.companyName",
            )}`}
            title={t("workspace.companyName")}
          >
            <Building2 size={17} strokeWidth={1.8} />

            <span className="kafu-workspace-selector__name">
              {t("workspace.companyName")}
            </span>

            <ChevronDown
              size={13}
              strokeWidth={2}
              className="kafu-workspace-selector__chevron"
            />
          </button>
        </div>

        <nav
          className="kafu-executive-navigation"
          aria-label="Enterprise navigation"
        >
          {navigationItems.map((item) => {
            const Icon = item.icon;

            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className="kafu-executive-navigation__link"
                data-active={isActive}
                aria-label={t(item.key)}
                title={t(item.key)}
              >
                <Icon size={18} strokeWidth={1.8} />

                <span className="kafu-executive-navigation__label">
                  {t(item.key)}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="kafu-executive-header__actions">
          <button
            type="button"
            className="kafu-executive-control"
            aria-label={t("common.search")}
            title={t("common.search")}
          >
            <Search size={18} strokeWidth={1.8} />
          </button>

          <div
            className="kafu-ai-status"
            aria-label={t("common.active")}
            title={t("common.active")}
          >
            <Bot size={18} strokeWidth={1.8} />

            <span className="kafu-ai-status__indicator">
              <Sparkles size={9} strokeWidth={2.2} />
            </span>
          </div>

          <ThemeSwitcher />

          <LanguageSwitcher />

          <button
            type="button"
            className="kafu-executive-control kafu-executive-notification"
            aria-label={t("common.notifications")}
            title={t("common.notifications")}
          >
            <Bell size={18} strokeWidth={1.8} />

            <span className="kafu-executive-notification__badge">
              2
            </span>
          </button>

          <span
            className="kafu-executive-header__divider"
            aria-hidden="true"
          />

          <button
            type="button"
            className="kafu-executive-user"
            aria-label="User menu"
            title="Jaber — Executive"
          >
            <span className="kafu-executive-user__avatar">
              <UserRound size={17} strokeWidth={1.9} />
            </span>

            <span className="kafu-executive-user__identity">
              <strong>Jaber</strong>
              <small>Executive</small>
            </span>

            <ChevronDown
              size={13}
              strokeWidth={2}
              className="kafu-executive-user__chevron"
            />
          </button>
        </div>
      </div>
    </header>
  );
}
