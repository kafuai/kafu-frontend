import { DemoDatasetModel } from "./executiveDemoTypes";

export class DemoDataset {
  constructor(private readonly datasets: DemoDatasetModel[]) {}

  getDatasets(): DemoDatasetModel[] {
    return this.datasets;
  }
}
