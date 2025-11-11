import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const { phone } = await req.json();

    if (!phone) {
      return Response.json({ error: "Phone number required" }, { status: 400 });
    }

    const secret = process.env.JWT_SECRET || "dev-temp-secret";

    const token = jwt.sign({ phone }, secret, { expiresIn: "30d" });

    return Response.json({ token }, { status: 200 });
  } catch (err) {
    console.error("Error generating token:", err);
    return Response.json(
      { error: "Failed to generate token" },
      { status: 500 }
    );
  }
}