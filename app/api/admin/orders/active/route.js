import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
import { requireAdmin } from "@/lib/adminAuth";

export async function GET(req) {
  try {
    await dbConnect();

    const admin = await requireAdmin(req, ["SUB_ADMIN", "SUPER_ADMIN"]);
    if (!admin)
      return NextResponse.json({ success: false }, { status: 401 });

    const orders = await Order.find({
      status: { $ne: "DELIVERED" }
    })
      .populate("pickupBoutiqueId", "title")
      .populate("items.fabricId", "name");

    return NextResponse.json({ success: true, orders });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}