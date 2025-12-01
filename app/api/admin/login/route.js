import dbConnect from "@/lib/dbConnect";
import Admin from "@/models/Admin";
import jwt from "jsonwebtoken";

export async function POST(req) {
  await dbConnect();

  const { name, password } = await req.json();

  // 1️⃣ Find admin
  const admin = await Admin.findOne({ name, isActive: true });

  if (!admin) {
    return Response.json({ success: false, error: "User not found" }, { status: 401 });
  }

  // 2️⃣ Password verify
  const validPass = await admin.comparePassword(password);
  if (!validPass) {
    admin.loginLogs.push({ success: false });
    await admin.save();
    return Response.json({ success: false, error: "Wrong password" }, { status: 401 });
  }

  // 3️⃣ Token generator
  const token = jwt.sign(
    {
      id: admin._id,
      name: admin.name,
      role: admin.role,
      routes: admin.allowedRoutes || [],
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  // ✅ Update logs
  admin.loginLogs.push({ success: true });
  admin.lastLoginAt = new Date();
  await admin.save();

  // 4️⃣ SUPER ADMIN – no OTP
  if (admin.role === "SUPER_ADMIN") {
    return Response.json({
      success: true,
      role: "SUPER_ADMIN",
      token
    });
  }

  // 5️⃣ SUB ADMIN – OTP required
  return Response.json({
  success: true,
  role: "SUB_ADMIN",
  requiresOtp: true,
  adminId: admin._id,
  phone: admin.phone   // ✅ REQUIRED
});
}