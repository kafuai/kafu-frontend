export type CrisisTimelineEntry = {
  id: string;
  crisisId: string;
  timestamp: string;
  title: string;
  description: string;
  actor: string;
};

export class CrisisTimeline {
  private readonly entries: CrisisTimelineEntry[] = [];

  add(entry: CrisisTimelineEntry): void {
    this.entries.push(entry);
    this.entries.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  }

  list(crisisId: string): CrisisTimelineEntry[] {
    return this.entries.filter((entry) => entry.crisisId === crisisId);
  }
}