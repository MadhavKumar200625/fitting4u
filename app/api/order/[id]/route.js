import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";

export async function GET(req, { params }) {
  try {
    await dbConnect();

    /* ---------------- AUTH ---------------- */
    const authHeader = req.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.phone) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    /* ---------------- FETCH ORDER ---------------- */
    const order = await Order.findOne({
      _id: params.id,
      userPhone: decoded.phone,
    })
      .populate("pickupBoutiqueId", "title googleAddress lat long")
      .populate(
        "items.fabricId",
        "name slug images material color"
      );

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order,
    });

  } catch (err) {
    console.error("ORDER VIEW ERROR:", err);

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}