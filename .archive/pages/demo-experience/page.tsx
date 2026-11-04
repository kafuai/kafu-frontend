import DemoExperienceController from "../../components/demo-experience/DemoExperienceController";
import {
  enterpriseDemoExperience,
} from "../../src/enterprise/demoExperience/enterpriseDemoExperienceCatalog";

export default function DemoExperiencePage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <DemoExperienceController
          experience={enterpriseDemoExperience}
        />
      </div>
    </main>
  );
}
