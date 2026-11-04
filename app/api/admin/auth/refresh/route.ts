import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  ADMIN_ACCESS_TOKEN_COOKIE,
  ADMIN_DASHBOARD_PATH,
  ADMIN_LOGIN_PATH,
  ADMIN_REFRESH_TOKEN_COOKIE,
} from "@/lib/admin-auth/constants";
import {
  ACCESS_TOKEN_MAX_AGE_SECONDS,
  REFRESH_TOKEN_MAX_AGE_SECONDS,
  adminAuthCookieOptions,
} from "@/lib/admin-auth/cookies";
import { getApiBaseUrl } from "@/lib/admin-auth/session";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const next = searchParams.get("next") ?? ADMIN_DASHBOARD_PATH;
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(ADMIN_REFRESH_TOKEN_COOKIE)?.value;

  if (!refreshToken) {
    return NextResponse.redirect(new URL(ADMIN_LOGIN_PATH, request.url));
  }

  try {
    const apiResponse = await fetch(`${getApiBaseUrl()}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
      cache: "no-store",
    });

    if (!apiResponse.ok) {
      return NextResponse.redirect(new URL(ADMIN_LOGIN_PATH, request.url));
    }

    const data = (await apiResponse.json()) as {
      accessToken?: string;
      refreshToken?: string;
    };

    if (!data.accessToken) {
      return NextResponse.redirect(new URL(ADMIN_LOGIN_PATH, request.url));
    }

    const response = NextResponse.redirect(new URL(next, request.url));
    response.cookies.set(
      ADMIN_ACCESS_TOKEN_COOKIE,
      data.accessToken,
      adminAuthCookieOptions(ACCESS_TOKEN_MAX_AGE_SECONDS),
    );

    if (data.refreshToken) {
      response.cookies.set(
        ADMIN_REFRESH_TOKEN_COOKIE,
        data.refreshToken,
        adminAuthCookieOptions(REFRESH_TOKEN_MAX_AGE_SECONDS),
      );
    }

    return response;
  } catch {
    return NextResponse.redirect(new URL(ADMIN_LOGIN_PATH, request.url));
  }
}
