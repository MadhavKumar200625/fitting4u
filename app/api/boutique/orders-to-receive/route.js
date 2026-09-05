import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
import Boutique from "@/models/boutiqueSchema";
import "@/models/Fabric";

export async function GET(req) {
  try {
    const auth = req.headers.get("authorization");
    if (!auth?.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(auth.slice(7), process.env.JWT_SECRET || "dev-temp-secret");
    } catch {
      return NextResponse.json({ success: false, message: "Invalid or expired session" }, { status: 401 });
    }

    if (!decoded?.email || decoded.isBoutique !== true) {
      return NextResponse.json({ success: false, message: "Boutique access required" }, { status: 403 });
    }

    await dbConnect();
    const boutique = await Boutique.findOne({ email: decoded.email.toLowerCase() }).select("_id title googleAddress").lean();
    if (!boutique) {
      return NextResponse.json({ success: false, message: "Boutique profile not found" }, { status: 403 });
    }

    const orders = await Order.find({
      pickupBoutiqueId: boutique._id,
      deliveryType: "BOUTIQUE",
      status: { $nin: ["PICKED_UP", "CANCELLED"] },
    })
      .sort({ createdAt: -1 })
      .populate("items.fabricId", "name")
      .lean();

    return NextResponse.json({ success: true, boutique, orders });
  } catch (error) {
    console.error("BOUTIQUE RECEIVING ORDERS ERROR:", error);
    return NextResponse.json({ success: false, message: "Could not load receiving orders" }, { status: 500 });
  }
}
