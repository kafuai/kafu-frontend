import Link from "next/link";

const navigationItems = [
  { label: "Platform", href: "/platform" },
  { label: "Solutions", href: "/solutions" },
  { label: "Enterprise", href: "/enterprise" },
  { label: "About", href: "/about" },
];

export default function WebsiteHeader() {
  return (
    <header className="website-header">
      <div className="site-container website-header__inner">
        <Link className="website-brand" href="/" aria-label="KAFU AI home">
          <span className="website-brand__mark">K</span>

          <span className="website-brand__text">
            <strong>KAFU AI</strong>
            <small>Enterprise Intelligence</small>
          </span>
        </Link>

        <nav className="website-navigation" aria-label="Primary navigation">
          {navigationItems.map((item) => (
            <Link href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <Link className="website-header__cta" href="/contact">
          Book a Demo
        </Link>
      </div>
    </header>
  );
}