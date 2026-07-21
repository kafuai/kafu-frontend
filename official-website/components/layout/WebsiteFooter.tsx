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
          <Link className="website-brand website-brand--footer" href="/">
            <span className="website-brand__mark">K</span>

            <span className="website-brand__text">
              <strong>KAFU AI</strong>
              <small>Enterprise Intelligence</small>
            </span>
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