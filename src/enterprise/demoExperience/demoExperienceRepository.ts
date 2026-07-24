import type {
  DemoExperience,
  DemoExperienceSession,
} from "./demoExperienceTypes";

export interface DemoExperienceRepository {
  getExperienceById(
    experienceId: string,
  ): Promise<DemoExperience | null>;

  getExperienceByKey(
    experienceKey: string,
  ): Promise<DemoExperience | null>;

  listExperiences():
    Promise<readonly DemoExperience[]>;

  saveExperience(
    experience: DemoExperience,
  ): Promise<DemoExperience>;

  getSession(
    sessionId: string,
  ): Promise<DemoExperienceSession | null>;

  createSession(
    session: DemoExperienceSession,
  ): Promise<DemoExperienceSession>;

  updateSession(
    session: DemoExperienceSession,
  ): Promise<DemoExperienceSession>;
}
