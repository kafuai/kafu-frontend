export type CrisisTeamMember = {
  userId: string;
  name: string;
  role: string;
  email?: string;
  phone?: string;
  primary: boolean;
};

export type CrisisResponseTeam = {
  id: string;
  organizationId: string;
  name: string;
  members: CrisisTeamMember[];
};