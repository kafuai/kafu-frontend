export type OrganizationRole =
  | "owner"
  | "admin"
  | "manager"
  | "member"
  | "viewer";

export interface AuthenticationProfile {
  readonly id: string;
  readonly fullName: string | null;
  readonly email: string | null;
  readonly avatarUrl: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface AuthenticationOrganization {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly createdAt: string;
}

export interface AuthenticationMembership {
  readonly id: string;
  readonly organizationId: string;
  readonly userId: string;
  readonly role: OrganizationRole;
  readonly createdAt: string;
}

export interface AuthenticationWorkspaceIdentity {
  readonly profile: AuthenticationProfile;
  readonly organization: AuthenticationOrganization | null;
  readonly membership: AuthenticationMembership | null;
}
