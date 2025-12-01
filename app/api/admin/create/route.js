import Admin from "@/models/Admin";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/dbConnect";

export async function POST(req) {
  await dbConnect();

  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token) return Response.json({ success:false },{status:401});

  const payload = jwt.verify(token, process.env.JWT_SECRET);

  if (payload.role !== "SUPER_ADMIN") {
    return Response.json({ success:false },{status:403});
  }

  const { name, phone, password, allowedRoutes } = await req.json();

  const admin = new Admin({
    name,
    phone,
    passwordHash: password,
    role: "SUB_ADMIN",
    allowedRoutes,
  });

  await admin.save();

  return Response.json({ success: true });
}