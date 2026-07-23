import Image from "next/image";
import Link from "next/link";

const CURRENT_YEAR = new Date().getFullYear();

const footerLinks = [
  {
    label: "Executive Summary",
    href: "/executive-summary",
  },
  {
    label: "Corporate Brain",
    href: "/corporate-brain",
  },
  {
    label: "Sales Intelligence",
    href: "/sales-intelligence",
  },
];

export default function EnterpriseFooter() {
  return (
    <footer
      className="kafu-enterprise-footer"
      aria-label="KAFU AI enterprise footer"
    >
      <div className="kafu-enterprise-footer__inner">
        <div className="kafu-enterprise-footer__brand">
          <Link
            href="/dashboard"
            className="kafu-enterprise-footer__logo-link"
            aria-label="KAFU AI dashboard"
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
              Enterprise AI Operating System
            </p>

            <p className="kafu-enterprise-footer__description">
              Intelligence, decision support, and enterprise execution in one
              unified platform.
            </p>
          </div>
        </div>

        <nav
          className="kafu-enterprise-footer__navigation"
          aria-label="Enterprise footer navigation"
        >
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="kafu-enterprise-footer__link"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="kafu-enterprise-footer__meta">
          <span className="kafu-enterprise-footer__version">
            Enterprise Platform · V1.0
          </span>

          <span className="kafu-enterprise-footer__copyright">
            © {CURRENT_YEAR} KAFU AI. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}