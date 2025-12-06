import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
import Boutique from "@/models/boutiqueSchema";


export async function GET(req) {
  try {
    await dbConnect();

    // ✅ AUTH HEADER
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.decode(token);

    if (!decoded?.phone) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }
    // ✅ FETCH ORDERS
    const orders = await Order.find({
      userPhone: decoded.phone,
    })
      .sort({ createdAt: -1 })
      .populate(
        "pickupBoutiqueId",
        "title googleAddress location"
      );

    return NextResponse.json({
      success: true,
      orders,
    });

  } catch (err) {
    console.error("MY ORDERS ERROR:", err);

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}