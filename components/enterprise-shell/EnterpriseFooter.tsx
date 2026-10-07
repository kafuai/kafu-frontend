"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocalization } from "@/components/localization/LocalizationContext";

const CURRENT_YEAR = new Date().getFullYear();

const FOOTER_CONTENT = {
  ar: {
    ariaLabel: "تذييل منصة KAFU AI المؤسسية",
    logoAriaLabel: "لوحة تحكم KAFU AI",
    platform: "نظام تشغيل الذكاء المؤسسي",
    description: "الذكاء، دعم القرار، والتنفيذ المؤسسي في منصة واحدة موحدة.",
    version: "V1.0. المنصة المؤسسية",
    copyright: `© ${CURRENT_YEAR} KAFU AI. جميع الحقوق محفوظة.`,
  },
  en: {
    ariaLabel: "KAFU AI enterprise footer",
    logoAriaLabel: "KAFU AI dashboard",
    platform: "Enterprise AI Operating System",
    description: "Intelligence, decision support, and enterprise execution in one unified platform.",
    version: "Enterprise Platform · V1.0",
    copyright: `© ${CURRENT_YEAR} KAFU AI. All rights reserved.`,
  },
} as const;

export default function EnterpriseFooter() {
  const { locale } = useLocalization();
  const isArabic = locale === "ar";
  const t = isArabic ? FOOTER_CONTENT.ar : FOOTER_CONTENT.en;

  return (
    <footer
      className="kafu-enterprise-footer"
      aria-label={t.ariaLabel}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div className="kafu-enterprise-footer__inner">
        <div className="kafu-enterprise-footer__brand text-start">
          <Link
            href="/"
            className="kafu-enterprise-footer__logo-link"
            aria-label={t.logoAriaLabel}
          >
            <Image
              src="/brand/kafu-logo-en.png"
              alt="KAFU AI"
              width={132}
              height={42}
              className="kafu-enterprise-footer__logo"
            />
          </Link>

          <div className="kafu-enterprise-footer__brand-copy">
            <p className="kafu-enterprise-footer__platform">
              {t.platform}
            </p>

            <p className="kafu-enterprise-footer__description">
              {t.description}
            </p>
          </div>
        </div>

        <div className="kafu-enterprise-footer__meta">
          <span className="kafu-enterprise-footer__version" dir="ltr">
            {t.version}
          </span>

          <span className="kafu-enterprise-footer__copyright">
            {t.copyright}
          </span>
        </div>
      </div>
    </footer>
  );
}