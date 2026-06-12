import { NextResponse } from "next/server";
import type { AppointmentFormData } from "@/lib/appointment";

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

  // Ready to wire to email, CRM, or database — logged for now.
  console.info("[appointment-request]", {
    ...appointment,
    receivedAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}
