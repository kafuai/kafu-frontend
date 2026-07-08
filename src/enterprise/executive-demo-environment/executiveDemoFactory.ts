import { ExecutiveDemoModel } from "./executiveDemoTypes";
import { DemoEnvironment } from "./demoEnvironment";
import { DemoScenario } from "./demoScenario";
import { DemoDataset } from "./demoDataset";
import { DemoJourney } from "./demoJourney";
import { DemoPresentation } from "./demoPresentation";
import { DemoWorkspace } from "./demoWorkspace";
import { DemoMetrics } from "./demoMetrics";
import { DemoConfiguration } from "./demoConfiguration";
import { DemoValidation } from "./demoValidation";

export class ExecutiveDemoFactory {
  static create(demo: ExecutiveDemoModel) {
    return {
      environment: new DemoEnvironment(demo),
      scenarios: new DemoScenario(demo.scenarios),
      datasets: new DemoDataset(demo.datasets),
      journey: new DemoJourney(demo),
      presentation: new DemoPresentation(demo),
      workspace: new DemoWorkspace(demo),
      metrics: new DemoMetrics(demo),
      configuration: new DemoConfiguration(demo),
      validation: new DemoValidation(demo),
    };
  }
}
