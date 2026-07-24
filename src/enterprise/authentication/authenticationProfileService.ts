import type {
  SupabaseClient,
} from "@supabase/supabase-js";

import type {
  AuthenticationMembership,
  AuthenticationOrganization,
  AuthenticationProfile,
  AuthenticationWorkspaceIdentity,
} from "./authenticationProfileTypes";

interface ProfileRow {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

interface MembershipRow {
  id: string;
  organization_id: string;
  user_id: string;
  role:
    | "owner"
    | "admin"
    | "manager"
    | "member"
    | "viewer";
  created_at: string;
  organizations:
    | {
        id: string;
        name: string;
        slug: string;
        created_at: string;
      }
    | {
        id: string;
        name: string;
        slug: string;
        created_at: string;
      }[]
    | null;
}

function mapProfile(
  row: ProfileRow,
): AuthenticationProfile {
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    avatarUrl: row.avatar_url,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function resolveOrganization(
  row: MembershipRow,
): AuthenticationOrganization | null {
  const organization = Array.isArray(row.organizations)
    ? row.organizations[0] ?? null
    : row.organizations;

  if (!organization) {
    return null;
  }

  return {
    id: organization.id,
    name: organization.name,
    slug: organization.slug,
    createdAt: organization.created_at,
  };
}

function mapMembership(
  row: MembershipRow,
): AuthenticationMembership {
  return {
    id: row.id,
    organizationId: row.organization_id,
    userId: row.user_id,
    role: row.role,
    createdAt: row.created_at,
  };
}

export class AuthenticationProfileService {
  constructor(
    private readonly client: SupabaseClient,
  ) {}

  async getWorkspaceIdentity(
    userId: string,
  ): Promise<AuthenticationWorkspaceIdentity | null> {
    const {
      data: profile,
      error: profileError,
    } = await this.client
      .from("profiles")
      .select(
        "id, full_name, email, avatar_url, created_at, updated_at",
      )
      .eq("id", userId)
      .maybeSingle<ProfileRow>();

    if (profileError) {
      throw profileError;
    }

    if (!profile) {
      return null;
    }

    const {
      data: membership,
      error: membershipError,
    } = await this.client
      .from("organization_memberships")
      .select(
        `
          id,
          organization_id,
          user_id,
          role,
          created_at,
          organizations (
            id,
            name,
            slug,
            created_at
          )
        `,
      )
      .eq("user_id", userId)
      .order("created_at", {
        ascending: true,
      })
      .limit(1)
      .maybeSingle<MembershipRow>();

    if (membershipError) {
      throw membershipError;
    }

    return {
      profile: mapProfile(profile),
      organization: membership
        ? resolveOrganization(membership)
        : null,
      membership: membership
        ? mapMembership(membership)
        : null,
    };
  }
}
