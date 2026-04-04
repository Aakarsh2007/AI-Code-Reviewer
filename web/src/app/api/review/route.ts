import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifyToken } from "@/lib/auth";
import { rateLimit } from "@/lib/rateLimit";

const schema = z.object({
  code: z.string().min(1).max(50000),
  language: z.enum(["javascript", "typescript", "python", "java", "cpp", "c", "go", "rust", "csharp"]),
});

export async function POST(req: NextRequest) {
  // Rate limit: 5 requests per 15 minutes per user
  const limited = await rateLimit(req, { max: 5, windowMs: 15 * 60 * 1000 });
  if (limited) return limited;

  const user = verifyToken(req);
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const body = schema.parse(await req.json());

    const aiRes = await fetch(`${process.env.AI_SERVICE_URL}/api/v1/review/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: req.headers.get("authorization") ?? "",
      },
      body: JSON.stringify({ ...body, user_id: user.id }),
    });

    if (!aiRes.ok) {
      const err = await aiRes.json().catch(() => ({}));
      return NextResponse.json(
        { message: err.detail ?? "AI service error" },
        { status: aiRes.status }
      );
    }

    const data = await aiRes.json();
    return NextResponse.json(data);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ message: err.errors[0].message }, { status: 400 });
    }
    console.error("[review]", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
