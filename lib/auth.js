export function verifyAuth(req) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader) {
    return { authorized: false, message: "Missing Authorization Header" };
  }

  const token = authHeader.split(" ")[1];
  const secret = process.env.ADMIN_SECRET;

  if (!secret) {
    throw new Error("⚠️ ADMIN_SECRET is not defined in environment variables.");
  }

  if (token === secret) {
    return { authorized: true };
  } else {
    return { authorized: false, message: "Invalid Authorization Token" };
  }
}