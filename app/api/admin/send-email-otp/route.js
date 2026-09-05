import crypto from "crypto";
import dbConnect from "@/lib/dbConnect";
import Admin from "@/models/Admin";
import { sendOtpEmail } from "@/lib/mailer";

export const runtime = "nodejs";

const otpHash = (email, otp) => crypto.createHash("sha256")
  .update(`${email}:${otp}:${process.env.JWT_SECRET || "dev-temp-secret"}`)
  .digest("hex");

export async function POST(req) {
  try {
    const { adminId } = await req.json();
    await dbConnect();
    const admin = await Admin.findOne({ _id: adminId, isActive: true });
    if (!admin?.email) return Response.json({ success: false, error: "Admin email is not configured" }, { status: 400 });

    const otp = crypto.randomInt(100000, 1000000).toString();
    admin.otpHash = otpHash(admin.email, otp);
    admin.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await admin.save();
    await sendOtpEmail(admin.email, otp);
    return Response.json({ success: true });
  } catch (error) {
    console.error("SEND ADMIN EMAIL OTP ERROR:", error);
    return Response.json({ success: false, error: "Could not send OTP" }, { status: 500 });
  }
}
