import { StrategicOption } from "./strategicOption";

export function scoreStrategicOption(option: StrategicOption): number {
  return Math.max(0, Math.min(option.score, 100));
}

export function scoreStrategicOptions(
  options: StrategicOption[],
): StrategicOption[] {
  return options.map((option) => ({
    ...option,
    score: scoreStrategicOption(option),
  }));
}