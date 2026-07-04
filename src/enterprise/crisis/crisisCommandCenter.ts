import { Crisis } from "./crisisTypes";
import { CrisisPlan } from "./crisisPlan";
import { CrisisResponseTeam } from "./crisisResponseTeam";

export type CrisisCommandCenter = {
  crisis: Crisis;
  plan: CrisisPlan;
  responseTeam: CrisisResponseTeam;
  activatedAt: string;
  commanderId: string;
};

export function activateCrisisCommandCenter(
  crisis: Crisis,
  plan: CrisisPlan,
  responseTeam: CrisisResponseTeam,
  commanderId: string,
): CrisisCommandCenter {
  return {
    crisis,
    plan,
    responseTeam,
    activatedAt: new Date().toISOString(),
    commanderId,
  };
}