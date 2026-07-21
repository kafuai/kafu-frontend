import Image from "next/image";
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
          <Image
            src="/brand/kafu-logo-en-transparent.png"
            alt="KAFU AI"
            width={180}
            height={64}
            priority
            className="website-brand__logo"
          />
        </Link>

        <nav className="website-navigation" aria-label="Primary navigation">
          {navigationItems.map((item) => (
            <Link href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <Link className="website-header__cta" href="/book-demo">
          Book a Demo
        </Link>
      </div>
    </header>
  );
}