import type { Metadata } from "next";

import SalesIntelligenceDashboard from "@/components/sales-intelligence/SalesIntelligenceDashboard";

export const metadata: Metadata = {
  title: "ذكاء المبيعات | KAFU AI",
  description:
    "لوحة KAFU AI لتحليل خط المبيعات والفرص والتوقعات التجارية.",
};

export default function SalesIntelligencePage() {
  return <SalesIntelligenceDashboard />;
}
