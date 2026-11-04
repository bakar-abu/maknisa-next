import { NextResponse } from "next/server";
import { getApiBaseUrl } from "@/lib/admin-auth/session";

function sourcePathFromRequest(request: Request): string {
  try {
    const referer = request.headers.get("referer");
    if (!referer) return "";
    return new URL(referer).pathname;
  } catch {
    return "";
  }
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  try {
    const response = await fetch(`${getApiBaseUrl()}/api/leads/public/product-orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...(body as Record<string, unknown>),
        sourcePath: sourcePathFromRequest(request),
      }),
      cache: "no-store",
    });

    const data = await response.json().catch(() => ({}));
    return NextResponse.json(data.ok ? { ok: true } : data, { status: response.status });
  } catch {
    return NextResponse.json(
      { error: "Unable to reach the submission server." },
      { status: 503 },
    );
  }
}
