import jwt from "jsonwebtoken";
import dbConnect from "@/lib/dbConnect";
import Boutique from "@/models/boutiqueSchema";

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return Response.json({ error: "Email required" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    await dbConnect();
    const isBoutique = Boolean(
      await Boutique.exists({ email: normalizedEmail })
    );
    const secret = process.env.JWT_SECRET || "dev-temp-secret";

    const token = jwt.sign({ email: normalizedEmail, isBoutique }, secret);

    return Response.json({ token, isBoutique }, { status: 200 });
  } catch (err) {
    console.error("Error generating token:", err);
    return Response.json(
      { error: "Failed to generate token" },
      { status: 500 }
    );
  }
}
