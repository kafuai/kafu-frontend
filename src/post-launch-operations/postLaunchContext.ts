import { PostLaunchRecord } from "./postLaunchTypes";

export interface PostLaunchContext {
  postLaunch: PostLaunchRecord;
  successObjectives: string[];
  customerFeedback: string[];
  operationalIssues: string[];
  followUpActions: string[];
  notes: string[];
}
