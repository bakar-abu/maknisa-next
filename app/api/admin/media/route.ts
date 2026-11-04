import { NextResponse } from "next/server";
import { adminApiFetch } from "@/lib/admin-api/server";

export async function GET() {
  const response = await adminApiFetch("/api/media");
  const data = await response.json().catch(() => ({}));
  return NextResponse.json(data, { status: response.status });
}
