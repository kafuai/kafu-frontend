import type {
  SupabaseClient,
} from "@supabase/supabase-js";

import {
  clearCurrentCompanyId,
} from "../../../lib/companySession";
import {
  resolveWorkspaceIdentity,
} from "../../../lib/workspace-identity/tenantResolver";

import type {
  AuthenticationService,
} from "./authenticationService";
import type {
  AuthenticationCredentials,
  AuthenticationIdentity,
  AuthenticationRegistrationInput,
  AuthenticationResult,
} from "./authenticationTypes";

export class SupabaseAuthenticationService
  implements AuthenticationService {
  constructor(
    private readonly client: SupabaseClient,
  ) {}

  async signIn(
    credentials: AuthenticationCredentials,
  ): Promise<AuthenticationIdentity> {
    clearCurrentCompanyId();

    const { data, error } =
      await this.client.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

    if (error) {
      throw error;
    }

    if (!data.user || !data.session) {
      throw new Error(
        "Authentication session was not created.",
      );
    }

    try {
      await resolveWorkspaceIdentity(this.client);
    } catch (workspaceError) {
      await this.client.auth.signOut();
      clearCurrentCompanyId();

      throw workspaceError;
    }

    return {
      user: data.user,
      session: data.session,
    };
  }

  async signUp(
    input: AuthenticationRegistrationInput,
  ): Promise<AuthenticationResult> {
    clearCurrentCompanyId();

    const { data, error } =
      await this.client.auth.signUp({
        email: input.email,
        password: input.password,
        options: {
          data: {
            full_name: input.fullName,
            company_name: input.companyName,
          },
        },
      });

    if (error) {
      throw error;
    }

    const identity =
      data.user && data.session
        ? {
            user: data.user,
            session: data.session,
          }
        : null;

    if (identity) {
      try {
        await resolveWorkspaceIdentity(this.client);
      } catch (workspaceError) {
        await this.client.auth.signOut();
        clearCurrentCompanyId();

        throw workspaceError;
      }
    }

    return {
      identity,
      requiresEmailConfirmation:
        Boolean(data.user) && !data.session,
    };
  }

  async resendConfirmationEmail(
    email: string,
    redirectTo: string,
  ): Promise<void> {
    const { error } =
      await this.client.auth.resend({
        type: "signup",
        email,
        options: {
          emailRedirectTo: redirectTo,
        },
      });

    if (error) {
      throw error;
    }
  }

  async signOut(): Promise<void> {
    clearCurrentCompanyId();

    const { error } =
      await this.client.auth.signOut();

    if (error) {
      throw error;
    }
  }

  async getIdentity(): Promise<AuthenticationIdentity | null> {
    const {
      data: userData,
      error: userError,
    } = await this.client.auth.getUser();

    if (userError || !userData.user) {
      clearCurrentCompanyId();
      return null;
    }

    const {
      data: sessionData,
      error: sessionError,
    } = await this.client.auth.getSession();

    if (
      sessionError ||
      !sessionData.session
    ) {
      clearCurrentCompanyId();
      return null;
    }

    return {
      user: userData.user,
      session: sessionData.session,
    };
  }

  async requestPasswordReset(
    email: string,
    redirectTo: string,
  ): Promise<void> {
    const { error } =
      await this.client.auth.resetPasswordForEmail(
        email,
        {
          redirectTo,
        },
      );

    if (error) {
      throw error;
    }
  }

  async updatePassword(
    password: string,
  ): Promise<void> {
    const { error } =
      await this.client.auth.updateUser({
        password,
      });

    if (error) {
      throw error;
    }
  }
}
