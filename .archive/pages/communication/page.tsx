import type { Metadata } from "next";
import { Suspense } from "react";

import CommunicationWorkspace from "@/components/communication-workspace/CommunicationWorkspace";

export const metadata: Metadata = {
  title: "مركز التواصل | KAFU AI",
  description:
    "مساحة التواصل الموحدة لإدارة محادثات العملاء والموظفين والذكاء الاصطناعي عبر قنوات KAFU AI.",
};

function CommunicationWorkspaceFallback() {
  return (
    <main
      style={{
        display: "grid",
        minHeight: "60vh",
        placeItems: "center",
        padding: "24px",
      }}
    >
      <p>جارٍ تحميل مركز التواصل...</p>
    </main>
  );
}

export default function CommunicationPage() {
  return (
    <Suspense fallback={<CommunicationWorkspaceFallback />}>
      <CommunicationWorkspace />
    </Suspense>
  );
}
