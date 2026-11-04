import { NextResponse } from "next/server";
import { adminApiFetch } from "@/lib/admin-api/server";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const response = await adminApiFetch(`/api/catalog/services/${id}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await response.json().catch(() => ({}));
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json(
      { error: "Cannot reach the Maknisa API on port 4000." },
      { status: 503 },
    );
  }
}
