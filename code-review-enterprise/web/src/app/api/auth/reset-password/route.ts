import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { getRedis } from "@/lib/redis";
import User from "@/models/User";

const schema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
  password: z.string().min(8),
});

export async function POST(req: NextRequest) {
  try {
    const { email, otp, password } = schema.parse(await req.json());
    const redis = await getRedis();

    const cached = await redis.get(`OTP:${email}`);
    if (!cached || cached !== otp) {
      return NextResponse.json({ message: "Invalid or expired OTP" }, { status: 400 });
    }

    await connectDB();
    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    user.password = await bcrypt.hash(password, 12);
    await user.save();
    await redis.del(`OTP:${email}`);

    return NextResponse.json({ message: "Password reset successfully" });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ message: err.errors[0].message }, { status: 400 });
    }
    console.error("[reset-password]", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
