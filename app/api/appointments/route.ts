import { NextResponse } from "next/server";
import { getApiBaseUrl } from "@/lib/admin-auth/session";
import type { AppointmentFormData } from "@/lib/appointment";

function sourcePathFromRequest(request: Request): string {
  try {
    const referer = request.headers.get("referer");
    if (!referer) return "";
    return new URL(referer).pathname;
  } catch {
    return "";
  }
}

function isNonEmpty(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validateBody(body: unknown): AppointmentFormData | null {
  if (!body || typeof body !== "object") return null;

  const data = body as Partial<AppointmentFormData>;

  if (
    !isNonEmpty(data.firstName) ||
    !isNonEmpty(data.lastName) ||
    !isNonEmpty(data.email) ||
    !isNonEmpty(data.phone) ||
    !isNonEmpty(data.showroom) ||
    !isNonEmpty(data.service)
  ) {
    return null;
  }

  if (!isValidEmail(data.email.trim())) return null;

  return {
    firstName: data.firstName.trim(),
    lastName: data.lastName.trim(),
    email: data.email.trim(),
    phone: data.phone.trim(),
    showroom: data.showroom.trim(),
    service: data.service.trim(),
    preferredDate: typeof data.preferredDate === "string" ? data.preferredDate : "",
    message: typeof data.message === "string" ? data.message.trim() : "",
  };
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const appointment = validateBody(body);
  if (!appointment) {
    return NextResponse.json(
      { error: "Please complete all required fields with valid details." },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(`${getApiBaseUrl()}/api/leads/public/appointments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...appointment,
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
