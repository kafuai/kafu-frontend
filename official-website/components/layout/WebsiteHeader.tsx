"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Globe2 } from "lucide-react";

import { useWebsiteLanguage } from "@/components/localization";

const navigation = {
  en: [
    { label: "Platform", href: "/platform" },
    { label: "Solutions", href: "/solutions" },
    { label: "Enterprise", href: "/enterprise" },
    { label: "About", href: "/about" },
  ],
  ar: [
    { label: "المنصة", href: "/platform" },
    { label: "الحلول", href: "/solutions" },
    { label: "قطاع الأعمال", href: "/enterprise" },
    { label: "عن كفو", href: "/about" },
  ],
};

const headerContent = {
  en: {
    homeLabel: "KAFU AI home",
    navigationLabel: "Primary navigation",
    demoLabel: "Book a Demo",
    languageMenuLabel: "Select website language",
    languageButtonLabel: "Open language selector",
  },
  ar: {
    homeLabel: "الصفحة الرئيسية لكفو للذكاء الاصطناعي",
    navigationLabel: "التنقل الرئيسي",
    demoLabel: "احجز عرضًا",
    languageMenuLabel: "اختر لغة الموقع",
    languageButtonLabel: "فتح قائمة اختيار اللغة",
  },
};

const languageOptions = [
  {
    value: "ar",
    label: "العربية",
    languageCode: "AR",
  },
  {
    value: "en",
    label: "English",
    languageCode: "EN",
  },
] as const;

export default function WebsiteHeader() {
  const { language, toggleLanguage } = useWebsiteLanguage();
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const languageMenuRef = useRef<HTMLDivElement>(null);

  const content = headerContent[language];
  const navigationItems = navigation[language];

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (
        languageMenuRef.current &&
        !languageMenuRef.current.contains(event.target as Node)
      ) {
        setIsLanguageMenuOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsLanguageMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  function selectLanguage(selectedLanguage: "ar" | "en") {
    if (selectedLanguage !== language) {
      toggleLanguage();
    }

    setIsLanguageMenuOpen(false);
  }

  return (
    <header className="website-header">
      <div className="site-container website-header__inner">
        <Link
          className="website-brand"
          href="/"
          aria-label={content.homeLabel}
        >
          <Image
            src="/brand/kafu-logo-en-transparent.png"
            alt="KAFU AI"
            width={180}
            height={64}
            priority
            className="website-brand__logo"
          />
        </Link>

        <nav
          className="website-navigation"
          aria-label={content.navigationLabel}
        >
          {navigationItems.map((item) => (
            <Link href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="website-header__actions">
          <div
            className="website-language-menu"
            ref={languageMenuRef}
          >
            <button
              className="website-language-switcher"
              type="button"
              aria-label={content.languageButtonLabel}
              aria-haspopup="menu"
              aria-expanded={isLanguageMenuOpen}
              aria-controls="website-language-options"
              title={content.languageButtonLabel}
              onClick={() =>
                setIsLanguageMenuOpen((currentValue) => !currentValue)
              }
            >
              <Globe2
                className="website-language-switcher__globe"
                size={19}
                strokeWidth={1.8}
                aria-hidden="true"
              />

              <ChevronDown
                className="website-language-switcher__chevron"
                size={14}
                strokeWidth={2}
                aria-hidden="true"
              />
            </button>

            {isLanguageMenuOpen && (
              <div
                id="website-language-options"
                className="website-language-menu__dropdown"
                role="menu"
                aria-label={content.languageMenuLabel}
              >
                {languageOptions.map((option) => {
                  const isActive = language === option.value;

                  return (
                    <button
                      className="website-language-menu__option"
                      type="button"
                      role="menuitemradio"
                      aria-checked={isActive}
                      key={option.value}
                      onClick={() => selectLanguage(option.value)}
                    >
                      <span
                        className="website-language-menu__code"
                        aria-hidden="true"
                      >
                        {option.languageCode}
                      </span>

                      <span className="website-language-menu__name">
                        {option.label}
                      </span>

                      <span className="website-language-menu__check">
                        {isActive && (
                          <Check
                            size={16}
                            strokeWidth={2.4}
                            aria-hidden="true"
                          />
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <Link className="website-header__cta" href="/book-demo">
            {content.demoLabel}
          </Link>
        </div>
      </div>
    </header>
  );
}
