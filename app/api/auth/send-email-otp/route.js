import crypto from "crypto";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { sendOtpEmail } from "@/lib/mailer";

export const runtime = "nodejs";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const otpHash = (email, otp) =>
  crypto.createHash("sha256").update(`${email}:${otp}:${process.env.JWT_SECRET || "dev-temp-secret"}`).digest("hex");

export async function POST(req) {
  try {
    const { email } = await req.json();
    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedEmail || !emailPattern.test(normalizedEmail)) {
      return NextResponse.json({ success: false, message: "A valid email address is required" }, { status: 400 });
    }

    await dbConnect();
    const otp = crypto.randomInt(100000, 1000000).toString();

    await User.findOneAndUpdate(
      { email: normalizedEmail },
      {
        $set: {
          email: normalizedEmail,
          otpHash: otpHash(normalizedEmail, otp),
          otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    await sendOtpEmail(normalizedEmail, otp);
    return NextResponse.json({ success: true, message: "OTP sent to your email" });
  } catch (error) {
    console.error("SEND EMAIL OTP ERROR:", error);
    const isConfigurationError = error.message?.includes("SMTP_");
    return NextResponse.json(
      { success: false, message: isConfigurationError ? "Email service is not configured" : "Could not send OTP. Please try again." },
      { status: 500 }
    );
  }
}
