import Image from "next/image";
import Link from "next/link";

const platformLinks = [
  { label: "Platform", href: "/platform" },
  { label: "Solutions", href: "/solutions" },
  { label: "Enterprise", href: "/enterprise" },
];

const companyLinks = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Book a Demo", href: "/book-demo" },
];

export default function WebsiteFooter() {
  return (
    <footer className="website-footer">
      <div className="site-container website-footer__grid">
        <div className="website-footer__brand">
          <Link
            className="website-brand website-brand--footer"
            href="/"
            aria-label="KAFU AI home"
          >
            <Image
              src="/brand/kafu-logo-en-transparent.png"
              alt="KAFU AI"
              width={180}
              height={64}
              className="website-brand__logo website-brand__logo--footer"
            />
          </Link>

          <p>
            A connected enterprise intelligence platform for organizational
            understanding, executive decision-making, and AI-enabled execution.
          </p>
        </div>

        <div className="website-footer__column">
          <h3>Platform</h3>

          {platformLinks.map((item) => (
            <Link href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </div>

        <div className="website-footer__column">
          <h3>Company</h3>

          {companyLinks.map((item) => (
            <Link href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </div>

        <div className="website-footer__column">
          <h3>Contact</h3>
          <a href="mailto:hello@kafu.ai">hello@kafu.ai</a>
          <span>Bahrain · GCC · Global</span>
        </div>
      </div>

      <div className="site-container website-footer__bottom">
        <span>© {new Date().getFullYear()} KAFU AI. All rights reserved.</span>
        <span>Enterprise intelligence for the AI-enabled organization.</span>
      </div>
    </footer>
  );
}
