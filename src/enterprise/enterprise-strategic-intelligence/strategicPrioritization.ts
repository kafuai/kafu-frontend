import { StrategicOption } from "./strategicOption";

export function prioritizeStrategicOptions(
  options: StrategicOption[],
): StrategicOption[] {
  return [...options].sort((first, second) => second.score - first.score);
}