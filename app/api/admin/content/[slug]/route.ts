import { NextResponse } from "next/server";
import { adminApiFetch } from "@/lib/admin-api/server";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const response = await adminApiFetch(`/api/content/pages/${slug}`);

  const data = await response.json().catch(() => ({}));
  return NextResponse.json(data, { status: response.status });
}
