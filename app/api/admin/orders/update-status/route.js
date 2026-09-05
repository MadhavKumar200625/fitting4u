import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
import "@/models/Fabric";
import { requireAdmin } from "@/lib/adminAuth";
import { notifyOrderUpdate } from "@/lib/orderNotifications";

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
      "PICKED_UP",
      "SHIPPED",
      "DELIVERED",
      "CANCELLED",
    ];

    if (!allowedStatuses.includes(status))
      return NextResponse.json({ success: false, message: "Invalid status" }, { status: 400 });

    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    if (status === "PICKED_UP" && order.deliveryType !== "BOUTIQUE") {
      return NextResponse.json({ success: false, message: "Only boutique orders can be marked picked up" }, { status: 400 });
    }

    order.status = status;
    await order.save();
    await order.populate("items.fabricId", "name slug material color gender images");
    await notifyOrderUpdate(order, { siteUrl: new URL(req.url).origin });

    return NextResponse.json({ success: true, order });

  } catch (err) {
    console.error("STATUS UPDATE ERROR:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
