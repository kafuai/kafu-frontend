import type {
  LearningProfile,
  LearningStatus,
} from "./learningTypes";

export function createLearningProfile(
  profile: LearningProfile
): LearningProfile {
  return {
    ...profile,
    updatedAt: new Date().toISOString(),
  };
}

export function updateLearningStatus(
  profile: LearningProfile,
  status: LearningStatus
): LearningProfile {
  return {
    ...profile,
    status,
    updatedAt: new Date().toISOString(),
  };
}

export function isLearningActive(
  profile: LearningProfile
): boolean {
  return profile.status === "active";
}
