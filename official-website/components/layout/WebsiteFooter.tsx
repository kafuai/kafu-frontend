"use client";

import Image from "next/image";
import Link from "next/link";

import { useWebsiteLanguage } from "@/components/localization";

const footerContent = {
  en: {
    homeLabel: "KAFU AI home",
    description:
      "Enterprise intelligence that connects organizational knowledge, executive decisions, and governed AI-enabled execution.",
    platformTitle: "Platform",
    companyTitle: "Company",
    contactTitle: "Contact",
    platformNavigationLabel: "Platform links",
    companyNavigationLabel: "Company links",
    location: "Bahrain",
    serviceArea: "Serving GCC and global enterprises",
    copyright: "All rights reserved.",
    statement:
      "Enterprise intelligence for the AI-enabled organization.",
    platformLinks: [
      { label: "Platform", href: "/platform" },
      { label: "Solutions", href: "/solutions" },
      { label: "Enterprise", href: "/enterprise" },
    ],
    companyLinks: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Executive Discovery", href: "/book-demo" },
    ],
  },
  ar: {
    homeLabel: "الصفحة الرئيسية لكفو للذكاء الاصطناعي",
    description:
      "ذكاء مؤسسي يربط المعرفة التنظيمية والقرارات التنفيذية والتنفيذ المحكوم والمدعوم بالذكاء الاصطناعي.",
    platformTitle: "المنصة",
    companyTitle: "الشركة",
    contactTitle: "التواصل",
    platformNavigationLabel: "روابط المنصة",
    companyNavigationLabel: "روابط الشركة",
    location: "مملكة البحرين",
    serviceArea: "نخدم مؤسسات الخليج والأسواق العالمية",
    copyright: "جميع الحقوق محفوظة.",
    statement:
      "ذكاء مؤسسي للمنظمات المدعومة بالذكاء الاصطناعي.",
    platformLinks: [
      { label: "المنصة", href: "/platform" },
      { label: "الحلول", href: "/solutions" },
      { label: "قطاع الأعمال", href: "/enterprise" },
    ],
    companyLinks: [
      { label: "عن كفو", href: "/about" },
      { label: "تواصل معنا", href: "/contact" },
      { label: "اكتشاف تنفيذي", href: "/book-demo" },
    ],
  },
};

export default function WebsiteFooter() {
  const { language } = useWebsiteLanguage();
  const content = footerContent[language];

  return (
    <footer className="website-footer">
      <div className="site-container website-footer__grid">
        <div className="website-footer__brand">
          <Link
            className="website-brand website-brand--footer"
            href="/"
            aria-label={content.homeLabel}
          >
            <Image
              src="/brand/kafu-logo-en-transparent.png"
              alt="KAFU AI"
              width={210}
              height={74}
              className="website-brand__logo website-brand__logo--footer"
            />
          </Link>

          <p>{content.description}</p>
        </div>

        <nav
          className="website-footer__column"
          aria-label={content.platformNavigationLabel}
        >
          <h2>{content.platformTitle}</h2>

          <div className="website-footer__links">
            {content.platformLinks.map((item) => (
              <Link href={item.href} key={item.href}>
                {item.label}
              </Link>
            ))}
          </div>
        </nav>

        <nav
          className="website-footer__column"
          aria-label={content.companyNavigationLabel}
        >
          <h2>{content.companyTitle}</h2>

          <div className="website-footer__links">
            {content.companyLinks.map((item) => (
              <Link href={item.href} key={item.href}>
                {item.label}
              </Link>
            ))}
          </div>
        </nav>

        <div className="website-footer__column website-footer__contact">
          <h2>{content.contactTitle}</h2>

          <a href="mailto:hello@kafu.ai">hello@kafu.ai</a>

          <p>
            {content.location}
            <span>{content.serviceArea}</span>
          </p>
        </div>
      </div>

      <div className="site-container website-footer__bottom">
        <span>
          © {new Date().getFullYear()} KAFU AI. {content.copyright}
        </span>

        <span>{content.statement}</span>
      </div>
    </footer>
  );
}