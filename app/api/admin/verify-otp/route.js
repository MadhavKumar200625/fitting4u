import jwt from "jsonwebtoken";
import dbConnect from "@/lib/dbConnect";
import Admin from "@/models/Admin";

/* You will verify OTP on client via Firebase itself.
   This API executes AFTER successful OTP confirmation
*/

export async function POST(req) {
  await dbConnect();

  const { adminId } = await req.json();

  const admin = await Admin.findById(adminId);
  if (!admin || !admin.isActive) {
    return Response.json({ success: false });
  }

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