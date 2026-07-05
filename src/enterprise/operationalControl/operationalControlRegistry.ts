import type { OperationalControl } from "./operationalControl";

export class OperationalControlRegistry {
  private readonly controls = new Map<string, OperationalControl>();

  register(control: OperationalControl): void {
    this.controls.set(control.id, control);
  }

  getById(id: string): OperationalControl | undefined {
    return this.controls.get(id);
  }

  list(): readonly OperationalControl[] {
    return Array.from(this.controls.values());
  }

  listActive(): readonly OperationalControl[] {
    return this.list().filter(
      (control) => control.status === "active",
    );
  }

  listBlocking(): readonly OperationalControl[] {
    return this.list().filter(isBlockingControl);
  }

  clear(): void {
    this.controls.clear();
  }
}

function isBlockingControl(
  control: OperationalControl,
): boolean {
  return (
    control.status === "blocked" ||
    control.severity === "critical"
  );
}