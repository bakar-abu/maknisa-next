import { cookies } from "next/headers";
import { ADMIN_ACCESS_TOKEN_COOKIE } from "@/lib/admin-auth/constants";
import { getApiBaseUrl } from "@/lib/admin-auth/session";

export async function getAdminAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_ACCESS_TOKEN_COOKIE)?.value ?? null;
}

export async function adminApiFetch(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  const token = await getAdminAccessToken();

  if (!token) {
    return new Response(JSON.stringify({ error: "Authentication required." }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const headers = new Headers(init?.headers);
  headers.set("Authorization", `Bearer ${token}`);

  return fetch(`${getApiBaseUrl()}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });
}
