import { NextResponse } from "next/server";
import { adminApiFetch } from "@/lib/admin-api/server";

type RouteContext = { params: Promise<{ categoryId: string }> };

export async function PUT(request: Request, context: RouteContext) {
  try {
    const { categoryId } = await context.params;
    const body = await request.json();
    const response = await adminApiFetch(`/api/catalog/categories/${categoryId}`, {
      method: "PUT",
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

export async function DELETE(request: Request, context: RouteContext) {
  try {
    const { categoryId } = await context.params;
    const url = new URL(request.url);
    const mode = url.searchParams.get("mode") ?? "category_only";
    const response = await adminApiFetch(
      `/api/catalog/categories/${categoryId}?mode=${mode}`,
      { method: "DELETE" },
    );
    const data = await response.json().catch(() => ({}));
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json(
      { error: "Cannot reach the Maknisa API on port 4000." },
      { status: 503 },
    );
  }
}
