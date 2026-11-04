import { cookies } from "next/headers";
import { ADMIN_ACCESS_TOKEN_COOKIE } from "./constants";
import type { AdminUser } from "./types";
import { isAccessTokenValid } from "./tokens";

export type { AdminUser } from "./types";

type AdminJwtPayload = {
  sub?: string;
  email?: string;
  username?: string;
  role?: string;
  type?: string;
};

function decodeAdminJwtPayload(token: string): AdminJwtPayload | null {
  const parts = token.split(".");
  if (parts.length < 2) return null;

  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "=",
    );
    const json = Buffer.from(padded, "base64").toString("utf8");
    return JSON.parse(json) as AdminJwtPayload;
  } catch {
    return null;
  }
}

export async function getAdminUser(): Promise<AdminUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_ACCESS_TOKEN_COOKIE)?.value;

  if (!isAccessTokenValid(token) || !token) return null;

  const payload = decodeAdminJwtPayload(token);
  if (!payload?.sub || payload.type !== "access") return null;

  return {
    id: payload.sub,
    email: payload.email ?? "",
    username: payload.username ?? "Admin",
    role: payload.role ?? "viewer",
  };
}
