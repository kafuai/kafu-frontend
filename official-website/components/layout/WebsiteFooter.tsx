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
  { label: "Book a Demo", href: "/contact" },
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
              width={210}
              height={74}
              className="website-brand__logo website-brand__logo--footer"
            />
          </Link>

          <p>
            Enterprise intelligence that connects organizational knowledge,
            executive decisions, and AI-enabled execution.
          </p>
        </div>

        <nav className="website-footer__column" aria-label="Platform links">
          <h2>Platform</h2>

          <div className="website-footer__links">
            {platformLinks.map((item) => (
              <Link href={item.href} key={item.label}>
                {item.label}
              </Link>
            ))}
          </div>
        </nav>

        <nav className="website-footer__column" aria-label="Company links">
          <h2>Company</h2>

          <div className="website-footer__links">
            {companyLinks.map((item) => (
              <Link href={item.href} key={item.label}>
                {item.label}
              </Link>
            ))}
          </div>
        </nav>

        <div className="website-footer__column website-footer__contact">
          <h2>Contact</h2>

          <a href="mailto:hello@kafu.ai">hello@kafu.ai</a>

          <p>
            Bahrain
            <span>Serving the GCC and global enterprises</span>
          </p>
        </div>
      </div>

      <div className="site-container website-footer__bottom">
        <span>© {new Date().getFullYear()} KAFU AI. All rights reserved.</span>
        <span>Enterprise intelligence for the AI-enabled organization.</span>
      </div>
    </footer>
  );
}

