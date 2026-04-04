import { NextRequest, NextResponse } from "next/server";
import { getRedis } from "./redis";

interface Options {
  max: number;
  windowMs: number;
}

export async function rateLimit(
  req: NextRequest,
  { max, windowMs }: Options
): Promise<NextResponse | null> {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  const key = `rl:${req.nextUrl.pathname}:${ip}`;

  try {
    const redis = await getRedis();
    const current = await redis.incr(key);
    if (current === 1) {
      await redis.pExpire(key, windowMs);
    }
    if (current > max) {
      return NextResponse.json(
        { message: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil(windowMs / 1000)),
            "X-RateLimit-Limit": String(max),
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }
  } catch {
    // Fail open — don't block requests if Redis is down
  }

  return null;
}
