import dbConnect from "@/lib/dbConnect";
import Admin from "@/models/Admin";

export async function POST(req) {
  await dbConnect();

  const count = await Admin.countDocuments({ role: "SUPER_ADMIN" });

  // Only allow without auth if no SUPER_ADMIN exists
  if (count > 0) {
    return Response.json(
      { success: false, error: "Super admin already exists" },
      { status: 403 }
    );
  }

  const { name, phone, email, password } = await req.json();

  if (!name || !phone || !password) {
    return Response.json(
      { success: false, error: "name, phone, password required" },
      { status: 400 }
    );
  }

  // Basic super admin with full access
  const admin = new Admin({
    name,
    phone,
    email,
    role: "SUPER_ADMIN",
    passwordHash: password, // will be hashed by pre('save')
    allowedRoutes: ["/admin", "/admin/fabric-management", "/admin/boutiques-management", "/admin/home-measurements", "/admin/settings", "/admin/admins"],
  });

  await admin.save();

  return Response.json({ success: true, admin: { id: admin._id, name: admin.name, phone: admin.phone } });
}