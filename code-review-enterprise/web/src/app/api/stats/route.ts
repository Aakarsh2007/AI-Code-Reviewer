import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

/**
 * Returns aggregate stats for the authenticated user from the AI service.
 */
export async function GET(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const res = await fetch(
      `${process.env.AI_SERVICE_URL}/api/v1/review/history/${user.id}?limit=200`,
      { headers: { Authorization: req.headers.get("authorization") ?? "" } }
    );

    if (!res.ok) return NextResponse.json({ totalReviews: 0, avgScore: 0, totalIssues: 0 });

    const history: any[] = await res.json();

    const totalReviews = history.length;
    const avgScore = totalReviews > 0
      ? Math.round((history.reduce((s, h) => s + (h.ai_response?.code_quality_score ?? 0), 0) / totalReviews) * 10) / 10
      : 0;
    const totalIssues = history.reduce((s, h) => s + (h.ai_response?.issues?.length ?? 0), 0);
    const languageCounts = history.reduce((acc: Record<string, number>, h) => {
      acc[h.language] = (acc[h.language] ?? 0) + 1;
      return acc;
    }, {});

    return NextResponse.json({ totalReviews, avgScore, totalIssues, languageCounts });
  } catch {
    return NextResponse.json({ totalReviews: 0, avgScore: 0, totalIssues: 0, languageCounts: {} });
  }
}
