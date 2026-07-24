import {
  redirect,
} from "next/navigation";

import {
  getAuthenticatedUser,
} from "./authenticationAccess";

export async function requireAuthentication(
  redirectPath = "/login",
) {
  const user = await getAuthenticatedUser();

  if (!user) {
    redirect(redirectPath);
  }

  return user;
}

export async function redirectAuthenticatedUser(
  destination = "/company-dashboard",
): Promise<void> {
  const user = await getAuthenticatedUser();

  if (user) {
    redirect(destination);
  }
}
