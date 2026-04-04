import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import nodemailer from "nodemailer";
import { connectDB } from "@/lib/db";
import { getRedis } from "@/lib/redis";
import User from "@/models/User";

const schema = z.object({ email: z.string().email() });

export async function POST(req: NextRequest) {
  try {
    const { email } = schema.parse(await req.json());
    await connectDB();

    const user = await User.findOne({ email });
    // Always return 200 to prevent email enumeration
    if (!user) return NextResponse.json({ message: "If that email exists, an OTP was sent." });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const redis = await getRedis();
    await redis.setEx(`OTP:${email}`, 900, otp);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
      to: email,
      from: `"CodeSense AI" <${process.env.EMAIL_USER}>`,
      subject: "Your CodeSense AI Password Reset OTP",
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;background:#0f172a;color:#f8fafc;border-radius:12px">
          <h2 style="color:#22c55e;margin-bottom:8px">Password Reset</h2>
          <p style="color:#94a3b8">Your one-time verification code:</p>
          <div style="font-size:36px;font-weight:700;letter-spacing:8px;color:#f8fafc;margin:24px 0;text-align:center;background:#1e293b;padding:16px;border-radius:8px">${otp}</div>
          <p style="color:#64748b;font-size:13px">Valid for 15 minutes. Do not share this code.</p>
        </div>
      `,
    });

    return NextResponse.json({ message: "If that email exists, an OTP was sent." });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ message: err.errors[0].message }, { status: 400 });
    }
    console.error("[forgot-password]", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
