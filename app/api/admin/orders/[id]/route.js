import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
import User from "@/models/User";
import { requireAdmin } from "@/lib/adminAuth";

export async function GET(req, { params }) {
  try {
    const admin = await requireAdmin(req, ["SUPER_ADMIN", "SUB_ADMIN"]);
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;
    const order = await Order.findById(id)
      .populate("pickupBoutiqueId", "title googleAddress lat long")
      .populate("items.fabricId", "name slug images material color gender customerPrice boutiquePrice");

    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    const customer = await User.findOne({ email: order.userPhone })
      .select("name email phone address")
      .lean();

    return NextResponse.json({ success: true, order, customer });
  } catch (error) {
    console.error("ADMIN ORDER DETAILS ERROR:", error);
    return NextResponse.json({ success: false, error: "Unable to load order" }, { status: 500 });
  }
}
