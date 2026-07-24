import type {
  AuthenticationCredentials,
  AuthenticationIdentity,
  AuthenticationRegistrationInput,
  AuthenticationResult,
} from "./authenticationTypes";

export interface AuthenticationService {
  signIn(
    credentials: AuthenticationCredentials,
  ): Promise<AuthenticationIdentity>;

  signUp(
    input: AuthenticationRegistrationInput,
  ): Promise<AuthenticationResult>;

  resendConfirmationEmail(
    email: string,
    redirectTo: string,
  ): Promise<void>;

  signOut(): Promise<void>;

  getIdentity(): Promise<AuthenticationIdentity | null>;

  requestPasswordReset(
    email: string,
    redirectTo: string,
  ): Promise<void>;

  updatePassword(
    password: string,
  ): Promise<void>;
}
