import { NextResponse } from "next/server";
import { getApiBaseUrl } from "@/lib/admin-auth/session";
import {
  getCustomizeFieldsForService,
  resolveCustomizeService,
  type CustomizeOrderFormData,
} from "@/lib/customize-order";

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

function validateBody(body: unknown): CustomizeOrderFormData | null {
  if (!body || typeof body !== "object") return null;

  const data = body as Partial<CustomizeOrderFormData>;

  if (
    !isNonEmpty(data.firstName) ||
    !isNonEmpty(data.lastName) ||
    !isNonEmpty(data.email) ||
    !isNonEmpty(data.phone) ||
    !isNonEmpty(data.service) ||
    !isNonEmpty(data.showroom)
  ) {
    return null;
  }

  if (!isValidEmail(data.email.trim())) return null;
  if (!resolveCustomizeService(data.service)) return null;

  const details =
    data.details && typeof data.details === "object" ? data.details : {};

  for (const field of getCustomizeFieldsForService(data.service)) {
    if (field.required && !isNonEmpty(details[field.id])) {
      return null;
    }
  }

  return {
    firstName: data.firstName.trim(),
    lastName: data.lastName.trim(),
    email: data.email.trim(),
    phone: data.phone.trim(),
    service: data.service.trim(),
    showroom: data.showroom.trim(),
    category: typeof data.category === "string" ? data.category.trim() : "",
    product: typeof data.product === "string" ? data.product.trim() : "",
    budgetRange: typeof data.budgetRange === "string" ? data.budgetRange.trim() : "",
    message: typeof data.message === "string" ? data.message.trim() : "",
    details: Object.fromEntries(
      Object.entries(details).map(([key, value]) => [
        key,
        typeof value === "string" ? value.trim() : "",
      ]),
    ),
  };
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const order = validateBody(body);
  if (!order) {
    return NextResponse.json(
      { error: "Please complete all required fields for your selected service." },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(`${getApiBaseUrl()}/api/leads/public/customize-orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...order,
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
