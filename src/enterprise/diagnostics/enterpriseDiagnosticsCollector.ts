import {
  EnterpriseDiagnosticsReport,
  EnterpriseDiagnosticsSection,
} from "./enterpriseDiagnosticsTypes";

export class EnterpriseDiagnosticsCollector {
  private readonly sections: EnterpriseDiagnosticsSection[] = [];

  addSection(section: EnterpriseDiagnosticsSection): void {
    this.sections.push(section);
  }

  generateReport(): EnterpriseDiagnosticsReport {
    return {
      generatedAt: new Date().toISOString(),
      sections: this.sections,
    };
  }
}