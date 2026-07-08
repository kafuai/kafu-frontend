export interface EmployeeEngagement {
  employeeId: string;
  level: "low" | "medium" | "high" | "excellent";
  feedbackScore: number;
}

export function isHighlyEngaged(
  engagement: EmployeeEngagement
): boolean {
  return (
    engagement.level === "high" ||
    engagement.level === "excellent"
  );
}
