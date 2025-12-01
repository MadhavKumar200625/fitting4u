import jwt from "jsonwebtoken";

export async function requireAdmin(req, allowedRoles = []) {
  try {
    // 1️⃣ Read header
    const auth = req.headers.get("authorization");

    if (!auth || !auth.startsWith("Bearer ")) {
      return null;
    }

    // 2️⃣ Extract token
    const token = auth.replace("Bearer ", "").trim();

    // 3️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) return null;

    // 4️⃣ Role check
    if (
      Array.isArray(allowedRoles) &&
      allowedRoles.length > 0 &&
      !allowedRoles.includes(decoded.role)
    ) {
      return null;
    }

    // ✅ Authorized
    return decoded;

  } catch (err) {
    console.error("ADMIN AUTH ERROR:", err.message);
    return null;
  }
}