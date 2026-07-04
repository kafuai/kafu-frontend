import { AIObservabilitySignal } from "./aiObservabilityTypes";

export class AIObservabilityCollector {
  private readonly signals: AIObservabilitySignal[] = [];

  collect(signal: AIObservabilitySignal): void {
    this.signals.push(signal);
  }

  collectMany(signals: AIObservabilitySignal[]): void {
    this.signals.push(...signals);
  }

  getAll(): AIObservabilitySignal[] {
    return [...this.signals];
  }

  clear(): void {
    this.signals.length = 0;
  }

  size(): number {
    return this.signals.length;
  }
}