import jwt from "jsonwebtoken";
import dbConnect from "@/lib/dbConnect";
import Admin from "@/models/Admin";
import crypto from "crypto";

export async function POST(req) {
  await dbConnect();

  const { adminId, otp } = await req.json();

  const admin = await Admin.findById(adminId).select("+otpHash +otpExpiresAt");
  if (!admin || !admin.isActive) {
    return Response.json({ success: false });
  }

  const submittedHash = crypto.createHash("sha256")
    .update(`${admin.email}:${otp}:${process.env.JWT_SECRET || "dev-temp-secret"}`)
    .digest("hex");
  if (!/^\d{6}$/.test(otp || "") || !admin.otpHash || admin.otpExpiresAt < new Date() || admin.otpHash !== submittedHash) {
    return Response.json({ success: false, error: "Invalid or expired OTP" }, { status: 400 });
  }

  admin.otpHash = undefined;
  admin.otpExpiresAt = undefined;
  await admin.save();

  const token = jwt.sign(
    {
      id: admin._id,
      name: admin.name,
      role: admin.role,
      routes: admin.allowedRoutes || [],
    },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );

  return Response.json({
    success: true,
    token,
  });
}
