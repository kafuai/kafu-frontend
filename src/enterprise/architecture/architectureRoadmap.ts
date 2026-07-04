export interface ArchitectureRoadmapItem {
  id: string;
  title: string;
  milestone: string;
  targetDate: string;
  completed: boolean;
}

export function getCompletedRoadmapItems(
  items: ArchitectureRoadmapItem[],
): ArchitectureRoadmapItem[] {
  return items.filter((item) => item.completed);
}

export function getPendingRoadmapItems(
  items: ArchitectureRoadmapItem[],
): ArchitectureRoadmapItem[] {
  return items.filter((item) => !item.completed);
}