import type {
  Session,
  User,
} from "@supabase/supabase-js";

export type AuthenticationStatus =
  | "authenticated"
  | "unauthenticated"
  | "loading";

export interface AuthenticationIdentity {
  readonly user: User;
  readonly session: Session;
}

export interface AuthenticationCredentials {
  readonly email: string;
  readonly password: string;
}

export interface AuthenticationRegistrationInput
  extends AuthenticationCredentials {
  readonly fullName?: string;
  readonly companyName?: string;
}

export interface AuthenticationResult {
  readonly identity: AuthenticationIdentity | null;
  readonly requiresEmailConfirmation: boolean;
}
