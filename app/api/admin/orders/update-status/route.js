import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
import { requireAdmin } from "@/lib/adminAuth";

export async function POST(req) {
  try {
    await dbConnect();

    const admin = await requireAdmin(req, ["SUB_ADMIN", "SUPER_ADMIN"]);
    if (!admin)
      return NextResponse.json({ success: false }, { status: 401 });

    const { orderId, status } = await req.json();

    const allowedStatuses = [
      "CREATED",
      "PAID",
      "PROCESSING",
      "READY_FOR_PICKUP",
      "SHIPPED",
      "DELIVERED",
      "CANCELLED",
    ];

    if (!allowedStatuses.includes(status))
      return NextResponse.json({ success: false, message: "Invalid status" }, { status: 400 });

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    return NextResponse.json({ success: true, order });

  } catch (err) {
    console.error("STATUS UPDATE ERROR:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}