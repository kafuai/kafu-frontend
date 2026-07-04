import WorkspaceHeader from "@/components/layout/WorkspaceHeader";
import WorkspaceSidebar from "@/components/layout/WorkspaceSidebar";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50" dir="ltr">
      <div className="mx-auto flex max-w-7xl gap-6 px-6 py-8">
        <WorkspaceSidebar />

        <main className="min-w-0 flex-1" dir="rtl">
          <div className="space-y-8">
            <WorkspaceHeader />
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}