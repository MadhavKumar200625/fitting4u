import dbConnect from "@/lib/dbConnect";
import Admin from "@/models/Admin";
import { requireAdmin } from "@/lib/adminAuth";

export async function GET(req) {
  const result = await requireAdmin(req, ["SUPER_ADMIN"]);
  if (!result) {
    return Response.json({ success: false, error: "Forbidden" }, { status: 403 });
  }

  await dbConnect();
  const admins = await Admin.find({}, "-passwordHash -loginLogs").sort({ createdAt: -1 });

  return Response.json({ success: true, admins });
}

export async function POST(req) {
  const result = await requireAdmin(req, ["SUPER_ADMIN"]);
  if (!result) {
    return Response.json({ success: false, error: "Forbidden" }, { status: 403 });
  }

  await dbConnect();
  const { name, phone, email, password, role, allowedRoutes } = await req.json();

  if (!name || !phone || !password) {
    return Response.json(
      { success: false, error: "name, phone, password are required" },
      { status: 400 }
    );
  }

  const existing = await Admin.findOne({ phone });
  if (existing) {
    return Response.json(
      { success: false, error: "Admin with this phone already exists" },
      { status: 409 }
    );
  }

  const admin = new Admin({
    name,
    phone,
    email,
    role: role === "SUPER_ADMIN" ? "SUPER_ADMIN" : "SUB_ADMIN",
    passwordHash: password, // will be hashed by pre('save')
    allowedRoutes: Array.isArray(allowedRoutes) ? allowedRoutes : [],
  });

  await admin.save();

  return Response.json({
    success: true,
    admin: {
      id: admin._id,
      name: admin.name,
      phone: admin.phone,
      role: admin.role,
      allowedRoutes: admin.allowedRoutes,
    },
  });
}