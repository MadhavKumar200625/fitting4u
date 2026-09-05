import crypto from "crypto";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Boutique from "@/models/boutiqueSchema";

export const runtime = "nodejs";

const otpHash = (email, otp) =>
  crypto.createHash("sha256").update(`${email}:${otp}:${process.env.JWT_SECRET || "dev-temp-secret"}`).digest("hex");

export async function POST(req) {
  try {
    const { email, otp } = await req.json();
    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedEmail || !/^\d{6}$/.test(otp || "")) {
      return NextResponse.json({ success: false, message: "Email and a 6-digit OTP are required" }, { status: 400 });
    }

    await dbConnect();
    const user = await User.findOne({ email: normalizedEmail }).select("+otpHash +otpExpiresAt");
    const submittedHash = otpHash(normalizedEmail, otp);

    if (!user || !user.otpHash || !user.otpExpiresAt || user.otpExpiresAt < new Date() || user.otpHash !== submittedHash) {
      return NextResponse.json({ success: false, message: "Invalid or expired OTP" }, { status: 400 });
    }

    user.otpHash = undefined;
    user.otpExpiresAt = undefined;
    // A boutique is identified by the email configured on its boutique record.
    // Do not use phone numbers here: customer phone numbers are optional and are
    // not a reliable boutique identity.
    const isBoutique = Boolean(
      await Boutique.exists({ email: normalizedEmail })
    );

    user.emailVerifiedAt = new Date();
    user.lastLogin = new Date();
    user.deviceInfo = "website";
    user.userType = isBoutique ? "boutique" : "customer";
    await user.save();

    const token = jwt.sign(
      { email: normalizedEmail, isBoutique },
      process.env.JWT_SECRET || "dev-temp-secret",
      { expiresIn: "180d" }
    );
    return NextResponse.json({
      success: true,
      token,
      isBoutique,
      user: { email: user.email, name: user.name, phone: user.phone, userType: user.userType },
    });
  } catch (error) {
    console.error("VERIFY EMAIL OTP ERROR:", error);
    return NextResponse.json({ success: false, message: "Could not verify OTP. Please try again." }, { status: 500 });
  }
}
