import { NextResponse } from "next/server";
import { adminApiFetch } from "@/lib/admin-api/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Image file is required." }, { status: 400 });
  }

  const upstream = new FormData();
  upstream.append("file", file);

  const response = await adminApiFetch("/api/media/upload", {
    method: "POST",
    body: upstream,
  });

  const data = await response.json().catch(() => ({}));
  return NextResponse.json(data, { status: response.status });
}
