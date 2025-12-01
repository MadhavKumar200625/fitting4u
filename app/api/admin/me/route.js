import jwt from "jsonwebtoken";
import Admin from "@/models/Admin";
import dbConnect from "@/lib/dbConnect";

export async function GET(req) {
  await dbConnect();

  const token = req.headers.get("authorization")?.split(" ")[1];

  if (!token) {
    return Response.json({ success: false }, { status: 401 });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await Admin.findById(payload.id);

    if (!admin || !admin.isActive) {
      return Response.json({ success: false }, { status: 401 });
    }

    return Response.json({
      success: true,
      admin: {
        name: admin.name,
        role: admin.role,
        allowedRoutes: admin.allowedRoutes,
      },
    });

  } catch {
    return Response.json({ success: false }, { status: 401 });
  }
}