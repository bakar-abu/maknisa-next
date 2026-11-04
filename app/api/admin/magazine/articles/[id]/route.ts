import { NextResponse } from "next/server";
import { adminApiFetch } from "@/lib/admin-api/server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const response = await adminApiFetch(`/api/magazine/articles/${id}`);
  const data = await response.json().catch(() => ({}));
  return NextResponse.json(data, { status: response.status });
}

export async function PUT(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const body = await request.json();
  const response = await adminApiFetch(`/api/magazine/articles/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  return NextResponse.json(data, { status: response.status });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const response = await adminApiFetch(`/api/magazine/articles/${id}`, {
    method: "DELETE",
  });
  const data = await response.json().catch(() => ({}));
  return NextResponse.json(data, { status: response.status });
}
