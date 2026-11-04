import { cookies } from "next/headers";
import {
  ADMIN_ACCESS_TOKEN_COOKIE,
  ADMIN_REFRESH_TOKEN_COOKIE,
} from "./constants";
import { isAccessTokenValid, isRefreshTokenPresent } from "./tokens";

export type AdminSession = {
  isAuthenticated: boolean;
  hasRefreshToken: boolean;
};

/** Checks access token validity and whether a refresh token cookie is present. */
export async function getAdminSession(): Promise<AdminSession> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ADMIN_ACCESS_TOKEN_COOKIE)?.value;
  const refreshToken = cookieStore.get(ADMIN_REFRESH_TOKEN_COOKIE)?.value;

  return {
    isAuthenticated: isAccessTokenValid(accessToken),
    hasRefreshToken: isRefreshTokenPresent(refreshToken),
  };
}

export function getApiBaseUrl(): string {
  return process.env.MAKNISA_API_URL ?? "http://localhost:4000";
}
