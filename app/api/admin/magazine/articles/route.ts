import { NextResponse } from "next/server";
import { adminApiFetch } from "@/lib/admin-api/server";

export async function GET() {
  try {
    const response = await adminApiFetch("/api/magazine/articles");
    const data = await response.json().catch(() => ({}));
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json(
      {
        error:
          "Cannot reach the Maknisa API. Start maknisa-backend with npm run dev on port 4000.",
      },
      { status: 503 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const response = await adminApiFetch("/api/magazine/articles", {
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
