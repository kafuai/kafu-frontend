"use client";

import { useEffect } from "react";
import Link from "next/link";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("KAFU AI website error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <main className="global-error-page">
          <section
            className="global-error-card"
            aria-labelledby="global-error-title"
            aria-describedby="global-error-description"
          >
            <p className="global-error-eyebrow">KAFU AI</p>

            <h1 id="global-error-title">Something went wrong</h1>

            <p id="global-error-description">
              We could not complete your request. Please try again or return
              to the homepage.
            </p>

            <div className="global-error-actions">
              <button type="button" onClick={reset}>
                Try again
              </button>

              <Link href="/">Return home</Link>
            </div>
          </section>
        </main>
      </body>
    </html>
  );
}
