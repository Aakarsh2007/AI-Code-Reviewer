import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const res = await fetch(
    `${process.env.AI_SERVICE_URL}/api/v1/review/history/${params.id}?user_id=${user.id}`,
    {
      method: "DELETE",
      headers: { Authorization: req.headers.get("authorization") ?? "" },
    }
  );

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
