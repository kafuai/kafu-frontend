export interface LearningProgram {
  id: string;
  name: string;
  objectives: string[];
  duration: number;
  active: boolean;
}

export function activateLearningProgram(
  program: LearningProgram
): LearningProgram {
  return {
    ...program,
    active: true,
  };
}

export function hasLearningObjectives(
  program: LearningProgram
): boolean {
  return program.objectives.length > 0;
}
