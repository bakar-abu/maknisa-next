import { NextResponse } from "next/server";
import { adminApiFetch } from "@/lib/admin-api/server";

export async function GET() {
  try {
    const response = await adminApiFetch("/api/leads/catalogue-requests");
    const data = await response.json().catch(() => ({}));
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json(
      { error: "Cannot reach the Maknisa API on port 4000." },
      { status: 503 },
    );
  }
}
