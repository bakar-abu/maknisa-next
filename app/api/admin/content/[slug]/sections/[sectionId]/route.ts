import { NextResponse } from "next/server";
import { adminApiFetch } from "@/lib/admin-api/server";

type RouteContext = {
  params: Promise<{ slug: string; sectionId: string }>;
};

export async function PUT(request: Request, context: RouteContext) {
  const { slug, sectionId } = await context.params;
  const body = await request.json();
  const response = await adminApiFetch(
    `/api/content/pages/${slug}/sections/${sectionId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );

  const data = await response.json().catch(() => ({}));
  return NextResponse.json(data, { status: response.status });
}
