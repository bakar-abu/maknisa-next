import { NextResponse } from "next/server";
import {
  ADMIN_ACCESS_TOKEN_COOKIE,
  ADMIN_REFRESH_TOKEN_COOKIE,
} from "@/lib/admin-auth/constants";
import {
  ACCESS_TOKEN_MAX_AGE_SECONDS,
  REFRESH_TOKEN_MAX_AGE_SECONDS,
  adminAuthCookieOptions,
} from "@/lib/admin-auth/cookies";
import { getApiBaseUrl } from "@/lib/admin-auth/session";

type LoginBody = {
  identifier?: string;
  password?: string;
};

export async function POST(request: Request) {
  let body: LoginBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const identifier = body.identifier?.trim() ?? "";
  const password = body.password ?? "";

  if (!identifier || !password) {
    return NextResponse.json(
      { error: "Username or mobile and password are required." },
      { status: 400 },
    );
  }

  try {
    const apiResponse = await fetch(`${getApiBaseUrl()}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, password }),
      cache: "no-store",
    });

    const data = (await apiResponse.json().catch(() => ({}))) as {
      accessToken?: string;
      refreshToken?: string;
      error?: string;
    };

    if (!apiResponse.ok) {
      return NextResponse.json(
        { error: data.error ?? "Invalid username or password." },
        { status: apiResponse.status === 401 ? 401 : 400 },
      );
    }

    if (!data.accessToken) {
      return NextResponse.json(
        { error: "Login response was invalid." },
        { status: 502 },
      );
    }

    const response = NextResponse.json({ ok: true });
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
    return NextResponse.json(
      { error: "Unable to reach the authentication server." },
      { status: 503 },
    );
  }
}
