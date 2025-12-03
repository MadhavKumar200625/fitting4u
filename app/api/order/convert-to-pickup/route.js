import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
import Boutique from "@/models/boutiqueSchema";

export async function POST(req) {
  try {
    await dbConnect();

    /**
     * ------------------------------------
     * AUTH
     * ------------------------------------
     */
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.decode(token);

    if (!decoded?.phone) {
      return NextResponse.json(
        { success: false, message: "Unauthorized token" },
        { status: 401 }
      );
    }

    /**
     * ------------------------------------
     * INPUT VALIDATION
     * ------------------------------------
     */
    const body = await req.json();
    const { orderId, boutiqueId } = body;

    if (!orderId || !boutiqueId) {
      return NextResponse.json(
        { success: false, message: "orderId and boutiqueId are required" },
        { status: 400 }
      );
    }

    /**
     * ------------------------------------
     * LOAD ORDER
     * ------------------------------------
     */
    const order = await Order.findOne({
      _id: orderId,
      userPhone: decoded.phone,
    });

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    /**
     * ------------------------------------
     * RULES
     * ------------------------------------
     */
    if (order.deliveryType === "BOUTIQUE") {
      return NextResponse.json(
        {
          success: false,
          message: "Order already marked for boutique pickup",
        },
        { status: 400 }
      );
    }

    if (
      ["DELIVERED", "CANCELLED", "SHIPPED"].includes(order.status)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Order already finalized and cannot be modified",
        },
        { status: 400 }
      );
    }

    /**
     * ------------------------------------
     * VERIFY BOUTIQUE
     * ------------------------------------
     */
    const boutique = await Boutique.findById(boutiqueId);

    if (!boutique) {
      return NextResponse.json(
        { success: false, message: "Invalid boutique" },
        { status: 404 }
      );
    }

    /**
     * ------------------------------------
     * UPDATE ORDER
     * ------------------------------------
     */

    order.deliveryType = "BOUTIQUE";
    order.deliveryAddress = null;
    order.pickupBoutiqueId = boutique._id;
    order.status = "READY_FOR_PICKUP";

    await order.save();

    return NextResponse.json({
      success: true,
      order,
    });

  } catch (err) {
    console.error("PICKUP CONVERT ERROR:", err);

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}