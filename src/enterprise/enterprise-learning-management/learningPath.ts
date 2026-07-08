export interface LearningPath {
  employeeId: string;
  courses: string[];
  targetSkills: string[];
}

export function hasLearningPath(
  path: LearningPath
): boolean {
  return path.courses.length > 0;
}

export function countTargetSkills(
  path: LearningPath
): number {
  return path.targetSkills.length;
}
